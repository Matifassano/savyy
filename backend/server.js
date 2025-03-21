const express = require("express");
const cors = require("cors");
const { router, fetchAndCacheScraping } = require("./routes/scrapingRoutes");
const ragRouter = require("./routes/ragRoutes");
const path = require("path");
require("dotenv").config();

// Importar configuraciones con valores por defecto
const PORT = process.env.PORT || 3000;
const SCRAPING_INTERVAL_HOURS = parseInt(process.env.SCRAPING_INTERVAL_HOURS || "12", 10);

let embeddingsHandler;
try {
  embeddingsHandler = require("./embeddingsHandler");
} catch (error) {
  console.warn("Advertencia: No se pudo cargar el módulo embeddingsHandler:", error.message);
  embeddingsHandler = {
    ensureCollectionExists: async () => console.log("Función ensureCollectionExists simulada"),
    scrollPromotions: async () => console.log("Función scrollPromotions simulada")
  };
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use("/api/rag", ragRouter);

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint - importante para Railway
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente.");
});

// Inicializar el servidor primero para que Railway detecte que está en funcionamiento
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`RAG API disponible en http://localhost:${PORT}/api/rag`);
  
  // Inicializar las colecciones y el scraping después de que el servidor esté funcionando
  initializeApp().catch(error => {
    console.error("Error en la inicialización:", error);
    // No terminamos el proceso para permitir que el servidor siga funcionando
  });
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recibida señal SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Inicializar la colección de Qdrant
async function initializeApp() {
  try {
    // Verificar y crear la colección si es necesario
    console.log("Verificando colección Qdrant...");
    try {
      await embeddingsHandler.ensureCollectionExists();
    } catch (error) {
      console.warn("Advertencia: Error al verificar/crear colección:", error.message);
      // Continuamos a pesar del error
    }
    
    // Initial scraping when the app starts
    console.log("Iniciando scraping inicial...");
    try {
      await fetchAndCacheScraping();
    } catch (error) {
      console.warn("Advertencia: Error en el scraping inicial:", error.message);
      // Continuamos a pesar del error
    }
    
    // Schedule periodic scraping
    const intervalMs = SCRAPING_INTERVAL_HOURS * 60 * 60 * 1000;
    setInterval(() => {
      console.log(`Ejecutando scraping programado (cada ${SCRAPING_INTERVAL_HOURS} horas)...`);
      fetchAndCacheScraping().catch(error => {
        console.warn("Error en scraping programado:", error.message);
      });
    }, intervalMs);
    
    console.log("Inicialización completada con éxito");
  } catch (error) {
    console.error("Error general en la inicialización:", error);
    throw error; // Propagamos el error pero no termina el servidor
  }
}