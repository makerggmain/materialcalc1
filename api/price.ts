import { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { brandName } = req.query;

    if (!brandName || typeof brandName !== 'string') {
        return res.status(400).json({ error: 'Missing brandName parameter' });
    }

    try {
        // Fetch from Lemana Pro (former Leroy Merlin)
        const searchUrl = `https://lemanapro.ru/search/?q=${encodeURIComponent(brandName)}`;

        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            console.error(`Lemana Pro HTTP error: ${response.status}`);
            return res.status(502).json({ error: 'Failed to fetch upstream', status: response.status });
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let priceStr = '';

        // Strategy 1: Find by data-qa attribute
        const firstCard = $('[data-qa="product-card"]').first();
        if (firstCard.length > 0) {
            // Find inner element that looks like price
            const priceElement = firstCard.find('[data-qa="product-price"], [data-qa="price"]');
            if (priceElement.length > 0) {
                priceStr = priceElement.text();
            } else {
                // Regex fallback on the whole card's text
                const text = firstCard.text();
                // Match things like "573 ₽/шт", "1 200 ₽"
                const match = text.match(/([\d\s]+)\s*(?:₽|руб|р\.)/);
                if (match) {
                    priceStr = match[1];
                }
            }
        }

        // Strategy 2: If no data-qa="product-card" is found, search globally for typical price structures
        if (!priceStr) {
            const anyPriceMatch = html.match(/"price":\s*(\d+(\.\d+)?)/);
            if (anyPriceMatch && anyPriceMatch[1]) {
                priceStr = anyPriceMatch[1];
            }
        }

        if (priceStr) {
            // Clean up the string (remove spaces, narrow non-breaking spaces, etc)
            const cleanString = priceStr.replace(/\s/g, '').replace(/,/g, '.');
            const parsedPrice = parseFloat(cleanString);

            if (!isNaN(parsedPrice) && parsedPrice > 0) {
                return res.status(200).json({ price: parsedPrice, source: 'lemanapro', url: searchUrl });
            }
        }

        return res.status(404).json({ error: 'Price not found on page structure' });
    } catch (error) {
        console.error('Error fetching price:', error);
        return res.status(500).json({ error: 'Internal server error while fetching prices' });
    }
}
