import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  renderRoute,
  ROUTES,
  SITE_TITLE,
  SITE_DESCRIPTION,
  FAQ,
} from '../dist-ssr/entry-static.js'

/**
 * Génère un fichier HTML complet par page publique, avec ses propres
 * métadonnées, puis les fichiers de référencement.
 *
 * L'adresse du site est nécessaire : URL canoniques, balises Open Graph et plan
 * du site exigent des adresses absolues. Elle se règle par SITE_URL.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://top-cv.vercel.app').replace(/\/$/, '')

const escape = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Données structurées. Le schéma de l'application est déclaré sans bloc
 * tarifaire : le prix n'est annoncé qu'une fois le CV rédigé, il n'a donc pas
 * à apparaître dans les résultats de recherche.
 */
function jsonLd(route) {
  const graph = []

  graph.push({
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#site`,
    url: `${SITE_URL}/`,
    name: 'CV Studio',
    inLanguage: 'fr-FR',
    description: SITE_DESCRIPTION,
  })

  if (route.path === '/') {
    graph.push({
      '@type': 'SoftwareApplication',
      name: 'CV Studio',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'fr-FR',
      url: `${SITE_URL}/`,
      description: SITE_DESCRIPTION,
    })
    graph.push({
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  } else {
    const segments = route.path.split('/').filter(Boolean)
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: route.title.split(/[:—]/)[0].trim(),
          item: `${SITE_URL}${route.path}`,
        },
      ],
      // Conservé pour la lisibilité du fil : le premier segment situe la rubrique.
      name: segments[0],
    })
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

function head(route) {
  const url = `${SITE_URL}${route.path === '/' ? '/' : route.path}`
  return `
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CV Studio" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escape(route.title)}" />
    <meta property="og:description" content="${escape(route.description)}" />
    <meta property="og:image" content="${SITE_URL}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Aperçu de l’éditeur CV Studio et de deux modèles de CV." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(route.title)}" />
    <meta name="twitter:description" content="${escape(route.description)}" />
    <meta name="twitter:image" content="${SITE_URL}/og.png" />
    <script type="application/ld+json">${jsonLd(route)}</script>
`
}

const shell = readFileSync('dist/index.html', 'utf8')

for (const route of ROUTES) {
  let html = shell

  // Titre et description viennent d'ici, pas du gabarit : une seule
  // formulation par page, et aucun écart entre l'onglet et l'aperçu partagé.
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(route.title)}</title>`)
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escape(route.description)}" />`,
  )
  html = html.replace('</head>', `${head(route)}  </head>`)
  html = html.replace('<div id="root"></div>', `<div id="root">${renderRoute(route.path)}</div>`)

  // Fichier plat (`cv/developpeur.html`) plutôt que dossier avec index : évite
  // que `/x` et `/x/` répondent tous les deux, ce qui dédoublerait chaque page
  // aux yeux des moteurs.
  const file = route.path === '/' ? 'dist/index.html' : join('dist', `${route.path}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

// Page d'erreur : sans elle, une adresse inconnue tomberait sur le 404 par
// défaut de l'hébergeur, sans navigation ni identité.
const notFound = shell
  .replace(/<title>[^<]*<\/title>/, '<title>Page introuvable — CV Studio</title>')
  .replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    '<meta name="description" content="Cette page n’existe pas." />',
  )
  .replace('<div id="root"></div>', `<div id="root">${renderRoute('/')}</div>`)
writeFileSync('dist/404.html', notFound)

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
${ROUTES.map(
  (route) => `  <url>
    <loc>${SITE_URL}${route.path === '/' ? '/' : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`,
).join('\n')}
</urlset>
`,
)

console.log(
  `postbuild : ${ROUTES.length} pages prérendues, métadonnées et référencement écrits pour ${SITE_URL}`,
)
