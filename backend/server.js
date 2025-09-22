require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Parse JSON requests

app.get('/', (req, res) => res.send('Welcome to News Genie'));

app.post('/query', async (req, res) => {
  try {
    const { query } = req.body; // Expect { "query": "user input" }
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    res.json({ response: `Received query: ${query}` }); // Placeholder
  } catch (error) {
    console.error('Query error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));