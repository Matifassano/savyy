const { OpenAI } = require('openai');
require('dotenv').config();

// Configurar la API de OpenAI con la clave
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Genera embeddings utilizando la API de OpenAI con el modelo text-embedding-3-small
 * @param {string|string[]} texts - Texto o array de textos para generar embeddings
 * @param {string} model - Modelo a utilizar (por defecto text-embedding-3-small)
 * @returns {Promise<number[][]>} - Array de vectores de embedding
 */
async function createEmbeddings(texts, model = 'text-embedding-3-small') {
    try {
        // Asegurarse de que texts es un array
        const textArray = Array.isArray(texts) ? texts : [texts];
        
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
        
        return embeddings;
    } catch (error) {
        console.error('Error al generar embeddings con OpenAI:', error);
        throw error;
    }
}

/**
 * Función de utilidad para verificar que los embeddings tengan la dimensión correcta
 * @param {number[]} embedding - Vector de embedding a verificar
 * @param {number} expectedDimension - Dimensión esperada del vector (1536 para text-embedding-3-small)
 * @returns {boolean} - Indica si el embedding tiene la dimensión correcta
 */
function verifyEmbeddingDimension(embedding, expectedDimension = 1536) {
    if (!Array.isArray(embedding)) {
        console.error('El embedding no es un array');
        return false;
    }
    
    if (embedding.length !== expectedDimension) {
        console.error(`El embedding tiene ${embedding.length} dimensiones, se esperaban ${expectedDimension}`);
        return false;
    }
    
    return true;
}

module.exports = {
    createEmbeddings,
    verifyEmbeddingDimension
}; 