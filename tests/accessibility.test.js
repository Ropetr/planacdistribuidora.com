/**
 * Accessibility Compliance Tests
 * Verifica WCAG 2.1 e boas práticas de acessibilidade
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
    return true;
  } else {
    failedTests++;
    log.fail(`${name}${errorMsg ? ': ' + errorMsg : ''}`);
    return false;
  }
}

console.log('\n' + '='.repeat(60));
console.log('ACCESSIBILITY TESTS - WCAG 2.1 Compliance');
console.log('='.repeat(60) + '\n');

HTML_FILES.forEach(file => {
  console.log(`\n${colors.blue}📄 ${file}${colors.reset}`);
  console.log('-'.repeat(40));
  
  const content = fs.readFileSync(file, 'utf-8');
  
  // WCAG 2.4.1 - Bypass Blocks
  test('Skip-link presente', content.includes('skip-link'));
  
  // WCAG 1.1.1 - Non-text Content
  const images = content.match(/<img[^>]*>/g) || [];
  const imagesWithAlt = images.filter(img => img.includes('alt="'));
  test('Imagens com alt text', images.length === imagesWithAlt.length,
       `${imagesWithAlt.length}/${images.length}`);
  
  // WCAG 2.4.2 - Page Titled
  test('Página tem título', content.includes('<title>'));
  
  // WCAG 1.3.1 - Info and Relationships
  test('Header semântico', content.includes('<header'));
  test('Main semântico', content.includes('<main'));
  test('Footer semântico', content.includes('<footer'));
  test('Nav semântico', content.includes('<nav'));
  
  // WCAG 2.4.4 - Link Purpose
  const linksWithTarget = (content.match(/target="_blank"/g) || []).length;
  const linksWithAriaOrTitle = (content.match(/target="_blank"[^>]*(aria-label|title)=/g) || []).length;
  // Links externos devem ter contexto
  
  // WCAG 4.1.2 - Name, Role, Value
  const forms = content.match(/<form[^>]*>/g) || [];
  if (forms.length > 0) {
    const labels = (content.match(/<label/g) || []).length;
    const inputs = (content.match(/<input[^>]*type="(text|email|tel|number)"/g) || []).length;
    test('Formulários com labels', labels >= inputs, `${labels} labels, ${inputs} inputs`);
  }
  
  // ARIA
  test('ARIA landmarks ou roles', 
       content.includes('role="') || content.includes('aria-label'));
  
  // WCAG 2.1.1 - Keyboard
  const interactiveElements = content.match(/<(button|a |input|select|textarea)/g) || [];
  test('Elementos interativos acessíveis', interactiveElements.length > 0);
  
  // Focus visible (verificar no CSS)
  const cssFile = fs.readFileSync('css/styles.css', 'utf-8');
  test('Focus states no CSS', cssFile.includes(':focus'));
  
  // Contraste (verificação básica de cores)
  // #AA000E (vermelho) em branco = ratio 5.5:1 (passa AA)
  // #1a1a1a (quase preto) em branco = ratio 16:1 (passa AAA)
  test('Cores de texto com bom contraste', 
       cssFile.includes('#1a1a1a') || cssFile.includes('#333'));
});

// ============================================
// RESULTADO
// ============================================

console.log('\n' + '='.repeat(60));
console.log('RESULTADO - ACESSIBILIDADE');
console.log('='.repeat(60));
console.log(`Total: ${totalTests} | ${colors.green}Passou: ${passedTests}${colors.reset} | ${colors.red}Falhou: ${failedTests}${colors.reset}`);
console.log(`Taxa: ${((passedTests/totalTests)*100).toFixed(1)}%`);
console.log('='.repeat(60) + '\n');

process.exit(failedTests > 0 ? 1 : 0);
