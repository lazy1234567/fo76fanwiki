# Vault-76 Wiki

A community-verified Fallout 76 wiki — AI seeded, human approved.

## Stack
- **Next.js 14** (App Router) on Vercel
- **Neon** (serverless Postgres) — free tier
- **Claude API** for AI article generation
- FO76 Pip-Boy blue/yellow theme

## Setup

### 1. Clone & Install
```bash
git clone <your-repo>
cd fo76wiki
npm install
```

### 2. Vercel + Neon
1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add Neon integration: Vercel Dashboard > Storage > Create Database > Neon
4. This auto-sets `DATABASE_URL` in your environment

### 3. Environment Variables
Set these in Vercel Dashboard > Settings > Environment Variables:
```
ANTHROPIC_API_KEY=sk-ant-...
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 4. Initialize Database
After first deploy, visit:
```
https://your-domain.vercel.app/api/init-db
```
This creates the `articles` and `flags` tables.

### 5. Generate First Articles
Go to `/admin/seed` and use the AI generator to seed initial content.

## Content Flow
1. AI generates article → status: `ai_draft`
2. Users read article, click "Flag Error" → status: `needs_review`  
3. Mod visits `/admin`, reviews flags, approves → status: `verified`

## Regions
`vercel.json` targets `syd1` (Sydney) for lowest latency from QLD.
