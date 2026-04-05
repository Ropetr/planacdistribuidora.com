import { test, expect } from '@playwright/test';

test.describe('Carrossel DeWalt', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/dewalt');
  });

  test('Carrossel existe na página', async ({ page }) => {
    const carousel = page.locator('.dewalt-carousel');
    await expect(carousel).toBeVisible();
  });

  test('Carrossel tem produtos visíveis', async ({ page }) => {
    const products = page.locator('.dewalt-product-card');
    
    // Deve ter pelo menos 1 produto visível
    await expect(products.first()).toBeVisible();
    
    // Deve ter múltiplos produtos no total
    const count = await products.count();
    expect(count).toBeGreaterThan(5);
  });

  test('Produtos têm estrutura correta', async ({ page }) => {
    const firstProduct = page.locator('.dewalt-product-card').first();
    
    // Imagem
    await expect(firstProduct.locator('.dewalt-product-card__image img')).toBeVisible();
    
    // Título
    await expect(firstProduct.locator('.dewalt-product-card__title')).toBeVisible();
    
    // Botão de orçamento
    await expect(firstProduct.locator('.dewalt-product-card__btn')).toBeVisible();
  });

  test('Botão de orçamento leva ao WhatsApp', async ({ page }) => {
    const btn = page.locator('.dewalt-product-card__btn').first();
    
    await expect(btn).toHaveAttribute('href', /whatsapp/);
    await expect(btn).toHaveAttribute('target', '_blank');
  });

  test.describe('Desktop', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    test('Setas de navegação visíveis no desktop', async ({ page }) => {
      await page.goto('/dewalt');
      
      const prevBtn = page.locator('.dewalt-carousel__nav--prev');
      const nextBtn = page.locator('.dewalt-carousel__nav--next');
      
      await expect(prevBtn).toBeVisible();
      await expect(nextBtn).toBeVisible();
    });

    test('Seta próximo faz scroll', async ({ page }) => {
      await page.goto('/dewalt');
      
      const container = page.locator('.dewalt-carousel__container');
      const initialScroll = await container.evaluate(el => el.scrollLeft);
      
      // Clicar na seta próximo
      await page.locator('.dewalt-carousel__nav--next').click();
      
      // Aguardar animação
      await page.waitForTimeout(500);
      
      const newScroll = await container.evaluate(el => el.scrollLeft);
      expect(newScroll).toBeGreaterThan(initialScroll);
    });
  });

  test.describe('Mobile', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('Setas de navegação escondidas no mobile', async ({ page }) => {
      await page.goto('/dewalt');
      
      const prevBtn = page.locator('.dewalt-carousel__nav--prev');
      const nextBtn = page.locator('.dewalt-carousel__nav--next');
      
      await expect(prevBtn).not.toBeVisible();
      await expect(nextBtn).not.toBeVisible();
    });

    test('Carrossel permite scroll horizontal no mobile', async ({ page }) => {
      await page.goto('/dewalt');
      
      const container = page.locator('.dewalt-carousel__container');
      
      // Verificar que o container tem overflow-x: auto
      await expect(container).toHaveCSS('overflow-x', 'auto');
      
      // Verificar que há conteúdo para scrollar
      const scrollWidth = await container.evaluate(el => el.scrollWidth);
      const clientWidth = await container.evaluate(el => el.clientWidth);
      
      expect(scrollWidth).toBeGreaterThan(clientWidth);
    });

    test('Pelo menos 1 card visível e no máximo 3 no mobile', async ({ page }) => {
      await page.goto('/dewalt');

      const container = page.locator('.dewalt-carousel__container');
      const cards = page.locator('.dewalt-product-card');

      // Contar cards visíveis no viewport do container
      const containerRect = await container.evaluate(el => el.getBoundingClientRect());
      const visibleCount = await cards.evaluateAll((els, rect) => {
        return els.filter(el => {
          const r = el.getBoundingClientRect();
          return r.left < rect.right && r.right > rect.left;
        }).length;
      }, containerRect);

      expect(visibleCount).toBeGreaterThanOrEqual(1);
      expect(visibleCount).toBeLessThanOrEqual(3);
    });

    test.skip('Touch scroll funciona', async ({ page }) => {
      await page.goto('/dewalt');
      
      const container = page.locator('.dewalt-carousel__container');
      const initialScroll = await container.evaluate(el => el.scrollLeft);
      
      // Simular swipe
      const box = await container.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width - 50, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + 50, box.y + box.height / 2, { steps: 10 });
        await page.mouse.up();
      }
      
      await page.waitForTimeout(500);
      
      const newScroll = await container.evaluate(el => el.scrollLeft);
      expect(newScroll).toBeGreaterThan(initialScroll);
    });

    test('Scroll snap funciona', async ({ page }) => {
      await page.goto('/dewalt');
      
      const container = page.locator('.dewalt-carousel__container');
      
      // Verificar CSS de scroll-snap
      await expect(container).toHaveCSS('scroll-snap-type', /x\s+mandatory/);
      
      // Verificar que cards têm scroll-snap-align
      const firstCard = page.locator('.dewalt-product-card').first();
      await expect(firstCard).toHaveCSS('scroll-snap-align', 'start');
    });
  });

  test.describe('Cards responsivos', () => {
    const viewports = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 14', width: 390, height: 844 },
      { name: 'Samsung Galaxy', width: 360, height: 740 },
    ];

    for (const viewport of viewports) {
      test(`Cards têm tamanho correto em ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/dewalt');
        
        const firstCard = page.locator('.dewalt-product-card').first();
        const cardWidth = await firstCard.evaluate(el => el.getBoundingClientRect().width);
        
        // Cálculo esperado: (viewport - 40 - 32 - 12) / 2 = (viewport - 84) / 2
        const expectedWidth = (viewport.width - 84) / 2;
        
        // Tolerância de 5px
        expect(cardWidth).toBeGreaterThan(expectedWidth - 5);
        expect(cardWidth).toBeLessThan(expectedWidth + 5);
      });
    }
  });
});
