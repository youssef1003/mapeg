# MapEg - Recruitment Platform

A modern recruitment platform connecting talent with opportunities across Egypt and the Arab world.

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS Modules with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Internationalization**: next-intl (Arabic & English)
- **API**: Next.js API Routes

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## 🛠️ Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd antigravity
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Required environment variables:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mapeg?schema=public"
DATABASE_URI="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mapeg?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup Database

Create the PostgreSQL database:
```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE mapeg;"
```

Run migrations and seed:
```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations (dev) |
| `npm run db:deploy` | Deploy migrations (production) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:setup` | Run migrations + seed |
| `npm run db:studio` | Open Prisma Studio |
| `npm run dev:full` | Setup database + start dev server |

## 📁 Project Structure

```
antigravity/
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── [locale]/      # Localized pages
│   │   ├── api/           # API routes
│   │   ├── robots.ts      # SEO robots.txt
│   │   └── sitemap.ts     # Dynamic sitemap
│   ├── components/        # React components
│   ├── lib/               # Utilities & database client
│   └── styles/            # Global CSS
├── messages/              # i18n translations (ar, en)
├── .env.example           # Environment template
└── DEPLOYMENT.md          # Production deployment guide
```

## 🔒 Security Features

- Security headers (HSTS, X-Frame-Options, CSP, etc.)
- Rate limiting for API routes
- Input validation with Zod
- Protected admin routes

## 🌍 Supported Languages

- Arabic (RTL support)
- English

## 🌐 Supported Countries

Egypt, Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman, Jordan, Lebanon, Morocco

## 🚀 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Vercel deployment
- Database setup (Vercel Postgres, Supabase, Neon)
- Custom domain configuration
- Environment variables

## 📝 License

© 2024 MapEg. All rights reserved.
