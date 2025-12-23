import { createContext, useContext, type ReactNode, useState } from "react";

interface TourContextType {
  isTourActive: boolean;
  currentStep: number;
  hasSeenTour: boolean;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hasSeenTour") === "true";
    }
    return false;
  });

  const startTour = () => {
    setIsTourActive(true);
    setCurrentStep(0);
  };

  const endTour = () => {
    setIsTourActive(false);
    setCurrentStep(0);
    setHasSeenTour(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("hasSeenTour", "true");
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const skipTour = () => {
    endTour();
  };

  const tourValue: TourContextType = {
    isTourActive,
    currentStep,
    hasSeenTour,
    startTour,
    endTour,
    nextStep,
    prevStep,
    skipTour,
  };

  return <TourContext.Provider value={tourValue}>{children}</TourContext.Provider>;
}

export function useTourContext() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTourContext must be used within a TourProvider");
  }
  return context;
}
