import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultCards } from './constants/defaultCards';
import StartupScreen from './components/StartupScreen';
import Carousel from './components/Carousel';
import CardModal from './components/CardModal';
import AddCardForm from './components/AddCardForm';
import ButterflyBackground from './components/ButterflyBackground';
import GlowingParticles from './components/GlowingParticles';
import { Sparkles, Info } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem('dreamscape_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return defaultCards;
    } catch (e) {
      console.error("Failed to load cards from localStorage:", e);
      return defaultCards;
    }
  });
  const [selectedCard, setSelectedCard] = useState(null);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    try {
      if (cards.length > 0) {
        localStorage.setItem('dreamscape_cards', JSON.stringify(cards));
      } else {
        localStorage.removeItem('dreamscape_cards');
      }
    } catch (e) {
      console.error("Failed to save cards to localStorage:", e);
      alert("Notice: Browser storage limit exceeded. This is usually caused by holding old, uncompressed large photos in your browser history. Please click the '+' button in the bottom right, open the panel, and click 'Clear All' to reset the cache and start fresh. Your new compressed images will save permanently without any limits!");
    }
  }, [cards]);

  // Appends a new card dynamically to local React state with safe unique incremental IDs
  const handleAddCard = (newCard) => {
    if (cards.length >= 12) return;
    
    // Find a unique small integer ID to avoid duplicates but keep serial clean
    const existingIds = cards.map(c => c.id);
    let newId = cards.length + 1;
    while (existingIds.includes(newId)) {
      newId++;
    }

    const preparedCard = {
      ...newCard,
      id: newId,
    };
    
    setCards((prev) => [...prev, preparedCard]);
  };

  // Deletes a card and closes the modal if it's currently open
  const handleDeleteCard = (cardId) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard(null);
    }
  };

  // Clears all cards from the keepsakes registry and purges browser cache
  const handleClearAllCards = () => {
    if (window.confirm("Are you sure you want to release all memories? This will empty your Keepsakes gallery and clear your browser database cache so you can start fresh.")) {
      setCards([]);
      try {
        localStorage.removeItem('dreamscape_cards');
        localStorage.clear(); // Wipes any giant old blocks to fully solve QuotaExceededError
      } catch (e) {
        console.error("Failed to clear browser storage:", e);
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#fff3ed] text-[#4a3728] font-sans overflow-x-hidden flex flex-col justify-between">
      
      {/* 1. Cinematic Startup Intro Screen Overlay */}
      <AnimatePresence>
        {showIntro && (
          <StartupScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Main Content Layout (Fades in once intro finishes) */}
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full min-h-screen flex flex-col justify-between p-6 sm:p-8"
        >
          {/* Base Background Systems (Glows & Flyers) */}
          <GlowingParticles />
          <ButterflyBackground />

          {/* A. Elegant Gallery Header Section */}
          <header className="relative w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-4 sm:mt-8 mb-4 z-20 pointer-events-none select-none">
            
            {/* Calligraphy branding titles */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <h2 className="font-calligraphy text-4xl sm:text-5xl text-amber-900/50 leading-none">
                Aurelia's
              </h2>
              <h1 className="font-cursive text-5xl sm:text-7xl text-amber-800 glow-text tracking-wide mt-2">
                Keepsakes
              </h1>
            </motion.div>

            {/* Glowing Decorative Separator Line */}
            <div className="flex items-center gap-3 mt-4">
              <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-600/30" />
              <Sparkles size={14} className="text-amber-500/60 animate-pulse" />
              <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-600/30" />
            </div>

            {/* Poetic description / SEO subline */}
            <div className="font-sans text-xs sm:text-sm text-amber-900/60 font-light mt-4 tracking-wider max-w-xl px-4 leading-relaxed flex flex-col gap-2">
              <p>Step into a rotating gallery of the sweetest memories and gifts that became a beautiful part of my life</p>
              <p>Every little thing here carries warmth, care, and a piece of your heart</p>
              <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-amber-800/80 mt-1">The circle completes at exactly 12..</p>
            </div>
          </header>


          {/* B. Core Interactive 3D Carousel Section */}
          <main className="relative w-full flex-grow flex items-center justify-center py-12 z-20">
            <Carousel 
              cards={cards} 
              onSelectCard={(card) => setSelectedCard(card)} 
            />
          </main>

          {/* C. Floating Controls & Alerts (Lower panel details) */}
          <footer className="relative w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-amber-900/5 text-[10px] text-amber-950/40 uppercase tracking-widest font-sans font-light z-20 select-none">
            <div className="flex items-center gap-2">
              <Info size={12} className="text-amber-700/40" />
              <span>Scroll to rotate • Tap card to magnify</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span>Chrysalis Registry:</span>
              <span className="font-bold text-amber-800">{cards.length} / 12 Shards</span>
            </div>
          </footer>

          {/* D. Slide-Over Add Content Drawer Trigger & Panel */}
          <AddCardForm 
            cards={cards}
            cardsCount={cards.length} 
            onAddCard={handleAddCard} 
            onDeleteCard={handleDeleteCard}
            onClearAllCards={handleClearAllCards}
          />

          {/* E. Zoom Calligraphy Card Detail Modal */}
          <AnimatePresence>
            {selectedCard && (
              <CardModal 
                card={selectedCard} 
                onClose={() => setSelectedCard(null)} 
                onDeleteCard={handleDeleteCard}
              />
            )}
          </AnimatePresence>
          
        </motion.div>
      )}
    </div>
  );
}
