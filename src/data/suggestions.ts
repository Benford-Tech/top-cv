/**
 * Bibliothèque de formulations prêtes à l'emploi, rangées par métier.
 * `summary` alimente la section Profil, `bullets` les descriptions de postes.
 * Les phrases sont volontairement écrites avec des repères chiffrés à remplacer :
 * un CV convaincant s'appuie sur des résultats, pas sur des missions.
 */
export type SuggestionGroup = {
  id: string
  job: string
  summary: string[]
  bullets: string[]
}

export const SUGGESTIONS: SuggestionGroup[] = [
  {
    id: 'dev',
    job: 'Développement / IT',
    summary: [
      "Développeur·se full-stack avec X ans d'expérience sur des applications web à fort trafic, à l'aise de la conception à la mise en production.",
      "Ingénieur·e logiciel spécialisé·e en X, attaché·e à la qualité du code, aux tests automatisés et à la revue de code exigeante.",
      "Profil technique orienté produit : je traduis des besoins métier en fonctionnalités livrées, mesurées et maintenues.",
    ],
    bullets: [
      "Conception et développement de X fonctionnalités livrées en production, utilisées par X utilisateurs actifs mensuels.",
      "Réduction de X % du temps de chargement des pages par l'optimisation des requêtes et la mise en cache.",
      "Mise en place d'une chaîne d'intégration continue ramenant le délai de déploiement de X à X minutes.",
      "Augmentation de la couverture de tests de X % à X %, divisant par X les régressions signalées.",
      "Revue de code quotidienne et accompagnement de X développeur·se·s juniors.",
      "Migration de X vers X sans interruption de service pour les utilisateurs.",
    ],
  },
  {
    id: 'commercial',
    job: 'Commercial / Vente',
    summary: [
      "Commercial·e B2B avec X ans d'expérience dans la prospection et la fidélisation de comptes grands comptes.",
      "Profil chasseur orienté résultats : dépassement du quota X années consécutives sur un portefeuille de X clients.",
      "Business developer à l'aise sur tout le cycle de vente, de la prise de contact à la signature et au renouvellement.",
    ],
    bullets: [
      "Réalisation de X % de l'objectif annuel, soit X € de chiffre d'affaires signé.",
      "Développement d'un portefeuille de X comptes, dont X grands comptes ouverts en propre.",
      "Augmentation du panier moyen de X % grâce à une stratégie de vente additionnelle.",
      "Réduction du cycle de vente de X à X semaines par la refonte du processus de qualification.",
      "Prospection de X leads par mois par téléphone, e-mail et réseaux sociaux.",
      "Taux de rétention client porté à X % sur l'exercice.",
    ],
  },
  {
    id: 'marketing',
    job: 'Marketing / Communication',
    summary: [
      "Chargé·e de marketing digital avec X ans d'expérience en acquisition payante, contenu et analyse de performance.",
      "Profil hybride créatif et analytique : je conçois des campagnes et j'en pilote le retour sur investissement.",
      "Responsable communication habitué·e à faire vivre une marque sur l'ensemble de ses canaux, du print au social.",
    ],
    bullets: [
      "Pilotage d'un budget média de X € annuel avec un retour sur investissement de X.",
      "Croissance de l'audience organique de X % en X mois via une stratégie de contenu et de référencement naturel.",
      "Lancement de X campagnes multicanales générant X leads qualifiés.",
      "Réduction du coût par acquisition de X € à X € par l'optimisation continue des campagnes.",
      "Animation de communautés totalisant X abonnés, avec un taux d'engagement de X %.",
      "Mise en place d'un tableau de bord de suivi partagé avec la direction commerciale.",
    ],
  },
  {
    id: 'gestion',
    job: 'Gestion de projet',
    summary: [
      "Chef·fe de projet avec X ans d'expérience dans la conduite de projets pluridisciplinaires, du cadrage au déploiement.",
      "Habitué·e aux environnements agiles comme au cycle en V, je sécurise les délais, le budget et la qualité livrée.",
      "Interlocuteur·rice privilégié·e entre les équipes techniques et les parties prenantes métier.",
    ],
    bullets: [
      "Pilotage simultané de X projets pour un budget cumulé de X €.",
      "Livraison de X % des jalons dans les délais annoncés sur X mois consécutifs.",
      "Encadrement fonctionnel d'une équipe de X personnes réparties sur X sites.",
      "Animation des rituels agiles : planification, points quotidiens, revues et rétrospectives.",
      "Réduction de X % des dérives budgétaires par la mise en place d'un suivi hebdomadaire.",
      "Rédaction des cahiers des charges et pilotage de la recette fonctionnelle.",
    ],
  },
  {
    id: 'rh',
    job: 'Ressources humaines',
    summary: [
      "Chargé·e de recrutement avec X ans d'expérience sur des profils techniques et cadres en tension.",
      "Généraliste RH couvrant le recrutement, l'administration du personnel et le développement des compétences.",
      "Profil orienté expérience candidat, attaché·e à des processus de sélection équitables et structurés.",
    ],
    bullets: [
      "Recrutement de X collaborateur·rice·s par an, avec un délai moyen de X jours par poste.",
      "Réduction du taux de départ en période d'essai de X % à X % via un parcours d'intégration repensé.",
      "Conduite de X entretiens annuels et construction du plan de développement des compétences.",
      "Déploiement d'un outil de suivi des candidatures pour X managers recruteurs.",
      "Gestion administrative de X contrats : rédaction, avenants, suivi des absences.",
      "Animation de X sessions de formation interne réunissant X participants.",
    ],
  },
  {
    id: 'client',
    job: 'Relation client / Support',
    summary: [
      "Conseiller·ère clientèle avec X ans d'expérience en environnement à fort volume, orienté résolution au premier contact.",
      "Responsable support technique habitué·e à traiter les escalades et à documenter les solutions récurrentes.",
      "Profil patient et méthodique, à l'aise à l'écrit comme au téléphone dans des situations tendues.",
    ],
    bullets: [
      "Traitement de X demandes par jour avec un taux de résolution au premier contact de X %.",
      "Satisfaction client mesurée à X / 5 sur X évaluations.",
      "Réduction du délai de première réponse de X heures à X minutes.",
      "Rédaction de X articles de base de connaissances réduisant de X % les demandes récurrentes.",
      "Formation et accompagnement de X nouveaux conseillers.",
      "Gestion des réclamations complexes en lien avec les services techniques et logistiques.",
    ],
  },
  {
    id: 'compta',
    job: 'Comptabilité / Finance',
    summary: [
      "Comptable avec X ans d'expérience en cabinet comme en entreprise, autonome sur la tenue jusqu'au bilan.",
      "Contrôleur·se de gestion orienté·e aide à la décision : reporting, budgets et analyse des écarts.",
      "Rigueur, respect des échéances déclaratives et goût pour la fiabilisation des processus.",
    ],
    bullets: [
      "Tenue comptable complète de X dossiers clients, du saisi au bilan.",
      "Production des clôtures mensuelles en X jours ouvrés au lieu de X.",
      "Élaboration et suivi d'un budget annuel de X €, avec analyse mensuelle des écarts.",
      "Établissement des déclarations fiscales et sociales dans le respect des échéances.",
      "Automatisation du rapprochement bancaire, économisant X heures par mois.",
      "Interlocuteur·rice des commissaires aux comptes lors des audits annuels.",
    ],
  },
  {
    id: 'sante',
    job: 'Santé / Social',
    summary: [
      "Infirmier·ère diplômé·e d'État avec X ans d'expérience en service X, à l'aise dans l'urgence comme dans le suivi au long cours.",
      "Professionnel·le du soin attaché·e à la qualité de la relation avec les patients et leurs proches.",
      "Habitué·e au travail en équipe pluridisciplinaire et à la traçabilité rigoureuse des actes.",
    ],
    bullets: [
      "Prise en charge quotidienne de X patients au sein d'une équipe de X soignants.",
      "Réalisation des soins techniques, surveillance clinique et transmission écrite et orale.",
      "Accompagnement des familles et coordination avec les médecins et services associés.",
      "Participation à la démarche qualité et à la mise à jour des protocoles de service.",
      "Encadrement de X étudiants en stage par an.",
      "Gestion des stocks et du matériel de soin de l'unité.",
    ],
  },
  {
    id: 'enseignement',
    job: 'Enseignement / Formation',
    summary: [
      "Formateur·rice avec X ans d'expérience auprès de publics adultes en reconversion professionnelle.",
      "Enseignant·e attaché·e à la progression de chaque apprenant et à la variété des supports pédagogiques.",
      "Conception de parcours complets : référentiel, séquences, supports et évaluations.",
    ],
    bullets: [
      "Animation de X heures de formation par an auprès de groupes de X apprenants.",
      "Conception de X modules pédagogiques et des supports associés.",
      "Taux de réussite aux certifications de X % sur X sessions.",
      "Suivi individualisé des apprenants en difficulté et adaptation des rythmes.",
      "Évaluation moyenne des sessions de X / 5 par les participants.",
      "Participation à la coordination pédagogique et aux conseils de classe.",
    ],
  },
  {
    id: 'logistique',
    job: 'Logistique / Production',
    summary: [
      "Responsable logistique avec X ans d'expérience dans la gestion de flux et l'optimisation d'entrepôt.",
      "Profil terrain habitué·e à piloter des équipes postées et à tenir des objectifs de productivité.",
      "Attaché·e à la sécurité, à la fiabilité des stocks et à la tenue des délais de livraison.",
    ],
    bullets: [
      "Pilotage d'un entrepôt de X m² traitant X colis par jour.",
      "Encadrement de X opérateurs répartis sur X équipes.",
      "Amélioration du taux de service de X % à X % en X mois.",
      "Réduction de X % des écarts d'inventaire par la refonte des procédures de contrôle.",
      "Négociation avec les transporteurs, économisant X € par an.",
      "Animation des points sécurité et suivi des indicateurs d'accidentologie.",
    ],
  },
  {
    id: 'restauration',
    job: 'Restauration / Hôtellerie',
    summary: [
      "Professionnel·le de la restauration avec X ans d'expérience en service continu et en gestion de rush.",
      "Chef·fe de rang habitué·e aux établissements de X couverts, soucieux·se de l'expérience client.",
      "Polyvalence salle et cuisine, sens de l'organisation et résistance au rythme soutenu.",
    ],
    bullets: [
      "Service de X couverts par jour en autonomie sur un rang de X tables.",
      "Encadrement et formation de X commis et apprentis.",
      "Gestion des commandes et des stocks pour un budget de X € mensuel.",
      "Respect strict des normes d'hygiène HACCP et tenue des relevés obligatoires.",
      "Contribution à la création de la carte saisonnière, X plats proposés.",
      "Note client moyenne de X / 5 sur les plateformes d'avis en ligne.",
    ],
  },
]
