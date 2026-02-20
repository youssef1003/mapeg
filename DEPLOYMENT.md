# Deployment Guide

This guide covers deploying MapEg to Vercel with a PostgreSQL database.

## Prerequisites

- Vercel account
- PostgreSQL database (Vercel Postgres, Supabase, Neon, or any PostgreSQL provider)
- Custom domain (optional)

## 1. Database Setup

### Option A: Vercel Postgres
1. Go to your Vercel project → Storage → Create Database → Postgres
2. Copy the connection string provided

### Option B: External PostgreSQL (Supabase, Neon, Railway, etc.)
1. Create a new PostgreSQL database
2. Get the connection string in format:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
   ```

## 2. Vercel Deployment

### First-time Setup

1. **Connect Repository**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Or deploy via GitHub integration at vercel.com/new
   ```

2. **Configure Environment Variables**
   
   In Vercel Dashboard → Project → Settings → Environment Variables:
   
   | Variable | Value | Environments |
   |----------|-------|--------------|
   | `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
   | `DATABASE_URI` | Same as DATABASE_URL | Production, Preview, Development |
   | `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` | Production |
   | `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Preview |

3. **Build Settings**
   
   Vercel auto-detects Next.js. Ensure these settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### Deploy

```bash
# Via CLI
vercel --prod

# Or push to main branch for automatic deployment
git push origin main
```

## 3. Database Migration (Production)

**Important**: Run migrations BEFORE your first production deployment.

```bash
# Set production DATABASE_URL locally
export DATABASE_URL="postgresql://..."

# Run production migrations
npm run db:deploy

# Seed data (optional, for first deployment only)
npm run db:seed
```

Or use Vercel's build command override:
```bash
# In vercel.json or build settings
prisma migrate deploy && next build
```

## 4. Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `mapeg.com`)
3. Configure DNS:

### DNS Settings

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

Or for subdomain only:
| Type | Name | Value |
|------|------|-------|
| CNAME | jobs | cname.vercel-dns.com |

4. Wait for SSL certificate (automatic, usually < 5 minutes)

## 5. Post-Deployment Checklist

- [ ] Verify site loads at production URL
- [ ] Test admin login functionality
- [ ] Verify job listings load from database
- [ ] Test contact form submission
- [ ] Check all pages in both Arabic and English
- [ ] Verify security headers (use securityheaders.com)
- [ ] Test on mobile devices

## 6. Monitoring & Maintenance

### Logs
```bash
vercel logs your-project --prod
```

### Database Maintenance
```bash
# Backup before migrations
pg_dump $DATABASE_URL > backup.sql

# Run new migrations
npm run db:deploy
```

### Rollback
Vercel keeps deployment history. Rollback via:
- Dashboard → Deployments → Click deployment → Promote to Production
- Or: `vercel rollback [deployment-url]`

## Troubleshooting

### Build Fails with Prisma Error
Ensure `prisma generate` runs before build:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Database Connection Issues
- Verify DATABASE_URL is correctly set in Vercel
- Check if database allows connections from Vercel's IP ranges
- For Supabase: Enable "Allow connections from all IPs" or add Vercel IPs

### 500 Errors on Dynamic Routes
Check Vercel Function Logs for specific errors:
```bash
vercel logs --prod --since 1h
```
