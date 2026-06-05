# Screenshot Guide — Patchwork

Screenshots to take for the GitHub README, portfolio, and social sharing.

## Setup

1. Create a GitHub OAuth App pointing to localhost
2. `npm run dev` — confirm the app loads at localhost:3000
3. Have at least one real repo connected with a generated changelog

---

## Screenshots to Take

### 1. Landing page — hero
- **URL:** `localhost:3000`
- **Goal:** Show the headline, subheading, and CTA
- **Size:** 1280×800 (full page above the fold)
- **File:** `screenshots/landing.png`

### 2. Login page
- **URL:** `localhost:3000/login`
- **Goal:** Show the clean "Continue with GitHub" card
- **Size:** 1280×800
- **File:** `screenshots/login.png`

### 3. Dashboard — repos connected
- **URL:** `localhost:3000/dashboard`
- **Goal:** Show at least 2–3 connected repos with changelog counts
- **Size:** 1280×800
- **File:** `screenshots/dashboard.png`

### 4. Connect repo modal
- **URL:** `localhost:3000/dashboard` → click "Connect Repository"
- **Goal:** Show the GitHub repo picker with search
- **Size:** 1280×800
- **File:** `screenshots/connect-repo.png`

### 5. Repo page — with generated changelogs
- **URL:** `localhost:3000/repos/[id]`
- **Goal:** Show the generate form + a list of changelogs below
- **Size:** 1280×1200 (scroll to show changelogs)
- **File:** `screenshots/repo-page.png`

### 6. Generated changelog — with categories
- **URL:** `localhost:3000/repos/[id]`
- **Goal:** Show a full changelog card with Features, Fixes, and Improvements sections
- **Notes:** Make sure at least 2–3 categories have items
- **File:** `screenshots/changelog-card.png`

### 7. Public changelog page
- **URL:** `localhost:3000/log/[owner]/[repo]`
- **Goal:** Show the public-facing changelog list (no login required)
- **Size:** 1280×900
- **File:** `screenshots/public-log.png`

### 8. Single changelog page
- **URL:** `localhost:3000/log/[owner]/[repo]/[slug]`
- **Goal:** Show the full single changelog with raw commits expanded
- **File:** `screenshots/single-changelog.png`

### 9. Embed widget
- **URL:** `localhost:3000/embed/[owner]/[repo]`
- **Goal:** Show the minimal iframe-ready widget
- **Notes:** Open in a small browser window (~400px wide) to simulate an iframe
- **File:** `screenshots/embed-widget.png`

---

## README Usage

For the README hero, use `landing.png`. Add this markdown:

```markdown
![Patchwork landing page](screenshots/landing.png)

![Dashboard](screenshots/dashboard.png)

![Generated changelog](screenshots/changelog-card.png)

![Public page](screenshots/public-log.png)
```

---

## Tips

- Use browser zoom at 100% for sharp screenshots
- Use dark mode in your OS so system UI matches the app theme
- Crop to remove browser chrome if showing on portfolio
- For the embed widget, resize the browser to 420px wide
