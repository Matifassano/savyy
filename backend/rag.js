const { QdrantClient } = require('@qdrant/js-client-rest');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { formatDocumentsAsString } = require('langchain/util/document');
require('dotenv').config();

// Inicializar el cliente de Qdrant
const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

// Crear un modelo de chat con OpenAI usando gpt-4o-mini
const llm = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.2, // Menor temperatura para respuestas más deterministas
    apiKey: process.env.OPENAI_API_KEY,
});

const collectionName = 'promotions';

// Función para realizar búsqueda de similitud en Qdrant
async function similaritySearch(query, limit = 5) {
    try {
        // Generar embedding para la consulta
        const { createEmbeddings } = require('./embeddingService');
        const embeddings = await createEmbeddings([query]);
        
        // Buscar en la colección de Qdrant
        const results = await qdrantClient.search( collectionName,{
            vector: embeddings[0],
            limit: limit,
            with_payload: true
        });
        
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
        console.error('Error en la búsqueda de similitud:', error);
        throw error;
    }
}

// Crear una plantilla de prompt con contexto
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
    

// Crear la cadena de procesamiento RAG
const createRagChain = () => {
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
};

// Función para consultar promociones
async function queryPromotions(question) {
    try {
        const ragChain = createRagChain();
        const response = await ragChain.invoke({ question });
        return response;
    } catch (error) {
        console.error('Error al consultar promociones:', error);
        throw error;
    }
}

// Exportar la función para su uso en otras partes de la aplicación
module.exports = {
    queryPromotions
};

// Solo ejecutar la consulta si este archivo se llama directamente
if (require.main === module) {
    const testQuestion = "¿Cuáles son las mejores promociones para tarjetas de crédito Visa?";
    
    console.log(`Consultando: "${testQuestion}"`);
    queryPromotions(testQuestion)
        .then(response => {
            console.log("\nRespuesta:\n", response);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
