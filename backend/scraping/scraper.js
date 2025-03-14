const puppeteer = require("puppeteer-extra");
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
        results.push({
          bank: bankName,
          url,
          ...scrapedData
        });
      } else {
        // Fallback to generic scraping
        const title = await page.title();
        const content = await page.evaluate(() => document.body.innerText);
        results.push({ 
          bank: bankName,
          url, 
          title,
          content 
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
  return results;
}

// Helper function to extract bank name from URL
function getBankNameFromUrl(url) {
  if (url.includes("bancociudad")) return "Banco Ciudad";
  if (url.includes("bbva")) return "BBVA";
  if (url.includes("galicia")) return "Banco Galicia";
  if (url.includes("semananacion")) return "Banco Nación";
  return "Unknown Bank";
}

module.exports = { scrapeAllBanks };
