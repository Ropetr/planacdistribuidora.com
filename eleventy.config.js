module.exports = function(eleventyConfig) {
    // Filtro personalizado para URL encoding (necessário para WhatsApp)
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
