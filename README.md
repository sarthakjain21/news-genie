## News-Genie

### Setup
1. Run `npm install` to install dependencies (axios, cheerio, xml2js).
2. Run `node ingest.js` to fetch 5 news articles and save to `articles.json`.

### Ingestion
- Using BBC and CNN RSS (reliable, free, structured data).
- Fetches title, snippet/body, URL, date.
- Saves to `articles.json` for RAG pipeline.
- Decision: limited to 5 articles for testing(scale to 50 by updating slice(0, 50)).