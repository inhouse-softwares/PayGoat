# PayGoat

A multi-tenant payment collection platform built for schools, businesses, and organizations in Nigeria. Powered by Paystack.

## Overview

PayGoat lets admins create **payment instances** (e.g. school fees, event tickets, product sales, donations), each with its own revenue-split configuration, custom form fields, and payment types. Payments are automatically split across multiple bank accounts via Paystack subaccounts. Operators collect payments through generated forms and produce print-ready receipts.

### Key Features

- **Multi-Instance Payment Management** -- Create and configure independent payment instances with custom forms
- **Automated Revenue Splitting** -- Payments auto-split across multiple bank accounts via Paystack split codes
- **Role-Based Access Control** -- Admin (full access) and Operator (restricted to assigned instance)
- **Dashboard & Analytics** -- Total collections, per-instance breakdowns, recent transaction tables
- **Receipt Generation** -- Print-ready HTML receipts formatted for 80mm thermal printers
- **Light/Dark Mode** -- Full theming via CSS custom properties

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| State | Redux Toolkit / RTK Query |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 |
| Auth | Cookie-based sessions, bcrypt |
| Payments | Paystack API |
| Validation | Zod 4 |
| Icons | Lucide React |
| Animations | Lottie |

## Project Structure

```
paygoat/
├── app/                        # Next.js App Router
│   ├── login/                  # Login page
│   ├── dashboard/              # Admin dashboard (stats, charts, tables)
│   ├── pay/                    # Payment workspace (instance selection + collection forms)
│   │   ├── [instanceId]/       # Instance-specific payment page
│   │   └── configure/          # Admin instance configuration
│   ├── instances/              # Instance detail view
│   ├── logs/                   # Admin logs
│   ├── operators/              # Operator management
│   ├── profile/                # User profile (password change)
│   ├── components/             # Shared UI (header, theme toggle, loader)
│   ├── actions/                # Server Actions (auth)
│   └── api/                    # REST API routes
│       ├── auth/               # Login / logout
│       ├── instances/          # CRUD for payment instances
│       ├── collections/        # CRUD for payment collections
│       ├── paystack/           # Transaction init, verify, banks, account resolve
│       ├── profile/            # Password change
│       └── admin/              # Operator listing
├── lib/                        # Shared utilities
│   ├── auth-utils.ts           # Session management, RBAC, withAuth wrapper
│   ├── prisma.ts               # Prisma client (PG pool adapter)
│   ├── rate-limit.ts           # In-memory rate limiting
│   ├── validation.ts           # Zod schemas
│   └── store/                  # Redux store + RTK Query APIs
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seeds admin + operator users
│   └── migrations/             # Database migrations
├── utils/
│   └── print-reciepts.ts       # Thermal printer receipt generator
└── public/                     # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Paystack](https://paystack.com) account (test keys work for development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXT_PUBLIC_APP_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

### 3. Set Up the Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

This creates default accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@paygoat.com` | `admin123` |
| Operator | `operator@paygoat.com` | `operator123` |

**Change these passwords before deploying to production.**

### 4. Start the Dev Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Database Schema

**User** -- Admin and operator accounts with role-based access, linked to a payment instance (operators only).

**PaymentInstance** -- A payment collection target (e.g. "School Fees 2026"). Contains a Paystack split code, revenue-split entities, and custom form fields.

**PaymentType** -- Individual payment categories within an instance (e.g. "Tuition", "Hostel"), each with its own amount and optional split configuration.

**PaymentCollection** -- Records of collected payments with payer info, amounts, quantities, Paystack reference, and metadata.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | End session |
| GET | `/api/instances` | List instances (paginated) |
| POST | `/api/instances` | Create instance (admin only) |
| GET | `/api/instances/[id]` | Get instance details |
| PATCH | `/api/instances/[id]` | Update instance |
| DELETE | `/api/instances/[id]` | Delete instance |
| GET | `/api/collections` | List collections (`?instanceId=` filter) |
| POST | `/api/collections` | Record a collection |
| GET | `/api/collections/[id]` | Get collection details |
| DELETE | `/api/collections/[id]` | Delete collection |
| POST | `/api/paystack/initialize` | Initialize Paystack transaction |
| POST | `/api/paystack/verify/[reference]` | Verify and record payment |
| GET | `/api/paystack/banks` | List Nigerian banks |
| GET | `/api/paystack/resolve` | Resolve bank account name |
| GET | `/api/profile` | Get current user profile |
| PATCH | `/api/profile` | Change password |
| GET | `/api/admin/operators` | List operators (admin only) |

## Collaborating

### Branch Strategy

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes, commit often with clear messages.
3. Push and open a pull request against `main`.

### Code Conventions

- **Language**: TypeScript everywhere (strict mode is enabled).
- **Styling**: Tailwind CSS utility classes. Theme variables are in `app/globals.css`.
- **State management**: Use RTK Query for server data. Avoid adding new global state outside the Redux store.
- **API routes**: Place new endpoints under `app/api/`. Use Zod schemas from `lib/validation.ts` for input validation.
- **Components**: Shared UI components go in `app/components/`. Page-specific components live alongside their pages.
- **Auth**: Use the `withAuth` wrapper from `lib/auth-utils.ts` to protect API routes. Never check cookies manually -- always go through the auth utilities.
- **Naming**: Use `kebab-case` for files, `camelCase` for variables/functions, `PascalCase` for components/types.

### Commit Messages

Use short, descriptive messages:

```
feat: add payment type filtering on dashboard
fix: correct receipt formatting for amounts above 10k
refactor: extract auth helpers into lib/auth-utils
```

### Before Submitting a PR

1. **Lint your code**:
   ```bash
   npm run lint
   ```
2. **Verify the build passes**:
   ```bash
   npm run build
   ```
3. **Run database migrations** if you changed the schema:
   ```bash
   npx prisma migrate dev --name describe-your-change
   ```
   Include the generated migration files in your commit.
4. **Update API documentation** in this README if you added or changed endpoints.

### Environment Setup for New Contributors

1. Fork and clone the repo.
2. Copy `.env.example` (or ask a teammate for the `.env` file with dev keys).
3. Run `npm install`, then `npx prisma generate && npx prisma migrate dev && npx prisma db seed`.
4. Run `npm run dev` and verify you can log in.

**Never commit `.env` files or Paystack secret keys.** Use test keys for local development.

## Production Deployment

PayGoat is designed to deploy on [Vercel](https://vercel.com).

1. Set environment variables in your Vercel project settings.
2. Run migrations after deployment:
   ```bash
   npx prisma migrate deploy
   ```
3. Seed production users:
   ```bash
   npx prisma db seed
   ```
4. Change all default passwords immediately.
5. Switch Paystack keys from test to live.
6. Enable database backups in Neon.

## License

Private -- for internal use only.
