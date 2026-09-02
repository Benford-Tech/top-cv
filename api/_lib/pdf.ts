import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

/**
 * Fabrique le PDF à partir du HTML rendu.
 *
 * C'est ici que se joue le verrou du produit : le document en pleine qualité
 * n'existe que sur le serveur, une fois le paiement vérifié. Tant qu'il était
 * produit par l'impression du navigateur, aucun contrôle n'était possible.
 */
async function launch() {
  // En développement et dans les tests, on pointe sur un Chromium déjà présent ;
  // en production, le binaire embarqué pour l'environnement serverless.
  const local = process.env.CHROMIUM_PATH
  if (local) {
    return puppeteer.launch({
      executablePath: local,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
      headless: true,
    })
  }
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  })
}

export async function renderPdf(html: string): Promise<Uint8Array> {
  const browser = await launch()
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load', timeout: 20_000 })
    // Attendre explicitement les polices : sans cela le PDF sort dans la police
    // de repli, avec une justification différente de l'aperçu. On n'échoue pas
    // pour autant si elles sont injoignables — un CV dans la police système
    // vaut mieux qu'une erreur.
    await page
      .evaluate(() => document.fonts.ready.then(() => undefined))
      .catch(() => undefined)
    await page.emulateMediaType('print')
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    })
  } finally {
    await browser.close()
  }
}
