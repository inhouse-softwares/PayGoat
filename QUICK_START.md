# Quick Start Guide

## Step 1: Set up Database Connection

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

Replace with your actual Neon PostgreSQL connection string from https://neon.tech

## Step 2: Generate Prisma Client

```bash
npx prisma generate
```

## Step 3: Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates the database tables (users, payment_instances, payment_collections).

## Step 4: Seed the Database

```bash
npx prisma db seed
```

This creates two users:
- **Admin**: admin@paygoat.com / admin123
- **Operator**: operator@paygoat.com / operator123

## Step 5: Start the App

```bash
npm run dev
```

Visit http://localhost:3000 and log in!

## Troubleshooting

### "PrismaClient needs to be constructed with options"

This means `DATABASE_URL` is not set. Make sure you have a `.env` file with your database connection string.

### "Module not found: bcryptjs"

Restart the dev server after installing dependencies.

### "Can't reach database server"

Check that your Neon database is running and the connection string is correct.
