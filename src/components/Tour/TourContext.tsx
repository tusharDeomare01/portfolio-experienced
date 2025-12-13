import { createContext, useContext, type ReactNode } from "react";
import { useTour } from "./Tour";

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
  const tour = useTour();

  return <TourContext.Provider value={tour}>{children}</TourContext.Provider>;
}

export function useTourContext() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTourContext must be used within a TourProvider");
  }
  return context;
}
