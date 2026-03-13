# folio. — Launch Roadmap & Task Planning

> **Living document** — updated by Claude with every session, tracked in git alongside the spec.
> Last updated: 2026-03-13 | Status: Pre-launch development

-----

## 🎯 Launch Target

**Goal:** Public launch with Free + Starter + Premium tiers live and purchasable.  
**Target date:** ~July 2026 (14–16 weeks from now, gated by UG formation + Tink production approval)  
**Premium+ (tax tool):** Separate launch in Q4 2026, timed for tax season.

-----

## 📊 Launch Readiness Tracker

| Requirement | Status | Notes |
|---|---|---|
| UG/GmbH formation | 🟡 In progress | Notary → Handelsregister → bank account |
| Tink sandbox access | ⬜ Not started | Can apply without company |
| Tink production access | ⬜ Blocked | Requires registered company |
| Stripe integration | ⬜ Not started | Payment processing for subscriptions |
| Supabase auth + profiles | ⬜ Not started | User accounts, tier management |
| Domain + DNS | ✅ Done | foliologic.app |
| Vercel deployment | ✅ Done | Already deployed |
| FMP API | ✅ Active | On current plan, Premium upgrade pending |
| CoinGecko API | ✅ Active | Analyst plan |

-----

## 🏗️ Development Phases to Launch

### Phase L1 — Landing Page, Demo & Email List (Weeks 1–2)

> **Do this FIRST.** Every week without a landing page is a week of zero discovery.
> The demo showcases what's already built. The email list starts collecting interested
> users immediately. Free marketing (Reddit, Twitter, SEO) can begin as soon as this is live.
> Update the demo with each new feature as L2–L5 progress.

| # | Task | Spec Ref | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L1.1 | Light theme (default) + dark toggle in Settings | Design System | 2–3 | 🚧 | None |
| L1.2 | Landing page: hero, feature showcase, pricing table | Phase 9 | 2–3 | ⬜ | L1.1 (light theme is the default visitors see) |
| L1.3 | Security & trust section + competitive comparison | Phase 9 | 1 | ⬜ | L1.2 |
| L1.4 | Demo page with fake portfolio data (no login required) | Phase 9 | 2 | ⬜ | L1.1, L1.2 |
| L1.5 | Email signup: "Get notified when we launch" (Resend list) | Phase 9 | 0.5 | ⬜ | L1.2 |
| L1.6 | SEO fundamentals: meta tags, OG images, sitemap | Phase 9 | 1 | ⬜ | L1.2 |
| L1.7 | Version number visible in app | Workflow | 0.5 | ⬜ | None |

**Phase L1 total: ~9–11 sessions**

**Immediately after L1 goes live:**
- [ ] First r/Finanzen post: "I'm building a portfolio tracker with AI research — here's the demo"
- [ ] Twitter/X: start build-in-public posts with screenshots
- [ ] LinkedIn: first founder post about the project
- [ ] First SEO blog post: "Portfolio Tracker Vergleich 2026"

-----

### Phase L2 — Quick Wins & Feature Completion (Weeks 2–5)

> Make the existing product feel complete. Everything here is frontend work on existing data.
> Each completed feature gets added to the demo and announced to the email list.

| # | Task | Spec Ref | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L2.1 | Global search modal (Cmd+K) | Phase 2h | 1–2 | ⬜ | None |
| L2.2 | Invested capital line on portfolio chart | Pending UI | 0.5 | ⬜ | None |
| L2.3 | Activity tab (transactions, collapsed by year + broker) | Phase 3i | 1–2 | ⬜ | None |
| L2.4 | Earnings calendar (portfolio-scoped) | Phase 3h | 1–2 | ⬜ | FMP endpoint |
| L2.5 | Dividend dashboard (basic: history + annual total) | Phase 3g | 2 | ⬜ | FMP dividend data |
| L2.6 | Extended benchmarks (MSCI World, Euro Stoxx, Gold, Bonds) | Phase 2e Part A | 1–2 | ⬜ | FMP historical prices |
| L2.7 | Developer setting: toggle hardcoded parsers on/off | Phase 2c TODO | 0.5 | ⬜ | None |
| L2.8 | AI ETF analyzer (TER check, closure risk, overlap, diversification) | Phase 4d | 2–3 | ⬜ | Claude API, FMP ETF data |

**Phase L2 total: ~9–13 sessions**

**Marketing (ongoing, parallel):** Update demo with each new feature. Email list update: "New: dividend tracking, earnings calendar, and ETF analyzer now in the demo — try it." The ETF analyzer is particularly strong for r/Finanzen — post it there as soon as it's in the demo.

-----

### Phase L3 — Infrastructure & Auth (Weeks 5–7)

> User accounts, payments, tier gating.
> Nothing works as a business without this.

