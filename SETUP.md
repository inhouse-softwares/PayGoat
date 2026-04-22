# PayGoat Setup Guide

Complete setup instructions for the PayGoat payment management application.

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database account (https://neon.tech)

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 16
- Prisma ORM 7
- bcryptjs for password hashing
- PostgreSQL adapter
- All required dependencies

## Step 2: Database Setup

### Create Neon Database

1. Go to https://neon.tech and sign in
2. Create a new project
3. Copy your connection string (format: `postgresql://user:password@host/database?sslmode=require`)

### Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
```

## Step 3: Run Database Migrations

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates the following tables:
- `users` - Admin and operator accounts
- `payment_instances` - Payment instance configurations
- `payment_collections` - Payment collection records

## Step 4: Seed the Database

Seed the database with default admin and operator users:

```bash
npx prisma db seed
```

This creates:
- **Admin User**
  - Email: `admin@paygoat.com`
  - Password: `admin123`
  - Access: Full dashboard, payment management, logs

- **Operator User**
  - Email: `operator@paygoat.com`
  - Password: `operator123`
  - Access: Payment collection only

**⚠️ IMPORTANT:** Change these passwords in production!

## Step 5: Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and log in with one of the seeded accounts.

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  role      String   // "admin" or "operator"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### PaymentInstance Model
```prisma
model PaymentInstance {
  id          String   @id @default(cuid())
  name        String
  splitCode   String   @unique
  idclPercent Float
  summary     String
  entities    Json     // Array of {name, percentage}
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  collections PaymentCollection[]
}
```

### PaymentCollection Model
```prisma
model PaymentCollection {
  id           String   @id @default(cuid())
  instanceId   String
  instanceName String
  splitCode    String
  payer        String
  amount       Float
  idclAmount   Float
  motAmount    Float
  collectedAt  String
  createdAt    DateTime @default(now())
  instance     PaymentInstance @relation(...)
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Payment Instances
- `GET /api/instances` - List all instances
- `POST /api/instances` - Create instance
- `GET /api/instances/[id]` - Get instance with collections
- `PATCH /api/instances/[id]` - Update instance
- `DELETE /api/instances/[id]` - Delete instance (cascades)

### Payment Collections
- `GET /api/collections` - List collections (optional `?instanceId=xxx`)
- `POST /api/collections` - Create collection
- `GET /api/collections/[id]` - Get collection
- `DELETE /api/collections/[id]` - Delete collection

## Mobile Responsive Design

The application is fully responsive with:
- Mobile-first navigation
- Collapsible header on small screens
- Responsive tables and forms
- Touch-friendly UI elements

## Production Deployment

### Environment Variables

Set these in your hosting platform:

```env
DATABASE_URL="your-production-database-url"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

### Build Command

```bash
npm run build
```

### Post-Deployment

1. Run migrations: `npx prisma migrate deploy`
2. Seed users: `npx prisma db seed`
3. Change default passwords immediately
4. Set up database backups in Neon

## Troubleshooting

### Prisma Client Errors

If you see "PrismaClient needs to be constructed with options":
- Ensure `DATABASE_URL` is set in `.env`
- Run `npx prisma generate`
- Restart the dev server

### Migration Issues

Reset database (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

### Authentication Issues

- Check that users are seeded: `npx prisma db seed`
- Verify cookies are enabled in browser
- Check console for API errors

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- HTTP-only cookies for session management
- Secure cookies in production
- Change default passwords immediately
- Use strong passwords for production users

## Support

For issues or questions, check:
- Prisma documentation: https://www.prisma.io/docs
- Next.js documentation: https://nextjs.org/docs
- Neon documentation: https://neon.tech/docs
