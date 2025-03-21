/**
 * Configuración centralizada de la aplicación
 * Todas las variables de entorno se definen aquí con valores por defecto
 */

require('dotenv').config();

const config = {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  
  // Configuración de scraping
  scrapingIntervalHours: parseInt(process.env.SCRAPING_INTERVAL_HOURS || "12", 10),
  
  // Credenciales de servicios externos
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    llmModel: process.env.OPENAI_LLM_MODEL || 'gpt-4o-mini',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.2'),
  },
  
  qdrant: {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: process.env.QDRANT_COLLECTION_NAME || 'promotions',
    vectorDimension: 1536, // Dimensión fija para text-embedding-3-small
  },
  
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Modo de entorno
  isDevelopment: process.env.NODE_ENV !== 'production',
};

// Validación de configuraciones críticas
function validateConfig() {
  const requiredKeys = [
    'openai.apiKey',
    'qdrant.url',
    'qdrant.apiKey', 
    'supabase.url',
    'supabase.key'
  ];
  
  const missingKeys = [];
  
  for (const key of requiredKeys) {
    const parts = key.split('.');
    let value = config;
    
    for (const part of parts) {
      value = value[part];
      if (!value) {
        missingKeys.push(key);
        break;
      }
    }
  }
  
  if (missingKeys.length > 0) {
    console.warn(`⚠️ Faltan las siguientes configuraciones requeridas: ${missingKeys.join(', ')}`);
  }
}

validateConfig();

module.exports = config; 