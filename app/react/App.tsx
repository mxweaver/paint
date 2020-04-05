import React, {
  useRef,
  useState,
  useEffect,
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import BrushOptionsPanel from './BrushOptionsPanel';
import CanvasOptionsPanel from './CanvasOptionsPanel';
import CursorOptions from './CursorOptions';
import CursorCanvas from './CursorCanvas';
import { getLockedCursorPosition, resizeCanvas } from '../utils';
import c from './App.module.scss';

const PRIMARY_MOUSE_BUTTON = 1;

enum Key {
  Space = ' ',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  s = 's',
}

enum Tool {
  Brush = 'brush',
}

export default function App() {
  const [canvasOptions, setCanvasOptions] = useState({
    width: 600,
    height: 600,
  });
  const [brushOptions, setBrushOptions] = useState({
    size: 5,
    color: '#000000',
  });

  const viewCanvasRef = useRef<HTMLCanvasElement>();

  const [drawing, setDrawing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number[] | null>(null);
  const [initialCursorPosition, setInitialCursorPosition] = useState<number[] | null>(null);
  const [tool, setTool] = useState(Tool.Brush);
  const [shift, setShift] = useState(false);

  const modifiedCursorPosition = shift
    ? getLockedCursorPosition(cursorPosition, initialCursorPosition)
    : cursorPosition;

  const handleSave = () => {
    window.location.href = viewCanvasRef
      .current
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    setShift(event.shiftKey);

    let delta: number[] | null = null;

    switch (event.key) {
      case Key.Space:
        event.preventDefault();
        setDrawing(true);
        break;
      case Key.ArrowLeft:
        event.preventDefault();
        delta = [-1, 0];
        break;
      case Key.ArrowUp:
        event.preventDefault();
        delta = [0, -1];
        break;
      case Key.ArrowRight:
        event.preventDefault();
        delta = [1, 0];
        break;
      case Key.ArrowDown:
        event.preventDefault();
        delta = [0, 1];
        break;
      case Key.s:
        if (event.metaKey) {
          event.preventDefault();
          handleSave();
        }
        break;
      default:
        // do nothing
        break;
    }

    if (delta !== null) {
      setCursorPosition((cursorPosition) => {
        if (cursorPosition !== null) {
          return [
            cursorPosition[0] + delta[0],
            cursorPosition[1] + delta[1],
          ];
        }
        return null;
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyUp = (event: KeyboardEvent) => {
    setShift(event.shiftKey);

    switch (event.key) {
      case Key.Space:
        event.preventDefault();
        setDrawing(false);
        break;
      default:
        // do nothing
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(event.buttons === PRIMARY_MOUSE_BUTTON);

    const rect = event.currentTarget.getBoundingClientRect();
    setInitialCursorPosition([
      event.clientX - rect.left,
      event.clientY - rect.top,
    ]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setCursorPosition([
      Math.floor(event.clientX - rect.left),
      Math.floor(event.clientY - rect.top),
    ]);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setInitialCursorPosition(null);
  };

  const handleMouseLeave = () => {
    setCursorPosition(null);
    setInitialCursorPosition(null);
  };

  // alter canvas
  useEffect(() => {
    if (modifiedCursorPosition && drawing) {
      const [x, y] = modifiedCursorPosition;
      const context = viewCanvasRef.current.getContext('2d');

      if (tool === Tool.Brush) {
        context.fillRect(
          x - (brushOptions.size / 2),
          y - (brushOptions.size / 2),
          brushOptions.size,
          brushOptions.size,
        );
      }
    }
  }, [
    viewCanvasRef,
    brushOptions.size,
    drawing,
    modifiedCursorPosition,
  ]);

  // sync brush color
  useEffect(() => {
    viewCanvasRef.current.getContext('2d').fillStyle = brushOptions.color;
  }, [brushOptions.color]);

  // sync canvas dimensions
  useEffect(() => {
    resizeCanvas(viewCanvasRef.current, canvasOptions.width, canvasOptions.height);
  }, [canvasOptions.width, canvasOptions.height]);

  const handleReset = () => {
    const viewCanvas = viewCanvasRef.current;
    const context = viewCanvas.getContext('2d');
    context.clearRect(0, 0, viewCanvas.width, viewCanvas.height);
  };

  return (
    <Container>
      <Row>
        <Col>
          <ButtonToolbar>
            <ButtonGroup className="mr-2">
              <Button
                active={tool === Tool.Brush}
                onClick={() => setTool(Tool.Brush)}
              >
                <FontAwesomeIcon icon={faPaintBrush} />
              </Button>
              <Button
                onClick={handleReset}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
              <Button
                onClick={handleSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <div className={c.container}>
            <div className={c.inner}>
              <CursorCanvas
                canvasOptions={canvasOptions}
                cursorPosition={cursorPosition}
                brushOptions={brushOptions}
              />
              <canvas
                ref={viewCanvasRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
              />
            </div>
          </div>
        </Col>
        <Col xs={3}>
          <BrushOptionsPanel value={brushOptions} onChange={setBrushOptions} />
          <CursorOptions position={cursorPosition} />
          <CanvasOptionsPanel value={canvasOptions} onChange={setCanvasOptions} />
        </Col>
      </Row>
    </Container>
  );
}
