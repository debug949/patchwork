# Deployment Guide — Patchwork

## Prerequisites

- Node.js 20+
- A Neon PostgreSQL account (neon.tech)
- A GitHub account (for OAuth App + hosting)
- A Vercel account

---

## Step 1 — Create GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name:** Patchwork
   - **Homepage URL:** `https://your-app.vercel.app` (or `http://localhost:3000` for dev)
   - **Authorization callback URL:** `https://your-app.vercel.app/api/auth/callback`
3. Click **Register application**
4. On the next page, copy:
   - **Client ID** → `GITHUB_CLIENT_ID`
   - Click **Generate a new client secret** → `GITHUB_CLIENT_SECRET`

---

## Step 2 — Set up environment variables locally

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="your-neon-connection-string"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
SESSION_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
GROQ_API_KEY="gsk_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Also add `DATABASE_URL` to `.env` (for Prisma CLI):
```env
DATABASE_URL="your-neon-connection-string"
```

---

## Step 3 — Run database migration

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Verify the app works at `http://localhost:3000`.

---

## Step 4 — Push to GitHub

```bash
git remote add origin https://github.com/your-username/patchwork
git branch -M main
git push -u origin main
```

---

## Step 5 — Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `patchwork` repository
3. Framework: **Next.js** (auto-detected)
4. Add environment variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `GITHUB_CLIENT_ID` | From GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | From GitHub OAuth App |
| `SESSION_SECRET` | 32+ random chars (generate once, keep it) |
| `GROQ_API_KEY` | From console.groq.com (optional) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

5. Click **Deploy**

---

## Step 6 — Update GitHub OAuth App callback URL

After getting your Vercel URL:

1. Go back to **GitHub → Settings → Developer settings → OAuth Apps → Patchwork**
2. Update **Authorization callback URL** to:
   `https://your-app.vercel.app/api/auth/callback`
3. Update **Homepage URL** to `https://your-app.vercel.app`
4. Click **Update application**

---

## Step 7 — Add secrets to GitHub Actions (for CI)

1. Go to your repo → **Settings → Secrets and variables → Actions**
2. Add these secrets:
   - `DATABASE_URL`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `SESSION_SECRET`
   - `GROQ_API_KEY`
   - `NEXT_PUBLIC_APP_URL`

---

## Checklist

- [ ] GitHub OAuth App created with correct callback URL
- [ ] `.env.local` filled in completely
- [ ] `npm run dev` works locally
- [ ] Sign in with GitHub works locally
- [ ] Can connect a repo and generate a changelog locally
- [ ] Public page (`/log/owner/repo`) is visible without login
- [ ] Embed widget (`/embed/owner/repo`) works in an iframe
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Vercel env vars all set
- [ ] Production OAuth callback URL updated
- [ ] Production sign-in works
- [ ] GitHub Actions CI passing
