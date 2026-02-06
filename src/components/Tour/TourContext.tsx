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
    if (typeof window !== "undefined") {
      // Dispatch gsap-intro-complete event to ensure Hero elements are visible
      // This triggers the Hero entrance animation if it hasn't played yet
      window.dispatchEvent(new CustomEvent("gsap-intro-complete"));
      // Dispatch tour-start event to disable scroll-triggered exit animations
      // This prevents sections from fading out when Tour scrolls between them
      window.dispatchEvent(new CustomEvent("tour-start"));
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setCurrentStep(0);
    setHasSeenTour(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("hasSeenTour", "true");
      // Dispatch tour-end event to re-enable scroll-triggered animations
      window.dispatchEvent(new CustomEvent("tour-end"));
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
