/**
 * Landing Page — public, no auth required.
 * Covers: hero, CTAs, language marquee, stats, how-it-works, features, footer.
 */
import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  // ── Visibility & content ────────────────────────────────────────────────

  test("page title is set", async ({ page }) => {
    await expect(page).toHaveTitle(/.+/); // any non-empty title
  });

  test("DUBS logo renders in the navbar", async ({ page }) => {
    const logo = page.locator("header").first();
    await expect(logo).toBeVisible();
  });

  test("hero headline contains 'Dub Any Video'", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /dub any video/i })).toBeVisible();
  });

  test("hero sub-headline is visible", async ({ page }) => {
    await expect(
      page.getByText(/paste a youtube url/i).first()
    ).toBeVisible();
  });

  test("AI-Powered badge chip is visible", async ({ page }) => {
    await expect(page.getByText(/ai.powered video dubbing/i)).toBeVisible();
  });

  // ── CTA buttons ─────────────────────────────────────────────────────────

  test('"Get Started Free" link points to /sign-up', async ({ page }) => {
    const cta = page.getByRole("link", { name: /get started free/i }).first();
    await expect(cta).toHaveAttribute("href", "/sign-up");
  });

  test('"Start Dubbing Free" link points to /sign-up', async ({ page }) => {
    const cta = page.getByRole("link", { name: /start dubbing free/i }).first();
    await expect(cta).toHaveAttribute("href", "/sign-up");
  });

  test('"Sign In" link points to /sign-in', async ({ page }) => {
    const signIn = page.getByRole("link", { name: /^sign in$/i }).first();
    await expect(signIn).toHaveAttribute("href", "/sign-in");
  });

  test("clicking Get Started Free navigates to /sign-up", async ({ page }) => {
    await page.getByRole("link", { name: /get started free/i }).first().click();
    await expect(page).toHaveURL(/\/sign-up/);
  });

  test("clicking Sign In navigates to /sign-in", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /^sign in$/i }).first().click();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  // ── Trust pills ─────────────────────────────────────────────────────────

  test('"No credit card required" trust pill is visible', async ({ page }) => {
    await expect(page.getByText(/no credit card required/i)).toBeVisible();
  });

  test('"ElevenLabs powered" trust pill is visible', async ({ page }) => {
    await expect(page.getByText(/elevenlabs powered/i)).toBeVisible();
  });

  // ── Language marquee ─────────────────────────────────────────────────────

  test("language marquee contains Hindi", async ({ page }) => {
    await expect(page.getByText("Hindi").first()).toBeVisible();
  });

  test("language marquee contains Spanish", async ({ page }) => {
    await expect(page.getByText("Spanish").first()).toBeVisible();
  });

  test("language marquee contains Japanese", async ({ page }) => {
    await expect(page.getByText("Japanese").first()).toBeVisible();
  });

  // ── Stats section ────────────────────────────────────────────────────────

  test("stats section shows 13+ languages", async ({ page }) => {
    await expect(page.getByText("13+").first()).toBeVisible();
  });

  test("stats section shows Free tier", async ({ page }) => {
    await expect(page.getByText("Free").first()).toBeVisible();
  });

  // ── How It Works section ─────────────────────────────────────────────────

  test('"How It Works" heading is present', async ({ page }) => {
    await expect(page.getByRole("heading", { name: /how it works/i })).toBeVisible();
  });

  test('step "01 — Paste a YouTube URL" is present', async ({ page }) => {
    await expect(page.getByText(/paste a youtube url/i).first()).toBeVisible();
  });

  test('step "03 — Watch & Listen" is present', async ({ page }) => {
    await expect(page.getByText(/watch.*listen/i).first()).toBeVisible();
  });

  // ── Features section ─────────────────────────────────────────────────────

  test('"Paste & Go" feature card is visible', async ({ page }) => {
    await expect(page.getByText(/paste.*go/i).first()).toBeVisible();
  });

  test('"AI Voice Cloning" feature card is visible', async ({ page }) => {
    await expect(page.getByText(/ai voice cloning/i)).toBeVisible();
  });

  test('"Watch in Browser" feature card is visible', async ({ page }) => {
    await expect(page.getByText(/watch in browser/i)).toBeVisible();
  });

  // ── Bottom CTA ───────────────────────────────────────────────────────────

  test('"Break the Language Barrier" CTA heading is visible', async ({ page }) => {
    await expect(page.getByRole("heading", { name: /break the language barrier/i })).toBeVisible();
  });

  // ── Footer ───────────────────────────────────────────────────────────────

  test("footer mentions ElevenLabs and Next.js", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toContainText(/elevenlabs/i);
    await expect(footer).toContainText(/next\.js/i);
  });

  // ── Auth redirect guards ─────────────────────────────────────────────────

  test("unauthenticated user visiting /dashboard is redirected to sign-in", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("unauthenticated user visiting /library is redirected to sign-in", async ({ page }) => {
    await page.goto("/library");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("unauthenticated user visiting /api/jobs gets 401", async ({ request }) => {
    const res = await request.get("/api/jobs");
    expect(res.status()).toBe(401);
  });
});
