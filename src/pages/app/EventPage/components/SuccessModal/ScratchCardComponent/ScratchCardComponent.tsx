import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

interface ScratchCardProps {
  width: number;
  height: number;
  coverImage: string;
  revealImage?: string;
  revealContent: string | React.ReactNode;
  brushSize?: number;
  revealThreshold?: number;
  isRevealed: boolean;
  setIsRevealed: Dispatch<SetStateAction<boolean>>;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  width,
  height,
  coverImage,
  revealContent,
  revealImage,
  brushSize = 20,
  revealThreshold = 50,
  isRevealed,
  setIsRevealed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  const startDrawing = (x: number, y: number) => {
    setIsDrawing(true);
    draw(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    if (percentage >= revealThreshold) {
      setIsRevealed(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    draw(x, y);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      {isRevealed ? (
        <>
          {revealImage && (
            <>
              <img
                src={revealImage}
                alt='Reveal Image'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width,
                  height,
                  borderRadius: '8px',
                }}
              />
            </>
          )}
          <div style={{ width, height }}>{revealContent}</div>
        </>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={stopDrawing}
            style={{
              zIndex: 1,
              position: 'relative',
              touchAction: 'none',
            }}
          />
          {revealImage && (
            <img
              src={revealImage}
              alt='Reveal Image'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width,
                height,
                zIndex: 0,
                borderRadius: '8px',
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ScratchCard;
