const express = require("express");
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
require("dotenv").config();

// Importar configuraciones
const config = require("./config/appConfig");
const { router, fetchAndCacheScraping } = require("./routes/scrapingRoutes");
const ragRouter = require("./routes/ragRoutes");
const logger = require("./config/logger");

// Carga condicional de servicios
let embeddingsHandler;
try {
  embeddingsHandler = require("./services/embeddingsHandler");
} catch (error) {
  logger.warn(`No se pudo cargar el módulo embeddingsHandler: ${error.message}`);
  embeddingsHandler = {
    ensureCollectionExists: async () => logger.info("Función ensureCollectionExists simulada"),
    scrollPromotions: async () => logger.info("Función scrollPromotions simulada")
  };
}

// Inicialización de Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para logging de peticiones
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rutas
app.use("/api", router);
app.use("/api/rag", ragRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente.");
});

// Inicializar el servidor
const server = createServer(app);
server.listen(config.port, () => {
  logger.info(`Servidor corriendo en http://localhost:${config.port}`);
  logger.info(`RAG API disponible en http://localhost:${config.port}/api/rag`);
  
  // Inicializar después de que el servidor esté funcionando
  initializeApp().catch(error => {
    logger.error(`Error en la inicialización: ${error.message}`);
  });
});

// Manejo de señales de terminación
process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));

function gracefulShutdown(signal) {
  return () => {
    logger.info(`Recibida señal ${signal}, cerrando servidor...`);
    server.close(() => {
      logger.info('Servidor cerrado correctamente');
      process.exit(0);
    });
    
    // Forzar cierre después de 10 segundos
    setTimeout(() => {
      logger.error('Forzando cierre después de 10s');
      process.exit(1);
    }, 10000);
  };
}

// Inicializar la app
async function initializeApp() {
  try {
    // Verificar y crear la colección si es necesario
    logger.info("Verificando colección Qdrant...");
    try {
      await embeddingsHandler.ensureCollectionExists();
    } catch (error) {
      logger.warn(`Error al verificar/crear colección: ${error.message}`);
    }
    
    // Initial scraping
    logger.info("Iniciando scraping inicial...");
    try {
      await fetchAndCacheScraping();
    } catch (error) {
      logger.warn(`Error en el scraping inicial: ${error.message}`);
    }
    
    // Schedule periodic scraping
    const intervalMs = config.scrapingIntervalHours * 60 * 60 * 1000;
    setInterval(() => {
      logger.info(`Ejecutando scraping programado (cada ${config.scrapingIntervalHours} horas)...`);
      fetchAndCacheScraping().catch(error => {
        logger.warn(`Error en scraping programado: ${error.message}`);
      });
    }, intervalMs);
    
    logger.info("Inicialización completada con éxito");
  } catch (error) {
    logger.error(`Error general en la inicialización: ${error.message}`);
    throw error;
  }
}