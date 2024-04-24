import * as cheerio from 'cheerio';

const parseHTMLContent = (htmlContent: string) => {
    const $ = cheerio.load(htmlContent);
  
    // Extract title
    const title = $('meta[property="og:title"]').attr('content')  ?? $('title').text();
  
    // Extract thumbnail image
    let thumbnailImage = $('meta[property="og:image"]').attr('content')  ?? '';

    if(!thumbnailImage){
      thumbnailImage = $('#landingImage').attr('src') ?? '';
    }
  
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
  
    let price = ''
    if(priceAmount && priceCurrency){
      // Combine price amount and currency
      price = `${priceCurrency} ${priceAmount}`;
    }else{
      // Scrape price
      price = $('#priceblock_ourprice').text().trim();
      if (!price) {
        price = $('#priceblock_dealprice').text().trim();
      }
    }
  
    return { title, thumbnailImage, price };
  };

  export {parseHTMLContent};