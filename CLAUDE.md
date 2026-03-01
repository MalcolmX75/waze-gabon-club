# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Waze Gabon Club #1** — The first Waze community website for Gabon. A Next.js App Router site promoting Waze adoption across the country through tutorials, a live traffic map, community channels, and map editor recruitment.

- **Domain**: wazegabon.com
- **Hosting**: Vercel (free tier, auto-deploy from main)
- **Bilingual**: French (default) + English (259 keys per language)
- **Target**: Drivers in Gabon (Libreville and nationwide)
- **Budget**: Zero (free services only)
- **Founder**: Michael — sole decision-maker, no tech team

## Build & Development

```bash
npm install           # Install dependencies
npm run dev           # Dev server → http://localhost:3000
npm run build         # Production build → .next/
npm run start         # Preview production build
npm run lint          # ESLint
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (VPS IONOS Docker) |
| `CRON_SECRET` | Auth token for Vercel cron jobs |
| `TELEGRAM_BOT_TOKEN` | Telegram bot API token |
| `TELEGRAM_CHANNEL_ID` | Telegram channel for publishing |
| `FACEBOOK_PAGE_ID` | Facebook page ID |
| `FACEBOOK_PAGE_TOKEN` | Facebook page access token |
| `FORMSPREE_ID` | Formspree endpoint for registration form |

## Architecture

**Next.js 15 + React 19 — App Router** with SSR metadata for SEO.

### Project Structure

```
app/
├── layout.js              # Root layout (fonts, metadata, SEO, JSON-LD, providers)
├── page.js                # Homepage (assembles all sections via flags)
├── globals.css            # Global styles (animations, utilities, buttons)
├── favicon.ico
├── opengraph-image.js     # Dynamic OG image (1200x630)
├── robots.js              # robots.txt
├── sitemap.js             # sitemap.xml
└── api/
    └── cron/
        ├── articles/route.js   # Daily articles fetch (8h UTC, max 5/day, FR only)
        └── community/route.js  # Daily Waze Man engagement post (12h UTC)

components/                # One file per section
├── Navigation.js
├── Hero.js
├── Features.js
├── Download.js
├── Tutorials.js           # 'use client' — accordion
├── LiveMap.js             # 'use client' — iframe
├── Community.js
├── Articles.js
├── FAQ.js                 # 'use client' — accordion
├── Privacy.js
├── Footer.js
├── FloatingWhatsApp.js
├── RegisterModal.js       # 'use client' — form + validation
├── DebugPanel.js          # 'use client' — ?debug=flags
└── LanguageSwitcher.js    # 'use client'

lib/
├── config.js              # All external links (WhatsApp, Telegram, Facebook, Waze, Formspree)
├── flags.js               # 14 feature flags + useFlags() hook
├── colors.js              # Gabon flag + Waze brand colors
├── data.js                # Static data (deep links, tutorials, articles, FAQ)
├── db.js                  # PostgreSQL connection pool (pg)
├── publish.js             # Social publishing (Telegram + Facebook)
├── community-posts.js     # Waze Man message bank (~40 messages)
└── i18n/
    ├── index.js           # LanguageProvider + useTranslation() hook
    ├── fr.json            # French (259 keys)
    └── en.json            # English (259 keys)

utils/
├── form.js                # Validation, honeypot, rate limiting, HTML sanitization
└── externalLink.js        # externalLinkProps helper (rel="noopener noreferrer")

public/
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker
├── logo.png               # Logo 800x800
├── logo.svg               # Logo vector
├── apple-touch-icon.png
├── favicon-16x16.png
├── favicon-32x32.png
└── icons/
    ├── icon-192x192.png
    └── icon-512x512.png

