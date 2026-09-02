import { useMemo } from 'react'
import { sampleResume, tileResume, ACCENTS } from './data/defaults'
import { TEMPLATES } from './components/preview/templates'
import { SUGGESTIONS } from './data/suggestions'
import { FAQ } from './content/faq'
import { JOB_PAGES } from './content/jobs'
import { TemplateShowcase } from './components/landing/TemplateShowcase'
import { Check, LinkedIn, Lock, Printer, Sparkles } from './components/ui/icons'

/**
 * Page d'accueil publique. Tout ce qui y est affirmé doit correspondre à ce que
 * l'application fait réellement : les modèles présentés sont les composants du
 * produit, et le prix est celui appliqué au téléchargement.
 */
export function Landing({ onStart, onSignIn }: { onStart: () => void; onSignIn: () => void }) {
  const demo = useMemo(() => sampleResume(), [])
  const tile = useMemo(() => tileResume(), [])

  const steps = [
    {
      title: 'Partez de votre profil',
      body: 'Importez votre export LinkedIn — expériences, formations, compétences et recommandations arrivent remplies. Ou commencez d’une page blanche.',
    },
    {
      title: 'Rédigez sans bloquer',
      body: `Une bibliothèque de formulations rangées par métier (${SUGGESTIONS.length} familles) propose des phrases à compléter avec vos propres chiffres.`,
    },
    {
      title: 'Ajustez la mise en forme',
      body: `${TEMPLATES.length} modèles interchangeables, couleur d’accent, typographie et densité — l’aperçu A4 se met à jour à chaque frappe.`,
    },
    {
      title: 'Téléchargez votre PDF',
      body: 'Créez votre compte et débloquez ce CV définitivement — modifications et retéléchargements ultérieurs compris.',
    },
  ]

  const features = [
    {
      icon: <Printer className="h-5 w-5" />,
      title: 'Un PDF au texte réel',
      body: 'Le document est composé sur nos serveurs, pas capturé en image. Le texte reste sélectionnable, donc lisible par les logiciels de tri des recruteurs.',
    },
    {
      icon: <LinkedIn className="h-5 w-5" />,
      title: 'Import LinkedIn',
      body: 'Votre export de données LinkedIn remplit le CV, recommandations reçues comprises — ce qu’aucune API LinkedIn ne permet.',
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: 'Des phrases pour démarrer',
      body: 'Développement, commerce, santé, logistique… des formulations éprouvées par métier, à personnaliser plutôt qu’à recopier.',
    },
    {
      icon: <Check className="h-5 w-5" />,
      title: 'Aperçu fidèle',
      body: 'Ce que vous voyez à l’écran est produit par les mêmes composants que le PDF final. Aucune surprise au téléchargement.',
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: 'Paiement unique',
      body: 'Pas d’abonnement, pas de reconduction automatique, rien à résilier. Vous payez un CV une fois, il reste à vous.',
    },
    {
      icon: <Check className="h-5 w-5" />,
      title: 'Vos données vous suivent',
      body: 'Votre CV est enregistré sur votre compte et s’exporte en JSON quand vous voulez, gratuitement.',
    },
  ]


  return (
    <div className="min-h-full bg-white">
      {/* ---- En-tête ---- */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            CV
          </span>
          <span className="text-sm font-semibold text-slate-900">CV Studio</span>
          <nav className="ml-auto flex items-center gap-2">
            <a
              href="#modeles"
              className="hidden rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:text-slate-900 sm:block"
            >
              Modèles
            </a>
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={onStart}
              className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Créer mon CV
            </button>
          </nav>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Importez votre profil LinkedIn en une fois
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Un CV net,
              <br />
              prêt à envoyer.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Vous remplissez à gauche, la feuille A4 se met à jour à droite. {TEMPLATES.length}{' '}
              modèles, des formulations par métier, et un PDF au texte réel — lisible par les
              logiciels de tri des recruteurs.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onStart}
                className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Créer mon CV
              </button>
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LinkedIn className="h-5 w-5 text-[#0a66c2]" />
                Importer depuis LinkedIn
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Rédaction et aperçu gratuits, sans compte. Le téléchargement du PDF est payant, une
              seule fois — sans abonnement.
            </p>
          </div>

          {/* Aperçus réels, produits par les composants du CV */}
          <div className="relative hidden justify-center gap-4 lg:flex">
            <div className="mt-10 rotate-[-4deg] shadow-xl transition hover:rotate-0">
              <TemplateShowcase id="colonne" resume={demo} width={210} />
            </div>
            <div className="rotate-[3deg] shadow-2xl transition hover:rotate-0">
              <TemplateShowcase id="moderne" resume={demo} width={230} />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Étapes ---- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Quatre étapes, une vingtaine de minutes
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- Modèles ---- */}
      <section id="modeles" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {TEMPLATES.length} modèles, un seul contenu
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Changez de modèle quand vous voulez : votre texte ne bouge pas. Les vignettes
            ci-dessous sont rendues par le produit lui-même, pas dessinées pour l’occasion.
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            {TEMPLATES.map((template, index) => (
              <figure key={template.id} className="w-[200px]">
                <a href={`/modeles/${template.id}`} className="block">
                    <TemplateShowcase
                    id={template.id}
                    resume={{
                      ...tile,
                      settings: {
                        ...tile.settings,
                        template: template.id,
                        accent: ACCENTS[index % ACCENTS.length],
                      },
                    }}
                  />
                </a>
                <figcaption className="mt-2">
                  <a
                    href={`/modeles/${template.id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                  >
                    {template.name}
                  </a>
                  <p className="text-xs leading-snug text-slate-500">{template.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Arguments ---- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ce qui change vraiment</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-slate-200 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
                {feature.icon}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Fiches métier ---- */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Que met-on dans un CV, métier par métier
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Ce qu’un recruteur regarde en premier, les erreurs propres au métier, et les
            formulations à reprendre en y mettant vos chiffres.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_PAGES.map((job) => (
              <li key={job.slug}>
                <a
                  href={`/cv/${job.slug}`}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                >
                  <span className="block text-sm font-semibold text-slate-900">{job.h1}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    {job.intro.slice(0, 95)}…
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Questions ---- */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Questions fréquentes</h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 marker:content-none">
                <span className="inline-block w-5 text-slate-400 transition group-open:rotate-90">
                  ›
                </span>
                {item.q}
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---- Dernier appel ---- */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Votre prochain CV commence maintenant
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Écrivez-le en entier, essayez les {TEMPLATES.length} modèles, regardez le rendu A4.
            Vous ne payez que si vous décidez de le télécharger.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-7 rounded-xl bg-white px-7 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Créer mon CV
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-8 text-xs text-slate-500">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-900 text-[11px] font-bold text-white">
            CV
          </span>
          <span>CV Studio</span>
          <a href="#modeles" className="hover:text-slate-800">
            Modèles
          </a>
          <span className="ml-auto">
            Sans lien avec LinkedIn Corporation. LinkedIn est une marque de son propriétaire.
          </span>
        </div>
      </footer>
    </div>
  )
}
