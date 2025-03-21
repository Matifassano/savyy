/**
 * Servicio RAG (Retrieval Augmented Generation)
 * Implementa la búsqueda de promociones y generación de respuestas
 */

const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { formatDocumentsAsString } = require('langchain/util/document');
const config = require('../config/appConfig');
const logger = require('../config/logger');
const embeddingsHandler = require('./embeddingsHandler');

// Mantener singleton del modelo
let llmInstance = null;

/**
 * Obtener o crear instancia del modelo LLM
 * @returns {ChatOpenAI} Instancia de ChatOpenAI
 */
function getLLMInstance() {
    if (!llmInstance) {
        llmInstance = new ChatOpenAI({
            modelName: config.openai.llmModel,
            temperature: config.openai.temperature,
            apiKey: config.openai.apiKey,
        });
        logger.debug(`Modelo LLM inicializado: ${config.openai.llmModel}`);
    }
    return llmInstance;
}

/**
 * Realizar búsqueda de similitud y formatear documentos
 * @param {string} query - Consulta del usuario
 * @param {number} limit - Límite de resultados
 * @returns {Promise<Array>} - Documentos encontrados
 */
async function similaritySearch(query, limit = 5) {
    try {
        // Buscar en la colección de Qdrant
        const results = await embeddingsHandler.searchSimilarPromotions(query, limit);
        
        // Formatear los resultados para LangChain
        return results.map(result => ({
            pageContent: `Promoción: ${result.payload.title}
            Banco: ${result.payload.bank}
            Beneficios: ${result.payload.benefits || 'No especificado'}
            Válido hasta: ${result.payload.valid_until || 'No especificado'}
            Link: ${result.payload.link_promotion || 'No disponible'}`,
            metadata: {
                score: result.score,
                ...result.payload
            }
        }));
    } catch (error) {
        logger.error(`Error en la búsqueda de similitud: ${error.message}`);
        throw error;
    }
}

// Plantilla de prompt mejorada
const promptTemplate = PromptTemplate.fromTemplate(`
    Sos Savy, un asistente que ayuda a los usuarios a encontrar promociones bancarias según las tarjetas que usan y lo que necesitan.
    
    Mostrá solo las promociones del contexto que se ajusten a la consulta del usuario. Respondé de forma clara, breve y amigable.
    
    Si no hay información relacionada en el contexto, no inventes. Decile que no encontrás promociones y que puede revisar la web oficial de su banco para más detalles.
    
    CONTEXTO:
    {context}
    
    PREGUNTA:
    {question}
    
    RESPUESTA:
    `);

/**
 * Crear cadena de procesamiento RAG
 * @returns {RunnableSequence} - Cadena RAG lista para usar
 */
function createRagChain() {
    const llm = getLLMInstance();
    
    const ragChain = RunnableSequence.from([
        {
            context: async (input) => {
                const docs = await similaritySearch(input.question);
                return formatDocumentsAsString(docs);
            },
            question: (input) => input.question,
        },
        promptTemplate,
        llm,
        new StringOutputParser(),
    ]);

    return ragChain;
}

/**
 * Consultar promociones mediante RAG
 * @param {string} question - Pregunta del usuario
 * @returns {Promise<string>} - Respuesta generada
 */
async function queryPromotions(question) {
    try {
        logger.info(`Consulta RAG: "${question}"`);
        const ragChain = createRagChain();
        const response = await ragChain.invoke({ question });
        return response;
    } catch (error) {
        logger.error(`Error al consultar promociones: ${error.message}`);
        throw error;
    }
}

module.exports = {
    queryPromotions,
    similaritySearch
}; 