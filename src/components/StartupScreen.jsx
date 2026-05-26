import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Butterfly } from './ButterflyBackground';

export default function StartupScreen({ onComplete }) {
  const [isScattered, setIsScattered] = useState(false);
  const [butterflies, setButterflies] = useState([]);

  useEffect(() => {
    // Definining relative offsets (in rem) from the center for the "11"
    const leftOne = [
      // Main stem
      { dx: -3.5, dy: -8, size: 26, color: 'pink' },
      { dx: -3.5, dy: -6, size: 24, color: 'rose' },
      { dx: -3.5, dy: -4, size: 22, color: 'purple' },
      { dx: -3.5, dy: -2, size: 24, color: 'cyan' },
      { dx: -3.5, dy: 0, size: 26, color: 'amber' },
      { dx: -3.5, dy: 2, size: 24, color: 'peach' },
      { dx: -3.5, dy: 4, size: 22, color: 'pink' },
      { dx: -3.5, dy: 6, size: 24, color: 'rose' },
      { dx: -3.5, dy: 8, size: 28, color: 'purple' },
      // Hook
      { dx: -4.8, dy: -7, size: 22, color: 'peach' },
      { dx: -5.8, dy: -6.2, size: 20, color: 'amber' },
      // Base
      { dx: -5.2, dy: 8, size: 24, color: 'cyan' },
      { dx: -1.8, dy: 8, size: 24, color: 'rose' },
    ];

    const rightOne = [
      // Main stem
      { dx: 3.5, dy: -8, size: 26, color: 'purple' },
      { dx: 3.5, dy: -6, size: 24, color: 'pink' },
      { dx: 3.5, dy: -4, size: 22, color: 'cyan' },
      { dx: 3.5, dy: -2, size: 24, color: 'amber' },
      { dx: 3.5, dy: 0, size: 26, color: 'peach' },
      { dx: 3.5, dy: 2, size: 24, color: 'rose' },
      { dx: 3.5, dy: 4, size: 22, color: 'purple' },
      { dx: 3.5, dy: 6, size: 24, color: 'pink' },
      { dx: 3.5, dy: 8, size: 28, color: 'cyan' },
      // Hook
      { dx: 2.2, dy: -7, size: 22, color: 'rose' },
      { dx: 1.2, dy: -6.2, size: 20, color: 'peach' },
      // Base
      { dx: 1.8, dy: 8, size: 24, color: 'amber' },
      { dx: 5.2, dy: 8, size: 24, color: 'purple' },
    ];

    const allPositions = [...leftOne, ...rightOne].map((b, idx) => {
      // Pre-calculate scattering directions so they are locked in
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 800 + 400; // Scatter distance in pixels
      const scatterX = Math.cos(angle) * distance;
      const scatterY = Math.sin(angle) * distance;
      const scatterZ = Math.random() * 600 - 300;
      const scatterRot = Math.random() * 720 - 360;

      return {
        id: idx,
        dx: b.dx,
        dy: b.dy,
        size: b.size,
        color: b.color,
        scatterX,
        scatterY,
        scatterZ,
        scatterRot,
        delay: Math.random() * 0.2, // elegant sequential explosion
      };
    });

    setButterflies(allPositions);
  }, []);

  const handleStart = () => {
    setIsScattered(true);
    // Smooth cinematic wait before changing screen state
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#fff3ed] via-[#fffbf9] to-[#ffece2] overflow-hidden z-50">
      {/* Soft Background Radial Glow */}
      <div className="absolute w-[40rem] h-[40rem] rounded-full bg-orange-100/30 blur-[120px] pointer-events-none" />

      {/* Soft Background Sketch Watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isScattered ? 0 : 0.12, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[90%] max-w-4xl aspect-[1.78] pointer-events-none select-none z-0 mix-blend-multiply"
        style={{
          backgroundImage: 'url("/keepsake_sketch.jpg")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'contrast(1.05) sepia(0.25)',
        }}
      />


      {/* Title Calligraphy Text */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: isScattered ? 0 : 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center mb-16 z-20"
      >
        <h2 className="font-calligraphy text-4xl sm:text-5xl text-amber-900/60 leading-none">
          Aurelia's
        </h2>
        <h1 className="font-cursive text-5xl sm:text-6xl text-amber-800 glow-text tracking-wide mt-2">
          Keepsakes
        </h1>
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-amber-900/40 mt-4">
          Memories and Gifts
        </p>

      </motion.div>

      {/* Center "11" Butterfly Formation Canvas */}
      <div className="relative w-80 h-96 flex items-center justify-center z-10 select-none">
        {butterflies.map((b) => (
          <motion.div
            key={b.id}
            className="absolute"
            style={{
              left: `calc(50% + ${b.dx}rem)`,
              top: `calc(50% + ${b.dy}rem)`,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isScattered
                ? {
                    x: b.scatterX,
                    y: b.scatterY,
                    z: b.scatterZ,
                    rotate: b.scatterRot,
                    scale: 0.1,
                    opacity: 0,
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    y: [0, -3, 0], // subtle breathing flutter
                  }
            }
            transition={
              isScattered
                ? {
                    duration: 1.4,
                    ease: [0.1, 0.8, 0.2, 1],
                    delay: b.delay,
                  }
                : {
                    opacity: { duration: 1, delay: b.id * 0.03 },
                    scale: { duration: 0.8, delay: b.id * 0.03, type: "spring" },
                    y: {
                      duration: 2 + Math.sin(b.id) * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          >
            {/* The individual flapping butterfly */}
            <Butterfly color={b.color} size={b.size} />
          </motion.div>
        ))}
      </div>

      {/* "Click Me!" Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isScattered ? 0 : 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
        className="mt-16 z-20"
      >
        <button
          onClick={handleStart}
          className="group relative px-10 py-4 bg-white/40 backdrop-blur-md border border-white/60 text-amber-900 rounded-full shadow-glass hover:shadow-glass-glow hover:border-amber-200 transition-all duration-500 font-sans tracking-[0.15em] text-sm overflow-hidden"
        >
          {/* Subtle button hovering backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-rose-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <span className="relative flex items-center gap-2">
            CLICK ME!
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              🦋
            </motion.span>
          </span>
        </button>
      </motion.div>

      {/* Floating particles specific to startup screen */}
      <AnimatePresence>
        {!isScattered && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/60"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${30 + Math.random() * 50}%`,
                }}
                animate={{
                  y: [0, -60],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
