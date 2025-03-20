const express = require("express");
const supabase = require("../supabase");
const { scrapeAllBanks } = require("../scraping/scraper");
const { generateAndStoreEmbeddings, searchSimilarPromotions } = require("../embeddingsHandler");

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
    
    // Después de completar el scraping, generamos los embeddings
    console.log("Scraping completed. Generating and storing embeddings...");
    await generateAndStoreEmbeddings();
    console.log("Embeddings stored successfully.");
    
    isScrapingInProgress = false;
    console.log("Initial scraping completed successfully at", lastScrapingTime);
    
    return cachedData;
  } catch (error) {
    console.error("Error during initial scraping:", error);
    isScrapingInProgress = false;
    throw error;
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
    
    // Después de completar el scraping, generamos los embeddings
    console.log("Scraping completed. Generating and storing embeddings...");
    await generateAndStoreEmbeddings();
    console.log("Embeddings stored successfully.");
    
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

// Ruta para regenerar los embeddings de todas las promociones
router.post("/embeddings/regenerate", async (req, res) => {
  try {
    res.json({ message: "Regenerating embeddings started" });
    
    // Regenerar embeddings de forma asíncrona
    await generateAndStoreEmbeddings();
    
    console.log("Embeddings regenerated successfully");
  } catch (error) {
    console.error("Error regenerating embeddings:", error);
  }
});

// Ruta para buscar promociones similares basado en texto
router.post("/search", async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: "Se requiere un texto de búsqueda" 
      });
    }
    
    // Buscar promociones similares
    const searchResults = await searchSimilarPromotions(query, limit);
    
    res.json({ 
      success: true, 
      results: searchResults 
    });
  } catch (error) {
    console.error("Error searching promotions:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error buscando promociones" 
    });
  }
});

module.exports = { router, fetchAndCacheScraping };
