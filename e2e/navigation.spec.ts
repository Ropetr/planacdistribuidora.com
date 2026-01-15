import { test, expect } from '@playwright/test';

test.describe('Navegação', () => {
  
  test('Menu desktop funciona', async ({ page }) => {
    // Usar viewport desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Menu desktop deve estar visível
    await expect(page.locator('.nav-desktop')).toBeVisible();
    
    // Hamburger deve estar escondido
    await expect(page.locator('.hamburger')).not.toBeVisible();
  });

  test('Menu mobile aparece em telas pequenas', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Menu desktop deve estar escondido
    await expect(page.locator('.nav-desktop')).not.toBeVisible();
    
    // Hamburger deve estar visível
    await expect(page.locator('.hamburger')).toBeVisible();
  });

  test('Menu mobile abre ao clicar no hamburger', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Menu mobile inicialmente fechado
    await expect(page.locator('.nav-mobile')).not.toBeVisible();
    
    // Clicar no hamburger
    await page.locator('.hamburger').click();
    
    // Menu mobile deve abrir
    await expect(page.locator('.nav-mobile')).toBeVisible();
  });

  test('Dropdown de produtos funciona no desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Hover no dropdown de Drywall
    const dropdown = page.locator('.nav-dropdown').first();
    await dropdown.hover();
    
    // Menu dropdown deve aparecer
    await expect(dropdown.locator('.dropdown-menu')).toBeVisible();
  });

  test('Links de navegação funcionam', async ({ page }) => {
    await page.goto('/');
    
    // Clicar no link da DeWalt (pode estar no dropdown ou direto)
    const dewaltLink = page.locator('a[href*="dewalt"]').first();
    await dewaltLink.click();
    
    // Deve navegar para a página DeWalt
    await expect(page).toHaveURL(/dewalt/);
  });

  test('Logo navega para home', async ({ page }) => {
    await page.goto('/dewalt');
    
    // Clicar na logo
    await page.locator('.logo').click();
    
    // Deve voltar para home
    await expect(page).toHaveURL('/');
  });

  test('Breadcrumb funciona', async ({ page }) => {
    await page.goto('/dewalt');
    
    // Breadcrumb deve existir
    const breadcrumb = page.locator('.breadcrumb');
    await expect(breadcrumb).toBeVisible();
    
    // Link para home no breadcrumb
    const homeLink = breadcrumb.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
  });

  test('Footer links funcionam', async ({ page }) => {
    await page.goto('/');
    
    // Scroll até o footer
    await page.locator('.footer').scrollIntoViewIfNeeded();
    
    // Footer deve estar visível
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('WhatsApp link tem número correto', async ({ page }) => {
    await page.goto('/dewalt');
    
    // Encontrar link do WhatsApp
    const whatsappLink = page.locator('a[href*="whatsapp"]').first();
    
    // Verificar que tem o número correto
    await expect(whatsappLink).toHaveAttribute('href', /5543984182582/);
  });

  test('Skip link funciona para acessibilidade', async ({ page }) => {
    await page.goto('/');
    
    // Pressionar Tab para focar no skip link
    await page.keyboard.press('Tab');
    
    // Skip link deve ficar visível quando focado
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();
  });
});
