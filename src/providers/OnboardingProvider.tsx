
import React, { createContext, useContext, ReactNode } from 'react';
import { useOnboarding } from '@/hooks/use-onboarding';

type OnboardingContextType = ReturnType<typeof useOnboarding>;

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const onboardingData = useOnboarding();
  
  return (
    <OnboardingContext.Provider value={onboardingData}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
};
