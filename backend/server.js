const express = require("express");
const cors = require("cors");
const { router, fetchAndCacheScraping } = require("./routes/scrapingRoutes");
const { PORT, SCRAPING_INTERVAL_HOURS } = require("./config/settings");
const { ensureCollectionExists, scrollPromotions } = require("./embeddingsHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

// Inicializar la colección de Qdrant
async function initializeApp() {
  try {
    // Verificar y crear la colección si es necesario
    console.log("Verifying Qdrant collection...");
    await ensureCollectionExists();
    
    // Initial scraping when the app starts
    console.log("Starting server and initial data scraping...");
    await fetchAndCacheScraping();
    // await scrollPromotions(); Verify points in Qdrant
    
    // Schedule periodic scraping (default: every 12 hours)
    const intervalHours = SCRAPING_INTERVAL_HOURS || 12;
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    setInterval(() => {
      console.log(`Running scheduled scraping (every ${intervalHours} hours)...`);
      fetchAndCacheScraping();
    }, intervalMs);
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing app:", error);
    process.exit(1);
  }
}

// Health check endpoint
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente.");
});

// Initialize the application
initializeApp();