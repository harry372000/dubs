# DUBS — End-to-End Test Cases

Covers: Frontend UI, API routes, Database, Auth middleware, Watch player, Job polling, and edge cases.  
Run these manually (or automate with Playwright/Jest) before every production deployment.

---

## 0. Pre-flight Checklist

Before running any tests, verify:
- [ ] All environment variables are set (see `deployment.md`)
- [ ] Supabase `jobs` table exists and `dubbed-audio` storage bucket is public
- [ ] ElevenLabs API key is valid and has dubbing quota
- [ ] Clerk application is configured with correct redirect URLs
- [ ] `npm run build` completes with no type errors

---

## 1. Landing Page (Public)

### TC-01 — Landing page loads for unauthenticated users
- **Steps:** Navigate to `/`
- **Expected:** Page renders with hero, language marquee, how-it-works, features, and CTA sections. No redirect occurs.

### TC-02 — Animated background orbs render
- **Steps:** Navigate to `/`, observe the fixed background layer
- **Expected:** Three floating radial gradient orbs animate continuously. Dot-grid overlay visible.

### TC-03 — Language marquee scrolls
- **Steps:** Navigate to `/`, observe the marquee strip between hero and stats
- **Expected:** 13 language names scroll infinitely left without pause or jump.

### TC-04 — "Get Started Free" CTA redirects to sign-up
- **Steps:** Click "Get Started Free" or "Start Dubbing Free"
- **Expected:** Redirects to `/sign-up`

### TC-05 — "Sign In" link redirects to sign-in
- **Steps:** Click "Sign In" in the navbar
- **Expected:** Redirects to `/sign-in`

### TC-06 — Scroll reveal animations trigger
- **Steps:** Scroll down through each section (Stats, How It Works, Features, CTA)
- **Expected:** Each section fades and slides up into view as it enters the viewport.

---

## 2. Authentication (Clerk)

### TC-07 — Sign-up flow completes successfully
- **Steps:** Navigate to `/sign-up`, enter a new email and password, complete verification
- **Expected:** User is created in Clerk, redirected to `/dashboard`

### TC-08 — Sign-in flow completes successfully
- **Steps:** Navigate to `/sign-in`, enter valid credentials
- **Expected:** Session created, redirected to `/dashboard`

### TC-09 — Invalid credentials show an error
- **Steps:** Navigate to `/sign-in`, enter wrong password
- **Expected:** Clerk displays an inline error; no redirect occurs

### TC-10 — Unauthenticated access to dashboard is blocked
- **Steps:** Without logging in, navigate to `/dashboard`
- **Expected:** Redirected to `/sign-in` (handled by Clerk middleware)

### TC-11 — Unauthenticated access to library is blocked
- **Steps:** Without logging in, navigate to `/library`
- **Expected:** Redirected to `/sign-in`

### TC-12 — Unauthenticated access to watch page is blocked
- **Steps:** Without logging in, navigate to `/watch/any-id`
- **Expected:** Redirected to `/sign-in`

### TC-13 — Unauthenticated API calls return 401
- **Steps:** Send `GET /api/jobs` without an active session (e.g., via curl with no cookies)
- **Expected:** `{ "error": "Unauthorized" }` with HTTP 401

### TC-14 — Sign-out clears session and redirects
- **Steps:** Log in, then click the sign-out control in the navbar
- **Expected:** Session cleared, redirected to `/` or `/sign-in`

---

## 3. Dashboard Page

### TC-15 — Dashboard renders for authenticated user
- **Steps:** Log in, navigate to `/dashboard`
- **Expected:** Navbar, DashboardHero, TranslateForm, StatsCards, and JobStatusPoller all render.

### TC-16 — Stats cards show correct counts
- **Steps:** Log in with an account that has known job history (e.g., 3 done, 1 active)
- **Expected:** StatsCards shows correct Total, Done, and Active counts.

### TC-17 — Empty state shows when no jobs exist
- **Steps:** Log in with a fresh account (no jobs)
- **Expected:** JobStatusPoller renders the "No translations yet" empty state with icon and hint text.

