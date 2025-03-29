const puppeteer = require("puppeteer-extra");
const supabase = require("../supabase");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { URLS, HEADLESS } = require("../config/settings");
const { scrapingStrategies } = require("./strategies");

async function scrapeAllBanks() {
  const browser = await puppeteer.launch({
    headless: HEADLESS,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const results = [];

  for (const url of URLS) {
    try {
      console.log(`Scraping ${url}...`);
      const page = await browser.newPage();

      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
      
      // Set timeout to 60 seconds
      await page.setDefaultNavigationTimeout(60000);
      
      // Navigate to the URL and wait for the page to load
      await page.goto(url, { waitUntil: "networkidle2" });

      // Add a random delay to mimic human behavior
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));

      // Get the bank name from the URL
      const bankName = getBankNameFromUrl(url);
      
      // Check if we have a specific strategy for this URL
      if (scrapingStrategies[url]) {
        // Use the specific strategy
        const scrapedData = await scrapingStrategies[url](page);
        
        // Process the benefits data based on the bank
        if (scrapedData.benefits && Array.isArray(scrapedData.benefits)) {
          // For banks that return an array of benefit objects
          scrapedData.benefits.forEach(benefit => {
            results.push({
              bank: bankName,
              title: benefit.title || 'Sin título',
              link_promotion: url,
              payment_network: benefit.payment_network || null,
              benefits: benefit.benefits || null,
              valid_until: benefit.valid_until || null
            });
          });
        } else if (scrapedData.promociones && Array.isArray(scrapedData.promociones)) {
          // For banks that return promociones array
          scrapedData.promociones.forEach(promo => {
            results.push({
              bank: bankName,
              title: promo.titulo || 'Sin título',
              link_promotion: url,
              payment_network: null,
              benefits: promo.descripcion || null,
              valid_until: promo.validez || null
            });
          });
        } else {
          // Default case if no specific format is detected
          results.push({
            bank: bankName,
            title: scrapedData.title || 'Sin título',
            link_promotion: url,
            payment_network: null,
            benefits: null,
            valid_until: null
          });
        }
      } else {
        // Fallback to generic scraping
        const title = await page.title();
        results.push({ 
          bank: bankName,
          title: title || 'Sin título',
          link_promotion: url,
          payment_network: null,
          benefits: null,
          valid_until: null
        });
      }

      await page.close();
      console.log(`Finished scraping ${url}`);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      results.push({ 
        url, 
        error: error.message 
      });
    }
  }

  await browser.close();

  // Save results to Supabase
  if (results.length > 0) {
    try {
      // First, delete all existing promotions
      const { error: deleteError } = await supabase
        .from('promotions')
        .delete()
        .neq('id', 0); // This will delete all rows
      
      if (deleteError) {
        console.error("Error deleting existing promotions:", deleteError);
      } else {
        console.log("All existing promotions deleted successfully");
        
        // Then insert all new promotions
        const { error: insertError } = await supabase
          .from('promotions')
          .insert(results.map(item => {
            // Remove any manually generated ID
            const { error, url, ...promotionData } = item;
            return promotionData;
          }));
        
        if (insertError) {
          console.error("Error saving new promotions to Supabase:", insertError);
        } else {
          console.log(`${results.length} new promotions saved to Supabase correctly`);
        }
      }
    } catch (error) {
      console.error("Error in save operation:", error);
    }
  }
  return results;
}

// Run the scraping every 96 hours
setInterval(scrapeAllBanks, 345600000);

// Helper function to extract bank name from URL
function getBankNameFromUrl(url) {
  if (url.includes("bancociudad")) return "Banco Ciudad";
  return "Unknown Bank";
}

module.exports = { scrapeAllBanks };
