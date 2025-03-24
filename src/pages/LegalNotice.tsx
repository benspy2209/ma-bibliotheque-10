
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const LegalNotice = () => {
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mentions légales | BiblioPulse</title>
      </Helmet>
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            Dernière mise à jour : 24 mars 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. INFORMATIONS LÉGALES</h2>
            <p>BiblioPulse est un service fourni par :</p>
            <ul className="list-disc pl-6 my-4">
              <li>Société : HAKUNA MATATA SRL</li>
              <li>Numéro d'entreprise : 0877.585.922</li>
              <li>Forme juridique : Société à responsabilité limitée</li>
              <li>Date de création : 29 novembre 2005</li>
              <li>Siège social : Avenue De Fré 139/52, 1180 Uccle, Belgique</li>
              <li>Email de contact : <a href="mailto:debruijneb@gmail.com" className="text-primary underline">debruijneb@gmail.com</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. REPRÉSENTANTS LÉGAUX</h2>
            <ul className="list-disc pl-6 my-4">
              <li>Benjamin de Bruijne Bussios, Administrateur</li>
              <li>Lou Legnini, Administrateur</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. CONDITIONS D'UTILISATION</h2>
            <h3 className="text-xl font-medium mt-4 mb-2">3.1 Acceptation des conditions</h3>
            <p>
              En accédant à notre site web et en utilisant notre application, vous acceptez d'être lié par les présentes conditions d'utilisation et toutes les lois et réglementations applicables.
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">3.2 Modification des conditions</h3>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur le site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. COMPTE UTILISATEUR</h2>
            <h3 className="text-xl font-medium mt-4 mb-2">4.1 Création de compte</h3>
            <p>Pour utiliser certaines fonctionnalités de BiblioPulse, vous devrez créer un compte. Vous êtes responsable de maintenir la confidentialité de vos informations de compte et de toutes les activités qui se produisent sous votre compte.</p>
            <h3 className="text-xl font-medium mt-4 mb-2">4.2 Contenu utilisateur</h3>
            <p>
              En ajoutant des livres à votre bibliothèque, vous acceptez que ces informations soient traitées conformément à notre politique de confidentialité.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. ABONNEMENT PREMIUM</h2>
            <h3 className="text-xl font-medium mt-4 mb-2">5.1 Services payants</h3>
            <p>BiblioPulse propose un service premium au prix de 39 euros par an. L'abonnement premium offre des fonctionnalités supplémentaires comme la possibilité d'ajouter un nombre illimité de livres à votre bibliothèque.</p>
            <h3 className="text-xl font-medium mt-4 mb-2">5.2 Facturation et annulation</h3>
            <p>
              Le paiement est effectué annuellement. Vous pouvez annuler votre abonnement à tout moment, l'accès aux fonctionnalités premium se terminera à la fin de la période de facturation en cours.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. PROPRIÉTÉ INTELLECTUELLE</h2>
            <h3 className="text-xl font-medium mt-4 mb-2">6.1 Contenu du site</h3>
            <p>
              Tous les contenus présents sur BiblioPulse, y compris les textes, graphiques, logos, icônes, images, sont la propriété de HAKUNA MATATA SRL ou de ses fournisseurs de contenu et sont protégés par les lois belges et internationales sur la propriété intellectuelle.
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">6.2 Liens vers Amazon</h3>
            <p>
              Notre site peut contenir des liens d'affiliation vers Amazon. Nous participons au Programme Partenaires d'Amazon, un programme d'affiliation conçu pour permettre aux sites de percevoir une rémunération grâce à la publicité et à des liens vers Amazon.fr.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. LIMITATION DE RESPONSABILITÉ</h2>
            <h3 className="text-xl font-medium mt-4 mb-2">7.1 Exactitude des informations</h3>
            <p>
              Bien que nous nous efforcions de fournir des informations précises sur les livres, nous ne garantissons pas l'exactitude, l'exhaustivité ou la pertinence des informations sur notre site.
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">7.2 Disponibilité du service</h3>
            <p>
              Nous nous efforçons de maintenir le service disponible en permanence, mais nous ne garantissons pas que le site ou l'application sera toujours disponible ou sans interruption.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. DROIT DE RÉTRACTATION</h2>
            <p>
              Conformément au droit belge et européen, les consommateurs disposent d'un délai de 14 jours pour se rétracter d'un contrat de service sans avoir à justifier de motifs. Cependant, en commençant à utiliser notre service premium immédiatement, vous renoncez expressément à ce droit de rétractation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. TVA</h2>
            <p>
              HAKUNA MATATA SRL, avec le numéro d'entreprise 0877.585.922, est assujettie à la TVA belge. Les prix affichés sur notre site sont toutes taxes comprises (TTC).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. LOI APPLICABLE ET JURIDICTION</h2>
            <p>
              Les présentes mentions légales sont régies par le droit belge. Tout litige relatif à l'interprétation ou à l'exécution des présentes sera soumis à la compétence exclusive des tribunaux belges.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. CONTACT</h2>
            <p>
              Pour toute question concernant ces mentions légales, veuillez nous contacter à :
            </p>
            <p className="mt-2">
              Email : <a href="mailto:debruijneb@gmail.com" className="text-primary underline">debruijneb@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>;
};
export default LegalNotice;
