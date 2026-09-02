/**
 * Questions fréquentes de la page d'accueil. Isolées ici parce qu'elles servent
 * deux fois : à l'affichage, et à la génération des données structurées
 * FAQPage, qui peuvent faire apparaître ces réponses directement dans les
 * résultats de recherche. Une seule source évite qu'elles divergent.
 */
export type FaqItem = { q: string; a: string }

export const FAQ: FaqItem[] = [
    {
      q: 'Combien ça coûte ?',
      a: 'La rédaction, l’aperçu et l’export de vos données sont gratuits. Seul le téléchargement du PDF est payant : le montant s’affiche au moment de télécharger, une fois votre CV terminé et avant tout engagement.',
    },
    {
      q: 'C’est un abonnement déguisé ?',
      a: 'Non. Un paiement unique, aucune reconduction, aucune carte conservée pour plus tard. Il n’y a rien à résilier.',
    },
    {
      q: 'Puis-je corriger mon CV après avoir payé ?',
      a: 'Oui. Le paiement débloque ce CV définitivement : vous le modifiez et le retéléchargez autant de fois que nécessaire, sans repayer.',
    },
    {
      q: 'Mon CV passera-t-il les filtres automatiques ?',
      a: 'Le PDF contient du vrai texte, pas une image, ce qui est la condition pour être analysé par ces outils. Les modèles gardent une structure simple et des intitulés de sections explicites. Aucun éditeur ne peut garantir le résultat : les critères varient d’un recruteur à l’autre.',
    },
    {
      q: 'Que deviennent mes données ?',
      a: 'Votre CV est enregistré sur votre compte pour que nos serveurs puissent composer le PDF. Vous pouvez l’exporter en JSON à tout moment, et supprimer votre compte.',
    },
    {
      q: 'Puis-je essayer avant de payer ?',
      a: 'C’est le principe : vous rédigez votre CV entier, testez les modèles et voyez le rendu A4 exact. Seul le téléchargement du fichier est payant.',
    },
]
