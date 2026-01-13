# Planac Distribuidora - Site com Eleventy (SSG)

## 📋 Visão Geral

Site institucional da Planac Distribuidora migrado para **Eleventy (11ty)**, um gerador de sites estáticos recomendado pelo Google para SEO e performance.

### Benefícios da Migração

- ✅ **DRY (Don't Repeat Yourself)**: Header, footer e componentes centralizados
- ✅ **Manutenção simplificada**: Altere uma vez, aplique em todas as páginas
- ✅ **SEO otimizado**: HTML puro gerado no build (recomendado pelo Google)
- ✅ **Performance máxima**: Arquivos estáticos servidos diretamente
- ✅ **Cloudflare Pages nativo**: Deploy automático via GitHub

---

## 🏗️ Estrutura do Projeto

```
planac-eleventy/
├── src/                          # Código fonte
│   ├── _data/                    # Dados globais (JSON)
│   │   └── site.json             # Informações da empresa
│   ├── _includes/                # Componentes reutilizáveis
│   │   ├── components/
│   │   │   ├── header.njk        # Cabeçalho (menu)
│   │   │   ├── footer.njk        # Rodapé
│   │   │   └── cookie-consent.njk # Banner de cookies
│   │   └── layouts/
│   │       └── base.njk          # Layout base (HTML completo)
│   ├── css/                      # Estilos
│   ├── js/                       # Scripts
│   ├── assets/                   # Imagens e fontes
│   ├── index.njk                 # Página inicial
│   ├── dewalt.njk                # Página Dewalt
│   ├── forro-gesso.njk           # Página Forro Gesso
│   └── ... (outras páginas)
├── dist/                         # Saída do build (HTML final)
├── eleventy.config.js            # Configuração do Eleventy
├── package.json                  # Dependências Node.js
└── README.md                     # Esta documentação
```

---

## 🔧 Correções Aplicadas

### 1. Logo - Altura 60px
- **Arquivo**: `src/_includes/layouts/base.njk` (Critical CSS)
- **Arquivo**: `src/css/styles.css` e `styles.min.css`
- **Valor**: `.logo img { height: 60px; width: 180px; }`

### 2. Font-weight 500 no Menu
- **Arquivo**: `src/_includes/layouts/base.njk` (Critical CSS)
- **Valor**: `.nav-link { font-weight: 500; }`
- Aplicado automaticamente em todas as 15 páginas

### 3. Menu Corrigido (la-de-rocha.html)
- **Arquivo**: `src/_includes/components/header.njk`
- Menu de Isolamento correto:
  - Manta Térmica
  - Lã de Vidro
  - Lã de Rocha
  - Lã de PET

### 4. Schema.org openingHours
- **Arquivo**: `src/_includes/layouts/base.njk`
- Formato atualizado para `openingHoursSpecification` (Google recomendado)
- Segunda a Sexta: 08:00-18:00
- Sábado: 08:00-12:00

### 5. Links Internos
- Todos os links agora usam `/` no início (ex: `/forro-gesso.html`)
- Compatível com Cloudflare Pages

---

## 📦 Comandos

### Instalar Dependências
```bash
npm install
```

### Build (Gerar HTML)
```bash
npm run build
```

### Desenvolvimento Local
```bash
npm run start
```
Acesse: http://localhost:8080

---

## 🚀 Deploy no Cloudflare Pages

### Configuração no Dashboard Cloudflare

1. **Framework preset**: None (ou Eleventy se disponível)
2. **Build command**: `npm run build`
3. **Build output directory**: `dist`
4. **Root directory**: `/` (raiz do repositório)

### Variáveis de Ambiente
Nenhuma variável necessária.

---

## 📝 Como Editar

### Alterar Dados da Empresa
Edite `src/_data/site.json`:
```json
{
  "phone": "(43) 3028-5316",
  "whatsapp": "(43) 98418-2582",
  ...
}
```

### Alterar Header/Footer
Edite os arquivos em `src/_includes/components/`:
- `header.njk` - Menu de navegação
- `footer.njk` - Rodapé com contatos

### Alterar Layout Base
Edite `src/_includes/layouts/base.njk`:
- Meta tags SEO
- Critical CSS
- Schema.org
- Scripts

### Criar Nova Página
1. Crie arquivo `src/nova-pagina.njk`
2. Adicione frontmatter:
```yaml
---
layout: base.njk
permalink: "/nova-pagina.html"
title: "Título da Página"
description: "Descrição para SEO"
---

<section>
  <!-- Conteúdo HTML aqui -->
</section>
```

---

## 📊 Páginas do Site

| Página | Arquivo | URL |
|--------|---------|-----|
| Home | index.njk | / |
| Dewalt | dewalt.njk | /dewalt.html |
| Paredes Drywall | paredes-drywall.njk | /paredes-drywall.html |
| Forro Gesso | forro-gesso.njk | /forro-gesso.html |
| PVC Branco | pvc-branco.njk | /pvc-branco.html |
| PVC Amadeirado | pvc-amadeirado.njk | /pvc-amadeirado.html |
| Forro Vinílico | forro-vinilico.njk | /forro-vinilico.html |
| Forro Mineral | forro-mineral.njk | /forro-mineral.html |
| Divisória Escritório | divisoria-escritorio.njk | /divisoria-escritorio.html |
| Divisória Drywall | divisoria-drywall.njk | /divisoria-drywall.html |
| Manta Térmica | manta-termica.njk | /manta-termica.html |
| Lã de Vidro | la-de-vidro.njk | /la-de-vidro.html |
| Lã de Rocha | la-de-rocha.njk | /la-de-rocha.html |
| Lã de PET | la-de-pet.njk | /la-de-pet.html |
| Privacidade | privacidade.njk | /privacidade.html |

---

## ✅ Checklist de Validação

- [x] Logo 60px em todas as páginas
- [x] Font-weight 500 no menu
- [x] Menu de isolamento correto
- [x] Schema.org com horários corretos
- [x] Links internos com /
- [x] Build sem erros
- [x] 15 páginas HTML geradas
- [x] CSS/JS copiados corretamente
- [x] _redirects configurado
- [x] _headers configurado

---

## 📅 Histórico

| Data | Versão | Alteração |
|------|--------|-----------|
| 13/01/2026 | 2.0.0 | Migração para Eleventy SSG |

---

**Desenvolvido por Claude (Anthropic) para Planac Distribuidora**
