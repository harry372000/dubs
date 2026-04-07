# DUBS — Vercel Deployment Guide

**Why Vercel?** DUBS is built on Next.js 15. Vercel is the native host for Next.js — zero-config deployments, edge-optimised serverless functions, and automatic preview URLs per branch.

---

## Pre-Deployment Checklist

### 1. Supabase Setup
- [ ] `jobs` table created (run `supabase/schema.sql` in the Supabase SQL editor)
- [ ] `dubbed-audio` storage bucket created and set to **Public**
- [ ] Row-level security is either disabled or properly configured for service role access
- [ ] Service role key noted (used server-side only — never exposed to the browser)

### 2. ElevenLabs Setup
- [ ] ElevenLabs account created at elevenlabs.io
- [ ] API key generated from the ElevenLabs dashboard
- [ ] Dubbing API access confirmed (may require a paid plan for production volumes)

### 3. Clerk Setup
- [ ] Clerk application created at clerk.com
- [ ] Publishable key and Secret key noted
- [ ] **Allowed redirect URLs** configured in Clerk dashboard:
  - `https://your-production-domain.vercel.app/dashboard`
  - `https://your-production-domain.vercel.app/`
  - Add preview URLs if using Vercel preview deployments
- [ ] Sign-in and Sign-up URLs set to `/sign-in` and `/sign-up` in Clerk settings

### 4. Repository
- [ ] All changes committed and pushed to GitHub
- [ ] No secrets or `.env` files committed to the repo

---

## Required Environment Variables

Set all of these in **Vercel → Project → Settings → Environment Variables**.  
Set scope to **Production**, **Preview**, and **Development** as needed.

| Variable | Where to find it | Scope |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | Public (browser) |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | Server only |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project → Settings → API → Project URL | Public (browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project → Settings → API → `anon public` key | Public (browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project → Settings → API → `service_role` key | Server only ⚠️ |
| `ELEVENLABS_API_KEY` | ElevenLabs Dashboard → Profile → API Keys | Server only ⚠️ |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` and `ELEVENLABS_API_KEY` are **server-only secrets**. They must NEVER be prefixed with `NEXT_PUBLIC_` and must NEVER be exposed to the browser.

---

## Deployment Steps

### Step 1 — Connect Repository to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository (`DUBS`)
3. Vercel auto-detects Next.js — no framework configuration needed

### Step 2 — Configure Build Settings
Vercel defaults work out of the box:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install`

### Step 3 — Add Environment Variables
In the Vercel deployment setup screen (or post-deploy in Settings → Environment Variables), add all 6 variables from the table above.

### Step 4 — Deploy
Click **Deploy**. Vercel will:
1. Install dependencies
2. Run `npm run build` (TypeScript compilation + static generation)
3. Deploy serverless functions for all API routes
4. Provide a live URL (`your-project.vercel.app`)

### Step 5 — Update Clerk Redirect URLs
After deployment, add your Vercel production URL to the Clerk dashboard:
- Allowed sign-in redirect: `https://your-project.vercel.app/dashboard`
- Allowed sign-up redirect: `https://your-project.vercel.app/dashboard`
- Allowed sign-out redirect: `https://your-project.vercel.app/`

### Step 6 — Smoke Test
Run through these after every deployment:
- [ ] Landing page loads at the production URL
- [ ] Sign-up creates a Clerk user and redirects to dashboard
- [ ] Sign-in works with existing credentials
- [ ] Submitting a YouTube URL creates a job (check Supabase dashboard)
- [ ] Watch page polls and eventually shows the player
- [ ] Audio plays in sync with the muted video
- [ ] Library shows completed jobs
- [ ] Clear All deletes jobs from DB

---

## Continuous Deployment

Once connected, Vercel auto-deploys on every push to `master`:
- Push to `master` → Production deployment
- Push to any other branch → Preview deployment (unique URL)

For the PR workflow:
- Open a PR from `dev` → `master`
- Vercel creates a preview deployment for the PR automatically
- Run test cases against the preview URL before merging

---

## Custom Domain (Optional)

1. Go to Vercel → Project → Settings → Domains
2. Add your domain (e.g., `dubsai.app`)
3. Update DNS records at your registrar per Vercel's instructions
4. Update Clerk redirect URLs to use the custom domain

---

## Common Deployment Issues

| Issue | Likely cause | Fix |
|---|---|---|
| Build fails with type errors | TypeScript errors in code | Run `npm run build` locally first; fix all errors |
| `CLERK_SECRET_KEY` not found | Env var missing in Vercel | Add to Vercel environment variables |
| 401 on all API calls | Clerk middleware not finding the secret key | Verify `CLERK_SECRET_KEY` is set server-side |
| Audio URL 403 | Supabase bucket not set to public | Set `dubbed-audio` bucket to public in Supabase |
| ElevenLabs 401 | Invalid or expired API key | Regenerate key at elevenlabs.io |
| Supabase insert fails | Service role key wrong or RLS blocking | Use service role key in `createServerSupabaseClient` |

---

*Last updated: 2026-04-07*
