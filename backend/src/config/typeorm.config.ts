import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Address } from '../entities/address.entity';

export const getTypeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => {
  const databaseUrl = config.get<string>('DATABASE_URL');
  const isProduction = config.get<string>('NODE_ENV') === 'production';
  const sslEnabled = config.get<string>('DB_SSL') === 'true' || !!databaseUrl;

  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    entities: [User, Category, Product, Cart, CartItem, Order, OrderItem, Address],
    synchronize: true, // set to false and use migrations in production
    logging: false,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  };

  if (databaseUrl) {
    return {
      ...baseConfig,
      url: databaseUrl,
    };
  }

  return {
    ...baseConfig,
    host: config.get<string>('DB_HOST', 'localhost'),
    port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
    username: config.get<string>('DB_USERNAME', 'postgres'),
    password: config.get<string>('DB_PASSWORD', 'postgres'),
    database: config.get<string>('DB_NAME', 'furniture_store'),
  };
};


