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
        }
    });
    
    // Filtro para URL encoding (mantido para outros usos)
    eleventyConfig.addFilter("urlencode", function(str) {
        if (!str) return "";
        return encodeURIComponent(str);
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
