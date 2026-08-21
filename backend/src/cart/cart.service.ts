import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async getOrCreateCart(userId: string) {
    let cart = await this.cartRepo.findOne({ where: { userId }, relations: ['items', 'items.product'] });
    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] });
      await this.cartRepo.save(cart);
    }
    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < quantity) throw new BadRequestException('Not enough stock');

    const cart = await this.getOrCreateCart(userId);
    let item = await this.itemRepo.findOne({ where: { cartId: cart.id, productId } });

    if (item) {
      item.quantity += quantity;
      await this.itemRepo.save(item);
    } else {
      item = this.itemRepo.create({ cartId: cart.id, productId, quantity });
      await this.itemRepo.save(item);
    }
    return this.getOrCreateCart(userId);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.itemRepo.findOne({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new NotFoundException('Cart item not found');

    if (quantity <= 0) {
      await this.itemRepo.delete(itemId);
    } else {
      item.quantity = quantity;
      await this.itemRepo.save(item);
    }
    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.itemRepo.delete({ id: itemId, cartId: cart.id });
    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.itemRepo.delete({ cartId: cart.id });
    return this.getOrCreateCart(userId);
  }
}
