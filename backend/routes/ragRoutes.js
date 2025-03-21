/**
 * Rutas para el servicio RAG
 */

const express = require('express');
const router = express.Router();
const ragService = require('../services/ragService');
const logger = require('../config/logger');

/**
 * @route POST /api/rag/query
 * @desc Consultar promociones usando RAG
 * @access Public
 */
router.post('/query', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question || typeof question !== 'string' || question.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'Se requiere una pregunta válida'
            });
        }
        
        logger.info(`Recibida consulta RAG: "${question}"`);
        const response = await ragService.queryPromotions(question);
        
        return res.status(200).json({
            success: true,
            response,
            requestQuestion: question
        });
    } catch (error) {
        logger.error(`Error en endpoint RAG query: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al procesar la consulta',
            message: error.message
        });
    }
});

/**
 * @route POST /api/rag/search
 * @desc Realizar búsqueda semántica sin generación
 * @access Public
 */
router.post('/search', async (req, res) => {
    try {
        const { query, limit = 5 } = req.body;
        
        if (!query || typeof query !== 'string' || query.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'Se requiere una consulta válida'
            });
        }
        
        if (limit > 20) {
            return res.status(400).json({
                success: false,
                error: 'El límite máximo es 20'
            });
        }
        
        logger.info(`Recibida búsqueda semántica: "${query}" (limit: ${limit})`);
        const results = await ragService.similaritySearch(query, limit);
        
        return res.status(200).json({
            success: true,
            results,
            count: results.length,
            query
        });
    } catch (error) {
        logger.error(`Error en endpoint RAG search: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al realizar la búsqueda',
            message: error.message
        });
    }
});

/**
 * @route GET /api/rag/health
 * @desc Verificar salud del servicio RAG
 * @access Public
 */
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Servicio RAG funcionando correctamente'
    });
});

module.exports = router; 