# folio. — Launch Roadmap & Task Planning

> **Living document** — updated by Claude with every session, tracked in git alongside the spec.
> Last updated: 2026-03-14 | Status: Pre-launch development

-----

## 👥 Team

| Name | Role | Responsibilities |
|---|---|---|
| **Timo** | CTO / Product | Product development with Claude, architecture, API integrations, deployment |
| **Claude** | AI Dev Partner | Code, spec maintenance, implementation, debugging |
| **Paul** | CFO / Back Office | UG formation, financials, Stripe setup, legal, contracts, banking, compliance |
| **Sasan** | PR / Marketing | Social media, content creation, YouTuber outreach, community, ads, SEO content |

-----

## 🎯 Launch Target

**Goal:** Public launch with Free + Starter + Premium tiers live and purchasable.  
**Target date:** ~July 2026 (14–16 weeks from now, gated by UG formation + Tink production approval)  
**Premium+ (tax tool):** Separate launch in Q4 2026, timed for tax season.

-----

## 📊 Launch Readiness Tracker

| Requirement | Owner | Status | Notes |
|---|---|---|---|
| UG/GmbH formation | Paul | 🟡 In progress | Notary → Handelsregister → bank account |
| Business bank account | Paul | ⬜ Not started | Needs Handelsregister entry |
| Tink sandbox access | Timo | ⬜ Not started | Can apply without company |
| Tink production access | Paul + Timo | ⬜ Blocked | Requires registered company |
| Stripe account setup | Paul | ⬜ Not started | Needs business bank account |
| Stripe integration (code) | Timo + Claude | ⬜ Not started | Payment processing for subscriptions |
| Supabase auth + profiles | Timo + Claude | ⬜ Not started | User accounts, tier management |
| Domain + DNS | Timo | ✅ Done | foliologic.app |
| Vercel deployment | Timo | ✅ Done | Already deployed |
| FMP API | Timo | ✅ Active | On current plan, Premium upgrade pending |
| CoinGecko API | Timo | ✅ Active | Analyst plan |
| Social media accounts | Sasan | ⬜ Not started | X/Twitter, LinkedIn, Instagram |
| Brand assets (logo, colors, OG images) | Sasan + Timo | ⬜ Not started | Needed for landing page + social |
| Email domain (firstname@foliologic.app) | Paul | ⬜ Not started | For outreach and support |
| Discord server | Sasan | ⬜ Not started | Community hub |
| Datenschutz / Privacy policy | Paul | ⬜ Not started | Legal requirement |
| Impressum | Paul | ⬜ Not started | Needs UG details |
| AGB / Terms of Service | Paul | ⬜ Not started | Legal requirement |

-----

## 🏗️ Development Phases to Launch

### Phase L1 — Landing Page, Demo & Email List (Weeks 1–2)

> **Do this FIRST.** Every week without a landing page is a week of zero discovery.
> The demo showcases what's already built. The email list starts collecting interested
> users immediately. Free marketing (Reddit, Twitter, SEO) can begin as soon as this is live.
> Update the demo with each new feature as L2–L5 progress.

| # | Task | Owner | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L1.1 | Light theme (default) + dark toggle in Settings | Timo + Claude | 2–3 | 🚧 | None |
| L1.2 | Landing page: hero, feature showcase, pricing table | Timo + Claude | 2–3 | ⬜ | L1.1 |
| L1.3 | Security & trust section + competitive comparison | Timo + Claude | 1 | ⬜ | L1.2 |
| L1.4 | Demo page with fake portfolio data (no login required) | Timo + Claude | 2 | ⬜ | L1.1, L1.2 |
| L1.5 | Email signup: "Get notified when we launch" (Resend list) | Timo + Claude | 0.5 | ⬜ | L1.2 |
| L1.6 | SEO fundamentals: meta tags, OG images, sitemap | Timo + Claude | 1 | ⬜ | L1.2 |
| L1.7 | Version number visible in app | Timo + Claude | 0.5 | ⬜ | None |
| L1.8 | Brand assets: logo variations, OG images, social banners | Sasan | — | ⬜ | None — start NOW |
| L1.9 | Create social accounts (X/Twitter, LinkedIn, Instagram) | Sasan | — | ⬜ | L1.8 |
| L1.10 | Landing page copy: taglines, feature descriptions (German + English) | Sasan + Timo | — | ⬜ | L1.2 |

