import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, BookOpen, Heart, Trash2 } from 'lucide-react';
import { Butterfly } from './ButterflyBackground';

export default function CardModal({ card, onClose, onDeleteCard }) {
  const [modalButterflies, setModalButterflies] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Periodically spawn floating butterflies inside the modal to make it feel alive!
  useEffect(() => {
    if (!card) return;

    // Spawn 4 immediate butterflies at different heights so it is pre-populated
    const initialFlutters = Array.from({ length: 4 }).map((_, i) => ({
      id: `init-${i}`,
      left: `${10 + Math.random() * 80}%`,
      bottom: `${10 + Math.random() * 60}%`,
      size: Math.random() * 14 + 18,
      color: ['pink', 'purple', 'cyan', 'rose', 'peach'][i % 5],
      duration: Math.random() * 8 + 6,
      drift: (Math.random() - 0.5) * 200,
    }));
    setModalButterflies(initialFlutters);

    const interval = setInterval(() => {
      setModalButterflies((prev) => {
        // Limit total active particles to avoid performance lag
        const filtered = prev.filter((b) => parseFloat(b.bottom) < 110);
        
        const newFlutter = {
          id: Math.random().toString(),
          left: `${15 + Math.random() * 70}%`,
          bottom: '-10%', // starts just below screen
          size: Math.random() * 12 + 16, // 16px to 28px
          color: ['pink', 'purple', 'cyan', 'rose', 'peach', 'amber'][Math.floor(Math.random() * 6)],
          duration: Math.random() * 7 + 7, // 7s to 14s
          drift: (Math.random() - 0.5) * 240, // random side drift
        };
        
        return [...filtered, newFlutter];
      });
    }, 1600);

    return () => clearInterval(interval);
  }, [card]);

  if (!card) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 overflow-hidden pointer-events-auto">
        
        {/* Fullscreen Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3a2f28]/45 backdrop-blur-md"
        />

        {/* Modal Sheet Panel */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-12 z-10"
        >
          
          {/* Internal Spawning Butterflies (Layered on top of content) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {modalButterflies.map((b) => (
              <motion.div
                key={b.id}
                className="absolute"
                style={{
                  left: b.left,
                  width: b.size,
                  height: b.size,
                }}
                initial={{ bottom: b.bottom, opacity: 0 }}
                animate={{
                  bottom: '110%',
                  opacity: [0, 0.75, 0.75, 0],
                  x: [0, b.drift / 2, b.drift],
                  rotate: [0, b.drift > 0 ? 30 : -30, 0],
                }}
                transition={{
                  duration: b.duration,
                  ease: "easeInOut",
                }}
              >
                <Butterfly color={b.color} size={b.size} />
              </motion.div>
            ))}
          </div>

          {/* Left Column: Majestic Card Image */}
          <div className="relative col-span-5 h-64 md:h-full min-h-[16rem] bg-amber-900/10">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
            />
            {/* Elegant vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Top Badge overlay */}
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans font-medium">
              <Heart size={10} className="fill-white" />
              <span>Chrysalis Dream</span>
            </div>
          </div>

          {/* Right Column: Calligraphy Chronicles */}
          <div className="col-span-7 relative p-6 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[85vh] bg-[#fffbf9]/60">
            
            {/* Close Trigger Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 text-amber-950/40 hover:text-amber-950 hover:bg-amber-950/5 rounded-full transition-all z-35"
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            {/* Prose Chronicle */}
            <div>
              {/* Card Meta details */}
              <div className="flex items-center gap-4 text-amber-900/40 text-[10px] uppercase tracking-wider font-sans font-light mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Present
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  Butterfly Chronicles
                </span>
              </div>

              {/* Card Heading */}
              <h3 className="font-calligraphy text-4xl sm:text-5xl text-amber-900/60 leading-none">
                Chrysalis
              </h3>
              <h2 className="font-cursive text-5xl sm:text-6xl text-amber-800 glow-text mt-1 leading-none">
                {card.title}
              </h2>

              <div className="w-16 h-[1px] bg-gradient-to-r from-amber-600/30 to-transparent my-6" />

              {/* The Calligraphy Paragraph (extremely beautiful, cursive, styled) */}
              <p className="font-calligraphy text-3xl sm:text-4xl text-amber-950/80 leading-relaxed text-left font-normal px-1 py-2 drop-shadow-sm indent-6">
                {card.description}
              </p>
            </div>

            {/* Poetic Footer */}
            <div className="mt-8 pt-6 border-t border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-900/40 text-[10px] font-sans tracking-widest font-light uppercase">
              <div className="flex items-center gap-4">
                <span>Shard No. {card.id}</span>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-rose-700/60 hover:text-rose-600 transition-colors font-sans text-[10px] font-semibold tracking-wider uppercase bg-rose-500/5 hover:bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/10"
                >
                  <Trash2 size={11} />
                  Release Shard
                </button>
              </div>
              <span className="flex items-center gap-1 animate-pulse text-rose-500/70">
                🦋 Magical Gallery
              </span>
            </div>

            {/* Deletion Confirmation Overlay */}
            <AnimatePresence>
              {showConfirmDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#fffcfb]/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 10 }}
                    className="max-w-xs flex flex-col items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-rose-100/80 border border-rose-200/50 rounded-full flex items-center justify-center text-rose-600 animate-pulse">
                      <Heart size={20} className="fill-rose-100" />
                    </div>
                    <h3 className="font-cursive text-3xl text-rose-800 leading-tight">
                      Release this Dream?
                    </h3>
                    <p className="font-sans text-xs text-amber-900/60 leading-relaxed font-light normal-case">
                      Are you sure you want to release <strong className="text-amber-900 font-medium">"{card.title}"</strong> back to the meadow? Its prose will fade from your keepsakes forever.
                    </p>
                    <div className="flex flex-col w-full gap-2 mt-2">
                      <button
                        onClick={() => {
                          onDeleteCard(card.id);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-amber-700 text-white font-sans font-semibold text-xs tracking-widest uppercase rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                      >
                        Yes, Release Shard
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(false)}
                        className="w-full py-2.5 bg-amber-900/5 border border-amber-900/10 text-amber-900/60 font-sans font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-amber-900/10 transition-all active:scale-95"
                      >
                        Keep Shard
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
