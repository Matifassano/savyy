const express = require('express');
const { queryPromotions } = require('../rag');
const router = express.Router();

// Ruta para realizar consultas RAG
router.post('/query', async (req, res) => {
    try {
        const { question } = req.body;
        
        // Validar que se ha proporcionado una pregunta
        if (!question || typeof question !== 'string' || question.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Se requiere una pregunta válida'
            });
        }
        
        // Procesar la consulta
        console.log(`RAG Consulta: "${question}"`);
        const startTime = Date.now();
        
        const answer = await queryPromotions(question);
        
        const elapsedTime = Date.now() - startTime;
        console.log(`RAG Respuesta generada en ${elapsedTime}ms`);
        
        // Devolver la respuesta
        res.json({
            success: true,
            question,
            answer,
            processingTime: elapsedTime
        });
    } catch (error) {
        console.error('Error en el procesamiento RAG:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la consulta',
            error: error.message
        });
    }
});

// Ruta para obtener información sobre el modelo y las capacidades RAG
router.get('/info', (req, res) => {
    res.json({
        success: true,
        info: {
            model: 'gpt-4o-mini',
            capabilities: [
                'Consultas sobre promociones bancarias',
                'Información sobre beneficios de tarjetas',
                'Filtrado por bancos y tipos de tarjetas',
                'Detalles sobre fechas de validez de promociones'
            ],
            examples: [
                '¿Qué promociones hay disponibles para tarjetas Visa?',
                '¿Cuáles son los mejores descuentos de BBVA?',
                '¿Hay promociones de cashback en Banco Galicia?',
                '¿Qué beneficios ofrece Banco Ciudad este mes?'
            ]
        }
    });
});

module.exports = router; 