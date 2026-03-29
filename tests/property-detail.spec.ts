import { test, expect } from "@playwright/test";

const API_URL = "https://staging.homevision.co/api_project/houses*";

const fakeHouse = {
  id: 5,
  address: "789 Oak Blvd",
  homeowner: "Alice Walker",
  price: 375000,
  photoURL: "https://picsum.photos/300",
};

test.describe("Property detail page", () => {
  test("shows loading skeleton then renders property details on success", async ({ page }) => {
    await page.route(API_URL, async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({ json: { ok: true, houses: [fakeHouse] } });
    });

    await page.goto(`/properties/${fakeHouse.id}`);

    await expect(page.getByTestId("detail-loading")).toBeVisible();

    await expect(page.getByRole("heading", { name: fakeHouse.address })).toBeVisible();
    await expect(page.getByText(fakeHouse.homeowner)).toBeVisible();
    await expect(page.getByText("$375,000")).toBeVisible();

    await expect(page.getByTestId("detail-loading")).not.toBeAttached();
  });

  test("shows error state with retry button when API fails", async ({ page }) => {
    await page.route(API_URL, (route) =>
      route.fulfill({
        status: 500,
        json: { ok: false, message: "Server down" },
      }),
    );

    await page.goto(`/properties/${fakeHouse.id}`);

    const alert = page.getByRole("alert").filter({ hasText: "couldn't load this property" });
    await expect(alert).toBeVisible();

    await expect(alert.getByRole("button", { name: "Try again" })).toBeVisible();
  });
});
