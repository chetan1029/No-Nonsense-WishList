import * as cheerio from 'cheerio';

const parseHTMLContent = (htmlContent: string) => {
  const $ = cheerio.load(htmlContent);

  // Function to get meta content
  const getMetaContent = (property: string) => $(`meta[property="${property}"]`).attr('content') || '';

  // Extract title
  const title = getMetaContent('og:title') || $('title').text();

  // Extract thumbnail image
  const thumbnailImage = getMetaContent('og:image') || $('#landingImage').attr('src') || '';

  // Extract price amount and currency
  const priceAmount = getMetaContent('og:price:amount') || getMetaContent('product:price:amount');
  const priceCurrency = getMetaContent('og:price:currency') || getMetaContent('product:price:currency');

  // Combine price amount and currency
  let price = '';
  if (priceAmount && priceCurrency) {
    price = `${priceCurrency} ${priceAmount}`;
  } else {
    // Scrape price
    price = $('#priceblock_ourprice').text().trim() || $('#priceblock_dealprice').text().trim();
  }

  return { title, thumbnailImage, price };
};

export { parseHTMLContent };
