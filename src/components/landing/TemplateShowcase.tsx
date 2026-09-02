import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * `useLayoutEffect` n'a pas d'équivalent au rendu serveur et y déclenche un
 * avertissement. La mesure ne concerne que le navigateur : côté serveur, l'état
 * initial (210 mm à 96 ppp, soit 794 px) suffit et donne le même HTML des deux
 * côtés, ce qui garde l'hydratation silencieuse.
 */
const useMeasureEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
import type { Resume, TemplateId } from '../../types'
import { FONTS } from '../../data/defaults'
import { templateById } from '../preview/templates'

/**
 * Vignette d'un modèle : c'est le vrai composant du CV, rendu à taille réelle
 * puis réduit. Les aperçus de la galerie ne peuvent donc pas diverger de ce que
 * l'utilisateur obtiendra.
 */
export function TemplateShowcase({
  id,
  resume,
  width = 200,
}: {
  id: TemplateId
  resume: Resume
  width?: number
}) {
  const pageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(width / 794)
  const { Component } = templateById(id)
  const font = FONTS.find((item) => item.id === resume.settings.font) ?? FONTS[0]

  useMeasureEffect(() => {
    const page = pageRef.current
    if (!page?.offsetWidth) return
    setScale(width / page.offsetWidth)
  }, [width])

  return (
    <div
      className="overflow-hidden rounded-lg bg-white ring-1 ring-slate-900/10"
      style={{ width, height: Math.round(width * (297 / 210)) }}
    >
      <div
        ref={pageRef}
        className="resume-page"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          fontFamily: font.stack,
          fontSize: '10.5pt',
          lineHeight: 1.45,
          color: '#1f2937',
          boxShadow: 'none',
        }}
        aria-hidden="true"
      >
        <Component resume={resume} accent={resume.settings.accent} />
      </div>
    </div>
  )
}
