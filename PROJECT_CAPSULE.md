# Patchwork — Project Capsule

> Last updated: 2026-06-05

---

## What It Is

Patchwork is a changelog generator that connects to GitHub via OAuth, fetches commit history, and produces a categorized, AI-enhanced changelog — split into features, fixes, refactors, and breaking changes. Every changelog gets a public shareable URL and an embeddable iframe widget.

**Live:** (pending Vercel deployment)
**GitHub:** (pending repo creation)

---

## Why It Was Built

Project #2 in a portfolio demonstrating different skills than ShipSafe. Where ShipSafe shows security tooling + anonymous HTTP scanning, Patchwork demonstrates:

- Real OAuth 2.0 implementation (not a library wrapper)
- GitHub API integration
- Multi-tenant SaaS with user-owned data
- AI for content generation (structured output from commit history)
- Embeddable third-party widgets
- Session management with iron-session

Built by a 15-year-old developer optimizing for portfolio value and internship applications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL on Neon (serverless) |
| ORM | Prisma 7 (pg adapter) |
| Auth | Raw GitHub OAuth 2.0 + iron-session |
| AI | Groq API — llama-3.3-70b-versatile |
| Deployment | Vercel (web) + Neon (database) |

---

## Architecture

```
Browser
  └── Next.js App Router (Vercel)
        ├── /                         Landing page
        ├── /login                    GitHub OAuth entry point
        ├── /dashboard                Connected repos list
        ├── /repos/[id]               Repo detail + changelog generation
        ├── /log/[owner]/[repo]       Public changelog list
        ├── /log/[owner]/[repo]/[slug] Single changelog
        ├── /embed/[owner]/[repo]     Embeddable iframe widget
        └── /api/
              ├── auth/               OAuth flow (github, callback, logout)
              ├── repos/              CRUD + GitHub repo list
              ├── repos/[id]/generate POST: fetch commits → AI → save
              └── public/[owner]/[repo] Public JSON API
```

---

## OAuth Flow

```
1. GET /api/auth/github
   └─ Generate CSRF state → set cookie → redirect to github.com/login/oauth/authorize

2. GET /api/auth/callback?code=...&state=...
   ├─ Verify state cookie (CSRF protection)
   ├─ POST github.com/login/oauth/access_token
   ├─ GET api.github.com/user
   ├─ Upsert user in DB
   ├─ Set iron-session cookie (HttpOnly, Secure)
   └─ Redirect to /dashboard
```

---

## Database Schema

```
User           — GitHub identity, access token, session anchor
Repository     — user-connected GitHub repos
Changelog      — generated changelogs with AI content + raw commits
```

---

## Features Completed

- [x] GitHub OAuth 2.0 (raw implementation, no NextAuth)
- [x] CSRF protection on OAuth state
- [x] iron-session HttpOnly cookie sessions
- [x] GitHub API: user profile, repo list, commit history
- [x] Repository connect/disconnect
- [x] Mock changelog generation (keyword-based categorization)
- [x] AI changelog generation via Groq (with mock fallback)
- [x] Public changelog pages (/log/[owner]/[repo])
- [x] Single changelog page with raw commit list
- [x] Embeddable iframe widget (/embed/[owner]/[repo])
- [x] Public JSON API (/api/public/[owner]/[repo])
- [x] Dashboard with repo management
- [x] GitHub Actions CI
- [x] Shareable changelog URLs (slug-based)

---

## Features Remaining

- [ ] Vercel deployment
- [ ] Custom domain
- [ ] Webhook-triggered auto-generation
- [ ] PDF export
- [ ] Version tag picker (fetch from GitHub releases)
- [ ] Changelog editing (rich text)
- [ ] Team access (share repo management)
- [ ] Monetization: free (3 generations/month) + Pro ($9/mo, unlimited)

---

## Skills Demonstrated (vs ShipSafe)

| Skill | ShipSafe | Patchwork |
|---|---|---|
| OAuth 2.0 | ✗ | ✓ Raw implementation |
| Session management | ✗ | ✓ iron-session |
| GitHub API | ✗ | ✓ Full integration |
| Multi-tenant auth | ✗ | ✓ User-scoped data |
| AI content gen | ✓ Analysis | ✓ Generation |
| Embeddable widgets | ✗ | ✓ iframe + JSON API |
| CSRF protection | ✗ | ✓ State token |

---

## Problems Solved

1. **iron-session with Next.js 15+ async cookies** — `cookies()` returns a Promise in Next.js 15+; must `await cookies()` before passing to `getIronSession`.
2. **Prisma 7 + pg adapter** — Same pattern as ShipSafe: `prisma.config.ts` + `@prisma/adapter-pg`, no url in schema.
3. **Embed iframe headers** — Next.js sets `X-Frame-Options: SAMEORIGIN` by default; overridden via `next.config.ts` headers for `/embed/*` routes.
4. **CSRF on OAuth** — Random state token stored in short-lived HttpOnly cookie, verified on callback.

---

## Resume Line

Built Patchwork — a GitHub OAuth changelog generator with AI categorization, public shareable pages, and an embeddable iframe widget (Next.js, TypeScript, Prisma, PostgreSQL, Groq). Implemented raw OAuth 2.0 without NextAuth.
