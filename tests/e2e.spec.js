/**
 * E2E Tests com Playwright
 * Testa fluxos completos de usuário
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'https://planacdistribuidora.com';

test.describe('Navegação Principal', () => {
  test('Homepage carrega corretamente', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Planac/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Menu de navegação funciona', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Testar link Drywall
    await page.click('a[href="drywall.html"]');
    await expect(page).toHaveURL(/drywall/);
    await expect(page.locator('h1')).toContainText(/Drywall/i);
  });

  test('Todas as páginas de produto carregam', async ({ page }) => {
    const pages = [
      'drywall.html',
      'forro-gesso.html',
      'forro-mineral.html',
      'forro-vinilico.html',
      'pvc-branco.html',
      'pvc-amadeirado.html',
      'divisoria-escritorio.html',
      'divisoria-naval.html',
      'manta-termica.html'
    ];

    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}/${pagePath}`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    }
  });
});

test.describe('CTAs e Conversão', () => {
  test('Botão WhatsApp visível no desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE_URL);
    
    const whatsappBtn = page.locator('.whatsapp-float');
    await expect(whatsappBtn).toBeVisible();
    
    // Verificar link correto
    const href = await whatsappBtn.getAttribute('href');
    expect(href).toContain('whatsapp.com');
    expect(href).toContain('5543984182582');
  });

  test('Barra fixa no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    const mobileBar = page.locator('.footer-fixed-mobile');
    await expect(mobileBar).toBeVisible();
  });

  test('Formulário de contato existe nas páginas de produto', async ({ page }) => {
    await page.goto(`${BASE_URL}/drywall.html`);
    
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Verificar campos
    await expect(page.locator('input[name="nome"]')).toBeVisible();
    await expect(page.locator('input[name="telefone"]')).toBeVisible();
  });
});

test.describe('Mobile Responsivo', () => {
  test('Menu hamburger funciona no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Menu deve estar oculto
    const mobileMenu = page.locator('.nav-mobile');
    
    // Clicar no hamburger
    await page.click('.hamburger');
    
    // Menu deve aparecer
    await expect(mobileMenu).toHaveClass(/active/);
  });

  test('Layout responsivo não quebra', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },  // iPhone SE
      { width: 375, height: 667 },  // iPhone 8
      { width: 414, height: 896 },  // iPhone 11
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad landscape
      { width: 1280, height: 720 }, // Desktop
      { width: 1920, height: 1080 } // Full HD
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(BASE_URL);
      
      // Verificar que não há overflow horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20);
    }
  });
});

test.describe('SEO e Meta Tags', () => {
  test('Meta tags presentes na homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(20);
    
    // Description
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description.length).toBeGreaterThan(50);
    
    // Canonical
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toContain('planacdistribuidora.com');
    
    // Open Graph
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toBeTruthy();
  });

  test('Schema.org presente', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(schema).toContain('Organization');
  });
});

test.describe('Performance', () => {
  test('Página carrega em menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'load' });
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('Imagens têm dimensões definidas', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const images = await page.locator('img').all();
    for (const img of images) {
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      
      // Pelo menos uma dimensão deve estar definida
      const hasWidth = width !== null;
      const hasHeight = height !== null;
      expect(hasWidth || hasHeight).toBeTruthy();
    }
  });
});

test.describe('Acessibilidade', () => {
  test('Skip link presente e funcional', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached();
    
    // Focar no skip link
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test('Imagens têm alt text', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('Links têm texto acessível', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const links = await page.locator('a[target="_blank"]').all();
    for (const link of links) {
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      const text = await link.textContent();
      
      // Deve ter aria-label, title ou texto visível
      expect(ariaLabel || title || text.trim()).toBeTruthy();
    }
  });
});

test.describe('Segurança', () => {
  test('Links externos têm noopener', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const externalLinks = await page.locator('a[target="_blank"]').all();
    for (const link of externalLinks) {
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });
});
