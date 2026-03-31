const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({
    name: "🚀 Web Data Extraction API - LIVE ON RAILWAY",
    status: "🟢 100% Working",
    test: "https://your-app.railway.app/api/scrape?url=https://example.com"
}));

app.get('/api/scrape', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({error: "URL required (?url=https://example.com)"});
        
        const response = await axios.get(url, {
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'},
            timeout: 15000
        });
        
        const $ = cheerio.load(response.data);
        res.json({
            success: true,
            url,
            title: $('title').text().trim(),
            description: $('meta[name="description"]').attr('content') || 'No description',
            h1_count: $('h1').length,
            links: $('a[href]').length,
            images: $('img').length,
            sample_links: $('a[href]').map((i,el)=>$(el).attr('href')).get().slice(0,5)
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 API running on port ${port}`);
});