**Phase L1 dev total: ~9–11 sessions (Timo + Claude)**

**Immediately after L1 goes live:**

| # | Task | Owner | Status |
|---|---|---|---|
| L1-M1 | First r/Finanzen post: "I'm building a portfolio tracker with AI research — here's the demo" | Sasan + Timo | ⬜ |
| L1-M2 | Twitter/X: start build-in-public posts with screenshots | Sasan | ⬜ |
| L1-M3 | LinkedIn: first founder post about the project | Sasan + Timo | ⬜ |
| L1-M4 | First SEO blog post: "Portfolio Tracker Vergleich 2026" | Sasan | ⬜ |
| L1-M5 | Instagram: product screenshots, dark/light mode showcase | Sasan | ⬜ |

-----

### Phase L2 — Quick Wins & Feature Completion (Weeks 2–5)

> Make the existing product feel complete. Everything here is frontend work on existing data.
> Each completed feature gets added to the demo and announced to the email list.

| # | Task | Owner | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L2.1 | Global search modal (Cmd+K) | Timo + Claude | 1–2 | ⬜ | None |
| L2.2 | Invested capital line on portfolio chart | Timo + Claude | 0.5 | ⬜ | None |
| L2.3 | Activity tab (transactions, collapsed by year + broker) | Timo + Claude | 1–2 | ⬜ | None |
| L2.4 | Earnings calendar (portfolio-scoped) | Timo + Claude | 1–2 | ⬜ | FMP endpoint |
| L2.5 | Dividend dashboard (basic: history + annual total) | Timo + Claude | 2 | ⬜ | FMP dividend data |
| L2.6 | Extended benchmarks (MSCI World, Euro Stoxx, Gold, Bonds) | Timo + Claude | 1–2 | ⬜ | FMP historical prices |
| L2.7 | Developer setting: toggle hardcoded parsers on/off | Timo + Claude | 0.5 | ⬜ | None |
| L2.8 | AI ETF analyzer (TER check, closure risk, overlap, diversification) | Timo + Claude | 2–3 | ⬜ | Claude API, FMP ETF data |

**Phase L2 dev total: ~9–13 sessions (Timo + Claude)**

**Marketing (ongoing, parallel to L2):**

| # | Task | Owner | Status |
|---|---|---|---|
| L2-M1 | Update demo with each new feature as it ships | Timo + Claude | ⬜ |
| L2-M2 | Email list update: "New features in the demo — try it" | Sasan | ⬜ |
| L2-M3 | r/Finanzen post: ETF analyzer showcase | Sasan + Timo | ⬜ |
| L2-M4 | Weekly build-in-public Twitter/X updates | Sasan | ⬜ |
| L2-M5 | SEO blog: "Beste ETF-Analyse Tools 2026" | Sasan | ⬜ |
| L2-M6 | SEO blog: "Dividenden Tracker — kostenlos Portfolio analysieren" | Sasan | ⬜ |
| L2-M7 | Research YouTuber rates + contact info (Aktien mit Kopf, Homo Oeconomicus) | Sasan | ⬜ |

-----

### Phase L3 — Infrastructure & Auth (Weeks 5–7)

> User accounts, payments, tier gating.
> Nothing works as a business without this.

| # | Task | Owner | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L3.1 | Supabase auth: email + Google sign-up/login | Timo + Claude | — | ✅ | Already implemented |
| L3.2 | User profiles table + tier field (free/starter/premium) | Timo + Claude | 1 | ⬜ | L3.1 ✅ |
| L3.3 | Stripe account setup + product/price configuration | Paul | — | ⬜ | Business bank account |
| L3.4 | Stripe integration: subscription checkout + webhook (code) | Timo + Claude | 2–3 | ⬜ | L3.3 |
| L3.5 | Tier gating: lock Starter+ features behind paywall | Timo + Claude | 2 | ⬜ | L3.2 |
| L3.6 | AI import quota system (Free: 5/month counter) | Timo + Claude | 1 | ⬜ | L3.2 |
| L3.7 | Settings page: account, subscription, preferences | Timo + Claude | 1–2 | ⬜ | L3.2, L3.4 |
| L3.8 | New user email notification to founder (Resend) | Timo + Claude | 0.5–1 | ⬜ | Resend account |
| L3.9 | Onboarding flow: first-time user experience | Timo + Claude | 1–2 | ⬜ | L3.2 |

