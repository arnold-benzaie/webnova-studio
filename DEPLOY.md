# 🚀 Deployment Guide — WebNova Studio

## What's in this upgrade

Three additive files (zero changes to your existing logic):

| File | Purpose |
|---|---|
| `styles/premium.css` | Premium UI polish overlay — buttons, glass, typography, micro-interactions |
| `styles/colors.css`  | International SaaS color harmony — violet · cyan · pink accents |
| `vercel.json`        | Vercel deployment config (security headers, caching, redirects) |

And one edited file: **`index.html`** — added 2 `<link>` lines to load the new stylesheets.

---

## ⚠️ Note about pushing to your repo

I can read your GitHub repo but **cannot push commits to it directly** — that requires your credentials. The fastest path is to apply this commit yourself (instructions below). If you want hands-off automation, the recommended setup is:

1. Connect your GitHub repo to **Vercel** once
2. Going forward, ANY push to `main` auto-deploys to production
3. You only need to push once — Vercel handles the rest

---

## 📤 Step 1 — Push the changes to GitHub

### Option A — Copy files locally then push (fastest)

```bash
# From your local clone of webnova-studio:
cd ~/path/to/webnova-studio

# 1. Copy the 3 new/edited files from this project into your repo
#    (download them from the file panel on the left, or use the commands below)

# 2. Stage + commit + push
git add styles/premium.css styles/colors.css vercel.json index.html
git commit -m "feat: premium UI overlay + international color system + Vercel config"
git push origin main
```

### Option B — Edit directly on github.com (no local clone needed)

1. Go to https://github.com/arnold-benzaie/webnova-studio
2. Click **Add file → Create new file** for each of:
   - `styles/premium.css` (paste contents)
   - `styles/colors.css` (paste contents)
   - `vercel.json` (paste contents)
3. Open `index.html`, click the pencil icon, and add these 2 lines right after the existing `<link rel="stylesheet" href="styles/main.css" />`:
   ```html
   <link rel="stylesheet" href="styles/premium.css" />
   <link rel="stylesheet" href="styles/colors.css" />
   ```
4. Commit each change to `main`

---

## 🚀 Step 2 — Deploy on Vercel (one-time setup, ~2 minutes)

### A. Connect the repo

1. Go to **https://vercel.com/new**
2. Sign in with GitHub (free for personal projects)
3. Click **Import** next to `arnold-benzaie/webnova-studio`
4. **Framework Preset**: select **Other** (it's a static site)
5. **Root Directory**: leave as `./`
6. **Build Command**: leave empty
7. **Output Directory**: leave as `./` (or empty)
8. Click **Deploy**

Done. ~30 seconds later your site is live at `webnova-studio.vercel.app`.

### B. Connect your custom domain `webnova.mu`

1. In Vercel project → **Settings → Domains**
2. Add `webnova.mu` and `www.webnova.mu`
3. Vercel shows the DNS records to set. Go to your registrar (NIC.mu) and add:
   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```
4. Wait ~10 min for DNS propagation
5. Vercel auto-issues an SSL certificate

### C. ⚠️ Disable GitHub Pages (avoid conflicts)

Since you currently deploy via GitHub Pages:
1. Go to `github.com/arnold-benzaie/webnova-studio/settings/pages`
2. **Source** → set to **None**
3. Remove the `CNAME` file from the repo (Vercel handles the domain now)

---

## 🔄 Auto-deploy on every push

Once Vercel is connected, you don't need to do anything special:

- Push to **`main`** → auto-deploys to production (`webnova.mu`)
- Push to any other branch → creates a preview URL (great for testing changes)
- Every Pull Request → gets its own preview URL with a comment

---

## ⚙️ What `vercel.json` does for you

- **Security headers** — HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **Aggressive caching** for CSS/JS/assets (1 year immutable)
- **No caching** for HTML (so updates show instantly)
- **Clean URLs** — `/about` instead of `/about.html`
- **Redirects** — `/contact` → `/#contact`, `/pricing` → `/#pricing`

---

## 📊 Don't forget — before going live

Replace the placeholder analytics IDs in `index.html`:
- `G-XXXXXXXXXX` → your Google Analytics 4 Measurement ID
- `0000000000000000` → your Meta Pixel ID
- `XXXXXXXXXXXXXXXXXX` → your TikTok Pixel ID
- `XXXXXXXXXX` (Clarity) → your Microsoft Clarity ID
- `YOUR_FORM_ID` → your Formspree form ID

Until then you'll see harmless console errors from those failed scripts — they don't affect users, just your dev console.

---

## 📥 Quick download

All 3 new files are in this project's file panel — click any file → **Download** to grab it.

Or download the whole upgraded project as a ZIP and unzip it on top of your local clone.
