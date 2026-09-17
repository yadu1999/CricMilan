# CricMilan.com - Cricket & News Portal (Next.js Edition)

Welcome to the official repository of **CricMilan.com**! 
This is a high-speed, lightweight, and professional sports news web application built natively with **Next.js (App Router), React, TypeScript**, and a resilient **SQLite / LibSQL database layer**.

## 🚀 Tagline
> **"CRICKET & NEWS ALWAYS ON."**

---

## 📋 Table of Contents
1. [Core Features](#-core-features)
2. [Quick Start & Setup](#-quick-start--setup)
3. [Admin Panel Access](#-admin-panel-access)
4. [Google AdSense Integration Guide](#-google-adsense-integration-guide)
5. [SEO & Open Graph (OG) sharing](#-seo--open-graph-og-sharing)
6. [Canvas Image Optimizer](#-canvas-image-optimizer)
7. [Database Portability & Backup](#-database-portability--backup)
8. [Vercel Deployment Guide](#-vercel-deployment-guide-100-configured--ready)

---

## 🌟 Core Features

- **Next.js App Router Native:** Ultra-fast Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and React Server Components (RSC).
- **Dynamic Clean URLs:** Generates SEO-friendly URLs directly under the domain root (e.g., `cricmilan.com/virat-kohli-historic-51st-odi-century-bengaluru`).
- **Full Admin CRUD Dashboard:** Add, Edit, Delete, Publish/Draft, and toggle Breaking News with instant feedback.
- **Canvas-based Client Compression:** Automatically compresses and resizes images in the browser before upload, protecting storage and bandwidth.
- **Interactive Article Reactions:** Live feedback counters (🔥 Thrilling, 🏏 Masterclass, 👏 Historic, ❤️ Loved It) stored in database.
- **Dynamic Sitemap & Robots:** XML sitemap generated dynamically at `/sitemap.xml` by querying database slugs. `robots.txt` fully configured.
- **Zero-Config Vercel Ready:** Seamless deployment directly to Vercel without custom server workarounds.

---

## 🛠️ Quick Start & Setup

Ensure you have **Node.js** (v18 or higher) installed, then:

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
3. **Visit local site:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Admin Panel Access

- **Admin URL:** `http://localhost:3000/admin/login`
- **Default Username:** `admin`
- **Default Password:** `cricmilanadmin`

> 💡 *Security Tip: Once logged in, use the "Change Admin Password" block at the bottom of the dashboard to change your password.*

---

## 💵 Google AdSense Integration Guide

We have optimized the layout of CricMilan.com to be completely **AdSense-friendly**. To start displaying real advertisements:

### Step 1: Add the Google AdSense Script
1. Open the header layout file: `views/partials/header.ejs`.
2. Locate the `<head>` section.
3. Paste the general Google AdSense Auto-Ads code block before the closing `</head>` tag:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```

### Step 2: Paste Ad Unit Codes in Pre-defined Slots
To control exactly where your banner ads appear, paste your specific Google Ad unit code inside these three dedicated partial files:

1. **Header Banner Ad (728x90 Billboard):**
   - File: `views/partials/ads/ad-header.ejs`
   - Paste your top banner code inside this file. It will render below the site navigation menu on the homepage, category pages, and article pages.
2. **Sidebar Ad (300x250 Rectangle):**
   - File: `views/partials/ads/ad-sidebar.ejs`
   - Paste your rectangle ad code here. It will display in the right sidebar beside the main articles.
3. **In-Content Ad (Horizontal Banner):**
   - File: `views/partials/ads/ad-content.ejs`
   - Paste your inside-article ad code here. It automatically appears beneath the body text on all article detail pages and inside news grid columns.

---

## 🔍 SEO & Open Graph (OG) Sharing

Every article page generates a standardized **JSON-LD Schema block** dynamically, ensuring Google Search Console reads it as a valid `NewsArticle`.

When you share an article on **WhatsApp, Facebook, or X (Twitter)**, it reads these dynamic meta tags generated on the server:
- `og:title` / `twitter:title` - Injects your article title or customized SEO title.
- `og:description` - Injects the short Meta Description.
- `og:image` - Injects the path to the compressed featured image.

---

## 🖼️ Canvas Image Optimizer

To save server disk space and make pages load instantly on mobile, the Admin Editor features browser-side canvas optimization:
- If you upload a heavy 5MB image, the editor draws it on an HTML5 canvas.
- It resizes the width to a maximum of **1200px** (maintaining the aspect ratio).
- It exports it as a compressed JPEG/WebP at **0.85 quality**.
- The server saves the compressed image in `public/uploads/` (resulting in sizes under 200KB).

---

## 🗄️ Database Portability & Backup

The system runs on **SQLite** (a local, file-based database).
- All articles, admin details, and settings are stored in **`database.db`** at the root of the project.
- **Backup:** Copy the `database.db` file to a secure cloud drive or local USB.
- **Restoring:** Simply paste the `database.db` file back into the project root folder.

---

## 🚀 Vercel Deployment Guide (100% Configured & Ready)

This repository is pre-configured to run on **Vercel Serverless Functions** with full support for Express, EJS template rendering, static asset routing, and SQLite storage in `/tmp`.

### Under the Hood Optimizations:
- **`api/index.js`**: Dedicated serverless entry point bridging Vercel and Express.
- **`vercel.json`**: Rewrites all routes to `/api/index.js` while bundling `views/**`, `public/**`, and `database.db`.
- **Cold-Start Resilience**: Built-in async database gating ensures zero crashes during serverless wakeups.
- **Dynamic `/tmp` Storage**: SQLite copies the initial seed `database.db` to `/tmp` for writable operations in Vercel.

---

### Option A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   If you haven't created a GitHub repository yet, go to [github.com/new](https://github.com/new) and create a new repository (e.g. `cricmilan`).
   Then run these commands in your project terminal:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Log into [vercel.com](https://vercel.com).
   - Click **"Add New..."** &rarr; **"Project"**.
   - Select your GitHub repository (`cricmilan`) and click **"Import"**.

3. **Deploy with Zero Extra Configuration:**
   - **Framework Preset**: Leave as *Other* (detected automatically).
   - **Root Directory**: `./` (default).
   - **Build Command**: Leave empty.
   - **Output Directory**: Leave empty.
   - *(Optional)* Add Environment Variable:
     - `SESSION_SECRET`: `any-secure-random-string`
   - Click **"Deploy"**.

4. **Your Site is Live!**
   - Vercel will provide a live URL such as `https://cricmilan.vercel.app`.

---

### Option B: Deploy via Vercel CLI (Instant from Terminal)

1. **Install Vercel CLI globally (if not installed):**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   Run the deploy command in your project root:
   ```bash
   vercel
   ```
   Answer the simple prompts:
   - `Set up and deploy?`: **Y**
   - `Which scope?`: *Select your account*
   - `Link to existing project?`: **N**
   - `Project name?`: **cricmilan** (or press Enter)
   - `In which directory is your code located?`: **./**
   - `Want to modify these settings?`: **N**

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

---

### 🧪 Verifying Your Vercel Deployment

Once deployed, test these endpoints:
1. **Homepage:** `https://<your-project>.vercel.app/` &rarr; Full bento grid news layout with articles.
2. **Health Diagnostics API:** `https://<your-project>.vercel.app/api/health` &rarr; Returns JSON with system uptime and database status (`totalArticles: 7`).
3. **Article Detail:** `https://<your-project>.vercel.app/virat-kohli-historic-51st-odi-century-bengaluru` &rarr; Full article with reaction buttons, related news, and comments.
4. **Admin Dashboard:** `https://<your-project>.vercel.app/admin/login` &rarr;
   - Username: `admin`
   - Password: `cricmilanadmin`

