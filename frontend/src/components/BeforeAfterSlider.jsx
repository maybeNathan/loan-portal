import React, { useState, useRef, useCallback, useEffect } from 'react';

const BeforeAfterSlider = ({ beforeSrc, afterSrc }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const targetRef = useRef(50);
  const animFrameRef = useRef(null);
  const isHoveringRef = useRef(false);
  const autoAnimRef = useRef(null);

  const scheduleUpdate = useCallback((pct) => {
    targetRef.current = pct;
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(function tick() {
        setPosition((prev) => {
          const next = prev + (targetRef.current - prev) * 0.07;
          if (Math.abs(targetRef.current - next) < 0.15) {
            animFrameRef.current = null;
            return targetRef.current;
          }
          animFrameRef.current = requestAnimationFrame(tick);
          return next;
        });
      });
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    isHoveringRef.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    scheduleUpdate(pct);
  }, [scheduleUpdate]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    scheduleUpdate(50);
  }, [scheduleUpdate]);

  // Gentle auto-oscillation for mobile (no hover available)
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) return;

    let startTime;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      if (isHoveringRef.current) {
        autoAnimRef.current = requestAnimationFrame(animate);
        return;
      }
      const elapsed = (ts - startTime) / 1000;
      // Slow sine wave: 50 +/- 30, period ~6s
      const val = 50 + 25 * Math.sin(elapsed * Math.PI / 3);
      targetRef.current = val;
      setPosition((prev) => prev + (val - prev) * 0.04);
      autoAnimRef.current = requestAnimationFrame(animate);
    };
    autoAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (autoAnimRef.current) cancelAnimationFrame(autoAnimRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-slider"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3 / 2',
        maxHeight: '600px',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* After (full background) */}
      <img
        src={afterSrc}
        alt="After renovation"
        draggable={false}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%', objectFit: 'cover',
        }}
      />

      {/* Before (clipped) */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        clipPath: `inset(0 ${100 - position}% 0 0)`,
      }}>
        <img
          src={beforeSrc}
          alt="Before renovation"
          draggable={false}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
          }}
        />
      </div>

      {/* Divider line */}
      <div style={{
        position: 'absolute', top: 0,
        left: `${position}%`,
        transform: 'translateX(-50%)',
        width: '2px', height: '100%',
        backgroundColor: 'rgba(255,255,255,0.6)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default BeforeAfterSlider;
