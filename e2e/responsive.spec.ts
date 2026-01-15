import { test, expect } from '@playwright/test';

test.describe('Responsividade e Overflow', () => {
  
  const pages = ['/', '/dewalt', '/forro-gesso', '/paredes-drywall'];
  
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'Samsung Galaxy', width: 360, height: 740 },
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Desktop Large', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test.describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      test('Sem overflow horizontal na homepage', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        expect(hasOverflow, 'Página não deve ter scroll horizontal').toBe(false);
      });

      test('Sem overflow horizontal na página DeWalt', async ({ page }) => {
        await page.goto('/dewalt');
        await page.waitForLoadState('networkidle');
        
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        expect(hasOverflow, 'Página DeWalt não deve ter scroll horizontal').toBe(false);
      });

      test('Header não vaza', async ({ page }) => {
        await page.goto('/');
        
        const header = page.locator('.header');
        const headerBox = await header.boundingBox();
        
        expect(headerBox?.x).toBeGreaterThanOrEqual(0);
        expect(headerBox?.width).toBeLessThanOrEqual(viewport.width);
      });

      test('Conteúdo principal não vaza', async ({ page }) => {
        await page.goto('/dewalt');
        
        const content = page.locator('.content');
        const contentBox = await content.boundingBox();
        
        if (contentBox) {
          expect(contentBox.x).toBeGreaterThanOrEqual(0);
          expect(contentBox.x + contentBox.width).toBeLessThanOrEqual(viewport.width + 1);
        }
      });
    });
  }

  test.describe('Logo responsivo', () => {
    test('Logo menor no mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const logo = page.locator('.logo img');
      const logoHeight = await logo.evaluate(el => {
        return parseInt(window.getComputedStyle(el).height);
      });
      
      expect(logoHeight).toBeLessThanOrEqual(45); // Deve ser ~40px
    });

    test('Logo maior no desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
      
      const logo = page.locator('.logo img');
      const logoHeight = await logo.evaluate(el => {
        return parseInt(window.getComputedStyle(el).height);
      });
      
      expect(logoHeight).toBeGreaterThanOrEqual(55); // Deve ser 60px
    });
  });

  test.describe('Grid responsivo', () => {
    test('Content-grid tem 2 colunas no desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/dewalt');
      
      const grid = page.locator('.content-grid');
      const gridColumns = await grid.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      
      // Deve ter 2 valores (2 colunas)
      const columnCount = gridColumns.split(' ').length;
      expect(columnCount).toBe(2);
    });

    test('Content-grid tem 1 coluna no mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dewalt');
      
      const grid = page.locator('.content-grid');
      const gridColumns = await grid.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      
      // Deve ter 1 valor (1 coluna)
      const columnCount = gridColumns.split(' ').filter(v => v.trim()).length;
      expect(columnCount).toBe(1);
    });
  });

  test.describe('Imagens responsivas', () => {
    test('Imagens não excedem container', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dewalt');
      
      const images = page.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const img = images.nth(i);
        const box = await img.boundingBox();
        
        if (box && box.width > 0) {
          expect(box.x).toBeGreaterThanOrEqual(-1);
          expect(box.x + box.width).toBeLessThanOrEqual(375 + 1);
        }
      }
    });
  });

  test.describe('Elementos não vazando', () => {
    test('Nenhum elemento vaza no mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dewalt');
      
      // Scroll pela página inteira
      await page.evaluate(async () => {
        const scrollHeight = document.documentElement.scrollHeight;
        for (let i = 0; i < scrollHeight; i += 500) {
          window.scrollTo(0, i);
          await new Promise(r => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
      });
      
      // Verificar overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasOverflow).toBe(false);
    });
  });
});
