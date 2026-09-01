import { formatRange } from '../../../lib/format'
import { Bullets, LevelBar, Photo, contactItems, fullName, type TemplateProps } from './parts'

export function Creatif({ resume, accent }: TemplateProps) {
  const { personal, settings, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string) => (
    <h2
      style={{
        display: 'inline-block',
        fontSize: '0.9em',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#111827',
        borderBottom: `3px solid ${accent}`,
        paddingBottom: '0.2em',
        marginBottom: '0.8em',
      }}
    >
      {text}
    </h2>
  )

  return (
    <div>
      <header
        style={{
          background: accent,
          color: '#fff',
          padding: '12mm 14mm',
          display: 'flex',
          alignItems: 'center',
          gap: '6mm',
        }}
      >
        {settings.showPhoto ? (
          <Photo src={personal.photo} size="26mm" ring="rgba(255,255,255,0.4)" />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '2.3em', fontWeight: 700, lineHeight: 1.05 }}>
            {fullName(personal) || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p style={{ fontSize: '1.05em', opacity: 0.9, marginTop: '0.2em' }}>{personal.title}</p>
          ) : null}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.3em 1.1em',
              marginTop: '0.7em',
              fontSize: '0.82em',
              opacity: 0.92,
            }}
          >
            {contacts.map(({ key, Icon, value }) => (
              <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35em' }}>
                <Icon className="h-[1em] w-[1em]" />
                {value}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '8mm', padding: '10mm 14mm 12mm' }}>
        <div style={{ flex: '1 1 62%', minWidth: 0 }}>
          {resume.summary.trim() ? (
            <section style={{ marginBottom: '7mm' }}>
              {heading(labels.summary)}
              <p style={{ lineHeight: 1.55, color: '#334155', whiteSpace: 'pre-line' }}>
                {resume.summary}
              </p>
            </section>
          ) : null}

          {resume.experiences.length > 0 ? (
            <section>
              {heading(labels.experiences)}
              {resume.experiences.map((item) => (
                <article
                  key={item.id}
                  className="avoid-break"
                  style={{
                    position: 'relative',
                    paddingLeft: '4mm',
                    borderLeft: `2px solid ${accent}33`,
                    marginBottom: '5mm',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '-4px',
                      top: '0.45em',
                      width: '6px',
                      height: '6px',
                      borderRadius: '999px',
                      background: accent,
                    }}
                  />
                  <h3 style={{ fontWeight: 600, color: '#111827' }}>{item.position}</h3>
                  <p style={{ fontSize: '0.88em', color: '#64748b' }}>
                    {[item.company, item.city].filter(Boolean).join(' · ')}
                    {item.company || item.city ? ' — ' : ''}
                    {formatRange(item.start, item.end, item.current)}
                  </p>
                  <Bullets
                    text={item.description}
                    style={{ color: '#334155', fontSize: '0.92em' }}
                  />
                </article>
              ))}
            </section>
          ) : null}
        </div>

        <div style={{ flex: '1 1 38%', minWidth: 0 }}>
          {resume.education.length > 0 ? (
            <section style={{ marginBottom: '7mm' }}>
              {heading(labels.education)}
              {resume.education.map((item) => (
                <article key={item.id} className="avoid-break" style={{ marginBottom: '3.5mm' }}>
                  <h3 style={{ fontWeight: 600, color: '#111827', fontSize: '0.95em' }}>
                    {item.degree}
                  </h3>
                  <p style={{ fontSize: '0.85em', color: '#64748b' }}>{item.school}</p>
                  <p style={{ fontSize: '0.82em', color: '#94a3b8' }}>
                    {formatRange(item.start, item.end, false)}
                  </p>
                </article>
              ))}
            </section>
          ) : null}

          {resume.skills.length > 0 ? (
            <section style={{ marginBottom: '7mm' }}>
              {heading(labels.skills)}
              {resume.skills.map((item) => (
                <div key={item.id} style={{ marginBottom: '0.5em', fontSize: '0.9em' }}>
                  <div style={{ color: '#334155' }}>{item.name}</div>
                  {settings.showSkillLevels ? (
                    <div style={{ marginTop: '0.2em' }}>
                      <LevelBar level={item.level} accent={accent} muted="#e2e8f0" />
                    </div>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {resume.languages.length > 0 ? (
            <section>
              {heading(labels.languages)}
              {resume.languages.map((item) => (
                <div key={item.id} style={{ marginBottom: '0.35em', fontSize: '0.9em' }}>
                  <span style={{ color: '#334155' }}>{item.name}</span>
                  <span style={{ color: '#94a3b8' }}> — {item.level}</span>
                </div>
              ))}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
