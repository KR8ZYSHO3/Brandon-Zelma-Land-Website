# Brandon Zelma Land

Personal-brand growth platform for **Brandon Zelma**, Southeast Ohio Land Pro with **Buckeye Land Sales**.

Not a Land.com clone — mission-based discovery, field-report listing dossiers, Land IQ map, seller readiness funnel, admin decision cockpit (leads + market trends), and an extensive veteran business-development hub (VA/SBA + Ohio broker independence path).

## Location

```
D:\Projects\brandon-zelma-land
```

## Share with Brandon (recommended)

**Do not rely on zip + .bat.** Deploy online (free):

→ See **[DEPLOY.md](./DEPLOY.md)** — GitHub repo + **Vercel** free host.

GitHub: https://github.com/KR8ZYSHO3/Brandon-Zelma-Land-Website

You can have **many** GitHub project websites; this does not replace your other site.

## Quick start

### For Brandon (non-technical)

1. Double-click **`Start-Brandon-Zelma-Land.bat`**
2. First run installs dependencies (needs internet + [Node.js LTS](https://nodejs.org))
3. Browser opens to http://localhost:3000  
4. Keep the black window open while using the site

See **`FOR-BRANDON.txt`**.

### Make a zip to email / USB

Double-click **`Make-Zip-For-Brandon.bat`** — creates  
`Desktop\Brandon-Zelma-Land-Website.zip` (without `node_modules`).

### For developers

```bash
cd D:\Projects\brandon-zelma-land
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Username: `admin`
- Password: `zelma`
- Override in `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=long-random-string
```

## What’s included

| Area | Routes / files |
|------|----------------|
| Home + missions | `/` |
| Mission Lab | `/find` |
| Land IQ map | `/map` |
| Listings / dossiers | `/listings`, `/listings/[slug]` |
| Sell readiness | `/sell` |
| County SEO pages | `/counties/[slug]` |
| Veterans / independence | `/veterans` |
| About / process / contact | `/about`, `/how-we-work`, `/contact` |
| Field Notes | `/field-notes` |
| Admin cockpit | `/admin`, `/admin/leads`, `/admin/market`, `/admin/business-dev` |
| Lead API | `POST /api/leads` → `data/leads.json` |

## Compliance (Ohio)

Every public page shows **Brandon Zelma Land** and **Buckeye Land Sales** with equal prominence in the header, plus a legal footer line. This is a personal brand site for a salesperson under a brokerage — not a separate brokerage.

## Stack (lean)

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- File-based lead store (`data/leads.json`) — swap for Supabase when ready
- Cookie admin session (HMAC) — no paid auth required for v1

## Important truths baked in

1. **VA ≠ skip the broker.** VR&E/SBA help build a business; Ohio broker license is required to practice independently.
2. **Market intel ≠ appraisal.** Admin comps and USDA context are decision support only.
3. **$1M/year GCI** is a multi-year systems outcome (inventory + demand + later team), not a launch claim.

## Next upgrades (when revenue pays)

- Supabase for listings CRM + multi-device admin
- Resend email notify + nurture sequences
- MapLibre + richer geo layers
- Real Cal.com embed
- Live USDA NASS sync

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

## Gift handoff

Long-term, Brandon should own:

- Domain DNS
- Vercel (or host) account
- `.env.local` secrets
- This repo

---

Brandon Zelma, Real Estate Salesperson · **Buckeye Land Sales**
