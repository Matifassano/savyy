export async function fetchScrapingData() {
    try {
      const response = await fetch("http://localhost:3000/api/scrape");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los datos del scraper:", error);
      return null;
    }
  }

// Nueva función para iniciar manualmente el proceso de scraping
export async function triggerScraping() {
  try {
    const response = await fetch("http://localhost:3000/api/scrape/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al iniciar el scraping:", error);
    return null;
  }
}