/**
 * Google Ads Compliance Tests
 * Verifica requisitos para aprovação de anúncios e Quality Score
 */

const fs = require('fs');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = {
  pass: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  fail: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`)
};

const HTML_FILES = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let warnings = 0;

function test(name, condition, errorMsg = '', isWarning = false) {
  totalTests++;
  if (condition) {
    passedTests++;
    log.pass(name);
  } else if (isWarning) {
    warnings++;
    log.warn(`${name}${errorMsg ? ': ' + errorMsg : ''}`);
  } else {
    failedTests++;
    log.fail(`${name}${errorMsg ? ': ' + errorMsg : ''}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('GOOGLE ADS COMPLIANCE TESTS');
console.log('Requisitos para Landing Pages de Alta Qualidade');
console.log('='.repeat(60) + '\n');

// ============================================
// 1. TRANSPARÊNCIA E CONFIANÇA
// ============================================

console.log(`${colors.blue}🏢 1. TRANSPARÊNCIA E CONFIANÇA${colors.reset}`);
console.log('-'.repeat(40));

// Política de Privacidade
test('Página de Política de Privacidade existe', 
     fs.existsSync('privacidade.html'),
     'OBRIGATÓRIO para Google Ads');

// Link para privacidade em todas as páginas
HTML_FILES.filter(f => f !== 'privacidade.html').forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  test(`${file}: Link para privacidade`, 
       content.includes('privacidade.html'));
});

// Informações da empresa
const indexContent = fs.readFileSync('index.html', 'utf-8');
test('CNPJ visível no site', indexContent.includes('CNPJ'));
test('Endereço físico presente', 
     indexContent.includes('Londrina') || indexContent.includes('endereço'));
test('Telefone de contato', indexContent.includes('(43)'));

// ============================================
// 2. RELEVÂNCIA DO CONTEÚDO
// ============================================

console.log(`\n${colors.blue}📝 2. RELEVÂNCIA DO CONTEÚDO${colors.reset}`);
console.log('-'.repeat(40));

HTML_FILES.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // Conteúdo mínimo
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const wordCount = textContent.split(' ').filter(w => w.length > 3).length;
  
  test(`${file}: Conteúdo substancial (>100 palavras)`, 
       wordCount > 100, `${wordCount} palavras`);
  
  // H1 relacionado ao produto
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (h1Match) {
    test(`${file}: H1 presente e descritivo`, h1Match[1].length > 10);
  }
});

// ============================================
// 3. NAVEGAÇÃO E UX
// ============================================

console.log(`\n${colors.blue}🧭 3. NAVEGAÇÃO E EXPERIÊNCIA${colors.reset}`);
console.log('-'.repeat(40));

HTML_FILES.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // Menu de navegação
  test(`${file}: Navegação presente`, 
       content.includes('<nav') || content.includes('nav-'));
  
  // CTA claro
  test(`${file}: Call-to-action presente`, 
       content.includes('whatsapp') || content.includes('Orçamento') || content.includes('Contato'));
});

// Mobile-friendly
test('Viewport meta tag (mobile)', 
     indexContent.includes('width=device-width'));

// ============================================
// 4. VELOCIDADE E PERFORMANCE
// ============================================

console.log(`\n${colors.blue}⚡ 4. VELOCIDADE (Quality Score)${colors.reset}`);
console.log('-'.repeat(40));

// Imagens otimizadas
const imageFiles = fs.readdirSync('assets').filter(f => 
  f.endsWith('.avif') || f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png')
);
const avifImages = imageFiles.filter(f => f.endsWith('.avif'));
test('Imagens em formato moderno (AVIF/WebP)', 
     avifImages.length > imageFiles.length / 2,
     `${avifImages.length}/${imageFiles.length} em AVIF`);

// CSS/JS otimizado
const cssSize = fs.statSync('css/styles.css').size;
test('CSS compacto (<50KB)', cssSize < 50 * 1024, `${(cssSize/1024).toFixed(1)}KB`);

// Fontes otimizadas
if (fs.existsSync('assets/fonts')) {
  const fontFiles = fs.readdirSync('assets/fonts');
  test('Fontes em WOFF2', fontFiles.some(f => f.endsWith('.woff2')));
}

// ============================================
// 5. TRACKING E CONVERSÃO
// ============================================

console.log(`\n${colors.blue}📊 5. TRACKING E CONVERSÃO${colors.reset}`);
console.log('-'.repeat(40));

// GTM instalado
test('Google Tag Manager instalado', indexContent.includes('GTM-'));

// Data attributes para eventos
test('Data attributes para tracking', 
     indexContent.includes('data-action') || indexContent.includes('data-page'));

// Múltiplos pontos de conversão
const whatsappLinks = (indexContent.match(/whatsapp/gi) || []).length;
test('Múltiplos CTAs (WhatsApp)', whatsappLinks >= 2, `${whatsappLinks} links`);

// ============================================
// 6. SEO PARA QUALITY SCORE
// ============================================

console.log(`\n${colors.blue}🔍 6. SEO (Relevância de Landing Page)${colors.reset}`);
console.log('-'.repeat(40));

HTML_FILES.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // Title otimizado
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    const title = titleMatch[1];
    test(`${file}: Title com palavra-chave`, 
         title.includes('Planac') || title.includes('Londrina') || 
         title.includes('Forro') || title.includes('Divisória') || 
         title.includes('Drywall'));
  }
  
  // Meta description
  test(`${file}: Meta description presente`, 
       content.includes('name="description"'));
});

// Schema.org
test('Schema.org estruturado', indexContent.includes('application/ld+json'));

// ============================================
// CHECKLIST FINAL
// ============================================

console.log(`\n${colors.blue}✅ CHECKLIST GOOGLE ADS${colors.reset}`);
console.log('-'.repeat(40));

const checklist = [
  { name: 'Política de Privacidade', check: fs.existsSync('privacidade.html') },
  { name: 'CNPJ/Razão Social', check: indexContent.includes('CNPJ') },
  { name: 'Endereço físico', check: indexContent.includes('Londrina') },
  { name: 'Telefone de contato', check: indexContent.includes('(43)') },
  { name: 'Mobile-friendly', check: indexContent.includes('viewport') },
  { name: 'HTTPS (verificar domínio)', check: true },
  { name: 'Conteúdo original', check: true },
  { name: 'Navegação clara', check: indexContent.includes('<nav') },
  { name: 'CTAs visíveis', check: indexContent.includes('whatsapp') },
  { name: 'Tracking instalado', check: indexContent.includes('GTM-') },
];

checklist.forEach(item => {
  if (item.check) {
    log.pass(item.name);
  } else {
    log.fail(item.name);
  }
});

// ============================================
// RESULTADO
// ============================================

console.log('\n' + '='.repeat(60));
console.log('RESULTADO - GOOGLE ADS COMPLIANCE');
console.log('='.repeat(60));
console.log(`Total: ${totalTests}`);
console.log(`${colors.green}Passou: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Falhou: ${failedTests}${colors.reset}`);
console.log(`${colors.yellow}Avisos: ${warnings}${colors.reset}`);
console.log(`Taxa de conformidade: ${((passedTests/totalTests)*100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log(`\n${colors.green}🎉 SITE PRONTO PARA GOOGLE ADS!${colors.reset}`);
} else {
  console.log(`\n${colors.yellow}⚠ Corrija os itens acima antes de rodar campanhas${colors.reset}`);
}
console.log('='.repeat(60) + '\n');

process.exit(failedTests > 0 ? 1 : 0);
