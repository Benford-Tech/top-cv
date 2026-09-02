import { renderToStaticMarkup } from 'react-dom/server'
import type { Resume } from '../../src/types'
import { FONTS } from '../../src/data/defaults'
import { templateById } from '../../src/components/preview/templates'

/**
 * Rend le CV en document HTML autonome, destiné au moteur PDF.
 *
 * Les mêmes composants React servent à l'aperçu et au PDF : un seul jeu de
 * modèles à maintenir, et aucun risque de voir le document payé différer de ce
 * que l'utilisateur avait sous les yeux.
 *
 * Les modèles portent l'essentiel de leur mise en forme en styles en ligne. Le
 * peu de classes utilitaires qu'ils emploient est redéfini ici explicitement,
 * plutôt que d'embarquer Tailwind côté serveur pour six règles.
 */
const SHEET = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; }
  .resume-page {
    width: 210mm;
    min-height: 297mm;
    background: #fff;
    position: relative;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  h1, h2, h3, p, figure, blockquote { margin: 0; }
  ul { margin: 0; padding: 0; list-style: none; }
  .avoid-break { break-inside: avoid; page-break-inside: avoid; }
  .bullet-row { display: flex; gap: 0.5em; }
  .bullet-dot { flex: none; line-height: 1.5; }
  .h-\\[1em\\] { height: 1em; }
  .w-\\[1em\\] { width: 1em; }
  .mt-\\[0\\.2em\\] { margin-top: 0.2em; }
  .shrink-0 { flex-shrink: 0; }
`

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Source+Serif+4:opsz,wght@8..60,300..700&family=Lato:wght@300;400;700&family=Roboto+Slab:wght@300;400;600&display=swap'

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (char) =>
    char === '&' ? '&amp;' : char === '<' ? '&lt;' : char === '>' ? '&gt;' : '&quot;',
  )
}

export function renderResumeHtml(resume: Resume): string {
  const { Component } = templateById(resume.settings.template)
  const font = FONTS.find((item) => item.id === resume.settings.font) ?? FONTS[0]

  const body = renderToStaticMarkup(
    <div
      className="resume-page"
      style={{
        fontFamily: font.stack,
        fontSize: `${10.5 * resume.settings.scale}pt`,
        lineHeight: 1.45,
        color: '#1f2937',
      }}
    >
      <Component resume={resume} accent={resume.settings.accent} />
    </div>,
  )

  const name = escapeHtml(
    [resume.personal.firstName, resume.personal.lastName].filter(Boolean).join(' ') || 'CV',
  )

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${name}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_LINK}">
<style>${SHEET}</style>
</head>
<body>${body}</body>
</html>`
}
