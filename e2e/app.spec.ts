import { test, expect } from '@playwright/test';

test.describe('CHICCHAPS Store', () => {
  test('home page loads with hero and products', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByAltText('Sembark Logo')).toBeVisible();
    await expect(page.locator('.nav-cat-btn').first()).toBeVisible({
      timeout: 15000,
    });
    await page.locator('#products').scrollIntoViewIfNeeded();
    await expect(page.locator('.product-luxury').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('navigates to product detail', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('.product-luxury-link').first().click();
    await expect(page.getByRole('button', { name: /Add to Bag/i })).toBeVisible({
      timeout: 10000,
    });
  });

  test('navbar opens category page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('.nav-cat-btn').first().click();
    await expect(page).toHaveURL(/\/category\/\d+/);
    await expect(page.locator('.category-hero-title')).toBeVisible({
      timeout: 10000,
    });
  });

  test('adds to bag and checkout flow link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('.product-luxury-link').first().click();
    await page.getByRole('button', { name: /Add to Bag/i }).click();
    await page.getByRole('link', { name: 'Bag', exact: true }).click();
    await expect(page.getByRole('heading', { name: /Your Bag/i })).toBeVisible();
  });
});
