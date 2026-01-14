# Migração para Cloudflare Zaraz

## Por que migrar?

O Zaraz executa scripts de analytics **no edge da Cloudflare**, não no browser do usuário:

| Métrica | GTM Atual | Com Zaraz |
|---------|-----------|-----------|
| TBT (Total Blocking Time) | ~200ms | ~0ms |
| JavaScript no cliente | ~50KB | ~5KB |
| INP (Interaction to Next Paint) | Impactado | Não impactado |

## Configuração no Dashboard Cloudflare

### Passo 1: Acessar Zaraz

1. Login no [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Selecionar domínio **planacdistribuidora.com**
3. Menu lateral: **Zaraz** > **Tools**

### Passo 2: Adicionar Google Analytics 4

1. Clicar em **Add new tool**
2. Selecionar **Google Analytics 4**
3. Configurar:
   - **Tool name**: `GA4`
   - **Measurement ID**: (pegar do GTM atual ou criar novo no GA)
4. Em **Firing Triggers**, selecionar **Pageview**
5. Clicar **Save**

### Passo 3: Configurar Consent Mode

1. Ir em **Zaraz** > **Consent**
2. Habilitar **Consent Management**
3. Mapear as categorias:
   - Analytics → GA4
   - Marketing → (se tiver)

### Passo 4: Remover GTM do Código

Após configurar o Zaraz, remover do `src/_includes/layouts/base.njk`:

```html
<!-- REMOVER: Linhas 21-24 (dns-prefetch e preconnect do GTM) -->
<link rel="dns-prefetch" href="//www.googletagmanager.com">
<link rel="dns-prefetch" href="//www.google-analytics.com">
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>

<!-- REMOVER: Linhas 27-34 (scripts inline do GTM) -->
<script>
    window.dataLayer=window.dataLayer||[];...
</script>
<script>(function(w,d,s,l,i){...})</script>

<!-- REMOVER: Linha 240 (noscript do GTM) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=..."...</noscript>
```

### Passo 5: Atualizar CSP

No `src/_headers`, remover googletagmanager.com e google-analytics.com do CSP:

```
# ANTES
Content-Security-Policy: ... script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; ...

# DEPOIS (Zaraz injeta automaticamente)
Content-Security-Policy: ... script-src 'self' 'unsafe-inline'; ...
```

## Verificação

1. Abrir site em aba anônima
2. DevTools > Network > filtrar por "zaraz"
3. Verificar se GA4 está recebendo eventos no [Google Analytics Realtime](https://analytics.google.com)

## Rollback

Se precisar reverter:
1. Desabilitar Zaraz no Dashboard
2. Restaurar código do base.njk da versão anterior

## Referências

- [Zaraz Get Started](https://developers.cloudflare.com/zaraz/get-started/)
- [Zaraz + GA4](https://developers.cloudflare.com/zaraz/get-started/add-tool/)
- [Zaraz FAQ](https://developers.cloudflare.com/zaraz/faq/)