**Phase L3 dev total: ~8–11 sessions (Timo + Claude)** (auth already done, saves ~2 sessions)

**Paul tasks (parallel to L3):**

| # | Task | Owner | Status | Deadline |
|---|---|---|---|---|
| L3-P1 | Complete UG registration (Handelsregister) | Paul | 🟡 | ASAP |
| L3-P2 | Open business bank account | Paul | ⬜ | After L3-P1 |
| L3-P3 | Register for Stripe with UG details | Paul | ⬜ | After L3-P2 |
| L3-P4 | Configure Stripe products: Free, Starter €5.99, Premium €10.99 | Paul | ⬜ | After L3-P3 |
| L3-P5 | Set up Resend account for transactional emails | Paul | ⬜ | Week 5 |
| L3-P6 | Set up email domain (firstname@foliologic.app) | Paul | ⬜ | Week 5 |
| L3-P7 | Draft Datenschutzerklärung (privacy policy) | Paul | ⬜ | Week 6 |
| L3-P8 | Draft AGB (terms of service) | Paul | ⬜ | Week 6 |
| L3-P9 | Draft Impressum | Paul | ⬜ | After L3-P1 |
| L3-P10 | Research tax obligations for SaaS subscriptions (USt, Kleinunternehmerregelung) | Paul | ⬜ | Week 5 |

-----

### Phase L4 — Tink Integration (Weeks 7–10)

> Tink is mandatory for paid tiers but can slide in the schedule if the UG isn't ready.
> Sandbox development starts as early as possible; production testing is gated by UG.
> If UG is delayed, L5 (Premium features) can be pulled forward and Tink slotted in
> whenever the production account is approved.

| # | Task | Owner | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L4.1 | Apply for Tink sandbox access | Timo | 0.5 | ⬜ | None — do this NOW |
| L4.2 | `api/tink-link.js` — generate OAuth URL | Timo + Claude | 1 | ⬜ | L4.1 |
| L4.3 | `api/tink-callback.js` — exchange code, store token | Timo + Claude | 1 | ⬜ | L4.2 |
| L4.4 | `lib/psd2-parser.js` — transaction type detection + ISIN extraction | Timo + Claude | 2–3 | ⬜ | L4.3 |
| L4.5 | `lib/holdings-builder.js` — reconstruct holdings from tx log | Timo + Claude | 1–2 | ⬜ | L4.4 |
| L4.6 | `api/sync-accounts.js` — daily cron: fetch → parse → upsert | Timo + Claude | 1–2 | ⬜ | L4.4, L4.5 |
| L4.7 | Connection status UI in Settings | Timo + Claude | 1 | ⬜ | L4.3 |
| L4.8 | 90-day re-auth flow (banner + email reminder) | Timo + Claude | 1 | ⬜ | L4.3, L3.1 |
| L4.9 | Cold wallet transfer detection on Tink data | Timo + Claude | 1 | ⬜ | L4.4 |
| L4.10 | Test against real broker connections (production) | Timo | 2–3 | 🟡 | UG formed, Tink production approved |

**Phase L4 dev total: ~11–15 sessions (Timo + Claude)**  
**Blocker: L4.10 requires UG + Tink production approval**  
**Flexibility: If UG is delayed, swap L4 and L5 in the schedule. All L4 sandbox work (L4.1–L4.9) can proceed; only L4.10 is truly blocked.**

**Paul tasks (parallel to L4):**

| # | Task | Owner | Status | Deadline |
|---|---|---|---|---|
| L4-P1 | Apply for Tink production access (requires UG) | Paul | ⬜ | After UG registered |
| L4-P2 | Tink contract review + sign | Paul | ⬜ | After L4-P1 |
| L4-P3 | FMP Premium upgrade (€97/mo) — evaluate + purchase | Paul + Timo | ⬜ | Week 7 |

-----

