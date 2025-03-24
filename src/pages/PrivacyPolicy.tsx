
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Politique de confidentialité | Ma Bibliothèque</title>
      </Helmet>
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Bienvenue sur Ma Bibliothèque. Nous nous engageons à protéger votre vie privée et vos données personnelles. 
              Cette politique de confidentialité décrit comment nous collectons, utilisons et partageons vos informations 
              lorsque vous utilisez notre service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Collecte et utilisation des données</h2>
            <p>
              Nous collectons les informations que vous fournissez directement lors de l'inscription et de l'utilisation 
              du service, notamment :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Informations de compte (e-mail, mot de passe)</li>
              <li>Données de bibliothèque personnelle (livres ajoutés, notes, commentaires)</li>
              <li>Préférences de lecture et historique d'activité</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Stockage et sécurité</h2>
            <p>
              Vos données sont stockées de manière sécurisée sur Supabase. Nous prenons toutes les mesures raisonnables pour 
              protéger vos informations contre l'accès non autorisé, la modification, la divulgation ou la destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Partage des données</h2>
            <p>
              Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager certaines informations avec :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Nos fournisseurs de services (hébergement, analyses)</li>
              <li>Si requis par la loi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Vos droits</h2>
            <p>
              Vous avez le droit d'accéder, de corriger ou de supprimer vos données personnelles. Vous pouvez également 
              demander une copie de vos données ou vous opposer à leur traitement dans certaines circonstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Modifications de la politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de 
              tout changement significatif par e-mail ou par une notification sur notre site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
              veuillez nous contacter à : <a href="mailto:contact@mabibliothèque.fr" className="text-primary underline">
                contact@mabibliothèque.fr
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
