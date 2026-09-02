import { formatRange } from '../../../lib/format'
import {
  Bullets,
  LevelBar,
  Photo,
  RecommendationList,
  contactItems,
  fullName,
  type TemplateProps,
} from './parts'

const SIDEBAR = '66mm'

export function Colonne({ resume, accent }: TemplateProps) {
  const { personal, settings, labels } = resume
  const contacts = contactItems(personal)

  const sideHeading = (text: string) => (
    <h2
      style={{
        fontSize: '0.85em',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#fff',
        opacity: 0.75,
        marginBottom: '0.6em',
      }}
    >
      {text}
    </h2>
  )

  const mainHeading = (text: string) => (
    <h2
      style={{
        fontSize: '0.95em',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: accent,
        marginBottom: '0.7em',
      }}
    >
      {text}
    </h2>
  )

  return (
    // Le dégradé porte la colonne colorée : posé sur un bloc continu, il se
    // prolonge correctement sur les pages suivantes à l'impression.
    <div
      style={{
        display: 'flex',
        minHeight: '297mm',
        background: `linear-gradient(90deg, ${accent} 0 ${SIDEBAR}, #ffffff ${SIDEBAR})`,
      }}
    >
      <aside
        style={{
          width: SIDEBAR,
          flex: 'none',
          padding: '12mm 8mm',
          color: '#fff',
        }}
      >
        {settings.showPhoto && personal.photo ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6mm' }}>
            <Photo src={personal.photo} size="32mm" ring="rgba(255,255,255,0.35)" />
          </div>
        ) : null}

        {contacts.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {sideHeading('Contact')}
            {contacts.map(({ key, Icon, value }) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5em',
                  marginBottom: '0.4em',
                  fontSize: '0.8em',
                  lineHeight: 1.4,
                  overflowWrap: 'anywhere',
                }}
              >
                <Icon className="h-[1em] w-[1em] mt-[0.2em] shrink-0" />
                <span>{value}</span>
              </div>
            ))}
          </section>
        ) : null}

        {resume.skills.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {sideHeading(labels.skills)}
            {resume.skills.map((item) => (
              <div key={item.id} style={{ marginBottom: '0.5em', fontSize: '0.88em' }}>
                <div>{item.name}</div>
                {settings.showSkillLevels ? (
                  <div style={{ marginTop: '0.25em' }}>
                    <LevelBar level={item.level} accent="#ffffff" muted="rgba(255,255,255,0.3)" />
                  </div>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {resume.languages.length > 0 ? (
          <section>
            {sideHeading(labels.languages)}
            {resume.languages.map((item) => (
              <div key={item.id} style={{ marginBottom: '0.35em', fontSize: '0.88em' }}>
                <div>{item.name}</div>
                <div style={{ opacity: 0.75, fontSize: '0.9em' }}>{item.level}</div>
              </div>
            ))}
          </section>
        ) : null}
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: '12mm 12mm 12mm 10mm' }}>
        <header style={{ marginBottom: '6mm' }}>
          <h1 style={{ fontSize: '2em', fontWeight: 700, lineHeight: 1.1, color: '#111827' }}>
            {fullName(personal) || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p style={{ fontSize: '1.05em', color: accent, marginTop: '0.15em' }}>
              {personal.title}
            </p>
          ) : null}
        </header>

        {resume.summary.trim() ? (
          <section style={{ marginBottom: '6mm' }}>
            {mainHeading(labels.summary)}
            <p style={{ lineHeight: 1.55, color: '#334155', whiteSpace: 'pre-line' }}>
              {resume.summary}
            </p>
          </section>
        ) : null}

        {resume.experiences.length > 0 ? (
          <section style={{ marginBottom: '6mm' }}>
            {mainHeading(labels.experiences)}
            {resume.experiences.map((item) => (
              <article key={item.id} className="avoid-break" style={{ marginBottom: '4.5mm' }}>
                <h3 style={{ fontWeight: 600, color: '#111827' }}>{item.position}</h3>
                <p style={{ fontSize: '0.88em', color: '#64748b' }}>
                  {[item.company, item.city].filter(Boolean).join(' · ')}
                  {item.company || item.city ? ' — ' : ''}
                  {formatRange(item.start, item.end, item.current)}
                </p>
                <Bullets text={item.description} style={{ color: '#334155', fontSize: '0.92em' }} />
              </article>
            ))}
          </section>
        ) : null}

        {resume.education.length > 0 ? (
          <section style={{ marginBottom: '6mm' }}>
            {mainHeading(labels.education)}
            {resume.education.map((item) => (
              <article key={item.id} className="avoid-break" style={{ marginBottom: '3.5mm' }}>
                <h3 style={{ fontWeight: 600, color: '#111827' }}>{item.degree}</h3>
                <p style={{ fontSize: '0.88em', color: '#64748b' }}>
                  {[item.school, item.city].filter(Boolean).join(' · ')}
                  {item.school || item.city ? ' — ' : ''}
                  {formatRange(item.start, item.end, false)}
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

        {resume.recommendations.length > 0 ? (
          <section>
            {mainHeading(labels.recommendations)}
            <RecommendationList items={resume.recommendations} accent={accent} />
          </section>
        ) : null}
      </main>
    </div>
  )
}
