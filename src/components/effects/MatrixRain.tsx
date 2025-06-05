import React, { useEffect, useRef } from 'react';

interface MatrixColumn {
  x: number;
  chars: string[];
  speed: number;
  y: number[];
}

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Character set
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns: MatrixColumn[] = [];
    const columnCount = Math.floor(canvas.width / 20);

    // Initialize columns
    for (let i = 0; i < columnCount; i++) {
      const column: MatrixColumn = {
        x: i * 20,
        chars: [],
        speed: 1 + Math.random() * 3,
        y: [],
      };
      
      const columnLength = 5 + Math.floor(Math.random() * 15);
      for (let j = 0; j < columnLength; j++) {
        column.chars.push(chars[Math.floor(Math.random() * chars.length)]);
        column.y.push(-100 - Math.random() * 10000); // Start above the screen at different positions
      }
      
      columns.push(column);
    }

    // Animation loop
    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      columns.forEach(column => {
        for (let i = 0; i < column.chars.length; i++) {
          // Randomize character occasionally
          if (Math.random() < 0.02) {
            column.chars[i] = chars[Math.floor(Math.random() * chars.length)];
          }

          // Different brightness for different positions
          const alpha = i === 0 ? 1 : (1 - i / column.chars.length) * 0.8;
          
          // First character is brightest (white with glow)
          if (i === 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#39FF14';
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`;
            ctx.shadowBlur = 0;
          }

          // Draw the character
          ctx.font = '14px "Space Mono", monospace';
          ctx.fillText(
            column.chars[i], 
            column.x, 
            column.y[i]
          );

          // Move the character down
          column.y[i] += column.speed;

          // Reset when it goes off screen
          if (column.y[i] > canvas.height) {
            column.y[i] = -20 - Math.random() * 100;
            column.chars[i] = chars[Math.floor(Math.random() * chars.length)];
          }
        }
      });

      requestAnimationFrame(draw);
    };

    const animation = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-15"
    />
  );
};

export default MatrixRain;