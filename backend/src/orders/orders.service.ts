import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async createFromCart(userId: string, dto: CreateOrderDto) {
    const cart = await this.cartRepo.findOne({ where: { userId }, relations: ['items', 'items.product'] });
    if (!cart || cart.items.length === 0) throw new BadRequestException('Cart is empty');

    return this.dataSource.transaction(async (manager) => {
      let total = 0;
      const orderItems: Partial<OrderItem>[] = [];

      for (const item of cart.items) {
        const product = await manager.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Not enough stock for ${product.name}`);
        }
        total += Number(product.price) * item.quantity;
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
        product.stock -= item.quantity;
        await manager.save(product);
      }

      const order = manager.create(Order, {
        userId,
        totalAmount: total,
        status: OrderStatus.PENDING,
        shippingAddress: {
          fullName: dto.fullName,
          phone: dto.phone,
          line1: dto.line1,
          line2: dto.line2,
          city: dto.city,
          state: dto.state,
          zip: dto.zip,
          country: dto.country ?? 'India',
        },
        items: orderItems as OrderItem[],
      });
      const saved = await manager.save(order);

      await manager.delete('cart_items', { cartId: cart.id });

      return saved;
    });
  }

  findAllForUser(userId: string) {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['items', 'items.product'],
    });
  }

  findAllAdmin() {
    return this.orderRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['items', 'items.product', 'user'],
    });
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (role !== UserRole.ADMIN && order.userId !== userId) throw new ForbiddenException();
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.orderRepo.update(id, { status });
    return this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
  }
}
