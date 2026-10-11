import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows the service title as the main heading", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Calendar" }),
    ).toBeVisible();
  });

  test("links to the booking page from the header and the call to action", async ({
    page,
  }) => {
    await page.goto("/");

    const bookingLinks = page.getByRole("link", { name: /Записаться/ });
    await expect(bookingLinks).toHaveCount(2);
    await expect(bookingLinks.first()).toHaveAttribute("href", "/book");
  });

  test("shows the shared public header", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Админка" })).toHaveAttribute(
      "href",
      "/admin",
    );
  });

  test("lists the service capabilities", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Возможности" }),
    ).toBeVisible();
    await expect(page.getByRole("listitem")).toHaveCount(3);
  });
});
