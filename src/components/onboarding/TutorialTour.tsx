
import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/use-onboarding';

export function TutorialTour() {
  const { showTutorial, completeTutorial, skipTutorial } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [run, setRun] = useState(false);

  // Définition des étapes du tutoriel
  useEffect(() => {
    const allSteps: Step[] = [
      // Étape 1 - Introduction
      {
        target: 'body',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Bienvenue chez BiblioPulse !</h3>
            <p>Nous allons découvrir ensemble comment utiliser l'application pour gérer votre bibliothèque personnelle.</p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      // Étape 2 - Recherche et ajout de livres
      {
        target: '[data-tour="search-link"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Comment ajouter un livre</h3>
            <p>La page de recherche vous permet de trouver et d'ajouter des livres à votre bibliothèque.</p>
            <p className="mt-2">Cliquez sur ce lien pour accéder à la recherche.</p>
            <div className="mt-2 flex items-center">
              <span className="text-[#CC4153] font-bold text-xl mr-2">↑</span>
              <span className="text-sm italic">Cliquez ici pour rechercher des livres</span>
            </div>
          </div>
        ),
        placement: 'bottom',
      },
      // Étape 3 - Ajouter un livre depuis la recherche
      {
        target: 'body',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Ajouter un livre à votre bibliothèque</h3>
            <p>Une fois sur la page de recherche :</p>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              <li>Saisissez un titre ou un auteur dans la barre de recherche</li>
              <li>Choisissez un livre dans les résultats</li>
              <li>Cliquez sur le badge "Ajouter" pour l'ajouter à votre bibliothèque</li>
            </ol>
            <p className="mt-2 text-sm italic">Vous pourrez ensuite définir son statut de lecture</p>
          </div>
        ),
        placement: 'center',
        spotlightClicks: true,
      },
      // Étape 4 - Statut d'un livre
      {
        target: 'body',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Comment définir le statut d'un livre</h3>
            <p>Pour chaque livre, vous pouvez définir son statut :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><span className="font-medium">À lire</span> - pour les livres que vous prévoyez de lire</li>
              <li><span className="font-medium">En cours</span> - pour les livres que vous êtes en train de lire</li>
              <li><span className="font-medium">Lu</span> - pour les livres que vous avez terminés</li>
            </ul>
            <p className="mt-2 text-sm italic">Cliquez sur le badge du statut pour le modifier</p>
          </div>
        ),
        placement: 'center',
      },
      // Étape 5 - Bibliothèque
      {
        target: '[data-tour="library-link"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Comment accéder à votre bibliothèque personnelle</h3>
            <p>Tous vos livres sont organisés dans votre bibliothèque personnelle.</p>
            <div className="mt-2 flex items-center">
              <span className="text-[#CC4153] font-bold text-xl mr-2">↑</span>
              <span className="text-sm italic">Cliquez ici pour voir votre bibliothèque</span>
            </div>
          </div>
        ),
        placement: 'bottom',
      },
      // Étape 6 - Organisation de la bibliothèque
      {
        target: 'body',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Organisation de votre bibliothèque</h3>
            <p>Dans votre bibliothèque, vous pouvez :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Filtrer par statut (À lire, En cours, Lu, etc.)</li>
              <li>Trier vos livres (par date, titre, auteur)</li>
              <li>Changer l'affichage (grille ou liste)</li>
              <li>Rechercher un livre spécifique</li>
            </ul>
            <p className="mt-2 text-sm italic">Cliquez sur un livre pour voir et modifier ses détails</p>
          </div>
        ),
        placement: 'center',
      },
      // Étape 7 - Statistiques
      {
        target: '[data-tour="stats-link"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Comment consulter vos statistiques</h3>
            <p>Suivez votre progression de lecture et découvrez des insights sur vos habitudes.</p>
            <div className="mt-2 flex items-center">
              <span className="text-[#CC4153] font-bold text-xl mr-2">↑</span>
              <span className="text-sm italic">Cliquez ici pour accéder aux statistiques</span>
            </div>
          </div>
        ),
        placement: 'bottom',
      },
      // Étape 8 - Personnalisation des statistiques
      {
        target: 'body',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Comment personnaliser vos statistiques</h3>
            <p>Pour des statistiques plus précises, vous pouvez :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Définir votre vitesse de lecture personnelle</li>
              <li>Ajouter une date de début et de fin de lecture</li>
              <li>Définir des objectifs de lecture annuels et mensuels</li>
              <li>Filtrer les statistiques par année</li>
            </ul>
            <p className="mt-2 text-sm italic">Ces données permettent de calculer des statistiques plus pertinentes</p>
          </div>
        ),
        placement: 'center',
      },
      // Étape 9 - Thème
      {
        target: '[data-tour="theme-toggle"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Personnalisation de l'interface</h3>
            <p>Changez le thème de l'application selon vos préférences.</p>
            <div className="mt-2 flex items-center">
              <span className="text-[#CC4153] font-bold text-xl mr-2">←</span>
              <span className="text-sm italic">Cliquez pour changer de thème</span>
            </div>
          </div>
        ),
        placement: 'left',
      },
      // Étape 10 - Aide
      {
        target: '[data-tour="help-button"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Besoin d'aide ?</h3>
            <p>Vous pouvez relancer ce tutoriel à tout moment en cliquant sur ce bouton d'aide.</p>
            <div className="mt-2 flex items-center">
              <span className="text-[#CC4153] font-bold text-xl mr-2">←</span>
              <span className="text-sm italic">Cliquez ici pour revoir le tutoriel</span>
            </div>
          </div>
        ),
        placement: 'left',
      },
      // Étape 11 - Conclusion
      {
        target: 'body',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Vous êtes prêt !</h3>
            <p>Vous pouvez maintenant profiter pleinement de BiblioPulse pour gérer votre bibliothèque et suivre vos lectures.</p>
            <p className="mt-2">Bonne lecture ! 📚</p>
          </div>
        ),
        placement: 'center',
      },
    ];

    setSteps(allSteps);
  }, []);

  // Démarrer le tour quand showTutorial devient true
  useEffect(() => {
    console.log("showTutorial changed:", showTutorial);
    if (showTutorial) {
      console.log("Starting tutorial tour...");
      setRun(true);
      setStepIndex(0); // Réinitialiser à la première étape
    } else {
      setRun(false);
    }
  }, [showTutorial]);

  // Gestion des callbacks de Joyride
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    console.log("Joyride callback:", { action, index, status, type });
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      // Tutoriel terminé ou ignoré
      console.log("Tutorial finished or skipped");
      setRun(false);
      completeTutorial();
    } else if (type === 'step:after') {
      // Navigation vers la prochaine étape
      console.log("Moving to next step, current index:", index);
      setStepIndex(index + 1);
      
      // Navigation vers des pages spécifiques selon l'étape
      if (index === 1 && location.pathname !== '/search') {
        console.log("Navigating to /search");
        navigate('/search');
      } else if (index === 4 && location.pathname !== '/library') {
        console.log("Navigating to /library");
        navigate('/library');
      } else if (index === 6 && location.pathname !== '/statistics') {
        console.log("Navigating to /statistics");
        navigate('/statistics');
      }
    } else if (action === 'close' || type === 'tour:end') {
      // L'utilisateur a fermé le tutoriel
      console.log("User closed tutorial");
      setRun(false);
      skipTutorial();
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton={false}
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#CC4153',
          textColor: '#333',
          arrowColor: '#fff',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#CC4153',
          color: '#fff',
        },
        buttonBack: {
          marginRight: 10,
        },
        spotlight: {
          backgroundColor: 'rgba(204, 65, 83, 0.4)',
        },
        tooltip: {
          borderRadius: 8,
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        },
      }}
      locale={{
        back: 'Précédent',
        close: 'Fermer',
        last: 'Terminer',
        next: 'Suivant',
        skip: 'Passer',
      }}
    />
  );
}
