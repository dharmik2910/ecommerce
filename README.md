# Hearthwood — Furniture E-commerce

A full-stack e-commerce store for furniture (tables, baskets, chairs, shelves).

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** NestJS + TypeORM
- **Database:** PostgreSQL

## Features

- Product catalog with categories, search, price filters, and sorting
- Product detail pages
- Auth (register/login) with JWT, role-based access (customer / admin)
- Cart (add, update quantity, remove) tied to the logged-in user
- Checkout → creates an order, decrements stock, clears cart (DB transaction)
- Order history for customers
- Admin panel to add/delete products
- Swagger API docs at `/api/docs`

## 1. Start PostgreSQL

The easiest way, using Docker:

```bash
cd ecommerce
docker compose up -d
```

Or point the backend at any existing Postgres instance — see `backend/.env`.

## 2. Backend setup

```bash
cd backend
cp .env.example .env      # already done for you; edit if your DB differs
npm install
npm run start:dev         # starts on http://localhost:4000/api
```

TypeORM has `synchronize: true` enabled, so tables are created automatically
on first run — no manual migrations needed for local development.

Seed demo categories, products, and an admin user:

```bash
npm run seed
```

This creates:

- Admin login: `admin@store.com` / `Admin@123`
- 4 categories (Tables, Baskets, Chairs, Shelves) and 8 sample products

API docs: <http://localhost:4000/api/docs>

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:3000
```

`frontend/.env.local` already points `NEXT_PUBLIC_API_URL` at
`http://localhost:4000/api` — change it if your backend runs elsewhere.

## 4. Try it out

1. Visit <http://localhost:3000> — browse products, view a product detail page
2. Register a customer account, add items to your cart, and check out
3. Log in as the seeded admin account and visit **Admin** in the nav to add
   or delete products

## Project structure

```
ecommerce/
├── docker-compose.yml       # Postgres for local dev
├── backend/                 # NestJS API
│   └── src/
│       ├── entities/        # TypeORM entities (User, Product, Cart, Order, ...)
│       ├── auth/            # JWT auth, guards, roles
│       ├── products/        # Product CRUD + filtering
│       ├── categories/
│       ├── cart/
│       ├── orders/          # Checkout transaction, order history
│       └── seed.ts          # Demo data seeder
└── frontend/                # Next.js app
    └── app/
        ├── products/        # Listing + [slug] detail page
        ├── cart/, checkout/
        ├── login/, register/
        ├── orders/
        └── admin/products/  # Admin product management
```

## Next steps for production

- Add a real payment gateway (Stripe/Razorpay) in the checkout flow —
  currently it's a "cash on delivery" style stub
- Switch `synchronize: true` to TypeORM migrations before going live
- Add image upload (S3/Cloudinary) instead of pasting image URLs in the admin form
- Add product reviews, wishlists, and pagination controls in the UI
- Add refresh tokens / token expiry handling
- Set strong `JWT_SECRET` and real DB credentials in production `.env`
