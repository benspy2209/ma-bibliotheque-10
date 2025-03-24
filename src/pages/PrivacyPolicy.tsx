import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
const PrivacyPolicy = () => {
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Politique de confidentialité | BiblioPluse</title>
      </Helmet>
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            Dernière mise à jour : 24 mars 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. INTRODUCTION</h2>
            <p className="text-base">BiblioPulse respecte votre vie privée et s'engage à protéger les données à caractère personnel que vous partagez avec nous. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre application et notre site web (https://bibliopulse.com).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. RESPONSABLE DU TRAITEMENT</h2>
            <p>
              HAKUNA MATATA SRL, avec numéro d'entreprise 0877.585.922, établie en Belgique à l'adresse Avenue De Fré 139/52, 
              1180 Uccle, est le responsable du traitement de vos données à caractère personnel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. DONNÉES QUE NOUS COLLECTONS</h2>
            <p>
              Nous collectons les types d'informations suivants :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Informations de compte : adresse e-mail et mot de passe pour créer et gérer votre compte.</li>
              <li>Données relatives à votre bibliothèque : informations sur les livres que vous ajoutez à votre bibliothèque personnelle, 
                y compris le statut de lecture (à lire, en cours, lu).</li>
              <li>Données d'utilisation : informations sur la façon dont vous utilisez notre application, vos préférences et paramètres.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. COMMENT NOUS UTILISONS VOS DONNÉES</h2>
            <p>
              Nous utilisons vos données pour :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte</li>
              <li>Envoyer des informations importantes concernant notre service</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Traiter les paiements pour les abonnements premium</li>
              <li>Fournir un support client</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. BASE LÉGALE DU TRAITEMENT</h2>
            <p>
              Nous traitons vos données personnelles sur les bases légales suivantes :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Exécution d'un contrat : traitement nécessaire à l'exécution du contrat auquel vous êtes partie.</li>
              <li>Consentement : lorsque vous avez donné votre consentement explicite.</li>
              <li>Intérêts légitimes : lorsque le traitement est nécessaire aux fins des intérêts légitimes poursuivis par nous.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. PARTAGE DES DONNÉES</h2>
            <p>
              Nous pouvons partager vos données avec :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Partenaires de services : prestataires de services qui nous aident à exploiter notre application (hébergement, paiements).</li>
              <li>Amazon : si vous cliquez sur des liens d'affiliation, certaines informations non personnelles peuvent être partagées avec Amazon dans 
                le cadre du Programme Partenaires d'Amazon.</li>
            </ul>
            <p>Nous ne vendons pas vos données personnelles à des tiers.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. CONSERVATION DES DONNÉES</h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. 
              Si vous supprimez votre compte, nous supprimerons ou anonymiserons vos données personnelles dans un délai raisonnable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. VOS DROITS</h2>
            <p>
              En tant que résident de l'Union européenne, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Droit d'accès</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition</li>
              <li>Droit de retirer votre consentement</li>
            </ul>
            <p>Pour exercer ces droits, veuillez nous contacter à debruijneb@gmail.com.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. SÉCURITÉ</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre la perte, 
              l'accès non autorisé, la divulgation, l'altération ou la destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. MODIFICATIONS DE CETTE POLITIQUE</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version la plus récente sera toujours 
              disponible sur notre site web avec la date de dernière mise à jour.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. CONTACT</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter à :
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
export default PrivacyPolicy;