async function scrapeBancoCiudad(page) {
  const title = await page.title();
  
  try {
    // Wait for promotions to load
    await page.waitForSelector('.card-body', { timeout: 10000 });
    
    // First, analyze the HTML structure to understand the promotion elements
    const htmlStructure = await page.evaluate(() => {
      const sampleCard = document.querySelector('.card-body');
      return sampleCard ? sampleCard.outerHTML : 'No card found';
    });
    
    console.log("Banco Ciudad HTML structure sample:", htmlStructure);
    
    // Extract all promotions
    const benefits = await page.$$eval('.card-body', (cards) => {
      return cards.map(card => {
        // Log the structure of each card for debugging
        console.log("Processing card:", card.outerHTML);
        
        const title = card.querySelector('.card-title')?.innerText?.trim() || 'Sin título';
        // Get the discount element
        const descuentoElement = card.querySelector('.min-height-texto p.card-text.card-title-descuento');
        // Get the installment element - make sure we're getting the correct element for cuotas
        const cuotasElement = card.querySelector('.min-height-texto p.card-text:not(.card-title-descuento)');        
        // Extract text from elements with better fallbacks
        const descuento = descuentoElement?.innerText?.trim() || 'Sin descuento';
        const cuotas = cuotasElement?.innerText?.trim() || 'Sin C/I';
        
        // Create array for discount and installment info
        const texto_descuentos = [];
        
        // Only add non-default discount
        if (descuento && descuento !== 'Sin descuento') {
            texto_descuentos.push(descuento);
        }
        
        // Only add non-default installment info
        if (cuotas && cuotas !== 'Sin C/I') {
            texto_descuentos.push(cuotas);
        }
        
        // If both are empty or default, add a default message
        if (texto_descuentos.length === 0) {
            texto_descuentos.push('Sin beneficios');
        }
        const metodosContainer = card.querySelector('.d-flex.align-items-center:not([class*="flex-row"]):not([class*="mt-1"]):not([class*="mt-md-3"])');
        let redes_pago = 'Sin métodos disponibles';
        if (metodosContainer) {
          const imgs = metodosContainer.querySelectorAll('.medio-pago');
          if (imgs && imgs.length > 0) {
            redes_pago = Array.from(imgs)
              .map(img => {
                const altText = img.getAttribute('alt') || '';
                // Extraer solo el método de pago, eliminando el prefijo "Medio de pago..."
                return altText.replace(/^Medio de pago\s*/, '').trim();
              })
              .filter(alt => alt)
              .join(', ');
          }
        }


        const diasContainer = card.querySelector('.d-flex.flex-row.align-items-center.mt-1.mt-md-3');
        let dias_validos = 'Sin fecha de validez';
        if (diasContainer) {
          const diasSpans = diasContainer.querySelectorAll('.card-text.ps-2.dia-beneficio.fw-bold, .card-text.ps-2.dia-beneficio');
          if (diasSpans && diasSpans.length > 0) {
            dias_validos = Array.from(diasSpans)
              .map(span => span.innerText.trim())
              .filter(text => text)
              .join(', ');
          }
        }
        
        return {
          title,
          benefits: texto_descuentos.join(', '),
          payment_network: redes_pago,
          valid_until: dias_validos
        };
      });
    });
    
    return { title, benefits };
  } catch (error) {
    console.error("Error scraping Banco Ciudad:", error);
    return { title, benefits: [], error: error.message };
  }
}
  
async function scrapeBancoSemananacion(page) {
  const title = await page.title();
  
  try {
    // Wait for promotions to load
    await page.waitForSelector('.beneficio-item', { timeout: 1000 });
    
    // Extract all promotions
    const promociones = await page.$$eval('.beneficio-item', (cards) => {
      return cards.map(card => {
        const titulo = card.querySelector('.beneficio-title')?.innerText || 'Sin título';
        const descripcion = card.querySelector('.beneficio-description')?.innerText || 'Sin descripción';
        const categoria = card.querySelector('.beneficio-category')?.innerText || 'Sin categoría';
        const imagen = card.querySelector('img')?.src || '';
        const validez = card.querySelector('.beneficio-validity')?.innerText || 'Sin fecha de validez';
        
        return {
          titulo,
          descripcion,
          categoria,
          imagen,
          validez
        };
      });
    });
    
    return { title, promociones };
  } catch (error) {
    console.error("Error scraping BBVA:", error);
    return { title, promociones: [], error: error.message };
  }
}

async function scrapeBancoGalicia(page) {
  const title = await page.title();
  
  try {
    // Wait for promotions to load
    await page.waitForSelector('.promocion-item', { timeout: 1000 });
    
    // Extract all promotions
    const promociones = await page.$$eval('.promocion-item', (cards) => {
      return cards.map(card => {
        const titulo = card.querySelector('.promocion-titulo')?.innerText || 'Sin título';
        const descripcion = card.querySelector('.promocion-descripcion')?.innerText || 'Sin descripción';
        const categoria = card.querySelector('.promocion-categoria')?.innerText || 'Sin categoría';
        const imagen = card.querySelector('img')?.src || '';
        const validez = card.querySelector('.promocion-validez')?.innerText || 'Sin fecha de validez';
        
        return {
          titulo,
          descripcion,
          categoria,
          imagen,
          validez
        };
      });
    });
    
    return { title, promociones };
  } catch (error) {
    console.error("Error scraping Banco Galicia:", error);
    return { title, promociones: [], error: error.message };
  }
}

async function scrapeBancoBBVA(page) {
  const title = await page.title();
  
  try {
    await page.waitForSelector('.styles_cardBody__PvtoA', { timeout: 10000 });
    
    // First, analyze the HTML structure to understand the promotion elements
    const htmlStructure = await page.evaluate(() => {
      const sampleCard = document.querySelector('.styles_cardBody__PvtoA');
      return sampleCard ? sampleCard.outerHTML : 'No card found';
    });
    
    console.log("Banco BBVA HTML structure sample:", htmlStructure);
    
    // Extract all promotions
    const promociones = await page.$$eval('.styles_cardBody__PvtoA', (cards) => {
      return cards.map(card => {
        const titulo = card.querySelector('h2.styles_title__62rwZ')?.innerText || 'Sin título';
        const descripcionCompleta = card.querySelector('.styles_fiveLines___hiC1.styles_description__McSt1')?.innerText || 'Sin beneficios';
        const descripcion = descripcionCompleta.split('.')[0] + '.';
        const validez = descripcionCompleta.split('.').slice(1).join('.').trim() || 'Sin fecha de validez';
        
        return {
          titulo,
          descripcion,
          validez
        };
      });
    });
    
    return { title, promociones };
  } catch (error) {
    console.error("Error scraping Banco Nación:", error);
    return { title, promociones: [], error: error.message };
  }
}


// Mapeo de estrategias por URL
const scrapingStrategies = {
  "https://www.bancociudad.com.ar/beneficios/promo?pagina=1": scrapeBancoCiudad,
  "https://go.bbva.com.ar/fgo/web_beneficios/beneficios/beneficios": scrapeBancoBBVA,
  "https://www.galicia.ar/personas/buscador-de-promociones": scrapeBancoGalicia,
  "https://semananacion.com.ar/buscador": scrapeBancoSemananacion,
};

module.exports = { scrapingStrategies };
  