| # | Task | Spec Ref | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L3.1 | Supabase auth: email + Google sign-up/login | Tech Stack | — | ✅ | Already implemented |
| L3.2 | User profiles table + tier field (free/starter/premium) | Supabase Schema | 1 | ⬜ | L3.1 ✅ |
| L3.3 | Stripe integration: subscription checkout + webhook | Tech Stack | 2–3 | ⬜ | Stripe account |
| L3.4 | Tier gating: lock Starter+ features behind paywall | Pricing Tiers | 2 | ⬜ | L3.2 |
| L3.5 | AI import quota system (Free: 5/month counter) | Phase 2c | 1 | ⬜ | L3.2 |
| L3.6 | Settings page: account, subscription, preferences | General | 1–2 | ⬜ | L3.2, L3.3 |
| L3.7 | New user email notification to founder (Resend) | Phase 2i | 0.5–1 | ⬜ | Resend account |
| L3.8 | Onboarding flow: first-time user experience | General | 1–2 | ⬜ | L3.2 |

**Phase L3 total: ~8–11 sessions** (auth already done, saves ~2 sessions)

-----

### Phase L4 — Tink Integration (Weeks 7–10)

> Tink is mandatory for paid tiers but can slide in the schedule if the UG isn't ready.
> Sandbox development starts as early as possible; production testing is gated by UG.
> If UG is delayed, L5 (Premium features) can be pulled forward and Tink slotted in
> whenever the production account is approved.

| # | Task | Spec Ref | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L4.1 | Apply for Tink sandbox access | Phase 2d | 0.5 | ⬜ | None — do this NOW |
| L4.2 | `api/tink-link.js` — generate OAuth URL | Phase 2d | 1 | ⬜ | L4.1 |
| L4.3 | `api/tink-callback.js` — exchange code, store token | Phase 2d | 1 | ⬜ | L4.2 |
| L4.4 | `lib/psd2-parser.js` — transaction type detection + ISIN extraction | Phase 2d | 2–3 | ⬜ | L4.3 |
| L4.5 | `lib/holdings-builder.js` — reconstruct holdings from tx log | Phase 2d | 1–2 | ⬜ | L4.4 |
| L4.6 | `api/sync-accounts.js` — daily cron: fetch → parse → upsert | Phase 2d | 1–2 | ⬜ | L4.4, L4.5 |
| L4.7 | Connection status UI in Settings | Phase 2d | 1 | ⬜ | L4.3 |
| L4.8 | 90-day re-auth flow (banner + email reminder) | Phase 2d | 1 | ⬜ | L4.3, L3.1 |
| L4.9 | Cold wallet transfer detection on Tink data | Cold Wallet Spec | 1 | ⬜ | L4.4 |
| L4.10 | Test against real broker connections (production) | Phase 2d | 2–3 | 🟡 | UG formed, Tink production approved |

**Phase L4 total: ~11–15 sessions**  
**Blocker: L4.10 requires UG + Tink production approval**  
**Flexibility: If UG is delayed, swap L4 and L5 in the schedule. All L4 sandbox work (L4.1–L4.9) can proceed; only L4.10 is truly blocked.**

-----

### Phase L5 — Premium Features (Weeks 10–13)

> The features that justify Premium pricing.
> Portfolio chat is the headline; AI analysis features make it feel deep.
> Can be pulled forward if Tink is blocked.

| # | Task | Spec Ref | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L5.1 | AI moat rating (quarterly cached) | Phase 4a | 2 | ⬜ | Claude API |
| L5.2 | AI DCF / intrinsic value | Phase 4b | 2–3 | ⬜ | Claude API, FMP data |
| L5.3 | AI balance sheet grade (earnings-triggered) | Phase 4c | 1–2 | ⬜ | Claude API |
| L5.4 | Smart news architecture (cached summaries) | Phase 4f | 2 | ⬜ | FMP news, Claude API |
| L5.5 | Portfolio chat (streaming, quota-tracked) | Phase 4g | 3–4 | ⬜ | L3.2, L3.5, Claude API |
| L5.6 | AI quota system + visible quota bar in sidebar | Phase 4g / Pricing | 1 | ⬜ | L3.2 |
| L5.7 | Notification bell (in-app only for launch) | Phase 4j | 2 | ⬜ | L3.2 |
| L5.8 | Core notification triggers: earnings reported, Possible Deal, sync failures | Phase 4j | 1–2 | ⬜ | L5.7 |

**Phase L5 total: ~14–18 sessions**

-----

### Phase L6 — Launch Polish (Weeks 13–15)

> Final pass before opening paid tiers.

| # | Task | Spec Ref | Est. Sessions | Status | Dependencies |
|---|---|---|---|---|---|
| L6.1 | Legal pages: Impressum, Datenschutz, AGB | Legal | 1 | ⬜ | UG formed |
| L6.2 | Update landing page with all new features + screenshots | Phase 9 | 1 | ⬜ | L2–L5 done |
| L6.3 | Update demo with Premium features (cached/sample AI results) | Phase 9 | 1 | ⬜ | L5 done |
| L6.4 | Bug fixes, edge cases, polish pass | General | 3–5 | ⬜ | All above |
| L6.5 | Performance audit: lazy loading, bundle size | General | 1 | ⬜ | All above |
| L6.6 | Email list announcement: "We're launching next week" | Marketing | 0.5 | ⬜ | All above |

**Phase L6 total: ~7–9 sessions**

-----

### 🚀 LAUNCH

**Target: ~Week 15–17 (~July 2026)**

