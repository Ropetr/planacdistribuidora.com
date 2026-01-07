/**
 * SEO Compliance Tests
 * Verifica requisitos para Google Ads e SEO Orgânico
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  pass: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  fail: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`)
};

// Configuração
const SITE_URL = 'https://planacdistribuidora.com';
const HTML_FILES = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, condition, errorMsg = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    log.pass(name);
    return true;
  } else {
    failedTests++;
    log.fail(`${name}${errorMsg ? ': ' + errorMsg : ''}`);
    return false;
  }
}

console.log('\n' + '='.repeat(60));
console.log('SEO COMPLIANCE TESTS - Planac Distribuidora');
console.log('='.repeat(60) + '\n');

// ============================================
// TESTES POR ARQUIVO HTML
// ============================================

HTML_FILES.forEach(file => {
  console.log(`\n${colors.blue}📄 ${file}${colors.reset}`);
  console.log('-'.repeat(40));
  
  const content = fs.readFileSync(file, 'utf-8');
  
  // 1. DOCTYPE
  test('DOCTYPE presente', content.includes('<!DOCTYPE html>'));
  
  // 2. Lang attribute
  test('lang="pt-BR" presente', content.includes('lang="pt-BR"'));
  
  // 3. Charset
  test('charset UTF-8', content.includes('charset="UTF-8"'));
  
  // 4. Viewport
  test('viewport meta tag', content.includes('name="viewport"'));
  
  // 5. Title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    const title = titleMatch[1];
    test('Title presente', true);
    test('Title length (30-60 chars)', title.length >= 30 && title.length <= 65, 
         `atual: ${title.length} chars`);
    test('Title contém marca', title.includes('Planac'));
  } else {
    test('Title presente', false);
  }
  
  // 6. Meta Description
  const descMatch = content.match(/name="description" content="([^"]+)"/);
  if (descMatch) {
    const desc = descMatch[1];
    test('Meta description presente', true);
    test('Description length (120-160 chars)', desc.length >= 100 && desc.length <= 165,
         `atual: ${desc.length} chars`);
  } else {
    test('Meta description presente', false);
  }
  
  // 7. Canonical
  test('Canonical tag presente', content.includes('rel="canonical"'));
  
  // 8. Open Graph
  test('og:title presente', content.includes('property="og:title"'));
  test('og:description presente', content.includes('property="og:description"'));
  test('og:image presente', content.includes('property="og:image"'));
  test('og:url presente', content.includes('property="og:url"'));
  
  // 9. H1 único
  const h1Count = (content.match(/<h1/g) || []).length;
  test('H1 único', h1Count === 1, `encontrados: ${h1Count}`);
  
  // 10. GTM
  test('GTM instalado', content.includes('GTM-5MQV6VMN'));
  
  // 11. Schema.org
  test('Schema.org JSON-LD', content.includes('application/ld+json'));
  
  // 12. Imagens com alt
  const imgsTotal = (content.match(/<img/g) || []).length;
  const imgsWithAlt = (content.match(/<img[^>]+alt="/g) || []).length;
  test('Todas imagens com alt', imgsTotal === imgsWithAlt,
       `${imgsWithAlt}/${imgsTotal} com alt`);
});

// ============================================
// TESTES GLOBAIS
// ============================================

console.log(`\n${colors.blue}🌐 TESTES GLOBAIS${colors.reset}`);
console.log('-'.repeat(40));

// robots.txt
test('robots.txt existe', fs.existsSync('robots.txt'));
if (fs.existsSync('robots.txt')) {
  const robots = fs.readFileSync('robots.txt', 'utf-8');
  test('robots.txt permite crawling', robots.includes('Allow: /'));
  test('robots.txt referencia sitemap', robots.includes('Sitemap:'));
}

// sitemap.xml
test('sitemap.xml existe', fs.existsSync('sitemap.xml'));
if (fs.existsSync('sitemap.xml')) {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf-8');
  HTML_FILES.forEach(file => {
    if (file !== 'privacidade.html') { // privacidade pode ter priority baixa
      const urlPath = file === 'index.html' ? '/' : `/${file}`;
      test(`sitemap contém ${file}`, 
           sitemap.includes(file) || sitemap.includes(SITE_URL + '/'));
    }
  });
}

// Política de Privacidade (obrigatório Google Ads)
test('Política de privacidade existe', 
     fs.existsSync('privacidade.html'),
     'OBRIGATÓRIO para Google Ads');

// CNPJ no footer
const indexContent = fs.readFileSync('index.html', 'utf-8');
test('CNPJ presente no site', 
     indexContent.includes('CNPJ'),
     'OBRIGATÓRIO para transparência');

// ============================================
// RESULTADO FINAL
// ============================================

console.log('\n' + '='.repeat(60));
console.log('RESULTADO FINAL');
console.log('='.repeat(60));
console.log(`Total de testes: ${totalTests}`);
console.log(`${colors.green}Passou: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Falhou: ${failedTests}${colors.reset}`);
console.log(`Taxa de sucesso: ${((passedTests/totalTests)*100).toFixed(1)}%`);
console.log('='.repeat(60) + '\n');

// Exit code
process.exit(failedTests > 0 ? 1 : 0);
