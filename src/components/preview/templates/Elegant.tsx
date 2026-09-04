import { formatRange } from '../../../lib/format'
import {
  Bullets,
  RecommendationList,
  contactItems,
  fullName,
  type TemplateProps,
} from './parts'

/**
 * Parti pris typographique : une serif, des capitales espacées, des filets
 * fins. Rien d'autre ne distingue ce modèle — c'est précisément l'effet
 * recherché, celui d'un document imprimé plutôt que composé à l'écran.
 *
 * La police porte sur tout le modèle, et prend donc le pas sur celle choisie
 * dans « Typographie ». La poser sur les seuls titres donnait un document
 * bâtard, moitié serif moitié linéale ; le panneau de mise en forme le
 * signale plutôt que de laisser le réglage sans effet visible.
 */
const SERIF = 'Georgia, "Times New Roman", "Liberation Serif", serif'

export function Elegant({ resume, accent }: TemplateProps) {
  const { personal, labels } = resume
  const contacts = contactItems(personal)

  const heading = (text: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '1em' }}>
      <h2
        style={{
          fontSize: '0.9em',
          fontWeight: 400,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: accent,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </h2>
      <span style={{ flex: 1, height: '1px', background: '#d6d3d1' }} />
    </div>
  )

  const entry = (
    title: string,
    org: string,
    range: string,
    description?: string,
    bullets?: string,
  ) => (
    <div className="avoid-break" style={{ marginBottom: '5mm' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '4mm',
        }}
      >
        <h3 style={{ fontSize: '1.02em', fontWeight: 700, color: '#1c1917' }}>
          {title}
        </h3>
        <span style={{ fontSize: '0.82em', color: '#78716c', whiteSpace: 'nowrap' }}>{range}</span>
      </div>
      {org ? (
        <p style={{ fontSize: '0.9em', color: '#57534e', fontStyle: 'italic' }}>{org}</p>
      ) : null}
      {bullets ? <Bullets text={bullets} style={{ color: '#44403c', fontSize: '0.92em' }} /> : null}
      {description ? (
        <p style={{ fontSize: '0.9em', color: '#57534e', marginTop: '0.25em' }}>{description}</p>
      ) : null}
    </div>
  )

  return (
    <div style={{ padding: '18mm 17mm 15mm', color: '#1c1917', fontFamily: SERIF }}>
      <header style={{ textAlign: 'center', marginBottom: '9mm' }}>
        <h1
          style={{
              fontSize: '2.1em',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {fullName(personal) || 'Votre nom'}
        </h1>
        {personal.title ? (
          <p
            style={{
                  fontSize: '1em',
              fontStyle: 'italic',
              color: accent,
              marginTop: '0.2em',
            }}
          >
            {personal.title}
          </p>
        ) : null}
        {contacts.length > 0 ? (
          <p
            style={{
              marginTop: '1em',
              paddingTop: '0.9em',
              borderTop: '1px solid #d6d3d1',
              fontSize: '0.82em',
              color: '#57534e',
            }}
          >
            {contacts.map((item) => item.value).join('  ·  ')}
          </p>
        ) : null}
      </header>

      {resume.summary.trim() ? (
        <section style={{ marginBottom: '8mm' }}>
          {heading(labels.summary)}
          <p
            style={{
                  lineHeight: 1.7,
              color: '#292524',
              whiteSpace: 'pre-line',
            }}
          >
            {resume.summary}
          </p>
        </section>
      ) : null}

      {resume.experiences.length > 0 ? (
        <section style={{ marginBottom: '8mm' }}>
          {heading(labels.experiences)}
          {resume.experiences.map((item) =>
            <div key={item.id}>
              {entry(
                item.position,
                [item.company, item.city].filter(Boolean).join(', '),
                formatRange(item.start, item.end, item.current),
                undefined,
                item.description,
              )}
            </div>,
          )}
        </section>
      ) : null}

      {resume.education.length > 0 ? (
        <section style={{ marginBottom: '8mm' }}>
          {heading(labels.education)}
          {resume.education.map((item) => (
            <div key={item.id}>
              {entry(
                item.degree,
                [item.school, item.city].filter(Boolean).join(', '),
                formatRange(item.start, item.end, false),
                item.description,
              )}
            </div>
          ))}
        </section>
      ) : null}

      {resume.recommendations.length > 0 ? (
        <section style={{ marginBottom: '8mm' }}>
          {heading(labels.recommendations)}
          <RecommendationList items={resume.recommendations} accent={accent} />
        </section>
      ) : null}

      {resume.skills.length > 0 ? (
        <section style={{ marginBottom: '8mm' }}>
          {heading(labels.skills)}
          <p style={{ lineHeight: 1.8, color: '#292524' }}>
            {resume.skills
              .filter((item) => item.name.trim())
              .map((item) => item.name)
              .join('  ·  ')}
          </p>
        </section>
      ) : null}

      {resume.languages.length > 0 ? (
        <section>
          {heading(labels.languages)}
          <p style={{ lineHeight: 1.8, color: '#292524' }}>
            {resume.languages
              .filter((item) => item.name.trim())
              // Le niveau porte souvent déjà sa parenthèse (« Courant (C1) »).
              .map((item) => (item.level ? `${item.name} — ${item.level}` : item.name))
              .join('  ·  ')}
          </p>
        </section>
      ) : null}
    </div>
  )
}
