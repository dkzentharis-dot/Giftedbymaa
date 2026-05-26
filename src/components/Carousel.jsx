import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Butterfly } from './ButterflyBackground';

// Reusable flat card component used when layout doesn't require 3D cylindrical projection
function FlatCard({ card, idx, onSelectCard }) {
  return (
    <div
      onClick={() => onSelectCard(card)}
      className="group relative flex flex-col justify-end overflow-hidden cursor-pointer border border-white/20 bg-white/10 backdrop-blur-md shadow-glass hover:shadow-glass-glow hover:border-amber-300/40 w-[16.5em] aspect-[7/10] rounded-[1.5em] transition-all duration-500 hover:scale-105 transform-style:preserve-3d"
    >
      {/* Visual Shimmers and Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-15" />
      
      {/* Background Image */}
      <img
        src={card.image}
        alt={card.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Perched butterfly */}
      <div className="absolute top-4 right-4 z-20 opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 origin-center pointer-events-none">
        <Butterfly color={idx % 2 === 0 ? "pink" : "cyan"} size={28} isFlapping={true} />
      </div>

      <div className="absolute top-4 left-4 z-20 text-amber-200/50 group-hover:text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles size={16} className="animate-pulse" />
      </div>

      {/* Contents */}
      <div className="relative p-6 z-20 flex flex-col gap-1 text-left transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <h3 className="font-cursive text-3xl sm:text-4xl text-amber-100 leading-none group-hover:text-amber-200 transition-colors">
          {card.title}
        </h3>
        <p className="font-sans text-xs text-amber-200/80 line-clamp-1 group-hover:text-amber-100/90 transition-colors mt-1 font-light italic">
          {card.preview}
        </p>
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-amber-300/0 group-hover:text-amber-300/80 transition-opacity duration-500 mt-2 font-medium">
          Tap to Open Gallery
        </span>
      </div>
    </div>
  );
}

