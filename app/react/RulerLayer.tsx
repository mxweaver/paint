import React, { useRef, useEffect } from 'react';
import {
  Position,
  CanvasOptions,
  resizeCanvas,
} from '../utils';
import c from './RulerLayer.module.scss';

interface Props {
  canvasOptions: CanvasOptions;
  cursorPosition?: Position;
}

export default function RulerLayer(props: Props) {
  const { canvasOptions, cursorPosition } = props;

  const canvasRef = useRef<HTMLCanvasElement>();

  // draw cursor
  useEffect(() => {
    const cursorCanvas = canvasRef.current;
    const cursorCanvasContext = cursorCanvas.getContext('2d');

    cursorCanvasContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    if (cursorPosition) {
      const [x, y] = props.cursorPosition;
      cursorCanvasContext.fillStyle = 'black';

      cursorCanvasContext.fillRect(x, 0, 1, cursorCanvas.height);
      cursorCanvasContext.fillRect(0, y, cursorCanvas.width, 1);
    }
  }, [
    cursorPosition,
    canvasRef,
  ]);

  // sync canvas dimensions
  useEffect(() => {
    resizeCanvas(
      canvasRef.current,
      canvasOptions.width,
      canvasOptions.height,
    );
  }, [canvasOptions.width, canvasOptions.height]);

  return (
    <canvas
      ref={canvasRef}
      className={c.canvas}
    />
  );
}
