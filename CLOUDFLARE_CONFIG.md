# Configuração Cloudflare Pro - Planac Distribuidora

## Configurações Recomendadas para Máxima Performance

### 1. Speed > Optimization

#### Auto Minify
- [x] JavaScript
- [x] CSS
- [x] HTML

#### Polish (Pro)
- **Modo:** Lossy
- **WebP:** Ativado
- Isso otimiza automaticamente todas as imagens servidas pelo Cloudflare

#### Mirage (Pro)
- [x] Ativado
- Otimiza carregamento de imagens em conexões lentas e mobile

#### Early Hints
- [x] Ativado
- Envia hints de preload antes do HTML completo

#### Rocket Loader
- [ ] Desativado (pode conflitar com GTM)
- Se ativar, testar bem o tracking do GA4

### 2. Caching > Configuration

#### Browser Cache TTL
- **Valor:** Respect Existing Headers
- Os headers já estão configurados no arquivo `_headers`

#### Caching Level
- **Valor:** Standard

#### Always Online
- [x] Ativado

### 3. Caching > Tiered Cache

#### Tiered Cache (Pro)
- [x] Smart Tiered Cache Topology
- Reduz requests ao servidor de origem

### 4. Speed > Optimization > Protocol Optimization

#### HTTP/2
- [x] Ativado (automático)

#### HTTP/3 (QUIC)
- [x] Ativado
- Melhora performance em mobile

#### 0-RTT Connection Resumption
- [x] Ativado

### 5. SSL/TLS

#### SSL Mode
- **Valor:** Full (strict)

#### Always Use HTTPS
- [x] Ativado

#### Minimum TLS Version
- **Valor:** TLS 1.2

#### TLS 1.3
- [x] Ativado

### 6. Security > WAF (Pro)

#### Managed Rules
- [x] Cloudflare Managed Ruleset
- [x] OWASP Core Ruleset (sensibilidade média)

#### Rate Limiting (Pro)
Criar regra para proteção contra bots:
- **URL:** `*planacdistribuidora.com/*`
- **Requests:** 100 por minuto
- **Ação:** Challenge

### 7. Page Rules (3 disponíveis no Pro)

#### Regra 1: Cache Everything para assets
```
URL: *planacdistribuidora.com/assets/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 year
```

#### Regra 2: Bypass cache para HTML dinâmico (se necessário)
```
URL: *planacdistribuidora.com/*.html
Settings:
- Cache Level: Standard
- Edge Cache TTL: 2 hours
```

#### Regra 3: Forçar HTTPS
```
URL: http://*planacdistribuidora.com/*
Settings:
- Always Use HTTPS: On
```

### 8. DNS

#### Proxied Records
- Todos os registros A e CNAME devem estar com proxy ativado (nuvem laranja)

### 9. Analytics

#### Web Analytics
- [x] Ativado (complementa o GA4)

---

## Add-ons Recomendados (Pagos)

### Argo Smart Routing (~$5/mês)
- Reduz latência em 30%+ usando rotas otimizadas
- **Altamente recomendado** para sites com audiência nacional

### Load Balancing (se tiver múltiplos servidores)
- Não necessário para sites estáticos no Cloudflare Pages

### APO for WordPress
- **Não aplicável** (site é HTML estático)

---

## Verificação de Performance

Após configurar, testar com:
1. [PageSpeed Insights](https://pagespeed.web.dev/)
2. [GTmetrix](https://gtmetrix.com/)
3. [WebPageTest](https://www.webpagetest.org/)

### Métricas Esperadas
- **LCP:** < 2.5s
- **FID/INP:** < 100ms
- **CLS:** < 0.1
- **FCP:** < 1.8s
- **TTFB:** < 200ms (com Cloudflare)

---

## Troubleshooting

### Se o GTM não funcionar
1. Verificar se Rocket Loader está desativado
2. Adicionar exceção no WAF para scripts do Google

### Se imagens não carregarem
1. Verificar se Polish está configurado corretamente
2. Testar com Polish desativado temporariamente

### Se o site estiver lento
1. Verificar se o proxy está ativado no DNS
2. Verificar se Argo está ativado (se contratado)
3. Limpar cache do Cloudflare
