const axios = require("axios");
const fs = require('fs');
const Parser = require('rss-parser');

const parser = new Parser();

async function fetchRssFeed(rssUrl) {
    try {
        const feed = await parser.parseURL(rssUrl);
        const articles = feed.items.slice(0, 30).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            content: item.content,
        }));
        return articles;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}

async function main() {
    const rssUrls = [
        'https://www.bbc.com/news/rss.xml',
        'http://rss.cnn.com/rss/cnn_topstories.rss'
    ];
    const articles = [];
    for (const rssUrl of rssUrls) {
        const feed = await fetchRssFeed(rssUrl);
        articles.push(...feed);
    }
    await fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));
  }

main();