/**
 * Script para generar embeddings de forma manual
 * Útil para regenerar embeddings o procesar nuevas promociones
 * 
 * Uso: npm run embedding:generate -- [--force] [--limit=100]
 * --force: Regenera todos los embeddings, incluso los ya generados
 * --limit: Limita el número de promociones a procesar (por defecto 100)
 */

require('dotenv').config();
const supabaseService = require('../services/supabaseService');
const embeddingsHandler = require('../services/embeddingsHandler');
const logger = require('../config/logger');

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const force = args.includes('--force');
const limitArg = args.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 100;

async function main() {
    try {
        logger.info('📊 Iniciando generación de embeddings');
        logger.info(`📋 Configuración: force=${force}, limit=${limit}`);
        
        // Verificar y crear la colección si es necesario
        logger.info('🔍 Verificando colección en Qdrant...');
        await embeddingsHandler.ensureCollectionExists();
        
        // Si es forzado, obtener todas las promociones, sino solo las que no tienen embedding
        let promotions;
        if (force) {
            logger.info('🔄 Modo forzado: Obteniendo todas las promociones...');
            promotions = await supabaseService.getAllPromotions(limit);
            
            // Si force, marcar todas como no procesadas primero
            for (const promo of promotions) {
                await supabaseService.updateEmbeddingStatus(promo.id, false);
            }
        } else {
            logger.info('🔍 Obteniendo promociones sin embeddings...');
            promotions = await supabaseService.getPromotionsWithoutEmbeddings(limit);
        }
        
        if (promotions.length === 0) {
            logger.info('✅ No hay promociones pendientes para generar embeddings');
            return;
        }
        
        logger.info(`🔢 Se procesarán ${promotions.length} promociones`);
        
        // Generar y almacenar embeddings
        await embeddingsHandler.generateAndStoreEmbeddings();
        
        logger.info('✅ Proceso de generación de embeddings completado con éxito');
    } catch (error) {
        logger.error(`❌ Error en la generación de embeddings: ${error.message}`);
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