import { useMemo } from 'react'
import type { JobPage } from '../content/jobs'
import { JOB_PAGES } from '../content/jobs'
import { SUGGESTIONS } from '../data/suggestions'
import { tileResume } from '../data/defaults'
import { templateCopy } from '../content/templates'
import { PageShell } from '../components/landing/PageShell'
import { TemplateShowcase } from '../components/landing/TemplateShowcase'
import { Check } from '../components/ui/icons'

export function JobPageView({ job, onStart }: { job: JobPage; onStart: () => void }) {
  const demo = useMemo(() => tileResume(), [])
  const group = SUGGESTIONS.find((item) => item.id === job.suggestionId)
  const copy = templateCopy(job.template)
  const others = JOB_PAGES.filter((item) => item.slug !== job.slug).slice(0, 6)

  return (
    <PageShell
      onStart={onStart}
      breadcrumb={[{ label: 'Accueil', href: '/' }, { label: job.h1 }]}
    >
      <article className="mx-auto max-w-4xl px-5">
        <header className="border-b border-slate-200 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {job.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{job.intro}</p>
          <button
            type="button"
            onClick={onStart}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
          >
            Rédiger mon CV maintenant
          </button>
        </header>

        <section className="py-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Ce que le recruteur regarde en premier
          </h2>
          <div className="mt-6 space-y-5">
            {job.priorities.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {group ? (
          <section className="border-t border-slate-200 py-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Formulations à reprendre et à chiffrer
            </h2>
            <p className="mt-2 text-slate-600">
              Ces phrases sont proposées directement dans l’éditeur. Les « X » sont à remplacer par
              vos propres chiffres : c’est le chiffre qui convainc, pas la formule.
            </p>

            <h3 className="mt-7 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Pour la phrase d’accroche
            </h3>
            <ul className="mt-3 space-y-2">
              {group.summary.map((phrase) => (
                <li
                  key={phrase}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700"
                >
                  {phrase}
                </li>
              ))}
            </ul>

            <h3 className="mt-7 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Pour décrire vos missions
            </h3>
            <ul className="mt-3 space-y-2">
              {group.bullets.map((phrase) => (
                <li key={phrase} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                  {phrase}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="border-t border-slate-200 py-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Trois erreurs propres à ce métier
          </h2>
          <ol className="mt-5 space-y-3">
            {job.mistakes.map((mistake, index) => (
              <li key={mistake} className="flex gap-3 leading-relaxed text-slate-700">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                  {index + 1}
                </span>
                {mistake}
              </li>
            ))}
          </ol>
        </section>

        {copy ? (
          <section className="border-t border-slate-200 py-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Le modèle conseillé pour ce métier
            </h2>
            <div className="mt-6 flex flex-wrap items-start gap-6">
              <a href={`/modeles/${job.template}`} className="block">
                <TemplateShowcase
                  id={job.template}
                  resume={{ ...demo, settings: { ...demo.settings, template: job.template } }}
                  width={190}
                />
              </a>
              <div className="min-w-[240px] flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{copy.h1}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{job.templateWhy}</p>
                <a
                  href={`/modeles/${job.template}`}
                  className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Voir ce modèle en détail
                </a>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-slate-200 py-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Autres métiers</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((item) => (
              <li key={item.slug}>
                <a
                  href={`/cv/${item.slug}`}
                  className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  {item.h1.replace(/^CV (de |d’)?/i, '')}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-2xl bg-slate-900 px-6 py-10 text-center">
          <h2 className="text-2xl font-bold text-white">Passez à la rédaction</h2>
          <p className="mx-auto mt-2 max-w-lg text-slate-300">
            L’éditeur reprend ces formulations et affiche le rendu A4 pendant que vous écrivez.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-6 rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Créer mon CV
          </button>
        </section>
      </article>
    </PageShell>
  )
}
