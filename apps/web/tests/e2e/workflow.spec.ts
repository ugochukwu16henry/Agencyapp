import { expect, test } from "@playwright/test";

test("public portal, submit page, and login page render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Ministry-verified properties")).toBeVisible();

  await page.goto("/submit");
  await expect(page.getByText("Partner Mobile Intake")).toBeVisible();

  await page.goto("/login");
  await expect(page.getByText("Admin Login")).toBeVisible();
});
