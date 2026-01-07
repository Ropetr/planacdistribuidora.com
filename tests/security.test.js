/**
 * Security Tests
 * Verifica vulnerabilidades e boas práticas de segurança
 */

const fs = require('fs');

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
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
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

console.log('\n' + '='.repeat(60));
console.log('SECURITY TESTS');
console.log('='.repeat(60) + '\n');

// ============================================
// TESTES POR ARQUIVO
// ============================================

HTML_FILES.forEach(file => {
  console.log(`\n${colors.blue}📄 ${file}${colors.reset}`);
  console.log('-'.repeat(40));
  
  const content = fs.readFileSync(file, 'utf-8');
  
  // Links externos com noopener noreferrer (previne tabnabbing)
  const externalLinks = content.match(/target="_blank"/g) || [];
  const safeLinks = content.match(/target="_blank"[^>]*rel="[^"]*noopener/g) || [];
  test('Links externos seguros (noopener)', 
       externalLinks.length === safeLinks.length,
       `${safeLinks.length}/${externalLinks.length} com noopener`);
  
  // Sem links HTTP (mixed content)
  const httpLinks = content.match(/href="http:\/\//g) || [];
  test('Sem links HTTP inseguros', httpLinks.length === 0,
       `${httpLinks.length} links HTTP encontrados`);
  
  // Sem imagens HTTP
  const httpImages = content.match(/src="http:\/\//g) || [];
  test('Sem imagens HTTP', httpImages.length === 0,
       `${httpImages.length} imagens HTTP`);
  
  // Formulários seguros
  const forms = content.match(/<form[^>]*>/g) || [];
  forms.forEach((form, i) => {
    // Verificar se action não aponta para HTTP
    const hasHttpAction = form.includes('action="http://');
    test(`Form ${i+1} sem action HTTP`, !hasHttpAction);
  });
  
  // Sem inline event handlers (XSS prevention)
  const inlineHandlers = content.match(/on(click|load|error|mouseover)="/gi) || [];
  // Permitimos alguns casos específicos como onclick no hamburger
  test('Mínimo de inline handlers', inlineHandlers.length <= 2,
       `${inlineHandlers.length} handlers inline`);
  
  // Verificar se não há dados sensíveis expostos
  test('Sem emails expostos em texto', 
       !content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/));
  
  // CSP Meta tag (opcional mas recomendado)
  // test('Content Security Policy', content.includes('Content-Security-Policy'));
});

// ============================================
// HEADERS DE SEGURANÇA
// ============================================

console.log(`\n${colors.blue}🔒 HEADERS DE SEGURANÇA${colors.reset}`);
console.log('-'.repeat(40));

if (fs.existsSync('_headers')) {
  const headers = fs.readFileSync('_headers', 'utf-8');
  
  // Verificar headers de segurança
  log.warn('Headers de segurança recomendados (verificar no Cloudflare):');
  console.log('  - X-Frame-Options: DENY');
  console.log('  - X-Content-Type-Options: nosniff');
  console.log('  - Referrer-Policy: strict-origin-when-cross-origin');
  console.log('  - Permissions-Policy: geolocation=(), microphone=()');
}

// ============================================
// RESULTADO
// ============================================

console.log('\n' + '='.repeat(60));
console.log('RESULTADO - SEGURANÇA');
console.log('='.repeat(60));
console.log(`Total: ${totalTests} | ${colors.green}Passou: ${passedTests}${colors.reset} | ${colors.red}Falhou: ${failedTests}${colors.reset}`);
console.log(`Taxa: ${((passedTests/totalTests)*100).toFixed(1)}%`);
console.log('='.repeat(60) + '\n');

process.exit(failedTests > 0 ? 1 : 0);
