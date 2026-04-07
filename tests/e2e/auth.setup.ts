/**
 * Auth Setup — runs once before all authenticated tests.
 *
 * Requires these env vars in .env.test.local:
 *   E2E_TEST_EMAIL    — email of a pre-created Clerk test account
 *   E2E_TEST_PASSWORD — its password
 *
 * Saves the authenticated browser state to playwright/.auth/user.json,
 * which is reused by all authenticated test projects.
 */
import { test as setup, expect } from "@playwright/test";
import path from "path";

const AUTH_FILE = path.join(__dirname, "../../playwright/.auth/user.json");

setup("authenticate as test user", async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      [
        "E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be set in .env.test.local.",
        "Create a dedicated Clerk test account and add its credentials there.",
        "See: About DUBS/deployment.md for setup instructions.",
      ].join("\n")
    );
  }

  await page.goto("/sign-in");
  await page.waitForLoadState("networkidle");

  // Step 1 — enter email and continue
  const emailInput = page.getByLabel(/email address/i).or(page.locator('input[name="identifier"]'));
  await emailInput.fill(email);
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 2 — enter password and sign in
  const passwordInput = page.getByLabel(/password/i).or(page.locator('input[type="password"]'));
  await passwordInput.waitFor({ state: "visible", timeout: 8_000 });
  await passwordInput.fill(password);
  await page.getByRole("button", { name: /continue|sign in/i }).click();

  // Wait for redirect to dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });

  // Persist session for all other tests
  await page.context().storageState({ path: AUTH_FILE });
});
