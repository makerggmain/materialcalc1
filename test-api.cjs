const cheerio = require('cheerio');

async function testFetch() {
    const brandName = "ВОЛМА СЛОЙ Штукатурка гипсовая";
    console.log("Testing fetch for:", brandName);
    const searchUrl = `https://lemanapro.ru/search/?q=${encodeURIComponent(brandName)}`;

    try {
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });

        console.log("Status:", response.status);
        if (!response.ok) return;

        const html = await response.text();
        const $ = cheerio.load(html);

        let priceStr = '';

        // strategy 1
        const firstCard = $('[data-qa="product-card"]').first();
        if (firstCard.length > 0) {
            console.log("Found product card.");
            const priceElement = firstCard.find('[data-qa="product-price"], [data-qa="price"]');
            if (priceElement.length > 0) {
                priceStr = priceElement.text();
            } else {
                const text = firstCard.text();
                const match = text.match(/([\d\s]+)\s*(?:₽|руб|р\.)/);
                if (match) priceStr = match[1];
            }
        } else {
            console.log("NO product card found with data-qa.");
            // check if there's any price in script tags
            const anyPriceMatch = html.match(/"price":\s*(\d+(\.\d+)?)/);
            if (anyPriceMatch && anyPriceMatch[1]) {
                priceStr = anyPriceMatch[1];
                console.log("Found price in JSON/regex:", priceStr);
            }
        }

        console.log("Extracted Price String:", priceStr);
        if (priceStr) {
            const cleanString = priceStr.replace(/\s/g, '').replace(/,/g, '.');
            console.log("Parsed Price:", parseFloat(cleanString));
        }

    } catch (e) {
        console.error(e);
    }
}

testFetch();
