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
 * Deux colonnes de contenu, sans bandeau coloré : le parcours occupe la large,
 * tout le reste se range dans l'étroite. Interlignage serré et corps réduit —
 * c'est le modèle des carrières longues qu'il faut tenir sur une page.
 *
 * Les colonnes sont posées en `flex` sur un bloc continu, comme le modèle à
 * bandeau : une grille CSS se coupe mal d'une page à l'autre à l'impression.
 */
export function Compact({ resume, accent }: TemplateProps) {
  const { personal, settings, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string) => (
    <h2
      style={{
        fontSize: '0.8em',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: accent,
        borderBottom: `1px solid ${accent}33`,
        paddingBottom: '0.25em',
        marginBottom: '0.6em',
      }}
    >
      {text}
    </h2>
  )

  const list = (items: { id: string; name: string; note?: string }[]) => (
    <div style={{ marginBottom: '6mm' }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '2mm',
            fontSize: '0.86em',
            color: '#334155',
            marginBottom: '0.25em',
          }}
        >
          <span>{item.name}</span>
          {item.note ? <span style={{ color: '#94a3b8' }}>{item.note}</span> : null}
        </div>
      ))}
    </div>
  )

  return (
    <div style={{ padding: '13mm 13mm 11mm', fontSize: '0.96em' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '6mm',
          borderBottom: `2px solid ${accent}`,
          paddingBottom: '2.5mm',
          marginBottom: '6mm',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4mm', minWidth: 0 }}>
          {settings.showPhoto && personal.photo ? (
            <Photo src={personal.photo} size="20mm" rounded="1.5mm" />
          ) : null}
          <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: '1.75em', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
            {fullName(personal) || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p style={{ fontSize: '0.95em', color: accent, fontWeight: 600 }}>{personal.title}</p>
          ) : null}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.78em', color: '#64748b', lineHeight: 1.6 }}>
          {contacts.map((item) => (
            <div key={item.key}>{item.value}</div>
          ))}
        </div>
      </header>

      {resume.summary.trim() ? (
        <p
          style={{
            fontSize: '0.92em',
            lineHeight: 1.5,
            color: '#334155',
            whiteSpace: 'pre-line',
            marginBottom: '6mm',
          }}
        >
          {resume.summary}
        </p>
      ) : null}

      <div style={{ display: 'flex', gap: '8mm', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          {resume.experiences.length > 0 ? (
            <section style={{ marginBottom: '6mm' }}>
              {heading(labels.experiences)}
              {resume.experiences.map((item) => (
                <div key={item.id} className="avoid-break" style={{ marginBottom: '4mm' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '3mm',
                    }}
                  >
                    <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.98em' }}>
                      {item.position}
                    </h3>
                    <span
                      style={{ fontSize: '0.78em', color: '#94a3b8', whiteSpace: 'nowrap' }}
                    >
                      {formatRange(item.start, item.end, item.current)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.86em', color: accent }}>
                    {[item.company, item.city].filter(Boolean).join(' · ')}
                  </p>
                  <Bullets
                    text={item.description}
                    style={{ color: '#334155', fontSize: '0.88em', lineHeight: 1.45 }}
                  />
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
        </div>

        <div style={{ width: '58mm', flex: 'none' }}>
          {resume.education.length > 0 ? (
            <section style={{ marginBottom: '6mm' }}>
              {heading(labels.education)}
              {resume.education.map((item) => (
                <div key={item.id} className="avoid-break" style={{ marginBottom: '3.5mm' }}>
                  <h3 style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9em' }}>
                    {item.degree}
                  </h3>
                  <p style={{ fontSize: '0.82em', color: '#64748b' }}>{item.school}</p>
                  <p style={{ fontSize: '0.78em', color: '#94a3b8' }}>
                    {formatRange(item.start, item.end, false)}
                  </p>
                </div>
              ))}
            </section>
          ) : null}

          {resume.skills.length > 0 ? (
            <section>
              {heading(labels.skills)}
              {list(
                resume.skills
                  .filter((item) => item.name.trim())
                  .map((item) => ({ id: item.id, name: item.name })),
              )}
            </section>
          ) : null}

          {resume.languages.length > 0 ? (
            <section>
              {heading(labels.languages)}
              {list(
                resume.languages
                  .filter((item) => item.name.trim())
                  .map((item) => ({ id: item.id, name: item.name, note: item.level })),
              )}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
