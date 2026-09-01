import { formatRange } from '../../../lib/format'
import { Bullets, contactItems, fullName, type TemplateProps } from './parts'

export function Classique({ resume, accent }: TemplateProps) {
  const { personal, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string) => (
    <h2
      style={{
        fontSize: '0.95em',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#111827',
        borderTop: '1px solid #cbd5e1',
        borderBottom: '1px solid #cbd5e1',
        padding: '0.3em 0',
        margin: '0 0 0.8em',
      }}
    >
      {text}
    </h2>
  )

  return (
    <div style={{ padding: '16mm 16mm 14mm' }}>
      <header style={{ textAlign: 'center', paddingBottom: '4mm' }}>
        <h1
          style={{
            fontSize: '2.2em',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#111827',
          }}
        >
          {fullName(personal) || 'Votre nom'}
        </h1>
        {personal.title ? (
          <p
            style={{
              fontSize: '1em',
              color: accent,
              marginTop: '0.25em',
              letterSpacing: '0.05em',
            }}
          >
            {personal.title}
          </p>
        ) : null}
        <p style={{ marginTop: '0.6em', fontSize: '0.85em', color: '#475569' }}>
          {contacts.map((item) => item.value).join('  ·  ')}
        </p>
      </header>

      {resume.summary.trim() ? (
        <section style={{ marginTop: '4mm' }}>
          {heading(labels.summary)}
          <p
            style={{
              lineHeight: 1.6,
              color: '#334155',
              textAlign: 'justify',
              whiteSpace: 'pre-line',
            }}
          >
            {resume.summary}
          </p>
        </section>
      ) : null}

      {resume.experiences.length > 0 ? (
        <section style={{ marginTop: '6mm' }}>
          {heading(labels.experiences)}
          {resume.experiences.map((item) => (
            <article key={item.id} className="avoid-break" style={{ marginBottom: '4.5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '3mm' }}>
                <h3 style={{ fontWeight: 700, color: '#111827' }}>
                  {item.company}
                  {item.city ? (
                    <span style={{ fontWeight: 400, color: '#64748b' }}> — {item.city}</span>
                  ) : null}
                </h3>
                <span style={{ fontSize: '0.85em', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {formatRange(item.start, item.end, item.current)}
                </span>
              </div>
              <p style={{ fontStyle: 'italic', color: '#334155', fontSize: '0.95em' }}>
                {item.position}
              </p>
              <Bullets text={item.description} style={{ color: '#334155', fontSize: '0.93em' }} />
            </article>
          ))}
        </section>
      ) : null}

      {resume.education.length > 0 ? (
        <section style={{ marginTop: '6mm' }}>
          {heading(labels.education)}
          {resume.education.map((item) => (
            <article key={item.id} className="avoid-break" style={{ marginBottom: '3mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '3mm' }}>
                <h3 style={{ fontWeight: 700, color: '#111827' }}>{item.degree}</h3>
                <span style={{ fontSize: '0.85em', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {formatRange(item.start, item.end, false)}
                </span>
              </div>
              <p style={{ fontStyle: 'italic', color: '#475569', fontSize: '0.93em' }}>
                {[item.school, item.city].filter(Boolean).join(', ')}
              </p>
              {item.description ? (
                <p style={{ fontSize: '0.9em', color: '#475569' }}>{item.description}</p>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {resume.skills.length > 0 ? (
        <section style={{ marginTop: '6mm' }}>
          {heading(labels.skills)}
          <p style={{ textAlign: 'center', color: '#334155', lineHeight: 1.7 }}>
            {resume.skills.map((item) => item.name).filter(Boolean).join('  ·  ')}
          </p>
        </section>
      ) : null}

      {resume.languages.length > 0 ? (
        <section style={{ marginTop: '6mm' }}>
          {heading(labels.languages)}
          <p style={{ textAlign: 'center', color: '#334155' }}>
            {resume.languages
              .map((item) => [item.name, item.level].filter(Boolean).join(' — '))
              .join('  ·  ')}
          </p>
        </section>
      ) : null}
    </div>
  )
}
