import { formatRange } from '../../../lib/format'
import { Bullets, LevelBar, Photo, contactItems, fullName, type TemplateProps } from './parts'

export function Moderne({ resume, accent }: TemplateProps) {
  const { personal, settings, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string) => (
    <h2
      style={{
        fontSize: '0.95em',
        fontWeight: 700,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        color: accent,
        borderBottom: `2px solid ${accent}22`,
        paddingBottom: '0.3em',
        marginBottom: '0.7em',
      }}
    >
      {text}
    </h2>
  )

  return (
    <div style={{ padding: '14mm 14mm 12mm' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '5mm' }}>
        {settings.showPhoto ? (
          <Photo src={personal.photo} size="24mm" ring={`${accent}33`} />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '2.1em', fontWeight: 700, lineHeight: 1.1, color: '#111827' }}>
            {fullName(personal) || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p style={{ fontSize: '1.05em', color: accent, marginTop: '0.15em', fontWeight: 500 }}>
              {personal.title}
            </p>
          ) : null}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.3em 1.1em',
              marginTop: '0.6em',
              fontSize: '0.85em',
              color: '#475569',
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

      {resume.summary.trim() ? (
        <section style={{ marginTop: '8mm' }}>
          {heading(labels.summary)}
          <p style={{ lineHeight: 1.55, color: '#334155', whiteSpace: 'pre-line' }}>
            {resume.summary}
          </p>
        </section>
      ) : null}

      {resume.experiences.length > 0 ? (
        <section style={{ marginTop: '7mm' }}>
          {heading(labels.experiences)}
          {resume.experiences.map((item) => (
            <article key={item.id} className="avoid-break" style={{ marginBottom: '4.5mm' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '3mm',
                  alignItems: 'baseline',
                }}
              >
                <h3 style={{ fontWeight: 600, color: '#111827' }}>{item.position}</h3>
                <span style={{ fontSize: '0.82em', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {formatRange(item.start, item.end, item.current)}
                </span>
              </div>
              <p style={{ fontSize: '0.9em', color: accent, fontWeight: 500 }}>
                {[item.company, item.city].filter(Boolean).join(' · ')}
              </p>
              <Bullets text={item.description} style={{ color: '#334155', fontSize: '0.92em' }} />
            </article>
          ))}
        </section>
      ) : null}

      {resume.education.length > 0 ? (
        <section style={{ marginTop: '7mm' }}>
          {heading(labels.education)}
          {resume.education.map((item) => (
            <article key={item.id} className="avoid-break" style={{ marginBottom: '3.5mm' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '3mm',
                  alignItems: 'baseline',
                }}
              >
                <h3 style={{ fontWeight: 600, color: '#111827' }}>{item.degree}</h3>
                <span style={{ fontSize: '0.82em', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {formatRange(item.start, item.end, false)}
                </span>
              </div>
              <p style={{ fontSize: '0.9em', color: '#475569' }}>
                {[item.school, item.city].filter(Boolean).join(' · ')}
              </p>
              {item.description ? (
                <p style={{ fontSize: '0.9em', color: '#475569', marginTop: '0.2em' }}>
                  {item.description}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      <div style={{ display: 'flex', gap: '8mm', marginTop: '7mm' }}>
        {resume.skills.length > 0 ? (
          <section style={{ flex: 1 }}>
            {heading(labels.skills)}
            {resume.skills.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '2mm',
                  marginBottom: '0.35em',
                  fontSize: '0.92em',
                  color: '#334155',
                }}
              >
                <span>{item.name}</span>
                {settings.showSkillLevels ? (
                  <LevelBar level={item.level} accent={accent} muted="#e2e8f0" />
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {resume.languages.length > 0 ? (
          <section style={{ flex: 1 }}>
            {heading(labels.languages)}
            {resume.languages.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.35em',
                  fontSize: '0.92em',
                  color: '#334155',
                }}
              >
                <span>{item.name}</span>
                <span style={{ color: '#64748b' }}>{item.level}</span>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  )
}
