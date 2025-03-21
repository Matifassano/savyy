/**
 * Servicio de generación de embeddings usando OpenAI
 */

const { OpenAI } = require('openai');
const config = require('../config/appConfig');
const logger = require('../config/logger');

// Cliente OpenAI singleton
let openaiClient = null;

/**
 * Obtener o crear cliente OpenAI
 * @returns {OpenAI} Cliente OpenAI
 */
function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: config.openai.apiKey
    });
  }
  return openaiClient;
}

/**
 * Genera embeddings utilizando la API de OpenAI
 * @param {string|string[]} texts - Texto o array de textos para generar embeddings
 * @param {string} model - Modelo a utilizar (por defecto desde config)
 * @returns {Promise<number[][]>} - Array de vectores de embedding
 */
async function createEmbeddings(texts, model = config.openai.embeddingModel) {
  try {
    // Asegurarse de que texts es un array
    const textArray = Array.isArray(texts) ? texts : [texts];
    
    if (textArray.length === 0) {
      throw new Error('No se proporcionaron textos para generar embeddings');
    }
    
    const openai = getOpenAIClient();
    
    // Hacer la solicitud a la API de OpenAI para generar embeddings
    const response = await openai.embeddings.create({
      model: model,
      input: textArray,
    });
    
    // Verificar si la respuesta contiene los datos esperados
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Formato de respuesta inesperado de la API de OpenAI');
    }
    
    // Extraer los vectores de embedding
    const embeddings = response.data.map(item => item.embedding);
    
    logger.debug(`Generados ${embeddings.length} embeddings con modelo ${model}`);
    return embeddings;
  } catch (error) {
    logger.error(`Error al generar embeddings con OpenAI: ${error.message}`);
    throw error;
  }
}

/**
 * Función de utilidad para verificar que los embeddings tengan la dimensión correcta
 * @param {number[]} embedding - Vector de embedding a verificar
 * @param {number} expectedDimension - Dimensión esperada del vector
 * @returns {boolean} - Indica si el embedding tiene la dimensión correcta
 */
function verifyEmbeddingDimension(embedding, expectedDimension = config.qdrant.vectorDimension) {
  if (!Array.isArray(embedding)) {
    logger.error('El embedding no es un array');
    return false;
  }
  
  if (embedding.length !== expectedDimension) {
    logger.error(`El embedding tiene ${embedding.length} dimensiones, se esperaban ${expectedDimension}`);
    return false;
  }
  
  return true;
}

module.exports = {
  createEmbeddings,
  verifyEmbeddingDimension
}; 