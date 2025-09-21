## News-Genie

### Setup
1. Run `npm install` to install dependencies (axios, cheerio, xml2js).
2. Run `node ingest.js` to fetch 5 news articles and save to `articles.json`.

### Ingestion
- Fetches Reuters sitemap to get article URLs.
- Scrapes title and body using Cheerio.
- Saves to `articles.json` for RAG pipeline.
- Decision: Used Reuters for reliable sitemap; limited to 5 articles for testing.