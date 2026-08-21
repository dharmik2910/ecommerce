import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

interface CursorData {
  id: string;
  val?: string | number;
}

function encodeCursor(data: CursorData): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

function decodeCursor(cursorStr: string): CursorData | null {
  try {
    const json = Buffer.from(cursorStr, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async findAll(query: QueryProductDto) {
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const page = query.page && query.page > 0 ? query.page : 1;

    const qb = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (!query.includeInactive) {
      qb.andWhere('product.isActive = true');
    }

    if (query.search) {
      qb.andWhere('(product.name ILIKE :search OR product.slug ILIKE :search OR product.description ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }
    if (query.categorySlug) {
      qb.andWhere('category.slug = :slug', { slug: query.categorySlug });
    }
    if (query.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId: query.categoryId });
    }
    if (query.stock === 'in_stock') {
      qb.andWhere('product.stock > 0');
    } else if (query.stock === 'out_of_stock') {
      qb.andWhere('product.stock <= 0');
    }
    if (query.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }
    if (query.featured) {
      qb.andWhere('product.isFeatured = true');
    }

    // Get total count for exact page calculations
    const total = await qb.getCount();
    const totalPages = Math.ceil(total / limit) || 1;

    // Apply cursor condition if cursor is provided
    if (query.cursor) {
      const decoded = decodeCursor(query.cursor);
      if (decoded && decoded.id) {
        if (query.sort === 'price_asc') {
          qb.andWhere('(product.price > :cVal OR (product.price = :cVal AND product.id > :cId))', {
            cVal: Number(decoded.val),
            cId: decoded.id,
          });
        } else if (query.sort === 'price_desc') {
          qb.andWhere('(product.price < :cVal OR (product.price = :cVal AND product.id < :cId))', {
            cVal: Number(decoded.val),
            cId: decoded.id,
          });
        } else {
          qb.andWhere('(product.createdAt < :cVal OR (product.createdAt = :cVal AND product.id < :cId))', {
            cVal: decoded.val ? new Date(decoded.val as string) : new Date(),
            cId: decoded.id,
          });
        }
      }
    } else if (page > 1) {
      qb.skip((page - 1) * limit);
    }

    if (query.sort === 'price_asc') {
      qb.orderBy('product.price', 'ASC').addOrderBy('product.id', 'ASC');
    } else if (query.sort === 'price_desc') {
      qb.orderBy('product.price', 'DESC').addOrderBy('product.id', 'DESC');
    } else {
      qb.orderBy('product.createdAt', 'DESC').addOrderBy('product.id', 'DESC');
    }

    qb.take(limit + 1);

    const rawItems = await qb.getMany();
    const hasMore = rawItems.length > limit;
    const items = hasMore ? rawItems.slice(0, limit) : rawItems;

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      let val: string | number;
      if (query.sort === 'price_asc' || query.sort === 'price_desc') {
        val = Number(lastItem.price);
      } else {
        val = lastItem.createdAt ? new Date(lastItem.createdAt).toISOString() : '';
      }
      nextCursor = encodeCursor({ id: lastItem.id, val });
    }

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasMore,
      nextCursor,
    };
  }

  async findBySlug(slug: string) {
    const product = await this.repo.findOne({ where: { slug }, relations: ['category'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findById(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    let slug = dto.slug && dto.slug.trim() ? dto.slug.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') : (dto.name || 'product').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    const existing = await this.repo.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    const product = this.repo.create({ ...dto, slug });
    return this.repo.save(product);
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    await this.findById(id);
    if (dto.slug && dto.slug.trim()) {
      let slug = dto.slug.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      const existing = await this.repo.findOne({ where: { slug } });
      if (existing && existing.id !== id) {
        dto.slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      } else {
        dto.slug = slug;
      }
    }
    await this.repo.update(id, dto);
    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);
    try {
      await this.repo.delete(id);
    } catch (err) {
      // If foreign key constraint prevents hard delete (e.g. product is referenced in order_items), soft delete it
      await this.repo.update(id, { isActive: false });
    }
    return { success: true };
  }
}
