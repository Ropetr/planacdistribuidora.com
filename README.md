# Planac Distribuidora - Site Institucional

## Visao Geral

Site institucional da **Planac Distribuidora** construido com **Eleventy (11ty)** SSG, hospedado no **Cloudflare Pages** com imagens via **Cloudflare Images**.

**URL:** https://planacdistribuidora.com

### Stack
- **SSG:** Eleventy 3.x (Nunjucks templates)
- **Hosting:** Cloudflare Pages
- **CDN/Images:** Cloudflare Images (AVIF/WebP automatico)
- **Analytics:** Google Tag Manager + GA4
- **Fonts:** Barlow (self-hosted, WOFF2, preloaded)

### Scores PageSpeed (06/04/2026)
| Metrica | Desktop | Mobile |
|---------|---------|--------|
| Desempenho | 97 | 85 |
| Acessibilidade | 97 | 97 |
| Praticas | 100 | 100 |
| SEO | 100 | 100 |

---

## Estrutura do Projeto

```
planacdistribuidora.com/
├── src/
│   ├── _data/
│   │   ├── site.json              # Dados empresa (telefone, endereco, FAQs)
│   │   └── products.json          # Catalogo produtos (schema.org)
│   ├── _includes/
│   │   ├── components/
│   │   │   ├── header.njk         # Menu desktop (button + ARIA) + mobile
│   │   │   ├── footer.njk         # Rodape + WhatsApp float + footer mobile
│   │   │   └── cookie-consent.njk # Banner LGPD (Consent Mode v2)
│   │   └── layouts/
│   │       └── base.njk           # Layout base (critical CSS, GTM, schema)
│   ├── css/
│   │   ├── styles.css             # CSS principal
│   │   └── cookie-consent.css     # CSS do banner cookies
│   ├── js/
│   │   ├── main.js                # JS principal (carousel, forms, tracking)
│   │   ├── main.min.js            # Versao minificada
│   │   └── cookie-consent.js      # Consent Mode v2 (defaults denied)
│   ├── assets/
│   │   ├── fonts/                 # Barlow 400-800 WOFF2
│   │   ├── img/produtos/ripado/   # PNGs sem fundo (fallback local)
│   │   ├── logo.svg               # Logo Planac
│   │   └── favicon-*.png          # Favicons
│   ├── sitemap.njk                # Sitemap gerado automaticamente no build
│   ├── robots.txt
│   ├── _headers                   # Security headers + cache Cloudflare
│   ├── _redirects                 # Redirects 301 de URLs antigas
│   ├── index.njk                  # Homepage
│   └── [16 paginas produto].njk   # Paginas de produto
├── dist/                          # Output do build (deploy)
├── eleventy.config.js             # Config Eleventy (filters, schema, passthrough)
├── package.json
├── wrangler.toml                  # Config Cloudflare Pages
└── Tokens.md                      # API keys (NAO commitar - no .gitignore)
```

---

## Paginas do Site

| Pagina | Arquivo | URL |
|--------|---------|-----|
| Home | index.njk | / |
| Painel Ripado PVC | painel-ripado-pvc.njk | /painel-ripado-pvc/ |
| Forro Vinilico REVID | forro-vinilico.njk | /forro-vinilico/ |
| Forro de Gesso | forro-gesso.njk | /forro-gesso/ |
| PVC Branco | pvc-branco.njk | /pvc-branco/ |
| PVC Amadeirado | pvc-amadeirado.njk | /pvc-amadeirado/ |
| Forro Mineral | forro-mineral.njk | /forro-mineral/ |
| Forro Boreal | forro-boreal.njk | /forro-boreal/ |
| Forro Isopor | forro-isopor.njk | /forro-isopor/ |
| Divisoria Escritorio | divisoria-escritorio.njk | /divisoria-escritorio/ |
| Divisoria Drywall | divisoria-drywall.njk | /divisoria-drywall/ |
| Paredes Drywall | paredes-drywall.njk | /paredes-drywall/ |
| Manta Termica | manta-termica.njk | /manta-termica/ |
| La de Vidro | la-de-vidro.njk | /la-de-vidro/ |
| La de Rocha | la-de-rocha.njk | /la-de-rocha/ |
| La de PET | la-de-pet.njk | /la-de-pet/ |
| Dewalt | dewalt.njk | /dewalt/ |
| Privacidade | privacidade.njk | /privacidade/ |
| 404 | 404.njk | /404 |