### TC-18 — Intelligence Engine banner renders
- **Steps:** Log in, scroll to the bottom of the dashboard
- **Expected:** Gradient banner with "Powered by AI", stat chips (13+, AI, Free) renders correctly.

### TC-19 — Dashboard loads within 3 seconds
- **Steps:** Log in, measure time until interactive
- **Expected:** Page is fully rendered in under 3 seconds on a standard connection.

---

## 4. TranslateForm — URL Validation

### TC-20 — Valid YouTube URL shows "✓ Valid"
- **Steps:** Type `https://www.youtube.com/watch?v=dQw4w9WgXcQ` into the URL field
- **Expected:** Green "✓ Valid" indicator appears in the input field.

### TC-21 — Valid short YouTube URL (`youtu.be`) is accepted
- **Steps:** Type `https://youtu.be/dQw4w9WgXcQ`
- **Expected:** "✓ Valid" indicator appears.

### TC-22 — Invalid URL shows "Invalid URL"
- **Steps:** Type `https://vimeo.com/123456` or plain text
- **Expected:** Red "Invalid URL" indicator appears. Submit button stays disabled.

### TC-23 — Submit button is disabled with no URL
- **Steps:** Load the form with empty URL field
- **Expected:** Submit button is visually disabled (`opacity-50`, `cursor-not-allowed`).

### TC-24 — Unsupported language shows warning
- **Steps:** Select "Marathi (Coming Soon)" from the language picker
- **Expected:** Amber warning box appears. Submit button is disabled.

### TC-25 — Thumbnail preview appears for valid URL
- **Steps:** Enter a valid YouTube URL
- **Expected:** YouTube thumbnail image renders below the language picker with a play overlay.

### TC-26 — Loading state shows during job submission
- **Steps:** Submit a valid URL + supported language
- **Expected:** Button shows spinner and "Starting Dubbing Job..." text. Form is non-interactive.

### TC-27 — Successful submission redirects to `/watch/[id]`
- **Steps:** Submit a valid YouTube URL with a supported language
- **Expected:** After API responds with 201, browser navigates to `/watch/{job_id}`.

### TC-28 — API error surfaces in the form
- **Steps:** Mock or trigger an API error (e.g., invalid ElevenLabs key)
- **Expected:** Red error box shows the error message. Form resets to interactive state.

---

## 5. Language Picker

### TC-29 — All 13 supported languages appear in picker
- **Steps:** Open the language picker dropdown
- **Expected:** All 13 supported languages are selectable.

### TC-30 — "Coming Soon" languages are shown but disabled
- **Steps:** Open the language picker
- **Expected:** Marathi, Bengali, Urdu appear with a "Coming Soon" label and cannot be selected as active targets.

### TC-31 — Default language is Hindi
- **Steps:** Load the dashboard without changing the language
- **Expected:** Language picker defaults to "Hindi" (`hi`).

---

## 6. API Routes

### TC-32 — `POST /api/jobs` creates a job and returns 201
- **Steps:** Authenticated POST with `{ youtubeUrl, targetLanguage }`
- **Expected:** Returns the created job object with `status: "dubbing"` and an `elevenlabs_dubbing_id`. HTTP 201.

### TC-33 — `POST /api/jobs` rejects missing fields with 400
- **Steps:** POST with empty body or missing `targetLanguage`
- **Expected:** `{ "error": "youtubeUrl and targetLanguage are required" }`, HTTP 400.

### TC-34 — `POST /api/jobs` rejects invalid YouTube URL with 400
- **Steps:** POST with `{ youtubeUrl: "https://vimeo.com/123", targetLanguage: "hi" }`
- **Expected:** `{ "error": "Invalid YouTube URL" }`, HTTP 400.

### TC-35 — `POST /api/jobs` sets video title via oEmbed
- **Steps:** POST with a public YouTube video URL
- **Expected:** Returned job has `video_title` set to the real video title (not "Untitled Video").

### TC-36 — `POST /api/jobs` saves `elevenlabs_dubbing_id` before status update
- **Steps:** Submit a job; query the Supabase `jobs` table immediately
- **Expected:** `elevenlabs_dubbing_id` is non-null even if `status` hasn't updated yet.