### Phase L5 — Premium Features (Weeks 10–13)

> The features that justify Premium pricing.
> Portfolio chat is the headline; AI analysis features make it feel deep.
> Can be pulled forward if Tink is blocked.

| # | Task | Owner | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L5.1 | AI moat rating (quarterly cached) | Timo + Claude | 2 | ⬜ | Claude API |
| L5.2 | AI DCF / intrinsic value | Timo + Claude | 2–3 | ⬜ | Claude API, FMP data |
| L5.3 | AI balance sheet grade (earnings-triggered) | Timo + Claude | 1–2 | ⬜ | Claude API |
| L5.4 | Smart news architecture (cached summaries) | Timo + Claude | 2 | ⬜ | FMP news, Claude API |
| L5.5 | Portfolio chat (streaming, quota-tracked) | Timo + Claude | 3–4 | ⬜ | L3.2, L3.6, Claude API |
| L5.6 | AI quota system + visible quota bar in sidebar | Timo + Claude | 1 | ⬜ | L3.2 |
| L5.7 | Notification bell (in-app only for launch) | Timo + Claude | 2 | ⬜ | L3.2 |
| L5.8 | Core notification triggers: earnings reported, Possible Deal, sync failures | Timo + Claude | 1–2 | ⬜ | L5.7 |

**Phase L5 dev total: ~14–18 sessions (Timo + Claude)**

**Sasan tasks (parallel to L5):**

| # | Task | Owner | Status | Deadline |
|---|---|---|---|---|
| L5-S1 | Prepare Aktien mit Kopf outreach email (draft + pricing research) | Sasan | ⬜ | Week 10 |
| L5-S2 | Prepare Homo Oeconomicus outreach email | Sasan | ⬜ | Week 10 |
| L5-S3 | Create demo video / screen recording (1–2 min) for outreach | Sasan | ⬜ | Week 11 |
| L5-S4 | Product Hunt page preparation (assets, tagline, description) | Sasan | ⬜ | Week 12 |
| L5-S5 | Draft r/Finanzen launch post (different from demo post) | Sasan + Timo | ⬜ | Week 12 |

-----

### Phase L6 — Launch Polish (Weeks 13–15)

> Final pass before opening paid tiers.

| # | Task | Owner | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L6.1 | Legal pages: Impressum, Datenschutz, AGB (integrate into app) | Timo + Claude | 1 | ⬜ | Paul's drafts (L3-P7/8/9) |
| L6.2 | Update landing page with all new features + screenshots | Timo + Claude | 1 | ⬜ | L2–L5 done |
| L6.3 | Update demo with Premium features (cached/sample AI results) | Timo + Claude | 1 | ⬜ | L5 done |
| L6.4 | Bug fixes, edge cases, polish pass | Timo + Claude | 3–5 | ⬜ | All above |
| L6.5 | Performance audit: lazy loading, bundle size | Timo + Claude | 1 | ⬜ | All above |
| L6.6 | Email list announcement: "We're launching next week" | Sasan | 0.5 | ⬜ | All above |

**Phase L6 dev total: ~7–9 sessions (Timo + Claude)**

**Pre-launch (all hands, Week 14–15):**

