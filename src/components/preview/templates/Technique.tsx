import { formatRange } from '../../../lib/format'
import {
  Bullets,
  LevelBar,
  RecommendationList,
  contactItems,
  fullName,
  type TemplateProps,
} from './parts'

/**
 * Rail latéral clair — gris, jamais coloré — où les compétences sont notées,
 * et libellés de dates en chasse fixe. Le parcours garde toute la largeur
 * utile, et les compétences se lisent comme une grille plutôt que comme une
 * liste de mots.
 */
const RAIL = '52mm'
const MONO = '"SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace'

export function Technique({ resume, accent }: TemplateProps) {
  const { personal, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string, color = accent) => (
    <h2
      style={{
        fontFamily: MONO,
        fontSize: '0.76em',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color,
        marginBottom: '0.7em',
      }}
    >
      {text}
    </h2>
  )

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '297mm',
        background: `linear-gradient(90deg, #f8fafc 0 ${RAIL}, #ffffff ${RAIL})`,
      }}
    >
      <aside
        style={{
          width: RAIL,
          flex: 'none',
          padding: '14mm 7mm',
          borderRight: '1px solid #e2e8f0',
        }}
      >
        {contacts.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {heading('Contact', '#64748b')}
            {contacts.map((item) => (
              <p
                key={item.key}
                style={{
                  fontSize: '0.76em',
                  color: '#475569',
                  marginBottom: '0.35em',
                  wordBreak: 'break-word',
                }}
              >
                {item.value}
              </p>
            ))}
          </section>
        ) : null}

        {resume.skills.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {heading(labels.skills)}
            {resume.skills
              .filter((item) => item.name.trim())
              .map((item) => (
                <div key={item.id} style={{ marginBottom: '0.5em' }}>
                  <p style={{ fontSize: '0.78em', color: '#334155', marginBottom: '0.15em' }}>
                    {item.name}
                  </p>
                  <LevelBar level={item.level} accent={accent} muted="#e2e8f0" />
                </div>
              ))}
          </section>
        ) : null}

        {resume.languages.length > 0 ? (
          <section>
            {heading(labels.languages)}
            {resume.languages
              .filter((item) => item.name.trim())
              .map((item) => (
                <p key={item.id} style={{ fontSize: '0.78em', color: '#334155', marginBottom: '0.3em' }}>
                  {item.name}
                  {item.level ? (
                    <span style={{ color: '#94a3b8' }}> — {item.level}</span>
                  ) : null}
                </p>
              ))}
          </section>
        ) : null}
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: '14mm 12mm 12mm' }}>
        <header style={{ marginBottom: '7mm' }}>
          <h1 style={{ fontSize: '1.9em', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
            {fullName(personal) || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p style={{ fontFamily: MONO, fontSize: '0.9em', color: accent, marginTop: '0.25em' }}>
              {personal.title}
            </p>
          ) : null}
        </header>

        {resume.summary.trim() ? (
          <section style={{ marginBottom: '7mm' }}>
            {heading(labels.summary)}
            <p style={{ lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-line' }}>
              {resume.summary}
            </p>
          </section>
        ) : null}

        {resume.experiences.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {heading(labels.experiences)}
            {resume.experiences.map((item) => (
              <div key={item.id} className="avoid-break" style={{ marginBottom: '5mm' }}>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.76em',
                    color: '#94a3b8',
                    marginBottom: '0.1em',
                  }}
                >
                  {formatRange(item.start, item.end, item.current)}
                </p>
                <h3 style={{ fontWeight: 700, color: '#0f172a' }}>{item.position}</h3>
                <p style={{ fontSize: '0.88em', color: accent }}>
                  {[item.company, item.city].filter(Boolean).join(' · ')}
                </p>
                <Bullets text={item.description} style={{ color: '#334155', fontSize: '0.92em' }} />
              </div>
            ))}
          </section>
        ) : null}

        {resume.education.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {heading(labels.education)}
            {resume.education.map((item) => (
              <div key={item.id} className="avoid-break" style={{ marginBottom: '3.5mm' }}>
                <p style={{ fontFamily: MONO, fontSize: '0.76em', color: '#94a3b8' }}>
                  {formatRange(item.start, item.end, false)}
                </p>
                <h3 style={{ fontWeight: 600, color: '#0f172a' }}>{item.degree}</h3>
                <p style={{ fontSize: '0.88em', color: '#64748b' }}>
                  {[item.school, item.city].filter(Boolean).join(' · ')}
                </p>
                {item.description ? (
                  <p style={{ fontSize: '0.88em', color: '#475569' }}>{item.description}</p>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {resume.recommendations.length > 0 ? (
          <section>
            {heading(labels.recommendations)}
            <RecommendationList items={resume.recommendations} accent={accent} />
          </section>
        ) : null}
      </main>
    </div>
  )
}
