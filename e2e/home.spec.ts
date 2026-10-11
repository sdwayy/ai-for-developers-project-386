import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows the service title as the main heading", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Calendar" }),
    ).toBeVisible();
  });

  test("links to the booking page", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: /Записаться/ }),
    ).toHaveAttribute("href", "/book");
  });

  test("lists the service capabilities", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Возможности" }),
    ).toBeVisible();
    await expect(page.getByRole("listitem")).toHaveCount(3);
  });
});
