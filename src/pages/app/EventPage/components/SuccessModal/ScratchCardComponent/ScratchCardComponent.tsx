import React, { useState, useRef, useEffect } from 'react';

interface ScratchCardProps {
  width: number;
  height: number;
  coverImage: string;
  revealContent: string | React.ReactNode;
  brushSize?: number;
  revealThreshold?: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  width,
  height,
  coverImage,
  revealContent,
  brushSize = 20,
  revealThreshold = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.src = coverImage;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, width, height);
    };
  }, [width, height, coverImage]);

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    calculateRevealPercentage();
  };

  const calculateRevealPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixelData = imageData.data;

    let transparentPixels = 0;
    for (let i = 3; i < pixelData.length; i += 4) {
      if (pixelData[i] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (width * height)) * 100;
    setRevealPercentage(Math.round(percentage));

    if (percentage >= revealThreshold) {
      setIsRevealed(true);
    }
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      {isRevealed ? (
        typeof revealContent === 'string' ? (
          <div
            style={{
              width,
              height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {revealContent}
          </div>
        ) : (
          revealContent
        )
      ) : (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleStartDrawing}
          onMouseMove={draw}
          onMouseUp={handleStopDrawing}
          onMouseLeave={handleStopDrawing}
        />
      )}
    </div>
  );
};

export default ScratchCard;
