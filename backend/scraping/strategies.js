
async function scrapeBancoCiudad(page) {
  const title = await page.title();
  let allBenefits = [];
  
  try {
    // Wait for promotions to load
    await page.waitForSelector('.card-body', { timeout: 10000 });
    
    // First, analyze the HTML structure to understand the promotion elements
    const htmlStructure = await page.evaluate(() => {
      const sampleCard = document.querySelector('.card-body');
      return sampleCard ? sampleCard.outerHTML : 'No card found';
    });
    
    let hasNextPage = true;
    let pageCounter = 1;
    const limitPage = 10;
    
    while (hasNextPage && pageCounter <= limitPage) {
      console.log(`Scraping page ${pageCounter} of Banco Ciudad...`);
      
      // Extract promotions from current page
      const pageBenefits = await page.$$eval('.card-body', (cards) => {
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

          // Now `texto_descuentos` will contain the discount and cuotas information.

          const metodosContainer = card.querySelector('.d-flex.align-items-center:not([class*="flex-row"]):not([class*="mt-1"]):not([class*="mt-md-3"])');
          let redes_pago = 'Sin métodos disponibles';
          if (metodosContainer) {
            const imgs = metodosContainer.querySelectorAll('.medio-pago');
            if (imgs && imgs.length > 0) {
              redes_pago = Array.from(imgs)
                .map(img => {
                  const altText = img.getAttribute('alt') || '';
                  // Extraer solo el método de pago, eliminando el prefijo "Medio de pago..."
                  return altText.replace(/^Medio de pago\s*/, '').toLowerCase().trim();
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
      
      // Add benefits from current page to our collection
      allBenefits = [...allBenefits, ...pageBenefits];

      // Check if there's a next page button and it's not disabled
      const nextButtonExists = await page.evaluate(() => {
        const nextButton = document.querySelector('.pagination.mb-5 a[title="Siguiente"]');
        return nextButton && !nextButton.classList.contains('disabled');
      });
      
      if (nextButtonExists && pageCounter < limitPage) {
        // Click the next page button
        await Promise.all([
          page.click('.pagination.mb-5 a[title="Siguiente"]'),
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
        ]);
        
        // Wait for the new page content to load
        await page.waitForSelector('.card-body', { timeout: 10000 });
        
        // Add a small delay to ensure page is fully loaded
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        pageCounter++;
      } else {
        hasNextPage = false;
      }
    }
    
    console.log(`Finished scraping Banco Ciudad. Total pages: ${pageCounter}, Total benefits: ${allBenefits.length}`);
    return { title, benefits: allBenefits };
  } catch (error) {
    console.error("Error scraping Banco Ciudad:", error);
    return { title, benefits: allBenefits, error: error.message };
  }
}

const url = process.env.URLS;

// Mapeo de estrategias por URL
const scrapingStrategies = {
  [url]: scrapeBancoCiudad,
};

module.exports = { scrapingStrategies };