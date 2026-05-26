import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Reusable animated SVG Butterfly component
export function Butterfly({ color = 'pink', size = 40, className = '', isFlapping = true }) {
  const gradients = {
    pink: { from: '#ff9ebb', to: '#ff5c8a', glow: 'rgba(255, 92, 138, 0.4)' },
    amber: { from: '#fef08a', to: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' },
    purple: { from: '#e9d5ff', to: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
    cyan: { from: '#a5f3fc', to: '#0891b2', glow: 'rgba(8, 145, 178, 0.4)' },
    peach: { from: '#ffedd5', to: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
    rose: { from: '#fecdd3', to: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' }
  };

  const selectedGrad = gradients[color] || gradients.pink;

  return (
    <svg
      viewBox="0 0 100 100"
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 0 6px ${selectedGrad.glow})`,
      }}
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={`left-g-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={selectedGrad.from} />
          <stop offset="100%" stopColor={selectedGrad.to} />
        </linearGradient>
        <linearGradient id={`right-g-${color}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={selectedGrad.from} />
          <stop offset="100%" stopColor={selectedGrad.to} />
        </linearGradient>
      </defs>
      
      {/* Left Wing with flapper animation */}
      <path
        d="M50,50 C20,15 5,45 15,65 C25,85 45,72 50,55 Z"
        fill={`url(#left-g-${color})`}
        className={isFlapping ? "left-wing" : ""}
      />
      
      {/* Right Wing with flapper animation */}
      <path
        d="M50,50 C80,15 95,45 85,65 C75,85 55,72 50,55 Z"
        fill={`url(#right-g-${color})`}
        className={isFlapping ? "right-wing" : ""}
      />
      
      {/* Butterfly Body */}
      <path d="M49,38 Q50,35 51,38 L51,68 Q50,70 49,68 Z" fill="#3a2512" />
      <circle cx="50" cy="35" r="1.5" fill="#3a2512" />
      
      {/* Antennas */}
      <path d="M49,35 Q44,25 38,28" fill="none" stroke="#3a2512" strokeWidth="0.8" />
      <path d="M51,35 Q56,25 62,28" fill="none" stroke="#3a2512" strokeWidth="0.8" />
    </svg>
  );
}

export default function ButterflyBackground() {
  const [ambientButterflies, setAmbientButterflies] = useState([]);

  useEffect(() => {
    const colors = ['pink', 'amber', 'purple', 'cyan', 'peach', 'rose'];
    // Generate 6 butterflies flying along distinct paths
    const items = Array.from({ length: 6 }).map((_, i) => {
      const size = Math.random() * 20 + 24; // 24px to 44px
      const color = colors[i % colors.length];
      const duration = Math.random() * 15 + 20; // 20s to 35s
      const delay = Math.random() * -15; // negative delay so they are already on screen

      // Set up random flight path coordinates (in viewport percentages)
      const isReverse = i % 2 === 0;
      const xCoords = isReverse 
        ? ['110vw', '75vw', '45vw', '15vw', '-10vw']
        : ['-10vw', '25vw', '55vw', '85vw', '110vw'];
      
      const yCoords = [
        `${Math.random() * 60 + 10}vh`,
        `${Math.random() * 60 + 10}vh`,
        `${Math.random() * 60 + 10}vh`,
        `${Math.random() * 60 + 10}vh`,
        `${Math.random() * 60 + 10}vh`
      ];

      const rotateCoords = isReverse
        ? [-90, -120, -70, -100, -90]
        : [90, 60, 110, 80, 90];

      return {
        id: i,
        color,
        size,
        duration,
        delay,
        xCoords,
        yCoords,
        rotateCoords
      };
    });
    setAmbientButterflies(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {ambientButterflies.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ width: b.size, height: b.size }}
          animate={{
            x: b.xCoords,
            y: b.yCoords,
            rotate: b.rotateCoords,
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        >
          <Butterfly color={b.color} size={b.size} />
        </motion.div>
      ))}
    </div>
  );
}
