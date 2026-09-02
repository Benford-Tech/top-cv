import { useMemo } from 'react'
import type { SituationPage } from '../content/situations'
import { SITUATION_PAGES } from '../content/situations'
import { JOB_PAGES } from '../content/jobs'
import { templateCopy } from '../content/templates'
import { tileResume } from '../data/defaults'
import { PageShell } from '../components/landing/PageShell'
import { TemplateShowcase } from '../components/landing/TemplateShowcase'

export function SituationPageView({
  situation,
  onStart,
}: {
  situation: SituationPage
  onStart: () => void
}) {
  const tile = useMemo(() => tileResume(), [])
  const copy = templateCopy(situation.template)
  const others = SITUATION_PAGES.filter((item) => item.slug !== situation.slug)

  return (
    <PageShell
      onStart={onStart}
      breadcrumb={[{ label: 'Accueil', href: '/' }, { label: situation.h1 }]}
    >
      <article className="mx-auto max-w-4xl px-5">
        <header className="border-b border-slate-200 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {situation.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{situation.intro}</p>
          <button
            type="button"
            onClick={onStart}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
          >
            Rédiger mon CV maintenant
          </button>
        </header>

        <section className="py-10">
          <div className="rounded-xl border-2 border-blue-600 bg-blue-50/40 p-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {situation.principle.title}
            </h2>
            <p className="mt-2 leading-relaxed text-slate-700">{situation.principle.body}</p>
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Comment ordonner les sections
          </h2>
          <div className="mt-6 space-y-5">
            {situation.structure.map((step) => (
              <div key={step.title} className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 leading-relaxed text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Comment le formuler
          </h2>
          <p className="mt-2 text-slate-600">
            Des exemples à adapter à votre situation — en gardant vos vraies dates et vos vrais
            chiffres.
          </p>
          <div className="mt-6 space-y-4">
            {situation.wording.map((item) => (
              <figure key={item.context}>
                <figcaption className="text-sm font-medium text-slate-500">
                  {item.context}
                </figcaption>
                <blockquote className="mt-1.5 rounded-lg border-l-4 border-blue-500 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-800">
                  {item.example}
                </blockquote>
              </figure>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Trois erreurs à éviter
          </h2>
          <ol className="mt-5 space-y-3">
            {situation.mistakes.map((mistake, index) => (
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
              Le modèle conseillé dans ce cas
            </h2>
            <div className="mt-6 flex flex-wrap items-start gap-6">
              <a href={`/modeles/${situation.template}`} className="block">
                <TemplateShowcase
                  id={situation.template}
                  resume={{ ...tile, settings: { ...tile.settings, template: situation.template } }}
                  width={190}
                />
              </a>
              <div className="min-w-[240px] flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{copy.h1}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{situation.templateWhy}</p>
                <a
                  href={`/modeles/${situation.template}`}
                  className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Voir ce modèle en détail
                </a>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-slate-200 py-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Autres situations</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((item) => (
              <li key={item.slug}>
                <a
                  href={`/cv/${item.slug}`}
                  className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  {item.h1.split(/[:—]/)[0].trim()}
                </a>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-bold tracking-tight text-slate-900">
            Et selon votre métier
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {JOB_PAGES.slice(0, 8).map((job) => (
              <li key={job.slug}>
                <a
                  href={`/cv/${job.slug}`}
                  className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  {job.h1.replace(/^CV (de |d’)?/i, '').split(/[:—]/)[0].trim()}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-2xl bg-slate-900 px-6 py-10 text-center">
          <h2 className="text-2xl font-bold text-white">Passez à la rédaction</h2>
          <p className="mx-auto mt-2 max-w-lg text-slate-300">
            L’éditeur affiche le rendu A4 pendant que vous écrivez, et vous laisse réordonner les
            sections comme cette page le conseille.
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
