
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('ServicePurchaseFlow_2026-05-23', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:8000/dk/ygn/home');

    // Take screenshot
    await page.screenshot({ path: '01_home_page.png' });

    // Click element
    await page.click('[data-testid="scene-card"]');

    // Navigate to URL
    await page.goto('http://localhost:8000/dk/service/product/hh');

    // Take screenshot
    await page.screenshot({ path: '02_service_product_page.png' });

    // Click element
    await page.click('[data-testid="buy-now-button"]');

    // Navigate to URL
    await page.goto('http://localhost:8000/dk/products/hh');

    // Take screenshot
    await page.screenshot({ path: '03_original_product_page.png' });

    // Navigate to URL
    await page.goto('http://localhost:8000/dk/checkout');

    // Take screenshot
    await page.screenshot({ path: '04_checkout_page.png' });

    // Navigate to URL
    await page.goto('http://localhost:8000/dk/service/product/t-shirt');

    // Take screenshot
    await page.screenshot({ path: '05_service_tshirt_page.png' });

    // Navigate to URL
    await page.goto('http://localhost:8000/dk/products/t-shirt');
});