export default function Carousel({ cards, onSelectCard }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [manualRotation, setManualRotation] = useState(0);
  const autoRotateTimerRef = useRef(null);
  const totalCards = cards.length;

  const anglePerCard = totalCards > 0 ? 360 / totalCards : 0;

  // Handles manual chevrons sweep
  const rotateCarousel = (direction) => {
    if (totalCards < 3) return;
    setIsInteracting(true);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % totalCards;
      setManualRotation((prev) => prev - anglePerCard);
    } else {
      newIndex = (currentIndex - 1 + totalCards) % totalCards;
      setManualRotation((prev) => prev + anglePerCard);
    }
    setCurrentIndex(newIndex);

    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 15000);
  };

  useEffect(() => {
    if (!isInteracting && totalCards >= 3) {
      setManualRotation(-currentIndex * anglePerCard);
    }
  }, [isInteracting, currentIndex, anglePerCard, totalCards]);

  useEffect(() => {
    return () => {
      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    };
  }, []);

  // 1. EMPTY GALLERY LAYOUT (0 CARDS)
  if (totalCards === 0) {
    return (
      <div className="relative w-full h-[45vh] flex flex-col items-center justify-center text-center select-none z-20 px-6">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="p-8 bg-white/20 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-glass max-w-md flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-white/30 border border-white/50 rounded-full flex items-center justify-center text-amber-800/60 animate-pulse">
            <Sparkles size={24} />
          </div>
          <h3 className="font-cursive text-4xl text-amber-800 leading-none">
            An Empty Canvas
          </h3>
          <p className="font-sans text-xs text-amber-900/60 font-light leading-relaxed px-4">
            There are currently no memories in your Keepsakes. Tap the glowing <strong className="text-amber-800 font-semibold font-sans">+</strong> button on the right to add your first beautiful memory!
          </p>
        </motion.div>
      </div>
    );
  }

  // 2. FLAT PROGRESSIVE LAYOUT (1 - 2 CARDS)
  if (totalCards < 3) {
    return (
      <div className="relative w-full min-h-[50vh] flex flex-col items-center justify-center select-none z-20 px-6 gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <FlatCard card={card} idx={idx} onSelectCard={onSelectCard} />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center pointer-events-none mt-4">
          <p className="font-calligraphy text-2xl text-amber-900/40 leading-none">
            Tap a card to explore its story (rotating 3D carousel unlocks at 3 memories)
          </p>
        </div>
      </div>
    );
  }

  // 3. CYLINDRICAL 3D CAROUSEL (3 - 11 CARDS)
  return (
    <div className="relative w-full h-[60vh] sm:h-[65vh] flex flex-col items-center justify-center select-none z-20">
      
      <div className="scene w-full max-w-5xl h-full flex items-center justify-center">
        <div
          className={`a3d w-full h-full justify-items-center items-center`}
          style={{
            '--n': totalCards,
            transform: isInteracting 
              ? `rotateY(${manualRotation}deg)`
              : undefined,
            animation: isInteracting ? 'none' : 'ry 38s linear infinite',
          }}
          onMouseEnter={(e) => {
            if (!isInteracting) {
              e.currentTarget.classList.add('paused');
            }
          }}
          onMouseLeave={(e) => {
            if (!isInteracting) {
              e.currentTarget.classList.remove('paused');
            }
          }}
        >
          {cards.map((card, idx) => {
            const isCenter = idx === currentIndex && isInteracting;

            return (
              <div
                key={card.id}
                className={`card group relative flex flex-col justify-end overflow-hidden cursor-pointer border border-white/20 bg-white/10 backdrop-blur-md shadow-glass hover:shadow-glass-glow hover:border-amber-300/40`}
                style={{
                  '--i': idx,
                  boxShadow: isCenter ? '0 0 25px 5px rgba(251, 191, 36, 0.25)' : undefined,
                }}
                onClick={() => onSelectCard(card)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-15" />

                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute top-4 right-4 z-20 opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 origin-center pointer-events-none">
                  <Butterfly 
                    color={idx % 2 === 0 ? "pink" : "cyan"} 
                    size={28} 
                    isFlapping={true} 
                  />
                </div>

                <div className="absolute top-4 left-4 z-20 text-amber-200/50 group-hover:text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles size={16} className="animate-pulse" />
                </div>

                <div className="relative p-6 z-20 flex flex-col gap-1 text-left transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h3 className="font-cursive text-3xl sm:text-4xl text-amber-100 leading-none group-hover:text-amber-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="font-sans text-xs text-amber-200/80 line-clamp-1 group-hover:text-amber-100/90 transition-colors mt-1 font-light italic">
                    {card.preview}
                  </p>
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-amber-300/0 group-hover:text-amber-300/80 transition-opacity duration-500 mt-2 font-medium">
                    Tap to Open Gallery
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chevrons Navigation panel */}
      <div className="absolute bottom-[-2.5rem] flex items-center gap-6 z-30">
        <button
          onClick={() => rotateCarousel('prev')}
          className="p-3 bg-white/40 border border-white/60 hover:bg-white/60 hover:border-amber-300/50 hover:shadow-glass rounded-full text-amber-900/70 hover:text-amber-900 transition-all duration-300 active:scale-95"
          aria-label="Previous Keepsakes Slide"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-full">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsInteracting(true);
                setCurrentIndex(idx);
                setManualRotation(-idx * anglePerCard);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex && isInteracting
                  ? 'bg-amber-600 w-4'
                  : 'bg-amber-900/20 hover:bg-amber-900/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => rotateCarousel('next')}
          className="p-3 bg-white/40 border border-white/60 hover:bg-white/60 hover:border-amber-300/50 hover:shadow-glass rounded-full text-amber-900/70 hover:text-amber-900 transition-all duration-300 active:scale-95"
          aria-label="Next Keepsakes Slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="absolute top-[-3.5rem] text-center pointer-events-none">
        <p className="font-calligraphy text-2xl text-amber-900/40 leading-none">
          Drag or click arrows to explore the memories
        </p>
      </div>
    </div>
  );
}
