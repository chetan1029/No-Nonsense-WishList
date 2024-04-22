import * as cheerio from 'cheerio';

const parseHTMLContent = (htmlContent: string) => {
    const $ = cheerio.load(htmlContent);
  
    // Extract title
    const title = $('meta[property="og:title"]').attr('content')  ?? $('title').text();
  
    // Extract thumbnail image
    const thumbnailImage = $('meta[property="og:image"]').attr('content')  ?? '';
  
    // Extract price amount
    let priceAmount = '';
    $('meta[property="og:price:amount"]').each((index, element) => {
      priceAmount = $(element).attr('content')?.toString() ?? '';
      return false;
    });

    if(!priceAmount){
        $('meta[property="product:price:amount"]').each((index, element) => {
            priceAmount = $(element).attr('content')?.toString() ?? '';
            return false;
        });
    }
  
    // Extract price currency
    let priceCurrency = '';
    $('meta[property="og:price:currency"]').each((index, element) => {
      priceCurrency = $(element).attr('content')?.toString() ?? '';
      return false;
    });

    if(!priceCurrency){
        $('meta[property="product:price:currency"]').each((index, element) => {
        priceCurrency = $(element).attr('content')?.toString() ?? '';
        return false;
        });
    }
  
    // Combine price amount and currency
    const price = `${priceCurrency} ${priceAmount}`;
  
    return { title, thumbnailImage, price };
  };

  export {parseHTMLContent};