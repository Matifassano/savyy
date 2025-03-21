const express = require('express');
const router = express.Router();

// Intenta importar la función queryPromotions, pero proporciona una alternativa en caso de error
let queryPromotions;
try {
    const rag = require('../rag');
    queryPromotions = rag.queryPromotions;
} catch (error) {
    console.warn('Advertencia: No se pudo cargar el módulo RAG:', error.message);
    // Función simulada para permitir que el servidor siga funcionando
    queryPromotions = async (question) => {
        return `Lo siento, el sistema RAG no está disponible en este momento. Por favor, inténtalo más tarde. (Error: ${error.message})`;
    };
}

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
        
        try {
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
            
            // Si hay un error específico relacionado con la API de OpenAI
            if (error.message && error.message.includes('OpenAI')) {
                return res.status(503).json({
                    success: false,
                    message: 'Servicio de OpenAI temporalmente no disponible',
                    error: error.message
                });
            }
            
            // Error general
            res.status(500).json({
                success: false,
                message: 'Error al procesar la consulta',
                error: error.message
            });
        }
    } catch (error) {
        console.error('Error inesperado en la ruta RAG:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
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

// Ruta para verificar el estado del servicio RAG
router.get('/health', async (req, res) => {
    try {
        // Consulta simple para verificar si el sistema RAG está funcionando
        const startTime = Date.now();
        await queryPromotions('test');
        const responseTime = Date.now() - startTime;
        
        res.json({
            success: true,
            status: 'ok',
            responseTime: `${responseTime}ms`
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            status: 'error',
            message: 'El servicio RAG no está funcionando correctamente',
            error: error.message
        });
    }
});

module.exports = router; 