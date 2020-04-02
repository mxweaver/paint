import React, { useRef, useCallback, useState, useEffect } from 'react';

const PRIMARY_MOUSE_BUTTON = 1;

export default function App() {
  const brushSize = 10;

  const cursorCanvasRef = useRef<HTMLCanvasElement>();
  const viewCanvasRef = useRef<HTMLCanvasElement>();
  
  const [mouseDown, setMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState(null);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setMouseDown(event.buttons === PRIMARY_MOUSE_BUTTON);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setMousePosition([event.clientX, event.clientY]);
  }, []);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
  }, []);

  useEffect(() => {
    const cursorCanvas = cursorCanvasRef.current;
    const cursorCanvasContext = cursorCanvas.getContext('2d');
    
    cursorCanvasContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    if (mousePosition === null) {
      return;
    }

    const [x, y] = mousePosition;

    if (mouseDown) {
      const context = viewCanvasRef.current.getContext('2d');
      context.fillRect(
        x - (brushSize / 2),
        y - (brushSize / 2),
        brushSize,
        brushSize
      );
    } else {
      cursorCanvasContext.fillStyle = 'red';

      cursorCanvasContext.fillRect(
        x - (brushSize / 2),
        y - (brushSize / 2),
        brushSize,
        brushSize
      );
    }
  }, [
    cursorCanvasRef,
    viewCanvasRef,
    brushSize,
    mouseDown,
    mousePosition
  ]);

  return (
    <div style={{ position: 'relative', cursor: 'none', display: 'inline-block' }}>
      <canvas
        ref={cursorCanvasRef}
        style={{ position: 'fixed', pointerEvents: 'none'}}
        width={100}
        height={100}
      />
      <canvas
        ref={viewCanvasRef}
        width={100}
        height={100}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}