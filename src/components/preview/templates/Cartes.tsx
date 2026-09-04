import type { ReactNode } from 'react'
import { formatRange } from '../../../lib/format'
import {
  Bullets,
  Photo,
  RecommendationList,
  contactItems,
  fullName,
  type TemplateProps,
} from './parts'

/**
 * Chaque rubrique dans son cadre.
 *
 * Les cadres sont posés section par section et non autour de la page : un
 * encadrement de page se coupe mal d'une feuille à l'autre, alors qu'un cadre
 * par rubrique se referme avant le saut — `avoid-break` s'en charge.
 */
export function Cartes({ resume, accent }: TemplateProps) {
  const { personal, settings, labels } = resume
  const contacts = contactItems(personal)

  const card = (title: string, children: ReactNode, extra?: boolean) => (
    <section
      className={extra ? undefined : 'avoid-break'}
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '3mm',
        padding: '5mm 6mm',
        marginBottom: '4mm',
        background: '#fff',
      }}
    >
      <h2
        style={{
          fontSize: '0.85em',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: accent,
          marginBottom: '0.7em',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )

  return (
    <div style={{ padding: '10mm', background: '#f8fafc' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6mm',
          border: '1px solid #e2e8f0',
          borderTop: `4px solid ${accent}`,
          borderRadius: '3mm',
          padding: '6mm',
          marginBottom: '4mm',
          background: '#fff',
        }}
      >
        {settings.showPhoto && personal.photo ? (
          <Photo src={personal.photo} size="26mm" rounded="2mm" />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '1.9em', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
            {fullName(personal) || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p style={{ fontSize: '1em', color: accent, fontWeight: 500 }}>{personal.title}</p>
          ) : null}
          {contacts.length > 0 ? (
            <div
              style={{
                marginTop: '0.7em',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.25em 1em',
                fontSize: '0.8em',
                color: '#64748b',
              }}
            >
              {contacts.map(({ key, Icon, value }) => (
                <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35em' }}>
                  <Icon className="h-[1em] w-[1em]" />
                  {value}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {resume.summary.trim()
        ? card(
            labels.summary,
            <p style={{ lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-line' }}>
              {resume.summary}
            </p>,
          )
        : null}

      {resume.experiences.length > 0
        ? card(
            labels.experiences,
            resume.experiences.map((item, index) => (
              <div
                key={item.id}
                className="avoid-break"
                style={{
                  marginBottom: index === resume.experiences.length - 1 ? 0 : '4.5mm',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '4mm',
                  }}
                >
                  <h3 style={{ fontWeight: 700, color: '#0f172a' }}>{item.position}</h3>
                  <span style={{ fontSize: '0.8em', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {formatRange(item.start, item.end, item.current)}
                  </span>
                </div>
                <p style={{ fontSize: '0.88em', color: accent }}>
                  {[item.company, item.city].filter(Boolean).join(' · ')}
                </p>
                <Bullets text={item.description} style={{ color: '#334155', fontSize: '0.92em' }} />
              </div>
            )),
            // Une longue liste d'expériences doit pouvoir se couper : c'est
            // l'entrée qui reste solidaire, pas le cadre entier.
            true,
          )
        : null}

      {resume.education.length > 0
        ? card(
            labels.education,
            resume.education.map((item, index) => (
              <div
                key={item.id}
                className="avoid-break"
                style={{ marginBottom: index === resume.education.length - 1 ? 0 : '3.5mm' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '4mm',
                  }}
                >
                  <h3 style={{ fontWeight: 600, color: '#0f172a' }}>{item.degree}</h3>
                  <span style={{ fontSize: '0.8em', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {formatRange(item.start, item.end, false)}
                  </span>
                </div>
                <p style={{ fontSize: '0.88em', color: '#64748b' }}>
                  {[item.school, item.city].filter(Boolean).join(' · ')}
                </p>
                {item.description ? (
                  <p style={{ fontSize: '0.88em', color: '#475569' }}>{item.description}</p>
                ) : null}
              </div>
            )),
            true,
          )
        : null}

      {resume.recommendations.length > 0
        ? card(labels.recommendations, <RecommendationList items={resume.recommendations} accent={accent} />, true)
        : null}

      {resume.skills.length > 0
        ? card(
            labels.skills,
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4em' }}>
              {resume.skills
                .filter((item) => item.name.trim())
                .map((item) => (
                  <span
                    key={item.id}
                    style={{
                      background: `${accent}12`,
                      color: '#334155',
                      borderRadius: '999px',
                      padding: '0.2em 0.8em',
                      fontSize: '0.85em',
                    }}
                  >
                    {item.name}
                  </span>
                ))}
            </div>,
          )
        : null}

      {resume.languages.length > 0
        ? card(
            labels.languages,
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em 1.5em' }}>
              {resume.languages
                .filter((item) => item.name.trim())
                .map((item) => (
                  <span key={item.id} style={{ fontSize: '0.9em', color: '#334155' }}>
                    {item.name}
                    {item.level ? <span style={{ color: '#94a3b8' }}> — {item.level}</span> : null}
                  </span>
                ))}
            </div>,
          )
        : null}
    </div>
  )
}
