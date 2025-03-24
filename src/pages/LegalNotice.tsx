
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const LegalNotice = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mentions légales | BiblioPluse</title>
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
            <p>
              Le site et l'application BiblioPluse sont édités par :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>HAKUNA MATATA SRL</li>
              <li>Numéro d'entreprise : 0877.585.922</li>
              <li>Adresse : Avenue De Fré 139/52, 1180 Uccle, Belgique</li>
              <li>Email : <a href="mailto:debruijneb@gmail.com" className="text-primary underline">debruijneb@gmail.com</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. DIRECTEUR DE LA PUBLICATION</h2>
            <p>
              Le directeur de la publication est Benoît De Bruijne, en qualité de gérant de la société HAKUNA MATATA SRL.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. HÉBERGEMENT</h2>
            <p>
              Le site BiblioPluse est hébergé par :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Vercel Inc.</li>
              <li>440 N Barranca Ave #4133</li>
              <li>Covina, CA 91723</li>
              <li>États-Unis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. PROPRIÉTÉ INTELLECTUELLE</h2>
            <p>
              L'ensemble du contenu du site BiblioPluse (illustrations, textes, logos, marques, icônes, images, fichiers audio ou vidéo...) 
              est la propriété exclusive de HAKUNA MATATA SRL, à l'exception des contenus fournis par des tiers (notamment les 
              couvertures de livres et les descriptions fournies par des API tierces).
            </p>
            <p className="mt-2">
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, 
              quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de HAKUNA MATATA SRL.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. LIENS HYPERTEXTES</h2>
            <p>
              Le site BiblioPluse peut contenir des liens hypertextes vers d'autres sites internet ou applications. 
              HAKUNA MATATA SRL n'exerce aucun contrôle sur ces sites et applications et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. DROIT APPLICABLE ET JURIDICTION COMPÉTENTE</h2>
            <p>
              Les présentes mentions légales sont régies par le droit belge. En cas de litige, les tribunaux belges seront seuls compétents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. CONTACT</h2>
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
    </div>
  );
};

export default LegalNotice;
