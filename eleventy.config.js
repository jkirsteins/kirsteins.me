const fs = require("fs");
const path = require("path");

const LANGUAGES = ["en", "lv", "fr"];

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  eleventyConfig.addFilter("i18n", function (key) {
    const lang = this.ctx?.locale || this.ctx?.lang || "en";
    let strings;
    try {
      strings = require(`./src/_data/i18n/${lang}.json`);
    } catch {
      strings = require("./src/_data/i18n/en.json");
    }
    return strings[key] || key;
  });

  eleventyConfig.addFilter("dateDisplay", function (date, lang) {
    const locale = lang || "en";
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("translations", function (article) {
    const slug = article.fileSlug;
    const result = [];
    for (const lang of LANGUAGES) {
      const filePath = path.join(__dirname, "src", lang, "articles", `${slug}.md`);
      if (fs.existsSync(filePath)) {
        result.push({ lang, url: `/${lang}/articles/${slug}/` });
      }
    }
    return result;
  });

  eleventyConfig.addCollection("articles_en", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/en/articles/*.md").sort((a, b) => b.date - a.date);
  });

  // All articles deduplicated by slug, preferring EN version
  eleventyConfig.addCollection("articles_all", function (collectionApi) {
    const all = collectionApi.getFilteredByGlob("src/*/articles/*.md");
    const bySlug = new Map();
    for (const article of all) {
      const slug = article.fileSlug;
      const existing = bySlug.get(slug);
      if (!existing || article.data.lang === "en") {
        bySlug.set(slug, article);
      }
    }
    return Array.from(bySlug.values()).sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
