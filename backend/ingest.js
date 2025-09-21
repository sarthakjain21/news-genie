const axios = require("axios");
const xml2js = require('xml2js');
const cheerio = require('cheerio');

async function fetchSiteMap() {
    try {
        const response = await axios.get('https://www.reuters.com/arc/outboundfeeds/sitemap-index/?outputType=xml');
        const parser = new xml2js.Parser();
        const xml = await parser.parseStringPromise(response.data);
        const siteMapUrls = xml.sitemapindex.sitemap.map(sitemap => sitemap.loc[0]);
        return siteMapUrls;
    } catch (error) {
        console.error('Error fetching site map:', error);
        return [];
    }
}

async function fetchArticlesUrls(siteMapUrl) {
    try{
        const response = await axios.get(siteMapUrl);
        const parser = new xml2js.Parser();
        const xml = await parser.parseStringPromise(response.data);
        const articlesUrls = xml.urlset.url.map(url => url.loc[0]).slice(0, 5);
        return articlesUrls;
    } catch (error) {
        console.error('Error fetching articles urls:', error);
        return [];
    }
}

async function fetchArticleContent(articleUrl) {
    try {
        const response = await axios.get(articleUrl);
        const $ = cheerio.load(response.data);
        const title = $('h1').text().trim();
        const body = $('article').text().trim();
        return {url: articleUrl, title, body};
    } catch (error) {
        console.error('Error fetching article content:', error);
        return null;
    }
}

async function main() {
    const sitemapUrls = await fetchSiteMap();
    if (sitemapUrls.length > 0) {
      const articleUrls = await fetchArticlesUrls(sitemapUrls[0]);
      const articles = [];
      for (const url of articleUrls) {
        const article = await fetchArticleContent(url);
        if (article) articles.push(article);
      }
      console.log('Fetched Articles:', articles);
    }
  }

main();