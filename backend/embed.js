require('dotenv').config();
const fs = require('fs').promises;
const JINA_API_KEY = process.env.JINA_API_KEY;

async function main() {
  const articles = JSON.parse(await fs.readFile('articles.json', 'utf8'));
  console.log(`Loaded ${articles.length} articles`);
}

main().catch(console.error);