### TC-37 — `GET /api/jobs` returns all jobs for the current user only
- **Steps:** Log in as User A, create 2 jobs. Log in as User B, call `GET /api/jobs`
- **Expected:** User B sees 0 jobs. User A's jobs are not exposed.

### TC-38 — `GET /api/jobs/[id]` returns job for correct user
- **Steps:** Create a job as User A, then call `GET /api/jobs/{id}` as User B
- **Expected:** HTTP 404 (`{ "error": "Job not found" }`)

### TC-39 — `GET /api/jobs/[id]` polls ElevenLabs and updates status to "done"
- **Steps:** Wait for a real dubbing job to complete; call `GET /api/jobs/{id}` once it's done on ElevenLabs
- **Expected:** Response contains `status: "done"` and a non-null `audio_url` pointing to Supabase Storage.

### TC-40 — `GET /api/jobs/[id]` returns immediately for terminal states
- **Steps:** Call `GET /api/jobs/{id}` for a job already marked `done` or `failed`
- **Expected:** Returns immediately without calling ElevenLabs API (no unnecessary outbound requests).

### TC-41 — `DELETE /api/jobs` deletes all jobs for the current user
- **Steps:** Create 3 jobs, then call `DELETE /api/jobs`
- **Expected:** `{ "success": true }` and all 3 jobs are removed from the database.

### TC-42 — `DELETE /api/jobs` does not delete other users' jobs
- **Steps:** Create jobs as User A and User B. Delete as User A.
- **Expected:** User B's jobs remain intact.

---

## 7. Watch Page

### TC-43 — Watch page shows loading state for pending/dubbing jobs
- **Steps:** Navigate to `/watch/{id}` for a job with `status: "dubbing"`
- **Expected:** Thumbnail with "AI IS WORKING" overlay renders. PageLoader spinner and language label visible. "Auto-refreshing every 6 seconds…" text shown.

### TC-44 — Watch page polls every 6 seconds while job is active
- **Steps:** Open network tab; navigate to `/watch/{id}` for an active job
- **Expected:** `GET /api/jobs/{id}` fires every 6 seconds.

### TC-45 — Watch page transitions to player when job completes
- **Steps:** Keep `/watch/{id}` open while the dubbing job finishes
- **Expected:** Without page reload, the loading state transitions to the video player.

### TC-46 — Video player renders with YouTube iframe (muted)
- **Steps:** Navigate to `/watch/{id}` for a `done` job
- **Expected:** YouTube iframe loads. No original audio plays. Custom control bar visible.

### TC-47 — Play/pause works via custom control bar
- **Steps:** Click the play button in the control bar
- **Expected:** Video plays (muted visuals). Dubbed audio starts. Pause button appears.

### TC-48 — Dubbed audio syncs with video on play
- **Steps:** Click play; observe audio vs. video alignment
- **Expected:** Dubbed audio starts within 0.5 seconds of video position.

### TC-49 — Seek bar scrubs both video and audio
- **Steps:** Drag the seek bar to a different position
- **Expected:** Video seeks to that position; audio `currentTime` updates to match within 0.5s.

### TC-50 — Time display updates during playback
- **Steps:** Click play; observe the `M:SS / M:SS` timestamp in the control bar
- **Expected:** Elapsed time increments every ~500ms.

### TC-51 — Fullscreen button triggers native fullscreen
- **Steps:** Click the fullscreen icon in the control bar
- **Expected:** The player wrapper enters native fullscreen mode.

### TC-52 — Language label badge shows correct language
- **Steps:** Open a job dubbed into Japanese
- **Expected:** Control bar shows "Japanese audio" badge. Header shows "Japanese dub".

### TC-53 — Failed job shows error state
- **Steps:** Navigate to `/watch/{id}` for a job with `status: "failed"`
- **Expected:** Error card with ⚠️ icon, error message, and "Back to Dashboard" link renders.

### TC-54 — Back to Dashboard link works
- **Steps:** Click "← Back to Dashboard" on the watch page
- **Expected:** Navigates to `/dashboard`.

---

## 8. Library Page

