import { readFileSync, writeFileSync } from 'node:fs'
import { renderLanding } from '../dist-ssr/entry-static.js'

/**
 * Après la compilation : fige la page d'accueil dans le HTML, y pose les
 * métadonnées de partage, et écrit les fichiers de référencement.
 *
 * L'adresse du site est nécessaire : les balises Open Graph et le plan du site
 * exigent des URL absolues. Elle se règle par SITE_URL, à définir dans Vercel.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://top-cv.vercel.app').replace(/\/$/, '')

const TITLE = 'CV Studio — créez un CV professionnel et téléchargez-le en PDF'
const DESCRIPTION =
  'Éditeur de CV en ligne : aperçu A4 en temps réel, 5 modèles, import de votre profil LinkedIn (recommandations comprises) et export PDF au texte réel, lisible par les logiciels de tri des recruteurs.'

const head = `
    <link rel="canonical" href="${SITE_URL}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CV Studio" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content="${SITE_URL}/" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />
    <meta property="og:image" content="${SITE_URL}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Aperçu de l’éditeur CV Studio et de deux modèles de CV." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${TITLE}" />
    <meta name="twitter:description" content="${DESCRIPTION}" />
    <meta name="twitter:image" content="${SITE_URL}/og.png" />
`

const file = 'dist/index.html'
let html = readFileSync(file, 'utf8')

// Titre et description viennent d'ici, pas du gabarit : une seule formulation
// à tenir à jour, et aucun écart possible entre l'onglet et l'aperçu partagé.
html = html.replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`)
html = html.replace(
  /<meta\s+name="description"[\s\S]*?\/>/,
  `<meta name="description" content="${DESCRIPTION}" />`,
)

if (!html.includes('og:title')) {
  html = html.replace('</head>', `${head}  </head>`)
}

const markup = renderLanding()
html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
writeFileSync(file, html)

writeFileSync(
  'dist/robots.txt',
  `User-agent: *
Allow: /
# L'éditeur n'a rien à indexer : c'est une application, pas une page.
Disallow: /editeur
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
)

console.log(
  `postbuild : accueil prérendue (${markup.length} octets), métadonnées et référencement écrits pour ${SITE_URL}`,
)
