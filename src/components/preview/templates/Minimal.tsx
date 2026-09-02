import type { ReactNode } from 'react'
import { formatRange } from '../../../lib/format'
import {
  Bullets,
  RecommendationList,
  contactItems,
  fullName,
  type TemplateProps,
} from './parts'

/** Grille à deux colonnes : les dates à gauche, le contenu à droite. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="avoid-break" style={{ display: 'flex', gap: '6mm', marginBottom: '4.5mm' }}>
      <div
        style={{
          width: '28mm',
          flex: 'none',
          fontSize: '0.82em',
          color: '#94a3b8',
          paddingTop: '0.15em',
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

export function Minimal({ resume, accent }: TemplateProps) {
  const { personal, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string) => (
    <h2
      style={{
        fontSize: '0.82em',
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#94a3b8',
        marginBottom: '1em',
      }}
    >
      {text}
    </h2>
  )

  return (
    <div style={{ padding: '20mm 18mm 16mm' }}>
      <header style={{ marginBottom: '10mm' }}>
        <h1
          style={{
            fontSize: '2em',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: '#0f172a',
          }}
        >
          {fullName(personal) || 'Votre nom'}
        </h1>
        {personal.title ? (
          <p style={{ fontSize: '1em', color: '#475569', marginTop: '0.2em' }}>{personal.title}</p>
        ) : null}
        <div
          style={{
            marginTop: '1em',
            paddingTop: '0.8em',
            borderTop: `1px solid ${accent}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.3em 1.2em',
            fontSize: '0.82em',
            color: '#64748b',
          }}
        >
          {contacts.map((item) => (
            <span key={item.key}>{item.value}</span>
          ))}
        </div>
      </header>

      {resume.summary.trim() ? (
        <section style={{ marginBottom: '9mm' }}>
          {heading(labels.summary)}
          <p style={{ lineHeight: 1.65, color: '#334155', whiteSpace: 'pre-line' }}>
            {resume.summary}
          </p>
        </section>
      ) : null}

      {resume.experiences.length > 0 ? (
        <section style={{ marginBottom: '9mm' }}>
          {heading(labels.experiences)}
          {resume.experiences.map((item) => (
            <Row key={item.id} label={formatRange(item.start, item.end, item.current)}>
              <h3 style={{ fontWeight: 600, color: '#0f172a' }}>{item.position}</h3>
              <p style={{ fontSize: '0.9em', color: '#64748b' }}>
                {[item.company, item.city].filter(Boolean).join(' · ')}
              </p>
              <Bullets text={item.description} style={{ color: '#334155', fontSize: '0.92em' }} />
            </Row>
          ))}
        </section>
      ) : null}

      {resume.education.length > 0 ? (
        <section style={{ marginBottom: '9mm' }}>
          {heading(labels.education)}
          {resume.education.map((item) => (
            <Row key={item.id} label={formatRange(item.start, item.end, false)}>
              <h3 style={{ fontWeight: 600, color: '#0f172a' }}>{item.degree}</h3>
              <p style={{ fontSize: '0.9em', color: '#64748b' }}>
                {[item.school, item.city].filter(Boolean).join(' · ')}
              </p>
              {item.description ? (
                <p style={{ fontSize: '0.9em', color: '#475569', marginTop: '0.2em' }}>
                  {item.description}
                </p>
              ) : null}
            </Row>
          ))}
        </section>
      ) : null}

      {resume.recommendations.length > 0 ? (
        <section style={{ marginBottom: '9mm' }}>
          {heading(labels.recommendations)}
          <RecommendationList items={resume.recommendations} accent={accent} />
        </section>
      ) : null}

      {resume.skills.length > 0 ? (
        <section style={{ marginBottom: '9mm' }}>
          {heading(labels.skills)}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4em' }}>
            {resume.skills
              .filter((item) => item.name.trim())
              .map((item) => (
                <span
                  key={item.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '999px',
                    padding: '0.2em 0.75em',
                    fontSize: '0.85em',
                    color: '#334155',
                  }}
                >
                  {item.name}
                </span>
              ))}
          </div>
        </section>
      ) : null}

      {resume.languages.length > 0 ? (
        <section>
          {heading(labels.languages)}
          {resume.languages.map((item) => (
            <Row key={item.id} label={item.level}>
              <span style={{ color: '#334155' }}>{item.name}</span>
            </Row>
          ))}
        </section>
      ) : null}
    </div>
  )
}
