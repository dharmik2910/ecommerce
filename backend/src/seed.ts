import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User, UserRole } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Address } from './entities/address.entity';

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_PUBLIC_URL;

const sslEnabled = process.env.DB_SSL === 'true' || !!databaseUrl;

const dataSource = new DataSource(
  databaseUrl && databaseUrl.trim() !== ''
    ? {
        type: 'postgres',
        url: databaseUrl,
        entities: [User, Category, Product, Cart, CartItem, Order, OrderItem, Address],
        synchronize: true,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
        port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
        username: process.env.DB_USERNAME || process.env.PGUSER || 'postgres',
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'postgres',
        database: process.env.DB_NAME || process.env.PGDATABASE || 'furniture_store',
        entities: [User, Category, Product, Cart, CartItem, Order, OrderItem, Address],
        synchronize: true,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      },
);

async function seed() {
  await dataSource.initialize();
  console.log('Connected to database. Seeding...');

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const userRepo = dataSource.getRepository(User);

  // Admin user
  const adminEmail = 'admin@furniturestore.com';
  let admin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!admin) {
    admin = userRepo.create({
      name: 'Store Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash('Admin@123', 10),
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('Created admin user:', adminEmail, '(password: Admin@123)');
  }

  // Categories
  const categoriesData = [
    { name: 'Tables', slug: 'tables', description: 'Dining, coffee, and side tables' },
    { name: 'Baskets', slug: 'baskets', description: 'Storage and decorative baskets' },
    { name: 'Chairs', slug: 'chairs', description: 'Dining and accent chairs' },
    { name: 'Shelves', slug: 'shelves', description: 'Bookshelves and wall shelves' },
  ];

  const categories: Record<string, Category> = {};
  for (const c of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { slug: c.slug } });
    if (!cat) {
      cat = await categoryRepo.save(categoryRepo.create(c));
    }
    categories[c.slug] = cat;
  }
  console.log('Seeded categories.');

  // Products
  const productsData = [
    {
      name: 'Oakwood Dining Table',
      slug: 'oakwood-dining-table',
      description: 'A solid oak dining table with a hand-rubbed finish, seats 6 comfortably.',
      price: 24999,
      compareAtPrice: 29999,
      stock: 15,
      material: 'Solid Oak',
      color: 'Natural Wood',
      dimensions: '180 x 90 x 75 cm',
      images: ['https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=800'],
      categorySlug: 'tables',
      isFeatured: true,
    },
    {
      name: 'Round Walnut Coffee Table',
      slug: 'round-walnut-coffee-table',
      description: 'Minimalist round coffee table crafted from walnut veneer.',
      price: 8999,
      stock: 20,
      material: 'Walnut Veneer',
      color: 'Dark Brown',
      dimensions: '90 x 90 x 40 cm',
      images: ['https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800'],
      categorySlug: 'tables',
      isFeatured: true,
    },
    {
      name: 'Slim Console Table',
      slug: 'slim-console-table',
      description: 'A narrow entryway table with a single storage drawer.',
      price: 6499,
      stock: 25,
      material: 'Mango Wood',
      color: 'Honey',
      dimensions: '110 x 30 x 80 cm',
      images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800'],
      categorySlug: 'tables',
    },
    {
      name: 'Handwoven Seagrass Basket',
      slug: 'handwoven-seagrass-basket',
      description: 'Large storage basket, handwoven from natural seagrass fiber.',
      price: 1499,
      stock: 50,
      material: 'Seagrass',
      color: 'Natural',
      dimensions: '40 x 40 x 35 cm',
      images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'],
      categorySlug: 'baskets',
      isFeatured: true,
    },
    {
      name: 'Set of 3 Rattan Baskets',
      slug: 'set-of-3-rattan-baskets',
      description: 'Nesting set of three rattan baskets, perfect for organizing shelves.',
      price: 2199,
      stock: 35,
      material: 'Rattan',
      color: 'Light Brown',
      dimensions: 'Various',
      images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'],
      categorySlug: 'baskets',
    },
    {
      name: 'Woven Laundry Basket',
      slug: 'woven-laundry-basket',
      description: 'Sturdy woven laundry basket with sewn-in fabric liner and handles.',
      price: 1899,
      stock: 40,
      material: 'Water Hyacinth',
      color: 'Natural',
      dimensions: '55 x 35 x 45 cm',
      images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
      categorySlug: 'baskets',
    },
    {
      name: 'Windsor Dining Chair',
      slug: 'windsor-dining-chair',
      description: 'Classic Windsor-style dining chair in solid ash wood.',
      price: 4999,
      stock: 30,
      material: 'Solid Ash',
      color: 'Natural Wood',
      dimensions: '45 x 50 x 90 cm',
      images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'],
      categorySlug: 'chairs',
      isFeatured: true,
    },
    {
      name: 'Ladder Bookshelf',
      slug: 'ladder-bookshelf',
      description: 'Five-tier leaning bookshelf, great for small spaces.',
      price: 7499,
      stock: 18,
      material: 'Engineered Wood',
      color: 'Walnut',
      dimensions: '60 x 30 x 180 cm',
      images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'],
      categorySlug: 'shelves',
    },
  ];

  for (const p of productsData) {
    const { categorySlug, ...rest } = p;
    let product = await productRepo.findOne({ where: { slug: p.slug } });
    if (!product) {
      product = productRepo.create({ ...rest, categoryId: categories[categorySlug].id });
      await productRepo.save(product);
    }
  }
  console.log('Seeded products.');

  await dataSource.destroy();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
