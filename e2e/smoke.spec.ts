import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Verificações Básicas', () => {
  
  test('Homepage carrega com sucesso', async ({ page }) => {
    const response = await page.goto('/');
    
    // Status 200
    expect(response?.status()).toBe(200);
    
    // Título da página
    await expect(page).toHaveTitle(/Planac/i);
    
    // Header visível
    await expect(page.locator('.header')).toBeVisible();
    
    // Logo visível
    await expect(page.locator('.logo img')).toBeVisible();
  });

  test('Página DeWalt carrega com sucesso', async ({ page }) => {
    const response = await page.goto('/dewalt');
    
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/DeWalt|Dewalt|Planac/i);
    await expect(page.locator('h1')).toContainText(/Dewalt/i);
  });

  test('Sem erros de JavaScript no console', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navegar para algumas páginas
    await page.goto('/dewalt');
    await page.waitForLoadState('networkidle');
    
    expect(errors).toHaveLength(0);
  });

  test('Sem recursos 404 (imagens, CSS, JS)', async ({ page }) => {
    const failedResources: string[] = [];
    
    page.on('response', (response) => {
      if (response.status() === 404) {
        failedResources.push(response.url());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/dewalt');
    await page.waitForLoadState('networkidle');
    
    expect(failedResources).toHaveLength(0);
  });

  test('CSS carrega corretamente', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que o header tem estilo aplicado
    const header = page.locator('.header');
    await expect(header).toHaveCSS('position', 'sticky');
  });

  test('Todas as páginas principais retornam 200', async ({ page }) => {
    const pages = [
      '/',
      '/dewalt',
      '/forro-gesso',
      '/forro-mineral',
      '/forro-vinilico',
      '/paredes-drywall',
      '/divisoria-drywall',
      '/divisoria-escritorio',
      '/la-de-vidro',
      '/la-de-rocha',
    ];
    
    for (const url of pages) {
      const response = await page.goto(url);
      expect(response?.status(), `Página ${url} deveria retornar 200`).toBe(200);
    }
  });

  test('Página 404 funciona corretamente', async ({ page }) => {
    const response = await page.goto('/pagina-que-nao-existe-123');
    
    // Deve retornar 404
    expect(response?.status()).toBe(404);
    
    // Deve mostrar página de erro customizada
    await expect(page.locator('.error-page, .error-container, h1')).toBeVisible();
  });
});
