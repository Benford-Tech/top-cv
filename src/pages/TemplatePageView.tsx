import { useMemo } from 'react'
import type { TemplateCopy } from '../content/templates'
import { TEMPLATE_COPY } from '../content/templates'
import { JOB_PAGES } from '../content/jobs'
import { sampleResume, tileResume, ACCENTS } from '../data/defaults'
import { PageShell } from '../components/landing/PageShell'
import { TemplateShowcase } from '../components/landing/TemplateShowcase'
import { Check, Close } from '../components/ui/icons'

export function TemplatePageView({ copy, onStart }: { copy: TemplateCopy; onStart: () => void }) {
  const demo = useMemo(() => sampleResume(), [])
  const tile = useMemo(() => tileResume(), [])
  const others = TEMPLATE_COPY.filter((item) => item.id !== copy.id)
  // Les métiers pour lesquels ce modèle est recommandé : maillage interne utile
  // au visiteur, et non une liste de liens posée pour le référencement.
  const jobs = JOB_PAGES.filter((job) => job.template === copy.id)

  return (
    <PageShell
      onStart={onStart}
      breadcrumb={[{ label: 'Accueil', href: '/' }, { label: copy.h1 }]}
    >
      <article className="mx-auto max-w-4xl px-5">
        {/*
          Le titre de la page précède la vignette dans le document, même si
          l'affichage place l'image à gauche : la vignette contient le CV de
          démonstration, dont le nom est un titre de niveau 1. Sans cet ordre,
          « Camille Moreau » serait le premier titre lu par un moteur.
        */}
        <header className="grid gap-8 border-b border-slate-200 py-8 sm:grid-cols-[220px_1fr]">
          <div className="order-1 sm:order-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {copy.h1}
            </h1>
            <p className="mt-4 leading-relaxed text-slate-600">{copy.intro}</p>
            <button
              type="button"
              onClick={onStart}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Utiliser ce modèle
            </button>
          </div>

          <div className="order-2 sm:order-1">
            <TemplateShowcase
              id={copy.id}
              resume={{ ...demo, settings: { ...demo.settings, template: copy.id } }}
              width={220}
            />
          </div>
        </header>

        <section className="grid gap-6 py-10 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5">
            <h2 className="text-base font-semibold text-slate-900">Ce modèle convient si…</h2>
            <ul className="mt-3 space-y-2">
              {copy.suitedFor.map((line) => (
                <li key={line} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <h2 className="text-base font-semibold text-slate-900">Préférez-en un autre si…</h2>
            <p className="mt-3 flex gap-2 text-sm leading-relaxed text-slate-700">
              <Close className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
              {copy.avoidIf}
            </p>
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Toutes les couleurs, sans retoucher le contenu
          </h2>
          <p className="mt-2 text-slate-600">
            La couleur d’accent se change d’un clic dans l’éditeur, comme la typographie et la
            densité du texte.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {ACCENTS.slice(0, 4).map((accent) => (
              <TemplateShowcase
                key={accent}
                id={copy.id}
                resume={{ ...tile, settings: { ...tile.settings, template: copy.id, accent } }}
                width={150}
              />
            ))}
          </div>
        </section>

        {jobs.length > 0 ? (
          <section className="border-t border-slate-200 py-10">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Métiers pour lesquels nous conseillons ce modèle
            </h2>
            <ul className="mt-4 space-y-2">
              {jobs.map((job) => (
                <li key={job.slug}>
                  <a
                    href={`/cv/${job.slug}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {job.h1}
                  </a>
                  <p className="text-sm text-slate-600">{job.templateWhy}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="border-t border-slate-200 py-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Les autres modèles</h2>
          <div className="mt-5 flex flex-wrap gap-5">
            {others.map((item) => (
              <a key={item.id} href={`/modeles/${item.id}`} className="w-[150px] group">
                <TemplateShowcase
                  id={item.id}
                  resume={{ ...tile, settings: { ...tile.settings, template: item.id } }}
                  width={150}
                />
                <span className="mt-2 block text-sm font-medium text-slate-800 group-hover:text-blue-600 group-hover:underline">
                  {item.h1}
                </span>
              </a>
            ))}
          </div>
        </section>
      </article>
    </PageShell>
  )
}