### TC-55 — Library shows only completed jobs
- **Steps:** Log in with an account that has both `done` and `failed` jobs; navigate to `/library`
- **Expected:** Only jobs with `status: "done"` appear.

### TC-56 — Library is empty state when no completed jobs
- **Steps:** Log in with a fresh account; navigate to `/library`
- **Expected:** Empty state UI renders (no crash, no error).

### TC-57 — Clicking a library job navigates to watch page
- **Steps:** Click on a completed job in the library
- **Expected:** Navigates to `/watch/{job_id}`.

---

## 9. JobStatusPoller (Dashboard)

### TC-58 — Active jobs poll every 8 seconds on dashboard
- **Steps:** Open network tab on dashboard with an active job
- **Expected:** `GET /api/jobs/{id}` fires every 8 seconds for each active job.

### TC-59 — Polling stops when all jobs reach terminal state
- **Steps:** Watch the network tab as a job transitions to `done`
- **Expected:** Polling for that job ceases after status becomes `done` or `failed`.

### TC-60 — "Clear All" confirmation dialog appears before deletion
- **Steps:** Click the "Clear All" button in the JobStatusPoller
- **Expected:** Animated confirmation dialog overlays the screen.

### TC-61 — Cancelling "Clear All" dialog keeps jobs intact
- **Steps:** Click "Clear All", then click "Cancel"
- **Expected:** Dialog closes; all jobs remain in the list.

### TC-62 — Confirming "Clear All" removes all jobs from UI and DB
- **Steps:** Click "Clear All", confirm with "Remove all"
- **Expected:** Jobs list empties in the UI; `DELETE /api/jobs` was called; DB rows are deleted.

### TC-63 — New jobs appear at the top with stagger animation
- **Steps:** Submit a new dubbing job from the dashboard
- **Expected:** New job card slides in at the top of the recent translations list.

---

## 10. Database

### TC-64 — `jobs` table has correct schema
- **Steps:** In Supabase SQL editor, run `\d jobs` or check the table columns
- **Expected:** Columns: `id (uuid PK)`, `user_id (text)`, `youtube_url`, `video_id`, `video_title`, `source_language`, `target_language`, `status`, `elevenlabs_dubbing_id`, `error_message`, `audio_url`, `created_at`, `updated_at`

### TC-65 — `updated_at` auto-updates on row change
- **Steps:** Update a job's status; check `updated_at`
- **Expected:** `updated_at` timestamp changes to the current time automatically (trigger fires).

### TC-66 — `jobs_user_id_idx` index exists
- **Steps:** Run `SELECT * FROM pg_indexes WHERE tablename = 'jobs'`
- **Expected:** `jobs_user_id_idx` index is present on the `user_id` column.

### TC-67 — `dubbed-audio` storage bucket is public
- **Steps:** In Supabase Storage settings, check bucket visibility
- **Expected:** `dubbed-audio` bucket has public access. Audio URLs are accessible without auth.

### TC-68 — Audio file is stored at correct path
- **Steps:** Complete a dubbing job; inspect the `audio_url` returned
- **Expected:** URL follows the pattern `{supabase_url}/storage/v1/object/public/dubbed-audio/{userId}/{jobId}/dubbed_{lang}.mp3`

### TC-69 — User can only access their own jobs (row-level security)
- **Steps:** Attempt to query another user's job directly via Supabase client
- **Expected:** Row not returned (RLS enforced; note: currently enforced at API level via `user_id` filter)

---

## 11. Middleware & Route Protection

### TC-70 — Protected routes are correctly enumerated
- **Steps:** Review `middleware.ts`; attempt to access each protected path unauthenticated
- **Expected:** `/dashboard`, `/library`, `/watch/*`, `/api/jobs/*` all redirect or 401 unauthenticated requests.

### TC-71 — Static assets bypass middleware
- **Steps:** Request a static asset (`/_next/static/...`, `.png`, `.svg`)
- **Expected:** Asset loads without auth check (matcher excludes static file patterns).

### TC-72 — Middleware matcher excludes font/image files
- **Steps:** Check `middleware.ts` matcher regex; request `/Logo.png`
- **Expected:** No auth redirect; file loads directly.

---

## 12. Theme & UI

