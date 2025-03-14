require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  HEADLESS: process.env.HEADLESS === "true",
  URLS: process.env.URLS.split(","), // Convierte las URLs en un array
  SCRAPING_INTERVAL_HOURS: parseInt(process.env.SCRAPING_INTERVAL_HOURS || "12", 10),
  USER_AGENT: process.env.USER_AGENT || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
};