Launch checklist:
- [ ] All L1–L6 tasks complete
- [ ] Tink production connection tested with at least 2 real brokers
- [ ] Stripe subscriptions tested end-to-end (signup → charge → tier upgrade → cancel)
- [ ] Landing page updated with final features + screenshots
- [ ] Demo updated with Premium features (cached/sample AI results)
- [ ] Legal pages published (Impressum with UG details)
- [ ] Product Hunt launch prepared (assets, description, hunter)
- [ ] r/Finanzen launch post drafted (different from the early demo post)
- [ ] Blog post live ("folio. is now open — ...")
- [ ] Email list announcement sent ("We're live — here's your early access")
- [ ] Discord server created with basic channels
- [ ] Email from founder ready (firstname@foliologic.app)

**Total sessions to launch: ~58–76**  
**At 3–4 sessions/week: ~15–19 weeks**  
**At 5–6 sessions/week: ~10–13 weeks**

-----

## 📈 Post-Launch Roadmap

### Month 1 after launch — Stabilise & Learn (Weeks 15–18)

| # | Task | Spec Ref | Priority |
|---|---|---|---|
| P1.1 | Fix bugs reported by first users | General | 🔴 Critical |
| P1.2 | Email notification system (Resend, digest mode) | Phase 4j | 🟡 High |
| P1.3 | Insider transactions tab | Phase 3f | 🟡 High |
| P1.4 | Model portfolio comparison | Phase 2e Part B+C | 🟡 High |
| P1.5 | Dividend forecast + calendar (full version) | Phase 3g | 🟡 High |
| P1.6 | Watchlist builder with price alerts | Phase 5c | 🟢 Medium |

### Month 2–3 — Differentiate (Weeks 19–26)

| # | Task | Spec Ref | Priority |
|---|---|---|---|
| P2.1 | AI portfolio analysis (5 runs/mo) | Phase 4e | 🟡 High |
| P2.2 | Crypto survival score (quarterly batch) | Phase 4h | 🟡 High |
| P2.3 | AI Radar 20 — first quarterly publication | Phase 4i | 🟡 High |
| P2.4 | Crypto tools suite (altcoin season, BTC signals, cycle chart, sell strategy) | Phase 2g | 🟢 Medium |
| P2.5 | Market heatmaps | Phase 5a | 🟢 Medium |
| P2.6 | Theoretical portfolio builder | Phase 5d | 🟢 Medium |
| P2.7 | **YouTuber outreach: Aktien mit Kopf** | Marketing | 🔴 Critical |

### Month 4–6 — Premium+ & Growth (Weeks 27–38)

| # | Task | Spec Ref | Priority |
|---|---|---|---|
| P3.1 | Tax tool: crypto FIFO/LIFO + Haltefrist tracking | Phase 6b | 🔴 Critical (Q4 timing) |
| P3.2 | Tax tool: Anlage SO PDF helper | Phase 6b | 🔴 Critical |
| P3.3 | Tax tool: FSA tracker per broker | Phase 6b | 🟡 High |
| P3.4 | Stripe: Premium+ tier live | Pricing | 🔴 Critical |
| P3.5 | **YouTuber outreach: crypto channel (tax angle)** | Marketing | 🔴 Critical |
| P3.6 | Finanzguru: transaction categorisation | Phase 6 | 🟡 High |
| P3.7 | Finanzguru: subscription detection | Phase 6 | 🟡 High |
| P3.8 | Finanzguru: predictive balance / runway to payday | Phase 6 | 🟡 High |
| P3.9 | Finanzguru: budget tracking | Phase 6 | 🟢 Medium |
| P3.10 | Finanzguru: taxable income detection | Phase 6 | 🟢 Medium |
| P3.11 | Full notification system (all triggers + email) | Phase 4j | 🟡 High |

### Month 7–9 — Scale & Polish (Weeks 39–50)

| # | Task | Spec Ref | Priority |
|---|---|---|---|
| P4.1 | i18n: German as primary language | Phase 8 | 🟡 High |
| P4.2 | Landing page: competitive comparison update | Phase 9 | 🟢 Medium |
| P4.3 | Finanzguru: net worth dashboard | Phase 6 | 🟢 Medium |
| P4.4 | Finanzguru: savings goals | Phase 6 | 🟢 Medium |
| P4.5 | Finanzguru: spending summary + free cashflow | Phase 6 | 🟢 Medium |
| P4.6 | Community: Discord server active, premium channels | Phase 9b | 🟢 Medium |

### Month 10–12 — Future (Weeks 51+)

| # | Task | Spec Ref | Priority |
|---|---|---|---|
| P5.1 | Mobile app (React Native + Expo) | Phase 7 | 🟡 High |
| P5.2 | Push notifications (third channel for 4j) | Phase 7 + 4j | 🟡 High |
| P5.3 | Hardware dashboard API + firmware | Phase 10 | 🟢 Fun project |
| P5.4 | Radar 20: second quarterly publication + track record page | Phase 4i | 🟡 High |
| P5.5 | Evaluate wealthAPI need (~3,000 users threshold) | Phase 2d note | 🟢 When needed |

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
