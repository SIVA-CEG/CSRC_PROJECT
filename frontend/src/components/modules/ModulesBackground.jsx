import React, { useEffect, useRef } from 'react';

const ModulesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(0, 180, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawGlowOrbs = (time) => {
      const orbs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25, r: 300, color: '0, 180, 255', opacity: 0.06 },
        { x: canvas.width * 0.85, y: canvas.height * 0.6,  r: 250, color: '120, 80, 255', opacity: 0.05 },
        { x: canvas.width * 0.5,  y: canvas.height * 0.85, r: 200, color: '0, 220, 180', opacity: 0.04 },
      ];
      orbs.forEach((orb, i) => {
        const pulse = Math.sin(time * 0.001 + i * 2) * 0.02;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `rgba(${orb.color}, ${orb.opacity + pulse})`);
        grad.addColorStop(1, `rgba(${orb.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = (time = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark base
      ctx.fillStyle = 'rgb(8, 12, 26)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();
      drawGlowOrbs(time);

      // Particles
      particles.forEach(p => {
        p.pulse += 0.02;
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const opacity = p.opacity + Math.sin(p.pulse) * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 255, ${opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => { resize(); createParticles(); });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ModulesBackground;