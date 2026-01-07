/**
 * Performance Tests
 * Verifica Core Web Vitals e otimizações PageSpeed
 */

const fs = require('fs');
const path = require('path');

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

const HTML_FILES = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, condition, errorMsg = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    log.pass(name);
  } else {
    failedTests++;
    log.fail(`${name}${errorMsg ? ': ' + errorMsg : ''}`);
  }
}

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

console.log('\n' + '='.repeat(60));
console.log('PERFORMANCE TESTS - Core Web Vitals & PageSpeed');
console.log('='.repeat(60) + '\n');

// ============================================
// TESTES DE ASSETS
// ============================================

console.log(`${colors.blue}📦 ANÁLISE DE ASSETS${colors.reset}`);
console.log('-'.repeat(40));

// CSS
const cssSize = getFileSize('css/styles.css');
test('CSS < 50KB', cssSize < 50 * 1024, `atual: ${formatBytes(cssSize)}`);
log.info(`CSS total: ${formatBytes(cssSize)}`);

// JS
const jsSize = getFileSize('js/main.js');
test('JS < 50KB', jsSize < 50 * 1024, `atual: ${formatBytes(jsSize)}`);
log.info(`JS total: ${formatBytes(jsSize)}`);

// Imagens
const assetFiles = fs.readdirSync('assets').filter(f => 
  f.endsWith('.avif') || f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png')
);

let totalImageSize = 0;
let largeImages = [];

assetFiles.forEach(img => {
  const size = getFileSize(`assets/${img}`);
  totalImageSize += size;
  if (size > 200 * 1024) {
    largeImages.push({ name: img, size });
  }
});

test('Imagens em formato AVIF', 
     assetFiles.filter(f => f.endsWith('.avif')).length > 0);

test('Nenhuma imagem > 200KB', 
     largeImages.length === 0,
     largeImages.map(i => `${i.name}: ${formatBytes(i.size)}`).join(', '));

log.info(`Total de imagens: ${formatBytes(totalImageSize)}`);

// Fontes
const fontFiles = fs.existsSync('assets/fonts') 
  ? fs.readdirSync('assets/fonts').filter(f => f.endsWith('.woff2'))
  : [];
test('Fontes em WOFF2', fontFiles.length > 0);

let totalFontSize = 0;
fontFiles.forEach(font => {
  totalFontSize += getFileSize(`assets/fonts/${font}`);
});
log.info(`Total de fontes: ${formatBytes(totalFontSize)}`);

// ============================================
// TESTES POR PÁGINA
// ============================================

console.log(`\n${colors.blue}📄 ANÁLISE POR PÁGINA${colors.reset}`);
console.log('-'.repeat(40));

HTML_FILES.forEach(file => {
  console.log(`\n${colors.yellow}${file}${colors.reset}`);
  
  const content = fs.readFileSync(file, 'utf-8');
  const htmlSize = Buffer.byteLength(content, 'utf-8');
  
  // Tamanho HTML
  test('HTML < 100KB', htmlSize < 100 * 1024, formatBytes(htmlSize));
  
  // LCP - Preload de imagem hero
  if (file === 'index.html') {
    test('Preload de hero image', content.includes('preload') && content.includes('hero'));
  }
  
  // CLS - Dimensões de imagens
  const imagesWithDimensions = (content.match(/<img[^>]+width="[^"]+"[^>]+height="[^"]+"/g) || []).length;
  const totalImages = (content.match(/<img/g) || []).length;
  test('Imagens com width/height', 
       imagesWithDimensions >= totalImages - 1, // tolerância de 1
       `${imagesWithDimensions}/${totalImages}`);
  
  // FID - Scripts com defer/async
  const scriptsTotal = (content.match(/<script[^>]*src=/g) || []).length;
  const scriptsDefer = (content.match(/<script[^>]*(defer|async)/g) || []).length;
  test('Scripts com defer/async', scriptsDefer >= scriptsTotal - 1,
       `${scriptsDefer}/${scriptsTotal}`);
  
  // CSS não bloqueante
  test('CSS com media hack ou preload', 
       content.includes('media="print"') || content.includes('rel="preload"'));
  
  // Fontes com preload
  test('Fontes com preload', content.includes('preload') && content.includes('font'));
});

// ============================================
// HEADERS DE CACHE
// ============================================

console.log(`\n${colors.blue}🔧 HEADERS DE CACHE${colors.reset}`);
console.log('-'.repeat(40));

if (fs.existsSync('_headers')) {
  const headers = fs.readFileSync('_headers', 'utf-8');
  test('Cache de assets estáticos', headers.includes('max-age=31536000'));
  test('Cache de HTML', headers.includes('max-age=3600') || headers.includes('/*.html'));
  test('Cache immutable para assets', headers.includes('immutable'));
} else {
  test('_headers existe', false);
}

// ============================================
// RESULTADO
// ============================================

console.log('\n' + '='.repeat(60));
console.log('RESULTADO - PERFORMANCE');
console.log('='.repeat(60));

const totalWeight = cssSize + jsSize + totalImageSize + totalFontSize;
log.info(`Peso total estimado: ${formatBytes(totalWeight)}`);

console.log(`Total: ${totalTests} | ${colors.green}Passou: ${passedTests}${colors.reset} | ${colors.red}Falhou: ${failedTests}${colors.reset}`);
console.log(`Taxa: ${((passedTests/totalTests)*100).toFixed(1)}%`);
console.log('='.repeat(60) + '\n');

process.exit(failedTests > 0 ? 1 : 0);