### TC-73 — Light/dark theme toggles correctly
- **Steps:** Click the theme toggle in the navbar
- **Expected:** Theme switches; CSS variables update; no flash of unstyled content on next reload.

### TC-74 — Theme persists across page reloads
- **Steps:** Set dark mode, reload the page
- **Expected:** Dark mode remains active (stored in localStorage/cookie by next-themes).

### TC-75 — Navbar renders correctly on all pages
- **Steps:** Visit `/dashboard`, `/library`, `/watch/*`
- **Expected:** Navbar with DUBS logo and navigation links renders consistently.

### TC-76 — NavigationProgress bar shows on route change
- **Steps:** Navigate between pages
- **Expected:** A thin progress bar appears at the top during navigation.

### TC-77 — Loading skeletons render for slow pages
- **Steps:** Check `app/dashboard/loading.tsx`, `app/library/loading.tsx`, etc.
- **Expected:** Loading fallback UI renders while server components fetch data (Suspense boundary).

---

## 13. ElevenLabs Integration

### TC-78 — Invalid API key returns 502 to the client
- **Steps:** Set an invalid `ELEVENLABS_API_KEY`; submit a dubbing job
- **Expected:** API returns HTTP 502; job is marked `failed` in the database with the error message.

### TC-79 — `num_speakers: "0"` is sent (auto-detect)
- **Steps:** Inspect the FormData sent to ElevenLabs in `lib/elevenlabs.ts`
- **Expected:** `num_speakers` is `"0"`, enabling automatic speaker count detection.

### TC-80 — `watermark: "true"` is included in trial tier calls
- **Steps:** Inspect `createDubbingJob` in `lib/elevenlabs.ts`
- **Expected:** `watermark: "true"` is present in the FormData (required for free ElevenLabs tier).

---

## 14. Edge Cases & Error Handling

### TC-81 — Private YouTube video returns a graceful error
- **Steps:** Submit a private or deleted YouTube URL
- **Expected:** Either oEmbed fails silently (title = "Untitled Video") or ElevenLabs returns an error that is propagated as a 502 with the job marked `failed`.

### TC-82 — Extremely long video does not crash the poller
- **Steps:** Submit a 60-minute video URL
- **Expected:** Job enters `dubbing` state; poller continues polling every 6/8 seconds; no timeout crash.

### TC-83 — Network interruption during polling is handled gracefully
- **Steps:** Disconnect network mid-dubbing on the watch page; reconnect
- **Expected:** Polling resumes; no unhandled rejection or blank screen.

### TC-84 — Duplicate job submission is handled
- **Steps:** Submit the same YouTube URL + language twice rapidly
- **Expected:** Two separate job records are created (no deduplication currently — acceptable); no DB error.

### TC-85 — Audio upload to Supabase Storage uses upsert
- **Steps:** Trigger the same job result twice (simulate a repeated poll resolution)
- **Expected:** `upsert: true` in the storage upload prevents duplicate file errors.

---

## 15. Build & Deployment

### TC-86 — `npm run build` completes without errors
- **Steps:** Run `npm run build` in the project root
- **Expected:** Build succeeds with no TypeScript errors, no ESLint errors, and static pages are generated.

### TC-87 — `npm run lint` passes cleanly
- **Steps:** Run `npm run lint`
- **Expected:** No ESLint violations reported.

### TC-88 — All environment variables are present in production
- **Steps:** Check Vercel project settings → Environment Variables
- **Expected:** All 6 required variables are set (see `deployment.md`).

### TC-89 — App is accessible at the production URL
- **Steps:** Visit the Vercel deployment URL
- **Expected:** Landing page loads; no 500 errors; Clerk auth flow works end-to-end.

### TC-90 — API routes work in production (serverless environment)
- **Steps:** Submit a dubbing job from the deployed app
- **Expected:** Job is created, ElevenLabs is called, status updates correctly, audio is stored in Supabase.

---

## Bug Tracking Template

When a test fails, log it with:

```
TC-XX  [FAIL]
Page/Route:
Steps to reproduce:
Expected:
Actual:
Screenshot/Log:
Fix applied:
Re-test result:
```

---

*Last updated: 2026-04-07*
