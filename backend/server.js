const express = require("express");
const cors = require("cors");
const { router, fetchAndCacheScraping } = require("./routes/scrapingRoutes");
const { PORT, SCRAPING_INTERVAL_HOURS } = require("./config/settings");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

// Initial scraping when the app starts
console.log("Starting server and initial data scraping...");
fetchAndCacheScraping();

// Schedule periodic scraping (default: every 12 hours)
const intervalHours = SCRAPING_INTERVAL_HOURS || 12;
const intervalMs = intervalHours * 60 * 60 * 1000;

setInterval(() => {
  console.log(`Running scheduled scraping (every ${intervalHours} hours)...`);
  fetchAndCacheScraping();
}, intervalMs);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});