# Deploy Brandon Zelma Land (online — no .bat for Brandon)

## How many GitHub websites can you have?

**As many as you want.** Each repo can have its own GitHub Pages site.

| Type | Example URL |
|------|-------------|
| User site (one) | `https://kr8zysho3.github.io` |
| Project sites (many) | `https://kr8zysho3.github.io/Brandon-Zelma-Land-Website/` |

Your other site does **not** block this one.

---

## Important: GitHub Pages vs full app

This project is **Next.js** with:

- Admin login
- Lead forms / API
- Free Land Scout AI

**GitHub Pages only hosts static files.** It cannot run those server features well.

### Recommended (free): **Vercel** + your GitHub repo

Vercel was made for Next.js. Free hobby plan. Brandon opens a normal link on his phone.

Source code still lives on **GitHub** — Vercel just builds and hosts it.

### Alternative: GitHub Pages only

Would require a big rewrite (static export, no real admin API). Not recommended for this app.

---

## Step-by-step (you do this in the browser — ~10 minutes)

### A. Put code on GitHub

Repo: https://github.com/KR8ZYSHO3/Brandon-Zelma-Land-Website

If empty / needs push from this PC:

1. Install / login GitHub CLI once:  
   `gh auth login`  
   (or use GitHub Desktop)

2. In PowerShell:

```powershell
cd D:\Projects\brandon-zelma-land
git init
git add .
git commit -m "Brandon Zelma Land website"
git branch -M main
git remote add origin https://github.com/KR8ZYSHO3/Brandon-Zelma-Land-Website.git
git push -u origin main
```

If remote already exists: `git remote set-url origin https://github.com/KR8ZYSHO3/Brandon-Zelma-Land-Website.git`

### B. Deploy free on Vercel

1. Go to https://vercel.com and **Sign up with GitHub**
2. **Add New Project** → import `Brandon-Zelma-Land-Website`
3. Framework: **Next.js** (auto-detected)
4. Environment variables (optional but good):

| Name | Value |
|------|--------|
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `zelma` |
| `ADMIN_SESSION_SECRET` | any long random string |

5. Click **Deploy**
6. Copy the URL (like `https://brandon-zelma-land-website.vercel.app`)
7. Text that link to Brandon — **no install, no zip**

Custom domain later (optional): `brandonzelma.com` in Vercel → Domains.

### C. Optional: GitHub Pages URL name only

You can still enable Pages on the repo for a README, but the **working app** should be the Vercel URL.

---

## What Brandon gets

- Open link on phone or computer  
- Full site + admin at `/admin`  
- No Node.js, no black windows  

---

## After deploy

### Keep leads permanently (required for real use)

Without this, Buy/Sell forms say “success” but **Admin → Leads stays empty** on Vercel (serverless memory is not shared).

**Free fix — Upstash Redis (~3 minutes):**

1. Sign up at https://console.upstash.com → **Create database** → Redis (free tier).
2. Open the database → **REST API** → copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Vercel → your project → **Settings → Environment Variables** → add both for Production (and Preview if you want).
4. **Deployments → … → Redeploy**.
5. Submit Sell or Mission Lab once → open **https://YOUR-SITE.vercel.app/admin/leads**.

Where customer forms go:

| Public page | Lead type | Admin location |
|-------------|-----------|----------------|
| `/sell` | seller | Admin → **Leads** |
| `/find` (Mission Lab) | buyer | Admin → **Leads** |
| `/contact` | buyer | Admin → **Leads** |
| Listing inquiry | buyer | Admin → **Leads** |

**Command** = overview / cheat sheet. **Leads** = the actual CRM table.

### Listings use the same Redis

Admin → **Listings** also saves to Upstash (key `bzl:listings`). You do **not** need a second database — the two env vars cover leads + inventory.
