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
  {
    id: 'assistant',
    job: 'Assistanat / Secrétariat',
    summary: [
      "Assistant·e de direction avec X ans d'expérience auprès de comités de direction, à l'aise avec la confidentialité et l'urgence.",
      "Assistant·e administratif·ve polyvalent·e : gestion d'agendas, organisation de déplacements, suivi de dossiers et interface avec les prestataires.",
      "Profil organisé et discret, habitué·e à tenir plusieurs dossiers de front sans en laisser tomber aucun.",
    ],
    bullets: [
      "Gestion des agendas de X dirigeants et arbitrage quotidien des priorités.",
      "Organisation de X déplacements par an, dont X à l'international, de la réservation à la note de frais.",
      "Préparation et diffusion des dossiers de X comités par mois, avec relevés de décisions.",
      "Traitement de X courriels et X appels par jour en filtrage et redirection.",
      "Suivi administratif de X contrats fournisseurs et relance des échéances.",
      "Mise en place d'un classement partagé ayant réduit de X % le temps de recherche de documents.",
    ],
  },
  {
    id: 'vente',
    job: 'Vente en magasin',
    summary: [
      "Conseiller·ère de vente avec X ans d'expérience en magasin, à l'aise sur la surface comme en caisse.",
      "Profil orienté satisfaction client, habitué·e aux fortes affluences et aux périodes de soldes.",
      "Vendeur·se attaché·e au conseil plutôt qu'à la vente forcée, avec un taux de retour produit faible.",
    ],
    bullets: [
      "Vente conseil sur un rayon de X références, panier moyen de X €.",
      "Chiffre d'affaires personnel de X € par mois, soit X % de l'objectif magasin.",
      "Accueil de X clients par jour en période de forte affluence.",
      "Mise en rayon, réassort et respect du plan de marchandisage sur X m².",
      "Tenue de caisse et clôture quotidienne, écarts inférieurs à X €.",
      "Formation de X nouveaux vendeurs et accompagnement des saisonniers.",
    ],
  },
  {
    id: 'aidesoignant',
    job: 'Aide-soignant',
    summary: [
      "Aide-soignant·e diplômé·e d'État avec X ans d'expérience en X, attentif·ve au confort et à la dignité des résidents.",
      "Habitué·e au travail en binôme avec les infirmiers et à la transmission rigoureuse des observations.",
      "Profil endurant, à l'aise avec les patients désorientés et les familles inquiètes.",
    ],
    bullets: [
      "Accompagnement quotidien de X résidents dans les actes de la vie courante.",
      "Réalisation des toilettes, aide aux repas et surveillance de l'état général.",
      "Transmission écrite et orale des observations à l'équipe infirmière.",
      "Utilisation quotidienne du matériel de transfert : lève-personne, verticalisateur.",
      "Participation aux projets d'accompagnement personnalisé de X résidents.",
      "Accueil et tutorat de X élèves aides-soignants par an.",
    ],
  },
  {
    id: 'domicile',
    job: 'Aide à domicile / Auxiliaire de vie',
    summary: [
      "Auxiliaire de vie avec X ans d'expérience auprès de personnes âgées et de personnes en situation de handicap.",
      "Habitué·e à intervenir seul·e au domicile, avec le sens des responsabilités que cela suppose.",
      "Profil patient et fiable, apprécié pour la régularité et la relation de confiance installée avec les familles.",
    ],
    bullets: [
      "Interventions chez X bénéficiaires par semaine, en autonomie complète.",
      "Aide à la toilette, à l'habillage et aux transferts dans le respect du rythme de la personne.",
      "Préparation des repas en tenant compte des régimes et des textures prescrites.",
      "Accompagnement aux courses et aux rendez-vous médicaux.",
      "Alerte du responsable de secteur sur X situations de dégradation détectées à temps.",
      "Tenue du cahier de liaison et coordination avec la famille et les soignants.",
    ],
  },
  {
    id: 'btp',
    job: 'BTP / Conduite de travaux',
    summary: [
      "Conducteur·rice de travaux avec X ans d'expérience sur des chantiers de X € en X.",
      "Habitué·e à tenir un planning et un budget face aux aléas, sans transiger sur la sécurité.",
      "Profil de terrain, à l'aise avec les compagnons comme avec la maîtrise d'ouvrage.",
    ],
    bullets: [
      "Pilotage de chantiers de X € pour une durée de X mois.",
      "Coordination de X entreprises sous-traitantes et animation des réunions hebdomadaires.",
      "Encadrement de X compagnons et suivi des pointages.",
      "Respect du planning à X % malgré X mois d'intempéries.",
      "Négociation des achats et économies de X € sur le budget prévisionnel.",
      "Zéro accident avec arrêt sur X mois consécutifs de chantier.",
    ],
  },
  {
    id: 'maintenance',
    job: 'Maintenance / Technique',
    summary: [
      "Technicien·ne de maintenance avec X ans d'expérience en environnement industriel, en préventif comme en curatif.",
      "Habitué·e aux interventions en urgence sur des lignes de production à l'arrêt.",
      "Profil polyvalent : mécanique, électricité, pneumatique et automatismes.",
    ],
    bullets: [
      "Maintenance préventive et curative de X équipements sur X lignes de production.",
      "Réduction du temps d'arrêt machine de X % en X mois.",
      "Interventions d'urgence avec un délai moyen de remise en service de X minutes.",
      "Diagnostic de pannes sur automates X et variateurs de vitesse.",
      "Gestion du stock de pièces détachées, valorisé à X €.",
      "Rédaction de X gammes de maintenance et formation des opérateurs au premier niveau.",
    ],
  },
  {
    id: 'transport',
    job: 'Transport / Livraison',
    summary: [
      "Chauffeur-livreur avec X ans d'expérience et X km parcourus sans sinistre responsable.",
      "Habitué·e aux tournées urbaines denses comme aux longues distances.",
      "Profil ponctuel et soigneux, conscient que le livreur est souvent le seul contact physique avec le client.",
    ],
    bullets: [
      "Tournées de X points de livraison par jour sur un secteur de X km.",
      "Taux de livraison dans le créneau annoncé de X %.",
      "Chargement, arrimage et contrôle de conformité de X colis quotidiens.",
      "X km parcourus sans sinistre responsable.",
      "Encaissement et remise des fonds pour X € par mois.",
      "Respect des temps de conduite et de repos, aucun manquement au contrôle.",
    ],
  },
  {
    id: 'data',
    job: 'Data / Analyse',
    summary: [
      "Analyste de données avec X ans d'expérience, du nettoyage de la donnée à la restitution auprès des décideurs.",
      "Profil à l'aise entre le métier et la technique : je traduis une question floue en indicateur exploitable.",
      "Habitué·e à construire des tableaux de bord réellement utilisés, plutôt que consultés une fois.",
    ],
    bullets: [
      "Construction de X tableaux de bord consultés par X utilisateurs chaque semaine.",
      "Automatisation d'un reporting mensuel, économisant X jours-homme par mois.",
      "Analyse ayant conduit à une décision chiffrée à X € pour la direction.",
      "Modélisation prédictive atteignant X % de précision sur le jeu de test.",
      "Fiabilisation de X sources de données et division par X des écarts de reporting.",
      "Formation de X utilisateurs métier à l'autonomie sur l'outil décisionnel.",
    ],
  },
  {
    id: 'design',
    job: 'Design / Création',
    summary: [
      "Designer avec X ans d'expérience, de la recherche utilisateur à la livraison des maquettes.",
      "Profil attaché à ce que le design serve un usage mesurable, pas seulement une intention esthétique.",
      "Habitué·e à travailler avec les développeurs et à défendre des choix devant des interlocuteurs non spécialistes.",
    ],
    bullets: [
      "Refonte d'un parcours ayant fait passer le taux de conversion de X % à X %.",
      "Conception et maintien d'un système de composants utilisé par X équipes.",
      "Conduite de X entretiens utilisateurs et X tests d'utilisabilité.",
      "Livraison de X écrans pour une application utilisée par X personnes.",
      "Réduction de X % des allers-retours avec les développeurs grâce à des maquettes documentées.",
      "Direction artistique de X campagnes, du concept aux déclinaisons.",
    ],
  },
  {
    id: 'juridique',
    job: 'Droit / Juridique',
    summary: [
      "Juriste d'entreprise avec X ans d'expérience en droit des contrats et en accompagnement opérationnel.",
      "Habitué·e à sécuriser sans bloquer : je cherche la solution qui permet l'affaire, pas celle qui l'empêche.",
      "Profil rigoureux, à l'aise avec les échéances contraintes et les dossiers sensibles.",
    ],
    bullets: [
      "Rédaction et négociation de X contrats par an, dont X à enjeu supérieur à X €.",
      "Conseil quotidien auprès de X directions opérationnelles.",
      "Suivi de X contentieux en lien avec les conseils externes.",
      "Mise en conformité au règlement général sur la protection des données sur X traitements.",
      "Élaboration de X modèles contractuels ayant réduit de X % le recours au cabinet externe.",
      "Animation de X sessions de sensibilisation juridique auprès des équipes.",
    ],
  },
]
