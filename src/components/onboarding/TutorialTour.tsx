
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
            <p>Nous allons découvrir ensemble les fonctionnalités principales de l'application.</p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      // Étape 2 - Recherche de livres
      {
        target: '[data-tour="search-link"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Rechercher des livres</h3>
            <p>Cliquez ici pour accéder à la recherche et ajouter de nouveaux livres à votre bibliothèque.</p>
          </div>
        ),
        placement: 'bottom',
      },
      // Étape 3 - Bibliothèque
      {
        target: '[data-tour="library-link"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Votre bibliothèque</h3>
            <p>Ici, vous retrouverez tous vos livres et pourrez les organiser selon vos préférences.</p>
          </div>
        ),
        placement: 'bottom',
      },
      // Étape 4 - Statistiques
      {
        target: '[data-tour="stats-link"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Vos statistiques</h3>
            <p>Suivez votre progression de lecture et découvrez des insights sur vos habitudes.</p>
          </div>
        ),
        placement: 'bottom',
      },
      // Étape 5 - Thème
      {
        target: '[data-tour="theme-toggle"]',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Personnalisation</h3>
            <p>Changez le thème de l'application selon vos préférences.</p>
          </div>
        ),
        placement: 'left',
      },
      // Étape 6 - Conclusion
      {
        target: 'body',
        content: (
          <div>
            <h3 className="text-lg font-semibold mb-2">Vous êtes prêt !</h3>
            <p>Vous pouvez maintenant profiter pleinement de BiblioPulse. Bonne lecture !</p>
          </div>
        ),
        placement: 'center',
      },
    ];

    setSteps(allSteps);
  }, []);

  // Démarrer le tour quand showTutorial devient true
  useEffect(() => {
    if (showTutorial) {
      setRun(true);
    } else {
      setRun(false);
    }
  }, [showTutorial]);

  // Gestion des callbacks de Joyride
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Tutoriel terminé ou ignoré
      setRun(false);
      completeTutorial();
    } else if (type === 'step:after') {
      // Navigation vers la prochaine étape
      setStepIndex(index + 1);
      
      // Navigation vers des pages spécifiques selon l'étape
      if (index === 1 && location.pathname !== '/search') {
        navigate('/search');
      } else if (index === 2 && location.pathname !== '/library') {
        navigate('/library');
      } else if (index === 3 && location.pathname !== '/statistics') {
        navigate('/statistics');
      }
    } else if (action === 'close' || type === 'tour:end') {
      // L'utilisateur a fermé le tutoriel
      setRun(false);
      skipTutorial();
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
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
