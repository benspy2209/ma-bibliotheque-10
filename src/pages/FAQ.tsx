import React from 'react';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, BookOpen, Search, BookmarkIcon, BarChart2, Users, BookText } from 'lucide-react';

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>FAQ et Guide d'utilisation | BiblioPulse</title>
        <meta name="description" content="Questions fréquemment posées et guide d'utilisation de BiblioPulse" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">FAQ & Guide d'utilisation</h1>
          <p className="text-lg text-center mb-12 text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment tirer le meilleur parti de BiblioPulse et trouvez des réponses à vos questions.
          </p>

          <Tabs defaultValue="guide" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Guide d'utilisation
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Guide d'utilisation */}
            <TabsContent value="guide" className="mt-6">
              <div className="grid gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Rechercher des livres
                    </h2>
                    <div className="space-y-4">
                      <p>Pour rechercher des livres et les ajouter à votre bibliothèque :</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accédez à la page <strong>Recherche</strong> depuis le menu principal.</li>
                        <li>Entrez le titre du livre, le nom de l'auteur ou l'ISBN dans le champ de recherche.</li>
                        <li>Sélectionnez le type de recherche souhaité (par titre, auteur ou ISBN).</li>
                        <li>Choisissez la langue dans laquelle effectuer votre recherche.</li>
                        <li>Cliquez sur "Rechercher" pour afficher les résultats.</li>
                        <li>Pour ajouter un livre à votre bibliothèque, cliquez sur le bouton "+" ou "Ajouter à ma bibliothèque".</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <BookmarkIcon className="h-5 w-5 text-primary" />
                      Gérer votre bibliothèque
                    </h2>
                    <div className="space-y-4">
                      <p>Votre bibliothèque est l'endroit où vous pouvez organiser tous vos livres :</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accédez à la page <strong>Ma Bibliothèque</strong> depuis le menu principal.</li>
                        <li>Vos livres sont organisés par sections : Non lus, En cours, Terminés.</li>
                        <li>Cliquez sur un livre pour accéder à ses détails complets.</li>
                        <li>Vous pouvez modifier le statut d'un livre (non lu, en cours, terminé) depuis la page de détails.</li>
                        <li>Pour filtrer vos livres, utilisez les options de filtrage disponibles en haut de votre bibliothèque.</li>
                        <li>Changez entre la vue grille et la vue liste selon votre préférence.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Consulter vos statistiques
                    </h2>
                    <div className="space-y-4">
                      <p>Suivez votre progression de lecture avec des statistiques détaillées :</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accédez à la page <strong>Statistiques</strong> depuis le menu principal.</li>
                        <li>Consultez votre temps de lecture total, nombre de livres lus, et autres métriques.</li>
                        <li>Définissez des objectifs de lecture en cliquant sur "Définir un objectif".</li>
                        <li>Suivez votre série de jours consécutifs de lecture.</li>
                        <li>Utilisez le filtre par année pour voir vos statistiques sur différentes périodes.</li>
                        <li>Ajustez votre vitesse de lecture moyenne dans les paramètres pour des estimations plus précises.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Gérer votre compte
                    </h2>
                    <div className="space-y-4">
                      <p>Pour profiter de toutes les fonctionnalités de BiblioPulse :</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Créez un compte ou connectez-vous via le bouton "Se connecter" dans la barre de navigation.</li>
                        <li>Vous pouvez vous inscrire avec votre email et un mot de passe ou utiliser l'authentification via Google.</li>
                        <li>Si vous oubliez votre mot de passe, utilisez l'option "Mot de passe oublié" sur l'écran de connexion.</li>
                        <li>Votre bibliothèque est synchronisée automatiquement sur tous vos appareils une fois connecté.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Comment puis-je ajouter un livre manuellement à ma bibliothèque ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Pour ajouter un livre manuellement :</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Accédez à votre bibliothèque depuis le menu principal</li>
                      <li>Cliquez sur le bouton "Ajouter un livre" ou "+"</li>
                      <li>Sélectionnez l'option "Ajouter manuellement"</li>
                      <li>Remplissez les informations du livre (titre, auteur, etc.)</li>
                      <li>Cliquez sur "Ajouter à ma bibliothèque"</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Comment modifier les informations d'un livre dans ma bibliothèque ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Pour modifier les informations d'un livre :</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Accédez à la page de détails du livre en cliquant dessus dans votre bibliothèque</li>
                      <li>Cliquez sur l'icône "Modifier" ou le bouton "Éditer les détails"</li>
                      <li>Modifiez les informations souhaitées dans le formulaire</li>
                      <li>Cliquez sur "Enregistrer" pour sauvegarder vos modifications</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Comment supprimer un livre de ma bibliothèque ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Pour supprimer un livre de votre bibliothèque :</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Accédez à la page de détails du livre en cliquant dessus dans votre bibliothèque</li>
                      <li>Faites défiler jusqu'en bas de la page ou recherchez l'option "Supprimer"</li>
                      <li>Cliquez sur le bouton "Supprimer"</li>
                      <li>Confirmez la suppression dans la boîte de dialogue qui apparaît</li>
                    </ol>
                    <p className="mt-2 text-sm text-muted-foreground">Note: Cette action est irréversible. Si vous souhaitez simplement masquer le livre de votre vue principale, vous pouvez utiliser les filtres de la bibliothèque.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Comment puis-je marquer un livre comme "Lu" ou "En cours de lecture" ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Pour changer le statut d'un livre :</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Accédez à la page de détails du livre en cliquant dessus dans votre bibliothèque</li>
                      <li>Recherchez la section "Statut de lecture" ou les boutons d'action</li>
                      <li>Cliquez sur le bouton correspondant au statut souhaité ("Non lu", "En cours", "Terminé")</li>
                      <li>Si vous marquez un livre comme terminé, vous pourrez également ajouter une date d'achèvement et une note</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Comment exporter ma bibliothèque pour la sauvegarder ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Pour exporter votre bibliothèque :</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Accédez à votre bibliothèque depuis le menu principal</li>
                      <li>Recherchez le bouton "Exporter/Importer" ou l'icône correspondante</li>
                      <li>Sélectionnez l'option "Exporter ma bibliothèque"</li>
                      <li>Choisissez le format d'exportation souhaité (JSON ou CSV)</li>
                      <li>Confirmez l'exportation et téléchargez le fichier</li>
                    </ol>
                    <p className="mt-2 text-sm text-muted-foreground">Note: Il est recommandé d'exporter régulièrement votre bibliothèque pour éviter toute perte de données.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    Comment puis-je ajouter une critique ou une note à un livre ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Pour ajouter une critique ou une note :</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Accédez à la page de détails du livre en cliquant dessus dans votre bibliothèque</li>
                      <li>Faites défiler jusqu'à la section "Mon avis" ou "Critique"</li>
                      <li>Cliquez sur "Ajouter une critique" ou "Modifier"</li>
                      <li>Rédigez votre critique et attribuez une note (de 1 à 5 étoiles)</li>
                      <li>Cliquez sur "Enregistrer" pour sauvegarder votre critique</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    Comment utiliser BiblioPulse sur mon téléphone ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">BiblioPulse est entièrement adapté aux appareils mobiles :</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Accédez à BiblioPulse depuis le navigateur de votre téléphone</li>
                      <li>Pour une expérience optimale, ajoutez BiblioPulse à votre écran d'accueil :</li>
                      <ul className="list-disc pl-8 mt-1 space-y-1">
                        <li><strong>Sur iOS</strong> : Appuyez sur l'icône de partage puis "Sur l'écran d'accueil"</li>
                        <li><strong>Sur Android</strong> : Appuyez sur les trois points en haut à droite puis "Ajouter à l'écran d'accueil"</li>
                      </ul>
                      <li>Une fois ajouté, BiblioPulse fonctionnera comme une application native</li>
                      <li>Connectez-vous à votre compte pour synchroniser votre bibliothèque entre tous vos appareils</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>
                    Comment définir et suivre mes objectifs de lecture ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Pour définir et suivre vos objectifs de lecture :</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Accédez à la page "Statistiques" depuis le menu principal</li>
                      <li>Recherchez la section "Mes objectifs" ou "Objectifs de lecture"</li>
                      <li>Cliquez sur "Définir un objectif" ou "Modifier"</li>
                      <li>Choisissez le type d'objectif (nombre de livres, temps de lecture, etc.)</li>
                      <li>Définissez la valeur cible et la période (annuelle, mensuelle)</li>
                      <li>Suivez votre progression directement depuis la page Statistiques</li>
                    </ol>
                    <p className="mt-2 text-sm text-muted-foreground">Note: Vous pouvez modifier vos objectifs à tout moment si vous trouvez qu'ils sont trop ambitieux ou pas assez.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Section de contact */}
              <div className="mt-12 p-6 border rounded-lg bg-background/50 text-center">
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Vous ne trouvez pas de réponse à votre question ?
                </h3>
                <p className="mb-4">
                  N'hésitez pas à nous contacter directement pour obtenir de l'aide personnalisée.
                </p>
                <a href="/contact" className="text-primary hover:underline font-medium">
                  Contactez-nous →
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FAQ;
