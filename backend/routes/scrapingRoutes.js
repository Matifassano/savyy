const express = require("express");
const supabase = require("../supabase");
const { scrapeAllBanks } = require("../scraping/scraper");

const router = express.Router();


let cachedData = null;
let lastScrapingTime = null;
let isScrapingInProgress = false;

async function fetchAndCacheScraping() {
  try {
    console.log("Starting initial scraping process...");
    isScrapingInProgress = true;
    cachedData = await scrapeAllBanks();
    lastScrapingTime = new Date();
    
    isScrapingInProgress = false;
    console.log("Initial scraping completed successfully at", lastScrapingTime);
  } catch (error) {
    console.error("Error during initial scraping:", error);
    isScrapingInProgress = false;
  }
}

// Route to get the cached scraping data
router.get('/scrape', async (req, res) => {
  try {
      // Obtener los datos de Supabase
      const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });

      if (error) {
          console.error('Error obteniendo datos de Supabase:', error);
          return res.status(500).json({ success: false, message: 'Error obteniendo datos' });
      }

      if (data.length === 0) {
          console.log('Base de datos vacía, ejecutando scraping...');
          const scrapedData = await fetchAndCacheScraping();
          return res.json({ success: true, data: scrapedData });
      }

      res.json({ success: true, data });
  } catch (error) {
      console.error('Error en la API:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Route to force a new scraping
router.post("/scrape/refresh", async (req, res) => {
  if (isScrapingInProgress) {
    return res.status(409).json({ 
      message: "There is already a scraping process in progress", 
      lastUpdated: lastScrapingTime 
    });
  }

  try {
    isScrapingInProgress = true;
    res.json({ 
      message: "Scraping process started", 
      lastUpdated: lastScrapingTime 
    });
    
    // Run the scraping process asynchronously
    cachedData = await scrapeAllBanks();
    lastScrapingTime = new Date();
    
    isScrapingInProgress = false;
    console.log("Manual scraping completed successfully at", lastScrapingTime);
  } catch (error) {
    console.error("Error during manual scraping:", error);
    isScrapingInProgress = false;
  }
});

// Route to get scraping status
router.get("/scrape/status", (req, res) => {
  res.json({
    status: isScrapingInProgress ? "in_progress" : "ready",
    lastUpdated: lastScrapingTime,
    dataAvailable: cachedData !== null
  });
});

module.exports = { router, fetchAndCacheScraping };
