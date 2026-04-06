module.exports = function(eleventyConfig) {
    // Computed data - processa ANTES do template
    eleventyConfig.addGlobalData("eleventyComputed", {
        whatsappUrl: function(data) {
            const phone = "5543984182582";
            let message = "Olá, tudo bem? Preciso de um orçamento";
            if (data.productName) {
                message += " de " + data.productName;
            }
            message += ". Pode me auxiliar?";
            return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        },
        
        // Gera Schema BreadcrumbList automaticamente
        schemaBreadcrumb: function(data) {
            if (!data.products || !data.page || !data.page.fileSlug) return null;
            
            const slug = data.page.fileSlug;
            const product = data.products[slug];
            
            if (!product) return null;
            
            const siteUrl = data.site?.url || "https://planacdistribuidora.com";
            const pageUrl = (data.page.url || "").replace(/\.html$/, "");
            
            const schema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Início",
                        "item": siteUrl + "/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": product.category,
                        "item": siteUrl + "/#" + product.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": product.breadcrumbName
                    }
                ]
            };
            
            return JSON.stringify(schema, null, 2);
        },
        
        // Gera Schema Product automaticamente
        // NOTA: Usa formato "Product Snippets" (sem offers/price) conforme
        // Google Search Central — adequado para distribuidoras com orçamento
        // personalizado que não vendem diretamente online.
        // Ref: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
        schemaProduct: function(data) {
            if (!data.products || !data.page || !data.page.fileSlug) return null;
            
            const slug = data.page.fileSlug;
            const product = data.products[slug];
            
            if (!product) return null;
            
            const siteUrl = data.site?.url || "https://planacdistribuidora.com";
            const pageUrl = (data.page.url || "").replace(/\.html$/, "");
            
            let schema;
            
            if (product.type === "collection" && Array.isArray(product.items)) {
                // Página de coleção (ex: DeWalt) → ItemList
                schema = {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "name": product.name,
                    "description": product.description,
                    "url": siteUrl + pageUrl,
                    "numberOfItems": product.items.length,
                    "itemListElement": product.items.map(function(item, index) {
                        return {
                            "@type": "ListItem",
                            "position": index + 1,
                            "name": item.name,
                            "description": item.description,
                            "url": siteUrl + pageUrl
                        };
                    })
                };
            } else {
                // Página de produto único → Product Snippet
                // Sem offers/price: válido para distribuidoras com orçamento personalizado
                // Ref: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
                schema = {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "image": product.image,
                    "brand": {
                        "@type": "Brand",
                        "name": product.brand
                    },
                    "category": product.category,
                    "url": siteUrl + pageUrl,
                    "manufacturer": {
                        "@type": "Organization",
                        "name": product.brand
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": product.ratingValue,
                        "reviewCount": product.reviewCount,
                        "bestRating": "5",
                        "worstRating": "1"
                    }
                };
            }
            
            return JSON.stringify(schema, null, 2);
        }
    });
    
    // Filtro para URL encoding (mantido para outros usos)
    eleventyConfig.addFilter("urlencode", function(str) {
        if (!str) return "";
        return encodeURIComponent(str);
    });
    
    // Filtro para data atual do build (usado no sitemap)
    eleventyConfig.addFilter("today", function() {
        return new Date().toISOString().split('T')[0];
    });

    // Filtro para remover .html das URLs (Pretty URLs)
    // Cloudflare Pages remove .html automaticamente, então canonical deve refletir isso
    eleventyConfig.addFilter("prettyUrl", function(url) {
        if (!url) return "/";
        // Remove .html do final da URL
        return url.replace(/\.html$/, "");
    });
    
    // Copiar arquivos estáticos
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");
    eleventyConfig.addPassthroughCopy("src/favicon-16x16.png");
    eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
    eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
    eleventyConfig.addPassthroughCopy("src/android-chrome-192x192.png");
    eleventyConfig.addPassthroughCopy("src/android-chrome-512x512.png");
    eleventyConfig.addPassthroughCopy("src/site.webmanifest");
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    // sitemap.xml agora é gerado automaticamente via src/sitemap.njk
    eleventyConfig.addPassthroughCopy("src/_headers");
    eleventyConfig.addPassthroughCopy("src/_redirects");
    
    // Configurar diretórios
    return {
        dir: {
            input: "src",
            output: "dist",
            includes: "_includes",
            layouts: "_includes/layouts",
            data: "_data"
        },
        templateFormats: ["njk", "html", "md"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};
