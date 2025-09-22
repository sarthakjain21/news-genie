## News-Genie

### Setup
1. Run `npm install` to install dependencies (axios, cheerio, xml2js).
2. Run `node ingest.js` to fetch 5 news articles and save to `articles.json`.

### Ingestion
- Using BBC and CNN RSS (reliable, free, structured data).
- Fetches title, snippet/body, URL, date.
- Saves to `articles.json` for RAG pipeline.
- Decision: limited to 5 articles for testing(scale to 50 by updating slice(0, 50)).

### Chroma Setup
- Requires Python 3.12+.
- Create virtual environment: `python -m venv venv`
- Activate: `source venv/bin/activate` (Mac/Linux) or `.\venv\Scripts\activate` (Windows).
- Install Chroma: `pip install chromadb`.
- Start server: `chroma run --path ./chroma_data`.
- Decision: Used virtual environment to isolate dependencies, avoid conflicts.

### Embeddings and Vector DB
- Uses Jina API (model: jina-embeddings-v4) for embeddings via REST.
- Stores in local Chroma (run server first).
- Run `node embed.js` to populate.
- Decisions: Jina for free multimodal support; Chroma for easy local setup.

### RAG Pipeline
- **/query endpoint**: 
- Embeds query with Jina (jina-embeddings-v4).
- Retrieves top-5 articles from Chroma (news_articles collection).
- Generates response with Gemini (gemini-1.5-flash).
- Test: POST `{ "query": "your question" }` to `http://localhost:3000/query` via Postman.
- Decisions: Top-k=5 for relevance; Gemini for fast, free text generation.