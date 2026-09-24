import React, { useEffect, useMemo } from 'react';
import './CosmicParallaxBg.css';

/**
 * Deterministic PRNG (LCG) to generate stable star coordinates
 * across renders without invoking Math.random() inside render cycles.
 */
function createPrng(seed = 424242) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function generateStarBoxShadow(count, seed, maxW = 2560, maxH = 2000) {
  const prng = createPrng(seed);
  const shadows = [];
  const colors = ['#FFF', '#FFF', '#FFF', '#FFF', 'rgba(196, 181, 253, 0.9)', 'rgba(103, 232, 249, 0.9)'];

  for (let i = 0; i < count; i++) {
    const x = Math.floor(prng() * maxW);
    const y = Math.floor(prng() * maxH);
    const color = colors[Math.floor(prng() * colors.length)];
    shadows.push(`${x}px ${y}px ${color}`);
  }

  return shadows.join(', ');
}

/**
 * A cosmic parallax background component with animated star layers,
 * atmospheric horizon glow, and orbital earth curve.
 */
export default function CosmicParallaxBg({
  head = 'GHOST',
  text = 'GitHub, has, officially, seen, truth',
  loop = true,
  className = '',
  children,
  showHorizon = true,
  showTitle = false,
}) {
  const textParts = text ? text.split(',').map((part) => part.trim()) : [];

  const smallStars = useMemo(() => generateStarBoxShadow(650, 101), []);
  const mediumStars = useMemo(() => generateStarBoxShadow(180, 202), []);
  const bigStars = useMemo(() => generateStarBoxShadow(90, 303), []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--animation-iteration',
      loop ? 'infinite' : '1'
    );
  }, [loop]);

  return (
    <div className={`cosmic-parallax-container ${className}`}>
      {/* 3-Layer Parallax Stars */}
      <div
        id="stars"
        style={{ boxShadow: smallStars }}
        className="cosmic-stars"
      />
      <div
        id="stars2"
        style={{ boxShadow: mediumStars }}
        className="cosmic-stars-medium"
      />
      <div
        id="stars3"
        style={{ boxShadow: bigStars }}
        className="cosmic-stars-large"
      />

      {/* Horizon and Earth Curvature Glow */}
      {showHorizon && (
        <>
          <div id="horizon" className="cosmic-horizon">
            <div className="cosmic-glow glow" />
          </div>
          <div id="earth" className="cosmic-earth" />
        </>
      )}

      {/* Optional Standalone Title and Subtitle */}
      {showTitle && (
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          <div id="title" className="cosmic-title">{head.toUpperCase()}</div>
          <div id="subtitle" className="cosmic-subtitle">
            {textParts.map((part, index) => (
              <React.Fragment key={index}>
                <span className={`subtitle-part-${index + 1}`}>{part.toUpperCase()}</span>
                {index < textParts.length - 1 && ' '}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Foreground Content */}
      {children && (
        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          {children}
        </div>
      )}
    </div>
  );
}

export { CosmicParallaxBg };
