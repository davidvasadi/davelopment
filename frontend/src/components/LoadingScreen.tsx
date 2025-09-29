import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showSlideUp, setShowSlideUp] = useState(false);
  const logoText = '[davelopment]®';
  const letters = logoText.split('');

  useEffect(() => {
    // Betűnkénti megjelenítés gyorsan, egymás után
    const letterInterval = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev >= letters.length) {
          clearInterval(letterInterval);
          // Rövid várakozás után legyen a felfelé csúszás
          setTimeout(() => {
            setShowSlideUp(true);
            // Csúszás után jelezzük a betöltés befejeződését
            setTimeout(() => {
              onComplete();
            }, 600); // Gyorsabb csúszás
          }, 800); // Rövid szünet a betűk után
          return prev;
        }
        return prev + 1;
      });
    }, 50); // Nagyon gyors betűanimáció
    return () => clearInterval(letterInterval);
  }, [letters.length, onComplete]);

  // Minden betű késleltetésének kiszámítása
  const getLetterDelay = (index: number) => {
    if (index === 0) return 0;     // Első karakter azonnal jelenik meg
    if (index === 1) return 30;    // Második karakter gyorsabb késéssel
    return index * 30 + 100;       // A többi betű is gyorsan, de egyéni késleltetéssel
  };

  return (
    <>
      {/* Betöltőképernyő: fekete háttér és animált felirat */}
      <div
        className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-transform duration-700 ease-in-out ${
          showSlideUp ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="relative">
          {/* Főfelirat: betűk animált bemozdulással */}
          <div className="text-white text-4xl font-semibold tracking-tight">
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`inline-block transition-all duration-500 ease-out ${
                  index < visibleLetters
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-32'
                }`}
                style={{ transitionDelay: `${getLetterDelay(index)}ms` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>

          {/* Tükörhatás a felirat alatt */}
          <div className="absolute top-full left-0 transform scale-y-[-1] text-transparent text-4xl font-semibold tracking-tight bg-gradient-to-b from-white/30 via-white/10 to-transparent bg-clip-text">
            {letters.map((letter, index) => (
              <span
                key={`reflection-${index}`}
                className={`inline-block transition-all duration-500 ease-out ${
                  index < visibleLetters
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-32'
                }`}
                style={{ transitionDelay: `${getLetterDelay(index)}ms` }}
              >
                {letter === ' ' ? ' ' : letter}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Főoldal tartalmának felfelé csúsztatása */}
      <div
        className={`fixed inset-0 bg-white transition-transform duration-700 ease-in-out ${
          showSlideUp ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ zIndex: 40 }}
      >
        {/* Ide kerül a tényleges tartalom betöltés után */}
      </div>
    </>
  );
}
