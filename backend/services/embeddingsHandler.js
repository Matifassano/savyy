/**
 * Manejador de embeddings para la integración con Qdrant
 */

const { QdrantClient } = require('@qdrant/js-client-rest');
const config = require('../config/appConfig');
const logger = require('../config/logger');
const { createEmbeddings, verifyEmbeddingDimension } = require('./embeddingService');
const supabaseService = require('./supabaseService');

// Cliente Qdrant singleton
let qdrantClient = null;

/**
 * Obtener o crear cliente Qdrant
 * @returns {QdrantClient} Cliente Qdrant
 */
function getQdrantClient() {
    if (!qdrantClient) {
        try {
            qdrantClient = new QdrantClient({
                url: config.qdrant.url,
                apiKey: config.qdrant.apiKey,
            });
            logger.debug('Cliente Qdrant inicializado correctamente');
        } catch (error) {
            logger.error(`Error inicializando cliente Qdrant: ${error.message}`);
            throw error;
        }
    }
    return qdrantClient;
}

/**
 * Verificar si la colección existe, si no, crearla
 * @returns {Promise<void>}
 */
async function ensureCollectionExists() {
    try {
        const client = getQdrantClient();
        const collections = await client.getCollections();
        const collectionExists = collections.collections.some(c => c.name === config.qdrant.collectionName);
        
        if (!collectionExists) {
            logger.info(`Creando colección '${config.qdrant.collectionName}' con dimensiones OpenAI`);
            await client.createCollection(config.qdrant.collectionName, {
                vectors: {
                    size: config.qdrant.vectorDimension,
                    distance: 'Cosine'
                },
            });
            logger.info(`Colección '${config.qdrant.collectionName}' creada correctamente`);
        } else {
            logger.info(`Colección '${config.qdrant.collectionName}' ya existe`);
            // Si la colección ya existe pero tiene una dimensión diferente, recrearla
            const collectionInfo = await client.getCollection(config.qdrant.collectionName);
            const currentSize = collectionInfo.config.params.vectors.size;
            
            if (currentSize !== config.qdrant.vectorDimension) {
                logger.warn(`Recreando colección '${config.qdrant.collectionName}'. Dimensión actual: ${currentSize}, necesaria: ${config.qdrant.vectorDimension}`);
                await client.deleteCollection(config.qdrant.collectionName);
                await client.createCollection(config.qdrant.collectionName, {
                    vectors: {
                        size: config.qdrant.vectorDimension,
                        distance: 'Cosine'
                    },
                });
                logger.info(`Colección '${config.qdrant.collectionName}' recreada con dimensiones correctas`);
            }
        }
    } catch (error) {
        logger.error(`Error verificando/creando colección: ${error.message}`);
        throw error;
    }
}

/**
 * Genera el embedding para una promoción
 * @param {Object} promo - Objeto de promoción
 * @returns {Promise<number[]>} - Vector de embedding
 */
async function generateEmbedding(promo) {
    try {
        // Crear el texto para el embedding
        const textToEmbed = `
            Título: ${promo.title}. 
            Beneficios: ${promo.benefits || 'N/A'}. 
            Válido hasta: ${promo.valid_until || 'N/A'}.
        `;

        // Generar el embedding utilizando OpenAI
        const embeddings = await createEmbeddings([textToEmbed]);
        
        // La API de OpenAI devuelve un array de embeddings
        const embedding = embeddings[0];

        // Verificar la dimensión del embedding
        if (!verifyEmbeddingDimension(embedding, config.qdrant.vectorDimension)) {
            throw new Error(`El embedding no tiene la dimensión esperada (${config.qdrant.vectorDimension})`);
        }

        return embedding;
    } catch (error) {
        logger.error(`Error generando embedding para promoción '${promo.title}': ${error.message}`);
        throw error;
    }
}

/**
 * Genera y almacena embeddings para promociones sin procesar
 * @returns {Promise<void>}
 */
