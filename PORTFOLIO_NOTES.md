# Portfolio Notes — Patchwork

Notes for explaining this project to recruiters, interviewers, university admissions, and internship applications.

---

## The One-Liner

> "Built Patchwork — a GitHub OAuth changelog generator with AI categorization, public shareable pages, and an embeddable widget. Implemented raw OAuth 2.0 without a library, integrating GitHub's API and Groq's LLM."

---

## What Makes This Impressive

### 1. Raw OAuth 2.0 — not NextAuth, not Passport

Most developers use a library like NextAuth and never understand what OAuth actually does. Patchwork implements the full flow from scratch:

- Generate random state token (CSRF protection)
- Redirect user to GitHub's authorization endpoint
- Receive callback with authorization code
- Exchange code for access token (server-side)
- Fetch user profile, upsert to DB, set encrypted session cookie

This shows you understand the protocol, not just the library.

**In an interview:** "I chose to implement OAuth manually rather than use NextAuth because I wanted to understand the protocol deeply and have full control over session management. I handle the CSRF state token, token exchange, and session encryption myself."

---

### 2. Multi-tenant SaaS data model

Users own repositories. Repositories own changelogs. Deleting a user cascades. This is real SaaS architecture:

```
User → Repository → Changelog
```

**In an interview:** "The schema is multi-tenant — each user has their own set of connected repositories and changelogs. Prisma handles the cascade deletes, and every database query is scoped to the authenticated user's ID to prevent data leakage."

---

### 3. AI for content generation, not just analysis

ShipSafe uses AI to analyze an existing result. Patchwork uses AI to generate structured content from raw data (commit messages → categorized changelog). The prompt engineering produces consistent JSON output.

**In an interview:** "The AI takes an array of commit messages and outputs structured JSON with four categories. I added a keyword-based fallback so the app works even without an API key — graceful degradation."

---

### 4. Embeddable widget + public JSON API

The `/embed/[owner]/[repo]` route is iframe-ready (correct CORS and CSP headers). The `/api/public/[owner]/[repo]` route returns JSON for anyone to build on. This is product thinking — shipping a platform, not just an app.

**In an interview:** "I built Patchwork as a platform with a public API from day one. Any developer can embed a live changelog in their own site with one iframe tag, or consume the JSON API to build their own UI."

---

### 5. Session security

- iron-session uses AES-256-GCM encrypted cookies
- Cookies are HttpOnly (not readable by JavaScript)
- Cookies are Secure in production
- SameSite=Lax prevents CSRF on the session itself

---

## Skills Checklist for Resume

Use these to decide which bullets to include:

- [x] OAuth 2.0 implementation (not library)
- [x] GitHub API integration (user, repos, commits)
- [x] Session management (encrypted HttpOnly cookies)
- [x] CSRF protection
- [x] Multi-tenant data model (user-scoped queries)
- [x] AI integration (Groq, structured JSON output)
- [x] Prompt engineering (consistent structured output)
- [x] Graceful degradation (AI optional)
- [x] Public API design (CORS, caching headers)
- [x] Embeddable widget (iframe, CSP headers)
- [x] Prisma 7 + PostgreSQL (same stack, different schema)
- [x] Next.js App Router (server components, route handlers)
- [x] TypeScript (strict mode, no any)
- [x] Vercel deployment
- [x] GitHub Actions CI

---

## Differences from ShipSafe

When asked "how does this differ from ShipSafe?":

> "ShipSafe is stateless — paste a URL, get a report, no accounts. Patchwork is stateful multi-tenant SaaS. Users log in via OAuth, own repositories, generate changelogs over time, and share them publicly. The engineering challenges are completely different: session management, OAuth, GitHub API pagination, multi-tenant data isolation, embeddable widgets."

---

## Numbers to Know

- OAuth flow: ~4 HTTP requests (authorize → callback → token exchange → user fetch)
- Commit fetch: GitHub API returns up to 100 commits per request (default 50)
- AI latency: ~1–3 seconds on Groq (llama-3.3-70b)
- DB queries: all scoped by userId (no cross-tenant data leakage)
- Session TTL: 30 days (configurable in session.ts)
