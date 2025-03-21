require("dotenv").config();

// Función para verificar si una variable de entorno existe
const getEnvVar = (varName, defaultValue = undefined) => {
  const value = process.env[varName];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Advertencia: La variable de entorno ${varName} no está definida y no tiene valor por defecto.`);
  }
  return value !== undefined ? value : defaultValue;
};

// Preparar URLs de manera segura
let urls = [];
try {
  const urlsString = getEnvVar('URLS', '');
  if (urlsString && urlsString.trim() !== '') {
    urls = urlsString.split(',').map(url => url.trim());
  } else {
    console.warn('Advertencia: No se definieron URLs para scraping.');
  }
} catch (error) {
  console.warn('Error al procesar las URLs:', error.message);
}

module.exports = {
  PORT: parseInt(getEnvVar('PORT', '3000'), 10),
  HEADLESS: getEnvVar('HEADLESS', 'true') === 'true',
  URLS: urls,
  SCRAPING_INTERVAL_HOURS: parseInt(getEnvVar('SCRAPING_INTERVAL_HOURS', '12'), 10),
  USER_AGENT: getEnvVar(
    'USER_AGENT', 
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
  ),
  QDRANT_URL: getEnvVar('QDRANT_URL'),
  QDRANT_API_KEY: getEnvVar('QDRANT_API_KEY'),
  OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY')
};
