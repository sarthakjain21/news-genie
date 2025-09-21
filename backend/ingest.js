const axios = require("axios");
const xml2js = require('xml2js');

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
        const articlesUrls = xml.urlset.url.map(url => url.loc[0]).slice(0, 10);
        console.log(articlesUrls);
        return articlesUrls;
    } catch (error) {
        console.error('Error fetching articles urls:', error);
        return [];
    }
}

async function main() {
    const siteMapUrls = await fetchSiteMap();
    if (siteMapUrls.length === 0) {
        console.error('No site map urls found');
        return;
    }
    const articlesUrls = await fetchArticlesUrls(siteMapUrls[0]);
    console.log(articlesUrls);
}

main();