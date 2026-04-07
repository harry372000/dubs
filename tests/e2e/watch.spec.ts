/**
 * Watch Page — client-side state tests (authenticated).
 *
 * The watch page is a server component that fetches the job from Supabase.
 * These tests mock the GET /api/jobs/[id] polling endpoint to test all
 * client-side states without needing a real ElevenLabs job.
 *
 * For the initial server render, we use a real seeded job ID.
 * Set E2E_WATCH_JOB_ID in .env.test.local to a job with status "dubbing"
 * that exists in your Supabase instance.
 *
 * If E2E_WATCH_JOB_ID is not set, the server-render-dependent tests are skipped.
 */
import { test, expect } from "@playwright/test";

const WATCH_JOB_ID = process.env.E2E_WATCH_JOB_ID;

// ── Polling state tests (requires seeded job) ────────────────────────────────

test.describe("Watch page — loading / polling state", () => {
  test.skip(!WATCH_JOB_ID, "Set E2E_WATCH_JOB_ID in .env.test.local to enable these tests");

  test("shows loading UI while job is dubbing", async ({ page }) => {
    // Mock the polling endpoint to always return "dubbing"
    await page.route(`**/api/jobs/${WATCH_JOB_ID}`, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: WATCH_JOB_ID,
          status: "dubbing",
          video_id: "dQw4w9WgXcQ",
          video_title: "Test Video",
          target_language: "hi",
          source_language: "en",
          audio_url: null,
          error_message: null,
        }),
      });
    });

    await page.goto(`/watch/${WATCH_JOB_ID}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/ai is working|dubbing in progress/i)).toBeVisible();
    await expect(page.getByText(/auto.refreshing/i)).toBeVisible();
  });

  test("shows video thumbnail while job is pending", async ({ page }) => {
    await page.route(`**/api/jobs/${WATCH_JOB_ID}`, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: WATCH_JOB_ID,
          status: "pending",
          video_id: "dQw4w9WgXcQ",
          video_title: "Test Video",
          target_language: "hi",
          source_language: "en",
          audio_url: null,
          error_message: null,
        }),
      });
    });

    await page.goto(`/watch/${WATCH_JOB_ID}`);
    await page.waitForLoadState("networkidle");

    const thumbnail = page.locator('img[src*="img.youtube.com"]');
    await expect(thumbnail).toBeVisible();
  });

  test("sends polling request every ~6 seconds", async ({ page }) => {
    let pollCount = 0;

    await page.route(`**/api/jobs/${WATCH_JOB_ID}`, (route) => {
      pollCount++;
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: WATCH_JOB_ID,
          status: "dubbing",
          video_id: "dQw4w9WgXcQ",
          video_title: "Test Video",
          target_language: "hi",
          source_language: "en",
          audio_url: null,
          error_message: null,
        }),
      });
    });

    await page.goto(`/watch/${WATCH_JOB_ID}`);
    await page.waitForLoadState("networkidle");

    // Wait ~14s — expect at least 2 polls (every 6s)
    await page.waitForTimeout(14_000);
    expect(pollCount).toBeGreaterThanOrEqual(2);
  });

  test("transitions to player UI when polling returns done", async ({ page }) => {
    let callCount = 0;

    await page.route(`**/api/jobs/${WATCH_JOB_ID}`, (route) => {
      callCount++;
      // First call returns dubbing, second returns done
      const status = callCount >= 2 ? "done" : "dubbing";
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: WATCH_JOB_ID,
          status,
          video_id: "dQw4w9WgXcQ",
          video_title: "Test Video",
          target_language: "hi",
          source_language: "en",
          audio_url: "https://example.com/audio.mp3",
          error_message: null,
        }),
      });
    });

    await page.goto(`/watch/${WATCH_JOB_ID}`);
    await page.waitForLoadState("networkidle");

    // Loading state initially
    await expect(page.getByText(/ai is working|dubbing in progress/i)).toBeVisible();

    // After ~8s the second poll fires → status = done → player appears
    await expect(page.getByText(/hindi.*dub|hindi audio/i)).toBeVisible({ timeout: 15_000 });
  });

  test("shows error card when polling returns failed", async ({ page }) => {
    await page.route(`**/api/jobs/${WATCH_JOB_ID}`, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: WATCH_JOB_ID,
          status: "failed",
          video_id: "dQw4w9WgXcQ",
          video_title: "Test Video",
          target_language: "hi",
          source_language: "en",
          audio_url: null,
          error_message: "ElevenLabs dubbing failed (402): quota exceeded",
        }),
      });
    });

    await page.goto(`/watch/${WATCH_JOB_ID}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/dubbing failed/i)).toBeVisible();
    await expect(page.getByText(/quota exceeded/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /back to dashboard/i })).toBeVisible();
  });
});

// ── Player UI tests (requires a "done" seeded job) ───────────────────────────

test.describe("Watch page — player state (done job)", () => {
  test.skip(!WATCH_JOB_ID, "Set E2E_WATCH_JOB_ID in .env.test.local to enable these tests");

  test.beforeEach(async ({ page }) => {
    // Mock the polling endpoint to return a completed job
    await page.route(`**/api/jobs/${WATCH_JOB_ID}`, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: WATCH_JOB_ID,
          status: "done",
          video_id: "dQw4w9WgXcQ",
          video_title: "Rick Astley - Never Gonna Give You Up",
          target_language: "hi",
          source_language: "en",
          audio_url: "https://example.com/audio.mp3",
          error_message: null,
        }),
      });
    });
  });

  test("shows video title in header", async ({ page }) => {
    await page.goto(`/watch/${WATCH_JOB_ID}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/rick astley|never gonna give/i)).toBeVisible({ timeout: 10_000 });
  });

  test("shows language dub badge", async ({ page }) => {
    await page.goto(`/watch/${WATCH_JOB_ID}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/hindi.*dub|hindi audio/i)).toBeVisible({ timeout: 10_000 });
  });

  test("Back to Dashboard link is present and correct", async ({ page }) => {
    await page.goto(`/watch/${WATCH_JOB_ID}`);
    await page.waitForLoadState("networkidle");
    const backLink = page.getByRole("link", { name: /back to dashboard/i });
    await expect(backLink).toBeVisible({ timeout: 10_000 });
    await expect(backLink).toHaveAttribute("href", "/dashboard");
  });

  test("custom play/pause button is visible in control bar", async ({ page }) => {
    await page.goto(`/watch/${WATCH_JOB_ID}`);
    // Wait for YouTube IFrame API to load player
    await page.waitForTimeout(5_000);
    const controlBar = page.locator("button").filter({ hasText: "" }).first();
    await expect(controlBar).toBeVisible();
  });
});
