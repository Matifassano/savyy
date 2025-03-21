export async function fetchScrapingData() {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/scrape`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos del scraper:", error);
    return null;
  }
}

export async function refreshScrapingData() {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/scrape/refresh`, {
      method: "POST",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al refrescar los datos del scraper:", error);
    return null;
  }
}

// Función para determinar la URL base de la API
function getApiBaseUrl() {
  // Determinar si estamos en desarrollo o producción
  const isProduction = window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // En producción, usamos la API de Railway
    return 'https://savyy-production-afe9.up.railway.app/api';
  }
  
  // En desarrollo local
  return '/api';
}