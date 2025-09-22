require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { ChromaClient } = require('chromadb');
const axios = require('axios');
const JINA_API_KEY = process.env.JINA_API_KEY;

const app = express();
app.use(bodyParser.json()); // Parse JSON requests

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


async function retrieveArticles(queryEmbedding) {
  try {
    const client = new ChromaClient({ path: 'http://localhost:8000' });
    const collection = await client.getCollection({ name: 'news_articles' });
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5 // Top-5 articles
    });
    return results.documents[0].map((doc, i) => ({
      text: doc,
      metadata: results.metadatas[0][i]
    }));
  } catch (error) {
    console.error('Chroma error:', error.message);
    throw error;
  }
}

app.get('/', (req, res) => res.send('Welcome to News Genie'));

app.post('/query', async (req, res) => {
  try {
    const { query } = req.body; // Expect { "query": "user input" }
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const [queryEmbedding] = await getEmbeddings([query]);
    const articles = await retrieveArticles(queryEmbedding);
    res.json({ articles });
  } catch (error) {
    console.error('Query error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));