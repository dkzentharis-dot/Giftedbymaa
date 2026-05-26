import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GlowingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate an array of 40 particles with randomized properties
    const initialParticles = Array.from({ length: 40 }).map((_, i) => {
      const size = Math.random() * 6 + 4; // Particle diameter in px
      return {
        id: i,
        size,
        startX: Math.random() * 100, // starting horizontal percent
        startY: Math.random() * 100, // starting vertical percent
        duration: Math.random() * 25 + 15, // float duration in seconds
        delay: Math.random() * -25, // negative delay so they start in-motion
        opacity: Math.random() * 0.4 + 0.1, // peak opacity
        drift: (Math.random() - 0.5) * 80, // horizontal drift amount
      };
    });
    setParticles(initialParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-200/50 mix-blend-screen"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            boxShadow: `0 0 ${p.size * 2}px ${p.size / 2}px rgba(253, 186, 116, 0.5)`,
          }}
          animate={{
            y: [0, -800],
            x: [0, p.drift, 0],
            scale: [1, 1.5, 1],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
