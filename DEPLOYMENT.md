# Complete Deployment Guide: Vercel (Frontend) + Railway (Backend & PostgreSQL)

This guide walks you through deploying your E-Commerce application with the **NestJS Backend & PostgreSQL Database on Railway**, and the **Next.js Frontend on Vercel**.

---

## Part 1: Deploy Backend & PostgreSQL on Railway

### 1. Create a Railway Project
1. Log in to [Railway.app](https://railway.app/).
2. Click **New Project**.
3. Select **Provision PostgreSQL**. Railway will automatically create a PostgreSQL database.

### 2. Deploy the Backend Service
1. Click **+ New** in your Railway project canvas and select **GitHub Repo** (or deploy via Railway CLI).
2. Select your repository.
3. In the service settings:
   - Set **Root Directory**: `backend`
   - Set **Build Command**: `npm run build`
   - Set **Start Command**: `npm run start:prod`
4. Under **Variables**, add the following environment variables:
   - `DATABASE_URL`: `${{ Postgres.DATABASE_URL }}` *(Railway will auto-suggest referencing your Postgres plugin!)*
   - `PORT`: `4000` *(or leave blank, Railway dynamically binds PORT)*
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `generate_a_secure_random_key_here`
   - `JWT_EXPIRES_IN`: `7d`
   - `FRONTEND_URL`: `https://your-frontend-app.vercel.app` *(Replace with your actual Vercel domain once created)*

### 3. Generate a Public Domain for Backend
1. Go to your Backend Service -> **Settings** -> **Networking**.
2. Click **Generate Domain** (e.g., `ecommerce-backend-production.up.railway.app`).
3. Your backend API base URL will be: `https://ecommerce-backend-production.up.railway.app/api`.

---

## Part 2: Deploy Frontend on Vercel

### 1. Import Repository to Vercel
1. Log in to [Vercel.com](https://vercel.com/).
2. Click **Add New** -> **Project** and import your GitHub repository.

### 2. Configure Project Settings
1. **Framework Preset**: Next.js
2. **Root Directory**: Click **Edit** and set to `frontend`.
3. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: `https://ecommerce-backend-production.up.railway.app/api` *(replace with your backend domain generated in Part 1)*

### 3. Deploy
1. Click **Deploy**.
2. Once complete, copy your Vercel deployment URL (e.g., `https://ecommerce-store.vercel.app`).

---

## Part 3: Final CORS Handshake

Go back to **Railway** -> Backend Service -> **Variables**, and update:
- `FRONTEND_URL`: `https://ecommerce-store.vercel.app`

Railway will automatically redeploy the backend. Now your Vercel Next.js app and Railway NestJS backend can communicate securely!

---

## Verification & Seeding

If you need to seed initial product data to your Railway production database:
You can run the seed command locally pointing `DATABASE_URL` to your Railway Postgres database:

```bash
cd backend
DATABASE_URL="your-railway-database-url" npm run seed
```