docs/                      # SAFER METHOD™ documentation (phases 00-11)
```

### Key Patterns

| Pattern | Rule |
|---------|------|
| **Text** | ALL visible text via `t('key')` from `useTranslation()` — zero hardcoded strings |
| **Links** | ALL external URLs from `lib/config.js` — zero hardcoded links |
| **External links** | ALL use `externalLinkProps` from `utils/externalLink.js` |
| **Sections** | ALL wrapped in feature flags from `lib/flags.js` |
| **Forms** | ALL use validation from `utils/form.js` + honeypot `_gotcha` |
| **Components** | Server Components by default. `'use client'` only for interactivity (useState, onClick) |

### i18n

Custom lightweight solution (no i18next). `useTranslation()` returns `{ t, lang, switchLang }`. Language stored in localStorage. Keys use dot-notation: `"section.element"` (e.g., `"hero.cta.whatsapp"`). FR and EN must always have the same number of keys.

### Feature Flags

14 flags in `lib/flags.js`. All `true` in dev. Production: 10 ON, 3 OFF (livemap, articles, registerModal), 1 SYSTEM (debugPanel). Debug panel visible at `?debug=flags`.

## Official Links

- **WhatsApp**: https://chat.whatsapp.com/CxqQfJ2DI8rJFGRx583YS5
- **Telegram**: https://t.me/+terR7LTLdk9jMDk0
- **Facebook**: https://www.facebook.com/WazeGabonClub
- **GitHub**: https://github.com/MalcolmX75/waze-gabon-club
- **Domain**: https://wazegabon.com

## Your Role

You are a **Senior Software Architect**, not a code generator. When given a task:

1. **Analyze** what's needed (SEO, security, performance, i18n implications)
2. **Propose** your plan before executing
3. **Implement** respecting all rules above
4. **Verify** yourself (`npm run build`, grep for issues, test flags)
5. **Commit** with convention: `type(scope): description` (feat, fix, docs, style, refactor, perf, chore, i18n)

## Methodology

**SAFER METHOD™** framework. Full documentation in `/docs/` (phases 00-11). Key principles:
- Architecture-first, security-first
- Feature flags for controlled rollout
- Environment separation (local → preview → production)
- Rollback plan before any deployment
- Document before coding

## Backend & Database

- **Database**: PostgreSQL on VPS IONOS Docker (212.227.87.11)
- **Tables**:
  - `articles` — RSS articles (title, description, url, source, tag, published_at)
  - `registrations` — Map editor registrations
  - `community_log` — Tracks posted Waze Man messages (avoids duplicates, auto-resets cycle)
- **Connection**: `lib/db.js` via `pg` Pool, connection string in `DATABASE_URL`

## Cron Jobs (Vercel)

| Cron | Schedule | Endpoint | Description |
|------|----------|----------|-------------|
| Articles | `0 8 * * *` (8h UTC) | `/api/cron/articles` | Fetches Google News RSS, filters French-only, max 5/day, publishes to Telegram+Facebook |
| Community | `0 12 * * *` (12h UTC) | `/api/cron/community` | Posts 1 random Waze Man message to Telegram+Facebook |

Both crons protected by `CRON_SECRET` Bearer token.

## Social Publishing

- **Telegram Bot**: Posts articles + Waze Man messages to channel
- **Facebook Page**: Posts same content via Graph API v19.0
- **Publishing logic**: `lib/publish.js` — `publishArticle()` + `publishCommunityPost()`
- Silent fallback: if a token is missing, the channel is skipped (no error)

## "Waze Man" — Community Manager Persona

- **Signature**: `— Waze Man 🏎️`
- **Tone**: Gabonais, drôle, moqueur, relax — parle comme un gars du quartier
- **Categories**: tips, humor, collabs, engagement, promo
- **Message bank**: `lib/community-posts.js` (~40 messages pré-écrits)
- **Hashtags par défaut**: `#WazeGabon #WazeMan #Libreville`
- **Collabs**: Mentions @airtelgabon, CanalBox, SEEG, @GabonTelecom, @Moov_Gabon, Mbolo, banques

## Key Constraints

- No AI chatbot (too expensive — FAQ + WhatsApp instead)
- No fuel price comparison (prices fixed by government in Gabon)
- Mobile-first (90%+ mobile users, 3G/4G networks)
- Bundle < 150 KB gzip (frontend)
- Zero `dangerouslySetInnerHTML` (except JSON-LD in layout.js)
- Security headers in `next.config.js`
- Max 5 articles/day (avoid spam)
- Articles must be French-only (isFrench filter)

## Founder's Philosophy

Durability > virality. Discipline > speed. Community > automation. Simplicity > complexity. Don't over-engineer. Keep it clean, functional, and maintainable by a solo founder.
