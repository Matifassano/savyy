/**
 * Script para verificar el estado de los embeddings en Qdrant
 * Útil para diagnosticar problemas o verificar la cantidad de embeddings almacenados
 * 
 * Uso: npm run embedding:check
 */

require('dotenv').config();
const embeddingsHandler = require('../services/embeddingsHandler');
const supabaseService = require('../services/supabaseService');
const logger = require('../config/logger');
const config = require('../config/appConfig');

/**
 * Función principal
 */
async function main() {
    try {
        logger.info('🔍 Verificando estado de embeddings');
        
        // Verificar colección Qdrant
        logger.info(`📊 Verificando colección "${config.qdrant.collectionName}" en Qdrant...`);
        const client = embeddingsHandler.getQdrantClient();
        
        try {
            // Obtener información de la colección
            const collectionInfo = await client.getCollection(config.qdrant.collectionName);
            logger.info('✅ Colección encontrada en Qdrant');
            logger.info(`📋 Configuración: ${JSON.stringify(collectionInfo.config.params.vectors, null, 2)}`);
            
            // Obtener conteo de puntos
            const countInfo = await client.getCollectionInfo(config.qdrant.collectionName);
            logger.info(`🔢 Puntos en Qdrant: ${countInfo.points_count}`);
            
            // Obtener algunos ejemplos
            const samples = await embeddingsHandler.scrollPromotions(5);
            logger.info(`📋 Muestra de ${samples.points.length} puntos:`);
            
            for (const point of samples.points) {
                logger.info(`   🔹 ID: ${point.id}, Banco: ${point.payload.bank}, Título: ${point.payload.title}`);
            }
            
            // Verificar estado en Supabase
            const supabase = supabaseService.getSupabaseClient();
            const { count: totalCount } = await supabase
                .from('promotions')
                .select('*', { count: 'exact', head: true });
                
            const { count: embeddedCount } = await supabase
                .from('promotions')
                .select('*', { count: 'exact', head: true })
                .eq('embedding_generated', true);
                
            logger.info(`📊 Estadísticas de Supabase:`);
            logger.info(`   📈 Total de promociones: ${totalCount}`);
            logger.info(`   📈 Promociones con embedding: ${embeddedCount}`);
            logger.info(`   📈 Promociones pendientes: ${totalCount - embeddedCount}`);
            
            // Verificar discrepancias
            if (countInfo.points_count !== embeddedCount) {
                logger.warn(`⚠️ Discrepancia: ${countInfo.points_count} puntos en Qdrant vs ${embeddedCount} promociones con embedding en Supabase`);
            } else {
                logger.info('✅ Coherencia entre Qdrant y Supabase verificada');
            }
            
        } catch (error) {
            if (error.message.includes('not found') || error.message.includes('does not exist')) {
                logger.error(`❌ La colección "${config.qdrant.collectionName}" no existe en Qdrant`);
                logger.info('💡 Ejecuta "npm run embedding:generate" para crearla e insertar embeddings');
            } else {
                throw error;
            }
        }
        
    } catch (error) {
        logger.error(`❌ Error verificando embeddings: ${error.message}`);
        process.exit(1);
    }
}

// Ejecutar la función principal
main()
    .then(() => process.exit(0))
    .catch(error => {
        logger.error(`❌ Error no controlado: ${error.message}`);
        process.exit(1);
    }); 