---

## Imagens

Todas as imagens de produto sao servidas via **Cloudflare Images**:
- URL base: `https://imagedelivery.net/XawtofIFluGyh9zwRP6h6A/`
- Conversao automatica AVIF/WebP
- Cache CDN global
- IDs: `revid-*`, `ripado-*`, `banner-*`

**Nenhuma imagem de produto e servida localmente.** Os PNGs em `src/assets/img/produtos/ripado/` sao fallback e podem ser removidos.

---

## Animacoes

2 keyframes unificados para todo o site:
- `shimmer-slide` (transform/GPU) - cards, footer icons
- `shimmer` (background-position) - texto com gradiente (badges, setas)

---

## LGPD / Consent Mode

- **Defaults:** `denied` para tudo (base.njk)
- **cookie-consent.js:** so faz `gtag('consent', 'update', 'granted')` apos aceite
- **Banner:** aparece apos 4s (nao interfere com LCP do Lighthouse)
- **Checkboxes:** defaultam `false` (opt-in)

---

## WhatsApp

- URL padrao: `https://wa.me/5543984182582?text=...`
- Deep link: abre direto o app no celular
- Centralizado via `eleventy.config.js` (computed data `whatsappUrl`)
- Formulario de orcamento: `handleProjectSubmit(event, productName)` em `main.js`

---

## Headers de Seguranca (_headers)

- `Strict-Transport-Security` (HSTS 1 ano)
- `Content-Security-Policy` (script-src, connect-src, frame-src com Google Ads)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, mic, geo desabilitados)
- `Cross-Origin-Opener-Policy: same-origin`

### Cache
| Recurso | TTL |
|---------|-----|
| HTML | 2h + stale-while-revalidate 7d |
| CSS/JS/Fonts | 1 ano (immutable) |
| Imagens | 1 ano (immutable) |
| Sitemap/Robots | 1 dia |

---

## Comandos

```bash
npm install          # Instalar dependencias
npm run build        # Gerar HTML em dist/
npm run start        # Dev server (localhost:8080)
npm run build:css    # Minificar CSS
```

### Deploy
```bash
npx wrangler pages deploy dist --project-name=planacdistribuidora-com
```

### Purge Cache
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---

## Workflow de Deploy

1. Criar branch a partir de `dev`
2. Fazer alteracoes + commit
3. PR para `dev` (testes automaticos rodam)
4. Merge PR
5. Merge `dev` -> `main`
6. Deploy: `npx wrangler pages deploy dist`
7. Purge cache Cloudflare

---

## Historico

| Data | PR | Alteracao |
|------|-----|-----------|
| 06/04/2026 | #89-90 | Sitemap automatico, limpeza 8MB imagens orfas, fix carrosseis |
| 06/04/2026 | #88 | Menu desktop acessivel (button+ARIA), titulos SEO otimizados |
| 06/04/2026 | #87 | JS cleanup: handleProjectSubmit centralizado, -1043 linhas |
| 06/04/2026 | #86 | LGPD consent denied, WhatsApp ?text=, ratings falsos removidos |
| 06/04/2026 | #82-85 | CSP Google Ads, cookie banner delay 4s, bot detection |
| 06/04/2026 | #80-81 | Shimmer GPU (2 keyframes), WhatsApp wa.me deep link |
| 06/04/2026 | #78-79 | PageSpeed otimizacoes (CLS, thread principal, cache, LCP) |
| 06/04/2026 | #76-77 | Catalogo REVID 26 cores + Cloudflare Images AVIF/WebP |
| 04/02/2026 | - | Limpeza repo (~81MB), migracao Cloudflare Images |
| 13/01/2026 | - | Migracao para Eleventy SSG |

---

**Planac Distribuidora** - Londrina/PR
