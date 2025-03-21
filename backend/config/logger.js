/**
 * Módulo de logging centralizado para la aplicación
 * Provee funciones para diferentes niveles de log con formato consistente
 */

const fs = require('fs');
const path = require('path');
const config = require('./appConfig');

// Asegurar que el directorio de logs existe
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Archivo para logs de errores
const errorLogPath = path.join(logsDir, 'error.log');
const appLogPath = path.join(logsDir, 'app.log');

// Configuración de colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

/**
 * Formatear el timestamp para los logs
 * @returns {string} Timestamp formateado
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Escribir en archivo de log
 * @param {string} filePath - Ruta del archivo de log
 * @param {string} message - Mensaje a escribir
 */
function writeToLogFile(filePath, message) {
  const logEntry = `[${getTimestamp()}] ${message}\n`;
  fs.appendFile(filePath, logEntry, (err) => {
    if (err) console.error(`Error escribiendo en log: ${err.message}`);
  });
}

/**
 * Formatear mensaje para console.log
 * @param {string} level - Nivel de log
 * @param {string} color - Color para el nivel
 * @param {string} message - Mensaje a mostrar
 * @returns {string} Mensaje formateado
 */
function formatConsoleMessage(level, color, message) {
  return `${color}[${level}]${colors.reset} [${getTimestamp()}] ${message}`;
}

const logger = {
  /**
   * Log de información
   * @param {string} message - Mensaje a registrar
   */
  info: (message) => {
    console.log(formatConsoleMessage('INFO', colors.green, message));
    writeToLogFile(appLogPath, `[INFO] ${message}`);
  },

  /**
   * Log de advertencia
   * @param {string} message - Mensaje a registrar
   */
  warn: (message) => {
    console.log(formatConsoleMessage('WARN', colors.yellow, message));
    writeToLogFile(appLogPath, `[WARN] ${message}`);
  },

  /**
   * Log de error
   * @param {string} message - Mensaje a registrar
   */
  error: (message) => {
    console.error(formatConsoleMessage('ERROR', colors.red, message));
    writeToLogFile(errorLogPath, `[ERROR] ${message}`);
  },

  /**
   * Log de depuración - solo en modo desarrollo
   * @param {string} message - Mensaje a registrar
   */
  debug: (message) => {
    if (config.isDevelopment) {
      console.log(formatConsoleMessage('DEBUG', colors.blue, message));
      writeToLogFile(appLogPath, `[DEBUG] ${message}`);
    }
  }
};

module.exports = logger; 