/**
 * Translate Form — authenticated tests (dashboard).
 *
 * Tests the client-side validation logic and UI states of the
 * TranslateForm component. Actual job submission is mocked so
 * no real ElevenLabs calls are made.
 *
 * Requires: auth setup (E2E_TEST_EMAIL + E2E_TEST_PASSWORD in .env.test.local)
 */
import { test, expect } from "@playwright/test";

test.describe("TranslateForm — URL validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
  });

  test("submit button is disabled with empty URL field", async ({ page }) => {
    const btn = page.getByRole("button", { name: /translate.*dub|dub now/i });
    await expect(btn).toBeDisabled();
  });

  test("valid YouTube watch URL shows ✓ Valid indicator", async ({ page }) => {
    await page.getByPlaceholder(/youtube\.com\/watch/i).fill(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    await expect(page.getByText("✓ Valid")).toBeVisible();
  });

  test("valid youtu.be short URL shows ✓ Valid indicator", async ({ page }) => {
    await page.getByPlaceholder(/youtube\.com\/watch/i).fill(
      "https://youtu.be/dQw4w9WgXcQ"
    );
    await expect(page.getByText("✓ Valid")).toBeVisible();
  });

  test("invalid URL shows Invalid URL indicator", async ({ page }) => {
    await page.getByPlaceholder(/youtube\.com\/watch/i).fill("https://vimeo.com/123456");
    await expect(page.getByText("Invalid URL")).toBeVisible();
  });

  test("submit button is disabled for an invalid URL", async ({ page }) => {
    await page.getByPlaceholder(/youtube\.com\/watch/i).fill("https://vimeo.com/123456");
    const btn = page.getByRole("button", { name: /translate.*dub|dub now/i });
    await expect(btn).toBeDisabled();
  });

  test("submit button is enabled for a valid URL with supported language", async ({ page }) => {
    await page.getByPlaceholder(/youtube\.com\/watch/i).fill(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    const btn = page.getByRole("button", { name: /translate.*dub|dub now/i });
    await expect(btn).toBeEnabled();
  });

  test("thumbnail preview appears for a valid URL", async ({ page }) => {
    await page.getByPlaceholder(/youtube\.com\/watch/i).fill(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    const thumbnail = page.locator('img[src*="img.youtube.com"]');
    await expect(thumbnail).toBeVisible();
  });

  test("thumbnail disappears when URL is cleared", async ({ page }) => {
    const input = page.getByPlaceholder(/youtube\.com\/watch/i);
    await input.fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await expect(page.locator('img[src*="img.youtube.com"]')).toBeVisible();
    await input.fill("");
    await expect(page.locator('img[src*="img.youtube.com"]')).not.toBeVisible();
  });

  test("clearing the URL hides the Valid/Invalid indicator", async ({ page }) => {
    const input = page.getByPlaceholder(/youtube\.com\/watch/i);
    await input.fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await expect(page.getByText("✓ Valid")).toBeVisible();
    await input.fill("");
    await expect(page.getByText("✓ Valid")).not.toBeVisible();
  });
});

test.describe("TranslateForm — language picker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
  });

  test("language picker is visible", async ({ page }) => {
    // LanguagePicker renders as a list of buttons or a select
    const picker = page.locator("[class*='language'], select, [role='listbox'], [data-testid='lang-picker']")
      .or(page.getByText(/hindi|spanish|french/i).first().locator(".."));
    await expect(page.getByText(/hindi/i).first()).toBeVisible();
  });

  test("unsupported language shows warning and disables submit", async ({ page }) => {
    // Look for a language with "Coming Soon" — click it if it exists as a button
    const comingSoon = page.getByText(/coming soon/i).first();
    const count = await comingSoon.count();
    if (count === 0) {
      test.skip(); // no visible coming soon option — picker may hide them
      return;
    }
    await comingSoon.click();
    await expect(
      page.getByText(/not supported|choose another|coming soon/i).first()
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /translate.*dub|dub now/i })).toBeDisabled();
  });
});

test.describe("TranslateForm — mocked job submission", () => {
  test("POSTs correct payload and shows loading state", async ({ page }) => {
    // Intercept the API call — return a fake job so no ElevenLabs call is made
    const FAKE_JOB_ID = "00000000-0000-0000-0000-000000000001";

    await page.route("**/api/jobs", (route) => {
      if (route.request().method() === "POST") {
        route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: FAKE_JOB_ID,
            status: "dubbing",
            youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            video_id: "dQw4w9WgXcQ",
            video_title: "Test Video",
            target_language: "hi",
            source_language: "en",
            elevenlabs_dubbing_id: "el_test_id",
            audio_url: null,
            error_message: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder(/youtube\.com\/watch/i).fill(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );

    // Capture the request body to verify correct payload
    let capturedBody: Record<string, unknown> | null = null;
    page.on("request", (req) => {
      if (req.url().includes("/api/jobs") && req.method() === "POST") {
        try {
          capturedBody = JSON.parse(req.postData() ?? "{}");
        } catch {
          // ignore
        }
      }
    });

    await page.getByRole("button", { name: /translate.*dub|dub now/i }).click();

    // Loading state must appear
    await expect(page.getByText(/starting dubbing job/i)).toBeVisible({ timeout: 3_000 });

    // Wait for navigation (redirect to /watch/{id})
    await page.waitForURL(`**/watch/${FAKE_JOB_ID}`, { timeout: 10_000 }).catch(() => {
      // May 404 because the job doesn't exist in Supabase — that's expected in this mock scenario
    });

    // Verify correct payload was sent
    expect(capturedBody).not.toBeNull();
    expect(capturedBody?.youtubeUrl).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(capturedBody?.targetLanguage).toBe("hi"); // default language is Hindi
  });
});