| # | Task | Owner | Status |
|---|---|---|---|
| L6-A1 | End-to-end Stripe test: signup → charge → tier upgrade → cancel | Paul + Timo | ⬜ |
| L6-A2 | Legal pages reviewed + published | Paul | ⬜ |
| L6-A3 | Product Hunt launch scheduled | Sasan | ⬜ |
| L6-A4 | Launch blog post drafted | Sasan + Timo | ⬜ |
| L6-A5 | Email blast prepared: "We're live — here's your early access" | Sasan | ⬜ |
| L6-A6 | Discord server set up with channels (#general, #feedback, #bugs, #feature-requests) | Sasan | ⬜ |
| L6-A7 | Verify all legal requirements met (Impressum, Datenschutz, AGB, Widerrufsbelehrung) | Paul | ⬜ |

-----

### 🚀 LAUNCH

**Target: ~Week 15–17 (~July 2026)**

| # | Task | Owner | Status |
|---|---|---|---|
| 🚀1 | All L1–L6 dev tasks complete | Timo + Claude | ⬜ |
| 🚀2 | Tink production connection tested with at least 2 real brokers | Timo | ⬜ |
| 🚀3 | Stripe subscriptions tested end-to-end | Paul + Timo | ⬜ |
| 🚀4 | Landing page updated with final features + screenshots | Timo + Claude | ⬜ |
| 🚀5 | Demo updated with Premium features | Timo + Claude | ⬜ |
| 🚀6 | Legal pages published | Paul | ⬜ |
| 🚀7 | Product Hunt launch executed | Sasan | ⬜ |
| 🚀8 | r/Finanzen launch post published | Sasan + Timo | ⬜ |
| 🚀9 | Blog post live: "folio. is now open" | Sasan | ⬜ |
| 🚀10 | Email list announcement sent | Sasan | ⬜ |
| 🚀11 | Discord server live | Sasan | ⬜ |
| 🚀12 | Support email ready (support@foliologic.app) | Paul | ⬜ |

**Total dev sessions to launch: ~58–76 (Timo + Claude)**  
**At 3–4 sessions/week: ~15–19 weeks**  
**At 5–6 sessions/week: ~10–13 weeks**

-----

## 📈 Post-Launch Roadmap

### Month 1 after launch — Stabilise & Learn (Weeks 15–18)

| # | Task | Owner | Priority |
|---|---|---|---|
| P1.1 | Fix bugs reported by first users | Timo + Claude | 🔴 Critical |
| P1.2 | Email notification system (Resend, digest mode) | Timo + Claude | 🟡 High |
| P1.3 | Insider transactions tab | Timo + Claude | 🟡 High |
| P1.4 | Model portfolio comparison | Timo + Claude | 🟡 High |
| P1.5 | Dividend forecast + calendar (full version) | Timo + Claude | 🟡 High |
| P1.6 | Watchlist builder with price alerts | Timo + Claude | 🟢 Medium |
| P1.7 | Monitor user feedback, respond to support emails | Paul | 🔴 Critical |
| P1.8 | Track MRR, churn, conversion metrics | Paul | 🟡 High |
| P1.9 | Community management: Discord, respond to Reddit comments | Sasan | 🟡 High |
| P1.10 | Weekly social media updates with user milestones | Sasan | 🟡 High |

### Month 2–3 — Differentiate (Weeks 19–26)

| # | Task | Owner | Priority |
|---|---|---|---|
| P2.1 | AI portfolio analysis (5 runs/mo) | Timo + Claude | 🟡 High |
| P2.2 | Crypto survival score (quarterly batch) | Timo + Claude | 🟡 High |
| P2.3 | AI Radar 20 — first quarterly publication | Timo + Claude | 🟡 High |
| P2.4 | Crypto tools suite (altcoin season, BTC signals, cycle chart, sell strategy) | Timo + Claude | 🟢 Medium |
| P2.5 | Market heatmaps | Timo + Claude | 🟢 Medium |
| P2.6 | Theoretical portfolio builder | Timo + Claude | 🟢 Medium |
| P2.7 | **YouTuber outreach: Aktien mit Kopf (Q3, €2,500–3,500 budget)** | **Sasan** | 🔴 Critical |
| P2.8 | Google Ads: test campaigns (portfolio tracker, ETF analyse, etc.) | Sasan | 🟡 High |
| P2.9 | SEO: monthly blog posts targeting German investing keywords | Sasan | 🟡 High |
| P2.10 | Financial reporting: first quarterly P&L | Paul | 🟡 High |

### Month 4–6 — Premium+ & Growth (Weeks 27–38)

| # | Task | Owner | Priority |
|---|---|---|---|
| P3.1 | Tax tool: crypto FIFO/LIFO + Haltefrist tracking | Timo + Claude | 🔴 Critical (Q4 timing) |
| P3.2 | Tax tool: Anlage SO PDF helper | Timo + Claude | 🔴 Critical |
| P3.3 | Tax tool: FSA tracker per broker | Timo + Claude | 🟡 High |
| P3.4 | Stripe: Premium+ tier live (€13.99/mo) | Paul + Timo | 🔴 Critical |
| P3.5 | **YouTuber outreach: crypto channel (tax angle, €800–1,500 budget)** | **Sasan** | 🔴 Critical |
| P3.6 | Finanzguru: transaction categorisation | Timo + Claude | 🟡 High |
| P3.7 | Finanzguru: subscription detection | Timo + Claude | 🟡 High |
| P3.8 | Finanzguru: predictive balance / runway to payday | Timo + Claude | 🟡 High |
| P3.9 | Finanzguru: budget tracking | Timo + Claude | 🟢 Medium |
| P3.10 | Finanzguru: taxable income detection | Timo + Claude | 🟢 Medium |
| P3.11 | Full notification system (all triggers + email) | Timo + Claude | 🟡 High |
| P3.12 | Tax season PR campaign: blog posts, social, r/Finanzen | Sasan | 🔴 Critical |
| P3.13 | Annual financial review + tax prep for UG | Paul | 🟡 High |

### Month 7–9 — Scale & Polish (Weeks 39–50)

| # | Task | Owner | Priority |
|---|---|---|---|
| P4.1 | i18n: German as primary language | Timo + Claude | 🟡 High |
| P4.2 | Landing page: competitive comparison update | Timo + Claude + Sasan | 🟢 Medium |
| P4.3 | Finanzguru: net worth dashboard | Timo + Claude | 🟢 Medium |
| P4.4 | Finanzguru: savings goals | Timo + Claude | 🟢 Medium |
| P4.5 | Finanzguru: spending summary + free cashflow | Timo + Claude | 🟢 Medium |
| P4.6 | Community: Discord premium channels, AMAs | Sasan | 🟢 Medium |
| P4.7 | Evaluate GmbH conversion (if revenue justifies) | Paul | 🟢 Medium |
| P4.8 | Partnerships: fintech events, podcast appearances | Sasan | 🟢 Medium |

### Month 10–12 — Future (Weeks 51+)

| # | Task | Owner | Priority |
|---|---|---|---|
| P5.1 | Mobile app (React Native + Expo) | Timo + Claude | 🟡 High |
| P5.2 | Push notifications (third channel for 4j) | Timo + Claude | 🟡 High |
| P5.3 | Hardware dashboard API + firmware | Timo + Claude | 🟢 Fun project |
| P5.4 | Radar 20: second quarterly publication + track record page | Timo + Claude | 🟡 High |
| P5.5 | Evaluate wealthAPI need (~3,000 users threshold) | Timo + Paul | 🟢 When needed |
| P5.6 | Year-end review: product strategy for Year 2 | All | 🟡 High |

-----

## 📅 Session Log

> Every development session is logged here with what was accomplished.
> This is the ground truth for pace tracking and estimates.

| Session | Date | Tasks Completed | Version | Notes |
|---|---|---|---|---|
| — | Pre-2026-03-13 | Phases 1, 2, 2b, 2c, 3a, 3a+, 3b, 3c, 3d, 3e, 5b | v103 | See main spec session log for full history |
| — | 2026-03-13 | Spec reorganisation, new features specced (3g, 3h, 3i, 4h, 4i, 4j, 6b, 2g, 2h, 2i, 9, 9b, 10), workflow defined | — | Spec-only session, no code changes |
| — | 2026-03-13 | Ticker resolution: v105–v120 (ISIN pipeline, derivative detection, Supabase isin_ticker_map, manual resolve) | v120 | Debug session — ticker resolution now rock solid |
| — | 2026-03-13 | L1.1 Light theme: CSS variables, theme toggle, chart colors, auth screens | v121 | Phase 1 of light theme — ~80% complete |

-----

## 📏 Pace Tracking

| Metric | Value |
|---|---|
| Sessions to launch (estimated) | 58–76 |
| Sessions per week (target) | 3–4 |
| Weeks to launch (estimated) | 14–19 |
| Launch target | July 2026 |
| Marketing starts | Week 3 (as soon as landing page + demo are live) |
| Current version | v121 |
| Next version | v122 |

-----

## 🏷️ Status Legend

| Icon | Meaning |
|---|---|
| ⬜ | Not started |
| 🚧 | In progress (active this session) |
| ✅ | Complete |
| 🟡 | Blocked / waiting on dependency |
| ❌ | Cancelled / descoped |

-----
