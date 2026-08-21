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
  const databaseUrl =
    config.get<string>('DATABASE_URL') ||
    config.get<string>('POSTGRES_URL') ||
    config.get<string>('DATABASE_PUBLIC_URL');

  const isProduction = config.get<string>('NODE_ENV') === 'production';
  const sslEnabled = config.get<string>('DB_SSL') === 'true' || !!databaseUrl;

  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    entities: [User, Category, Product, Cart, CartItem, Order, OrderItem, Address],
    synchronize: true, // set to false and use migrations in production
    logging: false,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  };

  if (databaseUrl && databaseUrl.trim() !== '') {
    return {
      ...baseConfig,
      url: databaseUrl,
    };
  }

  const host = config.get<string>('DB_HOST') || config.get<string>('PGHOST') || 'localhost';
  const port = parseInt(config.get<string>('DB_PORT') || config.get<string>('PGPORT') || '5432', 10);
  const username = config.get<string>('DB_USERNAME') || config.get<string>('PGUSER') || 'postgres';
  const password = config.get<string>('DB_PASSWORD') || config.get<string>('PGPASSWORD') || 'postgres';
  const database = config.get<string>('DB_NAME') || config.get<string>('PGDATABASE') || 'furniture_store';

  if (isProduction && host === 'localhost') {
    console.warn(
      '⚠️ WARNING: DATABASE_URL environment variable is not set in Railway! NestJS is falling back to localhost.',
    );
  }

  return {
    ...baseConfig,
    host,
    port,
    username,
    password,
    database,
  };
};


