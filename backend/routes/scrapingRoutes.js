const express = require("express");
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
router.get("/scrape", async (req, res) => {
  if (cachedData) {
    res.json({
      data: cachedData,
      lastUpdated: lastScrapingTime,
      status: isScrapingInProgress ? "updating" : "ready"
    });
  } else {
    res.json({ 
      message: "Scraping en proceso o no disponible", 
      status: isScrapingInProgress ? "in_progress" : "not_started" 
    });
  }
});

// Route to force a new scraping
router.post("/scrape/refresh", async (req, res) => {
  if (isScrapingInProgress) {
    return res.status(409).json({ 
      message: "Ya hay un proceso de scraping en curso", 
      lastUpdated: lastScrapingTime 
    });
  }

  try {
    isScrapingInProgress = true;
    res.json({ 
      message: "Proceso de scraping iniciado", 
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
