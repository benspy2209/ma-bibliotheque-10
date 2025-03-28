
import { AMAZON_AFFILIATE_ID } from '@/lib/amazon-utils';

export function AffiliateInfo() {
  return (
    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
      <p className="text-sm text-amber-700 dark:text-amber-200 font-medium mb-2">
        <strong>Comment soutenir BiblioPulse :</strong>
      </p>
      <ul className="text-sm text-amber-700 dark:text-amber-200 space-y-2">
        <li>• En cliquant sur les liens Amazon ci-dessous, vous générez une commission d'affiliation (identifiant: {AMAZON_AFFILIATE_ID}) sans aucun coût supplémentaire pour vous.</li>
        <li>• Cette commission s'applique à tout achat effectué dans les 24 heures suivant votre clic, pas uniquement pour le livre concerné.</li>
        <li>• Si vous ajoutez un produit à votre panier sans finaliser l'achat immédiatement, le cookie reste valide pendant 90 jours pour cet article spécifique.</li>
        <li>• Votre soutien via ces liens permet à BiblioPulse de rester à jamais gratuit et de continuer à se développer.</li>
      </ul>
      <p className="text-sm text-amber-700 dark:text-amber-200 mt-2 italic">
        Note: Si vous accédez à Amazon via un autre lien affilié après le nôtre, notre cookie est remplacé et nous ne percevrons pas de commission sur vos achats suivants.
      </p>
    </div>
  );
}
