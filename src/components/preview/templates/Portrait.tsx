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
 * Le portrait dans le bandeau : la disposition la plus répandue des banques de
 * modèles françaises. La photo est ronde, posée dans un aplat de couleur qui
 * porte aussi le nom, le titre et les coordonnées ; le corps du CV démarre sur
 * fond blanc, en une colonne.
 *
 * Le bandeau est une bande à part, pas un fond de page : à l'impression, une
 * couleur qui se prolongerait sur les pages suivantes coûterait de l'encre
 * pour rien.
 */
export function Portrait({ resume, accent }: TemplateProps) {
  const { personal, settings, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string) => (
    <h2
      style={{
        fontSize: '0.9em',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: accent,
        display: 'flex',
        alignItems: 'center',
        gap: '3mm',
        marginBottom: '0.8em',
      }}
    >
      {text}
      <span style={{ flex: 1, height: '2px', background: `${accent}22` }} />
    </h2>
  )

  return (
    <div>
      <header
        style={{
          background: accent,
          color: '#fff',
          padding: '11mm 14mm',
          display: 'flex',
          alignItems: 'center',
          gap: '8mm',
        }}
      >
        {settings.showPhoto && personal.photo ? (
          <Photo src={personal.photo} size="32mm" ring="rgba(255,255,255,0.45)" />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '2.2em', fontWeight: 700, lineHeight: 1.05 }}>
            {fullName(personal) || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p style={{ fontSize: '1.05em', opacity: 0.9, marginTop: '0.15em' }}>
              {personal.title}
            </p>
          ) : null}
          {contacts.length > 0 ? (
            <div
              style={{
                marginTop: '0.9em',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.3em 1.1em',
                fontSize: '0.8em',
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
          ) : null}
        </div>
      </header>

      <div style={{ padding: '10mm 14mm 12mm' }}>
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
                <p style={{ fontSize: '0.9em', color: accent, fontWeight: 500 }}>
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
              <div key={item.id} className="avoid-break" style={{ marginBottom: '4mm' }}>
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
                <p style={{ fontSize: '0.9em', color: '#64748b' }}>
                  {[item.school, item.city].filter(Boolean).join(' · ')}
                </p>
                {item.description ? (
                  <p style={{ fontSize: '0.9em', color: '#475569' }}>{item.description}</p>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {resume.recommendations.length > 0 ? (
          <section style={{ marginBottom: '7mm' }}>
            {heading(labels.recommendations)}
            <RecommendationList items={resume.recommendations} accent={accent} />
          </section>
        ) : null}

        <div style={{ display: 'flex', gap: '10mm', alignItems: 'flex-start' }}>
          {resume.skills.length > 0 ? (
            <section style={{ flex: 1, minWidth: 0 }}>
              {heading(labels.skills)}
              {resume.skills
                .filter((item) => item.name.trim())
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '3mm',
                      fontSize: '0.9em',
                      color: '#334155',
                      marginBottom: '0.35em',
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
            <section style={{ flex: 1, minWidth: 0 }}>
              {heading(labels.languages)}
              {resume.languages
                .filter((item) => item.name.trim())
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '3mm',
                      fontSize: '0.9em',
                      color: '#334155',
                      marginBottom: '0.35em',
                    }}
                  >
                    <span>{item.name}</span>
                    <span style={{ color: '#94a3b8' }}>{item.level}</span>
                  </div>
                ))}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
