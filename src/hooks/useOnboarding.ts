import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);
  
  const completeOnboarding = () => {
    localStorage.setItem('onboarding_seen', 'true');
    setShowOnboarding(false);
    setStep(0);
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(0, prev - 1));
  };
  
  return { 
    showOnboarding, 
    step, 
    setStep, 
    nextStep,
    prevStep,
    completeOnboarding 
  };
};
