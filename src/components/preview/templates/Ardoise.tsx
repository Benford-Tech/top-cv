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

/**
 * Colonne sombre pleine hauteur, corps clair.
 *
 * La différence avec le modèle « Deux colonnes » n'est pas cosmétique : là, le
 * bandeau prend la couleur d'accent, ici il reste anthracite et l'accent ne
 * sert qu'aux repères. Une couleur vive sur toute la hauteur d'une page se
 * défend mal dans les secteurs sobres, et coûte cher à l'impression.
 */
const RAIL = '68mm'
const SLATE = '#1e293b'

export function Ardoise({ resume, accent }: TemplateProps) {
  const { personal, settings, labels } = resume
  const contacts = contactItems(personal)

  const railHeading = (text: string) => (
    <h2
      style={{
        fontSize: '0.82em',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: accent,
        marginBottom: '0.7em',
      }}
    >
      {text}
    </h2>
  )

  const mainHeading = (text: string) => (
    <h2
      style={{
        fontSize: '0.92em',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: SLATE,
        borderBottom: `2px solid ${accent}`,
        paddingBottom: '0.3em',
        marginBottom: '0.9em',
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
        background: `linear-gradient(90deg, ${SLATE} 0 ${RAIL}, #ffffff ${RAIL})`,
      }}
    >
      <aside style={{ width: RAIL, flex: 'none', padding: '13mm 9mm', color: '#e2e8f0' }}>
        {settings.showPhoto && personal.photo ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '7mm' }}>
            <Photo src={personal.photo} size="34mm" ring={accent} />
          </div>
        ) : null}

        <h1
          style={{
            fontSize: '1.5em',
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#fff',
            marginBottom: '0.15em',
          }}
        >
          {fullName(personal) || 'Votre nom'}
        </h1>
        {personal.title ? (
          <p style={{ fontSize: '0.9em', color: accent, marginBottom: '6mm' }}>{personal.title}</p>
        ) : null}

        {contacts.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {railHeading('Contact')}
            {contacts.map(({ key, Icon, value }) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5em',
                  fontSize: '0.78em',
                  marginBottom: '0.4em',
                  wordBreak: 'break-word',
                }}
              >
                <Icon className="h-[1em] w-[1em] flex-none translate-y-[0.15em]" />
                <span>{value}</span>
              </div>
            ))}
          </section>
        ) : null}

        {resume.skills.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {railHeading(labels.skills)}
            {resume.skills
              .filter((item) => item.name.trim())
              .map((item) => (
                <div key={item.id} style={{ marginBottom: '0.5em' }}>
                  <p style={{ fontSize: '0.8em', marginBottom: '0.15em' }}>{item.name}</p>
                  {settings.showSkillLevels ? (
                    <LevelBar level={item.level} accent={accent} muted="rgba(255,255,255,0.2)" />
                  ) : null}
                </div>
              ))}
          </section>
        ) : null}

        {resume.languages.length > 0 ? (
          <section>
            {railHeading(labels.languages)}
            {resume.languages
              .filter((item) => item.name.trim())
              .map((item) => (
                <p key={item.id} style={{ fontSize: '0.8em', marginBottom: '0.3em' }}>
                  {item.name}
                  {item.level ? (
                    <span style={{ color: '#94a3b8' }}> — {item.level}</span>
                  ) : null}
                </p>
              ))}
          </section>
        ) : null}
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: '13mm 12mm 12mm' }}>
        {resume.summary.trim() ? (
          <section style={{ marginBottom: '7mm' }}>
            {mainHeading(labels.summary)}
            <p style={{ lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-line' }}>
              {resume.summary}
            </p>
          </section>
        ) : null}

        {resume.experiences.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {mainHeading(labels.experiences)}
            {resume.experiences.map((item) => (
              <div key={item.id} className="avoid-break" style={{ marginBottom: '5mm' }}>
                <h3 style={{ fontWeight: 700, color: SLATE }}>{item.position}</h3>
                <p style={{ fontSize: '0.86em', color: '#64748b' }}>
                  {[item.company, item.city, formatRange(item.start, item.end, item.current)]
                    .filter(Boolean)
                    .join('  ·  ')}
                </p>
                <Bullets text={item.description} style={{ color: '#334155', fontSize: '0.92em' }} />
              </div>
            ))}
          </section>
        ) : null}

        {resume.education.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {mainHeading(labels.education)}
            {resume.education.map((item) => (
              <div key={item.id} className="avoid-break" style={{ marginBottom: '4mm' }}>
                <h3 style={{ fontWeight: 600, color: SLATE }}>{item.degree}</h3>
                <p style={{ fontSize: '0.86em', color: '#64748b' }}>
                  {[item.school, item.city, formatRange(item.start, item.end, false)]
                    .filter(Boolean)
                    .join('  ·  ')}
                </p>
                {item.description ? (
                  <p style={{ fontSize: '0.9em', color: '#475569' }}>{item.description}</p>
                ) : null}
              </div>
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
