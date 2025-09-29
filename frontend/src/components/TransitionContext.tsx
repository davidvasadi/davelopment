import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransitionContextType } from '../types';

// Transition Context alapértelmezett értékekkel
const TransitionContext = createContext<TransitionContextType>({
  isNavigating: false,
  direction: 1,
  startNavigation: () => {},
  completeNavigation: () => {}
});

// Hook a transition context használatához
export const usePageTransition = () => useContext(TransitionContext);

// Provider komponens
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  // Navigáció indítása
  const startNavigation = (to: string, dir: number = 1) => {
    if ( to === location.pathname) return
    setDirection(dir);
    setIsNavigating(true);
    // Azonnal navigálunk, az overlay eltűnését a PageTransition belső animációja hívja meg
    navigate(to);
  };

  // Navigáció befejezése
  const completeNavigation = () => {
    setIsNavigating(false);
  };

  return (
    <TransitionContext.Provider value={{ isNavigating, direction, startNavigation, completeNavigation }}>
      {children}
    </TransitionContext.Provider>
  );
}
