# Murhaf Abu Rashed — Full-Stack Portfolio & CMS

A high-performance personal portfolio and dynamic CMS built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and PostgreSQL via Drizzle ORM on Neon.

## Features

- **Bilingual Support (EN / AR):** Instant language switching with complete RTL layout support and client-side preference sync.
- **Dynamic Content Management:** Protected `/admin` dashboard to manage projects, skills, and live availability status without redeploying.
- **Stateless HMAC Authentication:** Timing-attack resistant session management and route protection via Next.js 16 proxy.
- **Interactive Project Showcase:** Filterable project cards with architecture deep-dive modals, live links, and repository links.
- **Skills Bento Grid:** Categorized technical proficiency matrix with progress visualization.
- **Live GitHub Integration:** Cached server-side fetching of recent repositories and commit activity.
- **Direct Telegram Channel:** Instant visitor inquiry form that forwards messages directly to Telegram with honeypot spam protection and rate limiting.

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, Cache Components) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL (Neon Serverless) |
| **ORM & Migrations** | Drizzle ORM, Drizzle Kit |
| **Validation** | Zod |
| **Icons** | Lucide React |

## Project Structure

```text
├── drizzle/                  # Generated SQL migrations
├── public/                   # Static assets (images, resume)
├── src/
│   ├── actions/              # Server Actions for mutations
│   ├── app/                  # Next.js App Router (public & admin routes)
│   ├── components/
│   │   ├── admin/            # CMS management interfaces
│   │   └── public/           # Public portfolio sections
│   ├── context/              # Bilingual context & state
│   ├── db/                   # Database connection, schema, and seed scripts
│   ├── lib/                  # Authentication, session helpers, validators
│   └── proxy.ts              # Next.js 16 proxy / route guards
├── drizzle.config.ts         # Drizzle Kit configuration
└── next.config.ts            # Next.js configuration
```

## Getting Started

### 1. Prerequisites

- Node.js 20+
- PostgreSQL database (or [Neon](https://neon.tech) account)

### 2. Environment Variables

Create `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

Configure your variables:

```env
# Database (Neon / PostgreSQL)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host/dbname?sslmode=require
DATABASE_URL_POOLED=postgresql://user:password@host/dbname?sslmode=require

# Admin Authentication
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
AUTH_SECRET=your-random-32-character-secret

# Telegram Notifications (Optional)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### 3. Database Setup

Push the schema migrations and seed initial data:

```bash
# Push schema to database
npm run db:push

# Seed default profile & skills
npm run db:seed
```

### 4. Development

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.  
Access [http://localhost:3000/admin](http://localhost:3000/admin) to manage your skills, projects, and profile.

## Scripts

- `npm run dev` — Start Turbopack development server
- `npm run build` — Build production bundle
- `npm run start` — Run production server
- `npm run lint` — Run ESLint checks
- `npm run db:generate` — Generate Drizzle migration files
- `npm run db:migrate` — Execute migrations against database
- `npm run db:push` — Generate and apply migrations in one step
- `npm run db:seed` — Populate database with default profile and skills

## License

MIT © [Murhaf Abu Rashed](https://github.com/murhaf)
