import React, { useRef, useEffect } from 'react';
import {
  Position,
  BrushOptions,
  CanvasOptions,
  resizeCanvas,
} from '../utils';
import c from './CursorCanvas.module.scss';

interface Props {
  canvasOptions: CanvasOptions;
  cursorPosition?: Position;
  brushOptions: BrushOptions;
}

export default function CursorCanvas(props: Props) {
  const { canvasOptions, cursorPosition, brushOptions } = props;

  const cursorCanvasRef = useRef<HTMLCanvasElement>();

  // draw cursor
  useEffect(() => {
    const cursorCanvas = cursorCanvasRef.current;
    const cursorCanvasContext = cursorCanvas.getContext('2d');

    cursorCanvasContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    if (cursorPosition) {
      const [x, y] = props.cursorPosition;

      cursorCanvasContext.fillStyle = 'red';

      cursorCanvasContext.fillRect(
        x - (brushOptions.size / 2),
        y - (brushOptions.size / 2),
        brushOptions.size,
        brushOptions.size,
      );
    }
  }, [
    cursorPosition,
    cursorCanvasRef,
    brushOptions.size,
  ]);

  // sync canvas dimensions
  useEffect(() => {
    resizeCanvas(cursorCanvasRef.current, canvasOptions.width, canvasOptions.height);
  }, [canvasOptions.width, canvasOptions.height]);

  return (
    <canvas
      ref={cursorCanvasRef}
      className={c.cursorCanvas}
    />
  );
}
