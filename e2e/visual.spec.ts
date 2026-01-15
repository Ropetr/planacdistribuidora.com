import { test, expect } from '@playwright/test';

test.describe('Testes Visuais - Screenshots', () => {
  
  test.describe('Homepage', () => {
    test('Screenshot desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('homepage-desktop.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Screenshot mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Página DeWalt', () => {
    test('Screenshot desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/dewalt');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('dewalt-desktop.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Screenshot mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dewalt');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('dewalt-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Carrossel - área específica desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/dewalt');
      await page.waitForLoadState('networkidle');
      
      const carousel = page.locator('.dewalt-carousel-section');
      await carousel.scrollIntoViewIfNeeded();
      
      await expect(carousel).toHaveScreenshot('dewalt-carousel-desktop.png');
    });

    test('Carrossel - área específica mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dewalt');
      await page.waitForLoadState('networkidle');
      
      const carousel = page.locator('.dewalt-carousel-section');
      await carousel.scrollIntoViewIfNeeded();
      
      await expect(carousel).toHaveScreenshot('dewalt-carousel-mobile.png');
    });
  });

  test.describe('Header', () => {
    test('Header desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
      
      const header = page.locator('.header');
      await expect(header).toHaveScreenshot('header-desktop.png');
    });

    test('Header mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const header = page.locator('.header');
      await expect(header).toHaveScreenshot('header-mobile.png');
    });

    test('Menu mobile aberto', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      await page.locator('.hamburger').click();
      await page.waitForTimeout(300);
      
      await expect(page).toHaveScreenshot('header-mobile-menu-open.png', {
        fullPage: false,
      });
    });
  });

  test.describe('Footer', () => {
    test('Footer desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
      
      const footer = page.locator('.footer');
      await footer.scrollIntoViewIfNeeded();
      
      await expect(footer).toHaveScreenshot('footer-desktop.png');
    });

    test('Footer mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const footer = page.locator('.footer');
      await footer.scrollIntoViewIfNeeded();
      
      await expect(footer).toHaveScreenshot('footer-mobile.png');
    });
  });

  test.describe('Breakpoints críticos', () => {
    const breakpoints = [320, 375, 414, 768, 1024, 1280, 1920];
    
    for (const width of breakpoints) {
      test(`Homepage em ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveScreenshot(`homepage-${width}px.png`, {
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  });
});
