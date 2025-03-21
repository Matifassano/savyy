const {QdrantClient} = require('@qdrant/js-client-rest');
const { createEmbeddings, verifyEmbeddingDimension } = require('./embeddingService');
const supabase = require('./supabase');

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

const collectionName = 'promotions';

// Verificar si la colección existe, si no, crearla
async function ensureCollectionExists() {
    try {
        const collections = await client.getCollections();
        const collectionExists = collections.collections.some(c => c.name === collectionName);
        
        if (!collectionExists) {
            console.log("Creating 'promotions' collection with OpenAI embedding dimensions");
            await client.createCollection(collectionName, {
                vectors: {
                    size: 1536, // OpenAI text-embedding-3-small tiene 1536 dimensiones
                    distance: 'Cosine'
                },
            });
            console.log("Collection 'promotions' created successfully");
        } else {
            console.log("Collection 'promotions' already exists");
            // Si la colección ya existe pero tiene una dimensión diferente, recrearla
            const collectionInfo = await client.getCollection(collectionName);
            const currentSize = collectionInfo.config.params.vectors.size;
            
            if (currentSize !== 1536) {
                console.log(`Recreating '${collectionName}' collection. Current size: ${currentSize}, needed: 1536`);
                await client.deleteCollection(collectionName);
                await client.createCollection(collectionName, {
                    vectors: {
                        size: 1536,
                        distance: 'Cosine'
                    },
                });
                console.log(`Collection '${collectionName}' recreated with correct dimensions`);
            }
        }
    } catch (error) {
        console.error("Error ensuring collection exists:", error);
        throw error;
    }
}

async function generateEmbedding(promo) {
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

    // Verificar la dimensión del embedding (1536 para OpenAI)
    if (!verifyEmbeddingDimension(embedding, 1536)) {
        console.error("El embedding no tiene la dimensión esperada (1536)");
    }

    return embedding; // Retorna el vector de embedding
}

async function generateAndStoreEmbeddings() {
    // Asegurarse de que la colección existe con las dimensiones correctas
    await ensureCollectionExists();

    // Obtener promociones de Supabase
    const { data: promotions, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('embedding_generated', false);

    if (error) {
        console.error("Error fetching promotions:", error);
        return;
    }

    console.log(`Found ${promotions.length} promotions to generate embeddings for.`);

    const points = [];

    // Iterar sobre cada promoción y generar embeddings
    for (const promo of promotions) {
        try {
            const pointId = promo.id;

            // Validar si ya está en Qdrant
            const exists = await client.retrieve(collectionName, pointId).catch(() => null);
            if (exists) {
                console.log(`Embedding for promotion "${promo.title}" already exists. Skipping.`);
                continue; // Ya existe, salteamos
            }

            const embedding = await generateEmbedding(promo);

            const point = {
                id: pointId,  // Qdrant acepta ID como string o número
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
        } catch (error) {
            console.error(`Error generating embedding for promotion "${promo.title}":`, error);
        }
    }

    if (points.length > 0) {
        try {
            // 🔁 Insertar todos los embeddings en una sola llamada
            await client.upsert('promotions', { points });

            console.log(`✅ ${points.length} embeddings stored successfully in Qdrant.`);
        } catch (error) {
            console.error("Error storing embeddings in Qdrant:", error);
        }
    }
}


// Función para buscar promociones similares
async function searchSimilarPromotions(queryText, limit = 5) {
    try {
        // Generar embedding para el texto de búsqueda con OpenAI
        const embeddings = await createEmbeddings([queryText]);
        
        // Buscar en Qdrant
        const searchResults = await client.search({
            collection_name: 'promotions',
            vector: embeddings[0],
            limit: limit,
        });
        
        return searchResults;
    } catch (error) {
        console.error("Error searching similar promotions:", error);
        throw error;
    }
}

async function scrollPromotions() {
    await ensureCollectionExists();
    try {
        const result = await client.scroll(collectionName, {
            limit: 10,
            with_vector: true,
            with_payload: true
        });
        console.log("Points in Qdrant:", result.points);
    } 
    catch (error) {
        console.error("Error scrolling promotions:", error);
        throw error;
    }
}

// Exportar las funciones
module.exports = {
    generateEmbedding,
    generateAndStoreEmbeddings,
    searchSimilarPromotions,
    ensureCollectionExists,
    scrollPromotions,
    client
};

