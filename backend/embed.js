const axios = require('axios');
require('dotenv').config();
const fs = require('fs').promises;
const JINA_API_KEY = process.env.JINA_API_KEY;

async function getEmbeddings(texts) {
  try {
    const response = await axios.post('https://api.jina.ai/v1/embeddings', {
      model: 'jina-embeddings-v4',
      task: 'retrieval.passage',
      input: texts.map(text => ({ text })),
    }, {
      headers: {
        'Authorization': `Bearer ${JINA_API_KEY}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error getting embeddings:', error?.response?.data || error.message || error);
    return [];
  }
}

async function main() {
  const raw = await fs.readFile('articles.json', 'utf8');
  let articles = JSON.parse(raw);

  if (!Array.isArray(articles)) {
    if (Array.isArray(articles.articles)) articles = articles.articles;
    else if (Array.isArray(articles.items)) articles = articles.items;
    else {
      throw new Error('articles.json does not contain an array at top-level. Inspect the file structure.');
    }
  }

  console.log('Total articles:', articles.length);

  // collect safe text slices and keep mapping to original indexes for debugging
  const texts = [];
  const idxMap = []; // texts[i] comes from articles[idxMap[i]]
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    if (!a) {
      console.warn(`article ${i} is falsy, skipping`);
      continue;
    }
    const content = (typeof a.content === 'string') ? a.content : (typeof a.text === 'string' ? a.text : '');
    if (!content) {
      console.warn(`article ${i} has no content/text field or it's empty — skipping`);
      continue;
    }
    // safe slice
    texts.push(content.slice(0, 8192));
    idxMap.push(i);
  }

  console.log(`Sending ${texts.length} texts for embedding (skipped ${articles.length - texts.length})`);

  if (texts.length === 0) {
    console.error('No valid article content found. Exiting.');
    return;
  }

  const embeddings = await getEmbeddings(texts);
  console.log(`Generated ${embeddings.length} embeddings`);

  // if you want to map embeddings back to article indices:
  // embeddings[i] -> articles[idxMap[i]]
}

main().catch(err => {
  console.error('Fatal error:', err);
});
