import { test, expect } from "@playwright/test";

const API_URL = "https://staging.homevision.co/api_project/houses*";

const fakeHouses = [
  {
    id: 1,
    address: "123 Fake St",
    homeowner: "Jane Doe",
    price: 250000,
    photoURL: "https://picsum.photos/300",
  },
  {
    id: 2,
    address: "456 Test Ave",
    homeowner: "John Smith",
    price: 450000,
    photoURL: "https://picsum.photos/300",
  },
];

test.describe("Home page", () => {
  test("shows loading skeleton then renders property cards on success", async ({
    page,
  }) => {
    await page.route(API_URL, async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({ json: { ok: true, houses: fakeHouses } });
    });

    await page.goto("/");

    await expect(page.getByTestId("feed-loading")).toBeVisible();

    await expect(page.getByText(fakeHouses[0].address)).toBeVisible();
    await expect(page.getByText(fakeHouses[1].address)).toBeVisible();

    await expect(page.getByTestId("feed-loading")).not.toBeAttached();
  });

  test("shows error state with retry button when API fails", async ({
    page,
  }) => {
    await page.route(API_URL, (route) =>
      route.fulfill({
        status: 500,
        json: { ok: false, message: "Server down" },
      }),
    );

    await page.goto("/");

    const alert = page
      .getByRole("alert")
      .filter({ hasText: "couldn't load the properties" });
    await expect(alert).toBeVisible();

    await expect(
      alert.getByRole("button", { name: "Try again" }),
    ).toBeVisible();
  });
});
