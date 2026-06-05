# Patchwork

Auto-generate changelogs from your GitHub commits. Shareable public pages and an embeddable iframe widget included.

## Features

- **GitHub OAuth** — sign in, connect any repo you have access to
- **Commit analysis** — fetches commit history from the GitHub API
- **AI categorization** — sorts commits into features, fixes, refactors, and breaking changes using Groq (falls back to keyword matching)
- **Public changelog pages** — every repo gets a shareable URL at `/log/owner/repo`
- **Embeddable widget** — paste one `<iframe>` tag to show your changelog anywhere
- **Public JSON API** — `/api/public/owner/repo` for custom integrations

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Prisma 7** + PostgreSQL (Neon)
- **Raw GitHub OAuth 2.0** (no NextAuth)
- **iron-session** for encrypted cookie sessions
- **Groq** (llama-3.3-70b-versatile) for AI generation

## Getting Started

### 1. Clone

```bash
git clone https://github.com/your-username/patchwork
cd patchwork
npm install
```

### 2. Create a GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Homepage URL**: `http://localhost:3000`
4. Set **Authorization callback URL**: `http://localhost:3000/api/auth/callback`
5. Copy **Client ID** and **Client Secret**

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL="postgresql://..."
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
SESSION_SECRET="at-least-32-random-characters"
GROQ_API_KEY="gsk_..."          # optional — falls back to keyword matching
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Update your GitHub OAuth App's callback URL to `https://your-domain.vercel.app/api/auth/callback`
5. Set `NEXT_PUBLIC_APP_URL` to `https://your-domain.vercel.app`
6. Deploy

## Embeddable Widget

Add this to any HTML page to embed a live changelog:

```html
<iframe
  src="https://your-domain.vercel.app/embed/owner/repo"
  width="100%"
  height="600"
  frameborder="0"
></iframe>
```

## Public JSON API

```
GET /api/public/:owner/:repo
```

Returns:
```json
{
  "repository": { "fullName": "owner/repo", ... },
  "changelogs": [
    {
      "title": "v1.2.0 — Jun 5, 2026",
      "version": "v1.2.0",
      "commitCount": 23,
      "content": {
        "summary": "...",
        "features": ["..."],
        "fixes": ["..."],
        "refactors": ["..."],
        "breaking": []
      }
    }
  ]
}
```

## License

MIT
