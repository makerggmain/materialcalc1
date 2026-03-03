import { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { brandName } = req.query;

    if (!brandName || typeof brandName !== 'string') {
        return res.status(400).json({ error: 'Missing brandName parameter' });
    }

    try {
        const query = encodeURIComponent(brandName);
        // Using allOrigins as a public CORS proxy to bypass some basic IP blocks
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://lemanapro.ru/search/?q=${query}`)}`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
            return res.status(502).json({ error: 'Proxy fetch failed', status: response.status });
        }

        const data = await response.json();
        const html = data.contents;

        if (!html) {
            return res.status(500).json({ error: 'Empty contents from proxy' });
        }

        const $ = cheerio.load(html);
        let priceStr = '';

        // Strategy 1: Find by data-qa attribute
        const firstCard = $('[data-qa="product-card"]').first();
        if (firstCard.length > 0) {
            const priceElement = firstCard.find('[data-qa="product-price"], [data-qa="price"]');
            if (priceElement.length > 0) {
                priceStr = priceElement.text();
            } else {
                const text = firstCard.text();
                const match = text.match(/([\d\s]+)\s*(?:₽|руб|р\.)/);
                if (match) priceStr = match[1];
            }
        }

        // Strategy 2: Global Search
        if (!priceStr) {
            const anyPriceMatch = html.match(/"price":\s*(\d+(\.\d+)?)/);
            if (anyPriceMatch && anyPriceMatch[1]) {
                priceStr = anyPriceMatch[1];
            }
        }

        if (priceStr) {
            const cleanString = priceStr.replace(/\s/g, '').replace(/,/g, '.');
            const parsedPrice = parseFloat(cleanString);

            if (!isNaN(parsedPrice) && parsedPrice > 0) {
                return res.status(200).json({ price: parsedPrice, source: 'lemanapro' });
            }
        }

        return res.status(404).json({ error: 'Price not found on page structure' });
    } catch (error) {
        console.error('Error fetching price:', error);
        return res.status(500).json({ error: 'Internal server error while fetching prices' });
    }
}
