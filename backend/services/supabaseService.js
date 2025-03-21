/**
 * Servicio centralizado para Supabase
 * Proporciona una instancia singleton del cliente Supabase y métodos de acceso
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('../config/appConfig');
const logger = require('../config/logger');

// Cliente Supabase singleton
let supabaseClient = null;

/**
 * Obtener o crear cliente Supabase
 * @returns {Object} Cliente Supabase
 */
function getSupabaseClient() {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(config.supabase.url, config.supabase.key);
      logger.debug('Cliente Supabase inicializado correctamente');
    } catch (error) {
      logger.error(`Error inicializando cliente Supabase: ${error.message}`);
      throw error;
    }
  }
  return supabaseClient;
}

/**
 * Obtener promociones sin embeddings generados
 * @param {number} limit - Límite de registros a obtener
 * @returns {Promise<Array>} - Promociones sin embeddings
 */
async function getPromotionsWithoutEmbeddings(limit = 100) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('embedding_generated', false)
      .limit(limit);
      
    if (error) throw error;
    
    logger.debug(`Obtenidas ${data.length} promociones sin embeddings`);
    return data;
  } catch (error) {
    logger.error(`Error obteniendo promociones sin embeddings: ${error.message}`);
    throw error;
  }
}

/**
 * Actualizar estado de embedding generado
 * @param {number|string} promoId - ID de la promoción
 * @param {boolean} status - Estado a establecer
 * @returns {Promise<Object>} - Resultado de la operación
 */
async function updateEmbeddingStatus(promoId, status = true) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('promotions')
      .update({ embedding_generated: status })
      .eq('id', promoId);
      
    if (error) throw error;
    
    logger.debug(`Actualizado estado de embedding para promoción ID ${promoId}`);
    return data;
  } catch (error) {
    logger.error(`Error actualizando estado de embedding: ${error.message}`);
    throw error;
  }
}

/**
 * Obtener todas las promociones
 * @param {number} limit - Límite de registros a obtener
 * @returns {Promise<Array>} - Promociones
 */
async function getAllPromotions(limit = 100) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .limit(limit);
      
    if (error) throw error;
    
    logger.debug(`Obtenidas ${data.length} promociones`);
    return data;
  } catch (error) {
    logger.error(`Error obteniendo promociones: ${error.message}`);
    throw error;
  }
}

// Exportar funciones
module.exports = {
  getSupabaseClient,
  getPromotionsWithoutEmbeddings,
  updateEmbeddingStatus,
  getAllPromotions
}; 