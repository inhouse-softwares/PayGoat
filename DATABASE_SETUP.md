# Database Setup Guide

This guide will help you set up PostgreSQL database using Neon for the PayGoat application.

## Prerequisites

- Node.js installed
- A Neon account (sign up at https://neon.tech)

## Step 1: Create a Neon Database

1. Go to https://neon.tech and sign in
2. Create a new project
3. Copy your database connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)

## Step 2: Configure Environment Variables

1. Create a `.env` file in the root of your project:

```bash
DATABASE_URL="your-neon-connection-string-here"
```

Replace `your-neon-connection-string-here` with the connection string from Neon.

## Step 3: Run Database Migrations

Run the following command to create the database tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the `payment_instances` and `payment_collections` tables
- Generate the Prisma Client

## Step 4: (Optional) Seed the Database

If you want to add some initial data, you can create a seed script or manually insert data through the Neon console.

## Database Schema

### PaymentInstance Table
- `id` - Unique identifier (CUID)
- `name` - Instance name
- `splitCode` - Unique split code
- `idclPercent` - IDCL percentage (Float)
- `summary` - Description
- `entities` - JSON array of revenue split entities
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### PaymentCollection Table
- `id` - Unique identifier (CUID)
- `instanceId` - Foreign key to PaymentInstance
- `instanceName` - Instance name (denormalized)
- `splitCode` - Split code (denormalized)
- `payer` - Payer name
- `amount` - Total amount (Float)
- `idclAmount` - IDCL amount (Float)
- `motAmount` - MOT amount (Float)
- `collectedAt` - Collection timestamp (String)
- `createdAt` - Record creation timestamp

## API Endpoints

### Payment Instances

- `GET /api/instances` - Get all instances
- `POST /api/instances` - Create a new instance
- `GET /api/instances/[id]` - Get instance by ID
- `PATCH /api/instances/[id]` - Update instance
- `DELETE /api/instances/[id]` - Delete instance

### Payment Collections

- `GET /api/collections` - Get all collections (optional `?instanceId=xxx` query param)
- `POST /api/collections` - Create a new collection
- `GET /api/collections/[id]` - Get collection by ID
- `DELETE /api/collections/[id]` - Delete collection

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database:

1. Verify your `DATABASE_URL` is correct in `.env`
2. Make sure your IP is whitelisted in Neon (Neon allows all IPs by default)
3. Check that SSL mode is enabled in your connection string

### Migration Issues

If migrations fail:

1. Check your database connection
2. Ensure you have the latest Prisma version: `npm install prisma@latest @prisma/client@latest`
3. Try resetting the database: `npx prisma migrate reset` (WARNING: This will delete all data)

## Next Steps

After setting up the database, you'll need to update the frontend components to use the API endpoints instead of localStorage. This involves:

1. Removing localStorage calls from components
2. Adding API fetch calls to components
3. Implementing proper error handling
4. Adding loading states

For production deployment, make sure to:
- Set `DATABASE_URL` in your hosting platform's environment variables
- Run `npx prisma generate` during the build process
- Consider setting up database backups in Neon
