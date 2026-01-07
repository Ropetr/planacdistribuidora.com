#!/usr/bin/env node

/**
 * Full Site Audit Script
 * Executa todos os testes e gera relatório consolidado
 */

const { execSync } = require('child_process');
const fs = require('fs');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

console.log(`
${colors.cyan}${colors.bold}
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🔍 AUDITORIA COMPLETA - PLANAC DISTRIBUIDORA            ║
║                                                               ║
║     SEO • Google Ads • PageSpeed • Acessibilidade            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}
`);

const tests = [
  { name: 'SEO Compliance', file: 'tests/seo-compliance.test.js', icon: '🔍' },
  { name: 'Acessibilidade', file: 'tests/accessibility.test.js', icon: '♿' },
  { name: 'Performance', file: 'tests/performance.test.js', icon: '⚡' },
  { name: 'Segurança', file: 'tests/security.test.js', icon: '🔒' },
  { name: 'Google Ads', file: 'tests/google-ads-compliance.test.js', icon: '📢' },
];

const results = [];
let totalPassed = 0;
let totalFailed = 0;

tests.forEach(test => {
  console.log(`\n${colors.magenta}${test.icon} Executando: ${test.name}${colors.reset}\n`);
  
  try {
    const output = execSync(`node ${test.file}`, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(output);
    results.push({ name: test.name, status: 'PASSOU', icon: '✅' });
    totalPassed++;
  } catch (error) {
    console.log(error.stdout || '');
    console.log(error.stderr || '');
    results.push({ name: test.name, status: 'FALHOU', icon: '❌' });
    totalFailed++;
  }
});

// Resumo Final
console.log(`
${colors.cyan}${colors.bold}
╔═══════════════════════════════════════════════════════════════╗
║                    RESUMO DA AUDITORIA                        ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}
`);

results.forEach(r => {
  const color = r.status === 'PASSOU' ? colors.green : colors.red;
  console.log(`  ${r.icon} ${r.name}: ${color}${r.status}${colors.reset}`);
});

console.log(`
${colors.bold}──────────────────────────────────────────────────────────────${colors.reset}
  Total de suítes: ${tests.length}
  ${colors.green}Passou: ${totalPassed}${colors.reset}
  ${colors.red}Falhou: ${totalFailed}${colors.reset}
  
  Taxa de sucesso: ${((totalPassed/tests.length)*100).toFixed(0)}%
${colors.bold}──────────────────────────────────────────────────────────────${colors.reset}
`);

if (totalFailed === 0) {
  console.log(`${colors.green}${colors.bold}
  🎉 SITE 100% COMPLIANT!
  
  Pronto para:
  ✓ Google Ads
  ✓ SEO Orgânico
  ✓ PageSpeed Insights
  ✓ Acessibilidade
${colors.reset}`);
} else {
  console.log(`${colors.yellow}${colors.bold}
  ⚠️  Corrija os problemas acima antes de prosseguir.
  
  Execute cada teste individualmente para ver detalhes:
  $ node tests/seo-compliance.test.js
  $ node tests/accessibility.test.js
  $ node tests/performance.test.js
  $ node tests/security.test.js
  $ node tests/google-ads-compliance.test.js
${colors.reset}`);
}

// Gerar relatório em arquivo
const reportDate = new Date().toISOString().split('T')[0];
const report = {
  date: new Date().toISOString(),
  site: 'planacdistribuidora.com',
  results,
  summary: {
    total: tests.length,
    passed: totalPassed,
    failed: totalFailed,
    rate: ((totalPassed/tests.length)*100).toFixed(1) + '%'
  }
};

fs.writeFileSync(`audit-report-${reportDate}.json`, JSON.stringify(report, null, 2));
console.log(`\n📄 Relatório salvo em: audit-report-${reportDate}.json\n`);

process.exit(totalFailed > 0 ? 1 : 0);
