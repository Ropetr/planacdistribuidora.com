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
            return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(message)}`;
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
        schemaProduct: function(data) {
            if (!data.products || !data.page || !data.page.fileSlug) return null;
            
            const slug = data.page.fileSlug;
            const product = data.products[slug];
            
            if (!product) return null;
            
            const siteUrl = data.site?.url || "https://planacdistribuidora.com";
            const pageUrl = (data.page.url || "").replace(/\.html$/, "");
            
            const schema = {
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
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock",
                    "priceCurrency": "BRL",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "priceCurrency": "BRL"
                    },
                    "seller": {
                        "@type": "Organization",
                        "name": "Planac Distribuidora"
                    }
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": product.ratingValue,
                    "reviewCount": product.reviewCount,
                    "bestRating": "5",
                    "worstRating": "1"
                }
            };
            
            return JSON.stringify(schema, null, 2);
        }
    });
    
    // Filtro para URL encoding (mantido para outros usos)
    eleventyConfig.addFilter("urlencode", function(str) {
        if (!str) return "";
        return encodeURIComponent(str);
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
    eleventyConfig.addPassthroughCopy("src/sitemap.xml");
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
