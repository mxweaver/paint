import React, {
  useRef, useCallback, useState, useEffect,
} from 'react';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import c from './App.module.scss';

const PRIMARY_MOUSE_BUTTON = 1;

enum Tool {
  Brush = 'brush',
}

export default function App() {
  const brushSize = 5;
  const canvasSize = 100;

  const cursorCanvasRef = useRef<HTMLCanvasElement>();
  const viewCanvasRef = useRef<HTMLCanvasElement>();

  const [mouseDown, setMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState(null);
  const [initialMousePosition, setInitialMousePosition] = useState(null);
  const [tool, setTool] = useState(Tool.Brush);
  const [shift, setShift] = useState(false);

  const handleKeyChange = useCallback((event: KeyboardEvent) => {
    setShift(event.shiftKey);
  }, [setShift]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyChange);
    return () => document.removeEventListener('keydown', handleKeyChange);
  }, [handleKeyChange]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyChange);
    return () => document.removeEventListener('keyup', handleKeyChange);
  }, [handleKeyChange]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setMouseDown(event.buttons === PRIMARY_MOUSE_BUTTON);

    const rect = event.currentTarget.getBoundingClientRect();
    setInitialMousePosition([
      event.clientX - rect.left,
      event.clientY - rect.top,
    ]);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setMousePosition([
      event.clientX - rect.left,
      event.clientY - rect.top,
    ]);
  }, []);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);
    setInitialMousePosition(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
    setInitialMousePosition(null);
  }, []);

  function getCursorPosition(): number[] | null {
    if (mousePosition === null) {
      return null;
    }

    if (initialMousePosition !== null && shift) {
      const [x, y] = mousePosition;
      const [iX, iY] = initialMousePosition;

      const dX = Math.abs(iX - x);
      const dY = Math.abs(iY - y);

      if (dX < dY) {
        return [iX, y];
      }
      return [x, iY];
    }

    return mousePosition;
  }

  // draw cursor
  useEffect(() => {
    const cursorPosition = getCursorPosition();
    if (!cursorPosition) {
      return;
    }

    const [x, y] = cursorPosition;
    const cursorCanvas = cursorCanvasRef.current;
    const cursorCanvasContext = cursorCanvas.getContext('2d');

    cursorCanvasContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    cursorCanvasContext.fillStyle = 'red';

    cursorCanvasContext.fillRect(
      x - (brushSize / 2),
      y - (brushSize / 2),
      brushSize,
      brushSize,
    );
  }, [
    mousePosition,
    initialMousePosition,
    cursorCanvasRef,
    brushSize,
  ]);

  // alter canvas
  useEffect(() => {
    const cursorPosition = getCursorPosition();
    if (!cursorPosition) {
      return;
    }

    const [x, y] = cursorPosition;

    if (mouseDown) {
      const context = viewCanvasRef.current.getContext('2d');

      if (tool === Tool.Brush) {
        context.fillRect(
          x - (brushSize / 2),
          y - (brushSize / 2),
          brushSize,
          brushSize,
        );
      }
    }
  }, [
    viewCanvasRef,
    brushSize,
    mouseDown,
    mousePosition,
    initialMousePosition,
  ]);

  return (
    <>
      <ButtonToolbar>
        <ButtonGroup className="mr-2">
          <Button
            active={tool === Tool.Brush}
            onClick={() => setTool(Tool.Brush)}
          >
            <FontAwesomeIcon icon={faPaintBrush} />
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      <div className={c.container}>
        <canvas
          ref={cursorCanvasRef}
          className={c.cursorCanvas}
          width={canvasSize}
          height={canvasSize}
        />
        <canvas
          ref={viewCanvasRef}
          width={canvasSize}
          height={canvasSize}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </>
  );
}
