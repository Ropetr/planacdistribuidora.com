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

## 💾 Backup

Backup completo do repositório disponível no Google Drive:

🔗 **[Backup - Google Drive](https://drive.google.com/drive/u/0/folders/1Ky06FmeTlkGmnZpplrKVqnFJETLlin8f)**

> **Nota:** Contém versões anteriores do site, incluindo arquivos originais (.rar) e imagens fonte removidas na limpeza de 04/02/2026.

---

## 🏗️ Estrutura do Projeto

```
site-html-planac/
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

## 🖼️ Imagens

As imagens do site são servidas via **Cloudflare Images** (CDN global):
- URL base: `https://imagedelivery.net/XawtofIFluGyh9zwRP6h6A/`
- Conversão automática AVIF/WebP
- Responsivo com múltiplos tamanhos

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
| Dewalt | dewalt.njk | /dewalt |
| Paredes Drywall | paredes-drywall.njk | /paredes-drywall |
| Forro Gesso | forro-gesso.njk | /forro-gesso |
| PVC Branco | pvc-branco.njk | /pvc-branco |
| PVC Amadeirado | pvc-amadeirado.njk | /pvc-amadeirado |
| Forro Vinílico | forro-vinilico.njk | /forro-vinilico |
| Forro Mineral | forro-mineral.njk | /forro-mineral |
| Forro Boreal | forro-boreal.njk | /forro-boreal |
| Forro Isopor | forro-isopor.njk | /forro-isopor |
| Divisória Escritório | divisoria-escritorio.njk | /divisoria-escritorio |
| Divisória Drywall | divisoria-drywall.njk | /divisoria-drywall |
| Manta Térmica | manta-termica.njk | /manta-termica |
| Lã de Vidro | la-de-vidro.njk | /la-de-vidro |
| Lã de Rocha | la-de-rocha.njk | /la-de-rocha |
| Lã de PET | la-de-pet.njk | /la-de-pet |
| Privacidade | privacidade.njk | /privacidade |

---

## 📅 Histórico

| Data | Versão | Alteração |
|------|--------|-----------|
| 04/02/2026 | 2.1.0 | Limpeza do repositório (~81 MB removidos), migração completa para Cloudflare Images |
| 13/01/2026 | 2.0.0 | Migração para Eleventy SSG |

---

**Desenvolvido para Planac Distribuidora**

<!-- dev branch: deploy inicial via automação -->