async function generateAndStoreEmbeddings() {
    try {
        // Asegurarse de que la colección existe con las dimensiones correctas
        await ensureCollectionExists();

        // Obtener promociones de Supabase
        const promotions = await supabaseService.getPromotionsWithoutEmbeddings();

        logger.info(`Encontradas ${promotions.length} promociones para generar embeddings.`);

        if (promotions.length === 0) {
            return;
        }

        const client = getQdrantClient();
        const points = [];
        const processedIds = [];

        // Iterar sobre cada promoción y generar embeddings
        for (const promo of promotions) {
            try {
                const pointId = promo.id;

                // Validar si ya está en Qdrant
                const exists = await client.retrieve(config.qdrant.collectionName, pointId).catch(() => null);
                if (exists) {
                    logger.debug(`Embedding para promoción "${promo.title}" ya existe. Saltando.`);
                    await supabaseService.updateEmbeddingStatus(pointId, true);
                    continue;
                }

                const embedding = await generateEmbedding(promo);

                const point = {
                    id: pointId,
                    vector: embedding,
                    payload: {
                        bank: promo.bank,
                        title: promo.title,
                        link_promotion: promo.link_promotion,
                        cardtype: promo.cardtype,
                        payment_network: promo.payment_network,
                        benefits: promo.benefits,
                        valid_until: promo.valid_until,
                    },
                };

                points.push(point);
                processedIds.push(pointId);
                logger.debug(`Generado embedding para promoción ID ${pointId}`);
            } catch (error) {
                logger.error(`Error procesando promoción ID ${promo.id}: ${error.message}`);
            }
        }

        if (points.length > 0) {
            try {
                // Insertar todos los embeddings en una sola llamada
                await client.upsert(config.qdrant.collectionName, { points });

                // Actualizar estado en Supabase
                for (const id of processedIds) {
                    await supabaseService.updateEmbeddingStatus(id, true);
                }

                logger.info(`✅ ${points.length} embeddings almacenados correctamente en Qdrant.`);
            } catch (error) {
                logger.error(`Error almacenando embeddings en Qdrant: ${error.message}`);
                throw error;
            }
        }
    } catch (error) {
        logger.error(`Error en generateAndStoreEmbeddings: ${error.message}`);
        throw error;
    }
}

/**
 * Buscar promociones similares a un texto
 * @param {string} queryText - Texto de consulta
 * @param {number} limit - Límite de resultados
 * @returns {Promise<Array>} - Resultados de búsqueda
 */
async function searchSimilarPromotions(queryText, limit = 5) {
    try {
        const client = getQdrantClient();
        
        // Generar embedding para el texto de búsqueda
        const embeddings = await createEmbeddings([queryText]);
        
        // Buscar en Qdrant
        const searchResults = await client.search(config.qdrant.collectionName, {
            vector: embeddings[0],
            limit: limit,
            with_payload: true
        });
        
        logger.debug(`Búsqueda realizada para: "${queryText}" con ${searchResults.length} resultados`);
        return searchResults;
    } catch (error) {
        logger.error(`Error buscando promociones similares: ${error.message}`);
        throw error;
    }
}

/**
 * Ver los primeros registros de la colección
 * @param {number} limit - Límite de registros
 * @returns {Promise<Object>} - Resultados
 */
async function scrollPromotions(limit = 10) {
    try {
        await ensureCollectionExists();
        const client = getQdrantClient();
        
        const result = await client.scroll(config.qdrant.collectionName, {
            limit: limit,
            with_vector: true,
            with_payload: true
        });
        
        logger.debug(`Obtenidos ${result.points.length} puntos de Qdrant`);
        return result;
    } 
    catch (error) {
        logger.error(`Error obteniendo puntos de Qdrant: ${error.message}`);
        throw error;
    }
}

module.exports = {
    getQdrantClient,
    generateEmbedding,
    generateAndStoreEmbeddings,
    searchSimilarPromotions,
    ensureCollectionExists,
    scrollPromotions
}; 