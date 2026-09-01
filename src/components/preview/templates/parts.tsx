import type { CSSProperties } from 'react'
import type { Personal, Resume } from '../../../types'
import { toBullets } from '../../../lib/format'
import { Globe, LinkedIn, Mail, Phone, Pin } from '../../ui/icons'

export type TemplateProps = { resume: Resume; accent: string }

/**
 * Toutes les tailles des modèles sont exprimées en `em` : la feuille porte une
 * taille de base unique, ce qui rend le curseur « densité » possible sans
 * retoucher chaque règle.
 */
export function Bullets({ text, style }: { text: string; style?: CSSProperties }) {
  const lines = toBullets(text)
  if (lines.length === 0) return null
  return (
    <div style={{ marginTop: '0.35em', ...style }}>
      {lines.map((line, index) => (
        <div key={index} className="bullet-row" style={{ marginTop: index === 0 ? 0 : '0.2em' }}>
          <span className="bullet-dot">•</span>
          <span style={{ lineHeight: 1.5 }}>{line}</span>
        </div>
      ))}
    </div>
  )
}

export function contactItems(personal: Personal) {
  return [
    { key: 'email', Icon: Mail, value: personal.email },
    { key: 'phone', Icon: Phone, value: personal.phone },
    { key: 'city', Icon: Pin, value: personal.city },
    { key: 'website', Icon: Globe, value: personal.website },
    { key: 'linkedin', Icon: LinkedIn, value: personal.linkedin },
  ].filter((item) => item.value.trim().length > 0)
}

export function Photo({
  src,
  size,
  rounded = '50%',
  ring,
}: {
  src: string
  size: string
  rounded?: string
  ring?: string
}) {
  if (!src) return null
  return (
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        objectFit: 'cover',
        flex: 'none',
        boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
      }}
    />
  )
}

/** Jauge de niveau de compétence, rendue en segments pour rester lisible en PDF. */
export function LevelBar({ level, accent, muted }: { level: number; accent: string; muted: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          style={{
            width: '0.9em',
            height: '0.3em',
            borderRadius: '999px',
            background: step <= level ? accent : muted,
          }}
        />
      ))}
    </span>
  )
}

export function fullName(personal: Personal): string {
  return [personal.firstName, personal.lastName].filter(Boolean).join(' ')
}
