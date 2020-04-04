import React, {
  useRef, useCallback, useState, useEffect,
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import BrushOptions from './BrushOptions';
import CanvasOptions from './CanvasOptions';
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

  const cursorCanvasRef = useRef<HTMLCanvasElement>();
  const viewCanvasRef = useRef<HTMLCanvasElement>();

  const [drawing, setDrawing] = useState(false);
  const [mousePosition, setMousePosition] = useState(null);
  const [initialMousePosition, setInitialMousePosition] = useState(null);
  const [tool, setTool] = useState(Tool.Brush);
  const [shift, setShift] = useState(false);

  const handleSave = useCallback(() => {
    window.location.href = viewCanvasRef
      .current
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
  }, [viewCanvasRef]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setShift(event.shiftKey);

    let delta = null;

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

    if (delta !== null && mousePosition) {
      setMousePosition([mousePosition[0] + delta[0], mousePosition[1] + delta[1]]);
    }
  }, [
    setShift,
    mousePosition,
    setDrawing,
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
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
  }, [
    setShift,
    setDrawing,
  ]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [handleKeyUp]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(event.buttons === PRIMARY_MOUSE_BUTTON);

    const rect = event.currentTarget.getBoundingClientRect();
    setInitialMousePosition([
      event.clientX - rect.left,
      event.clientY - rect.top,
    ]);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setMousePosition([
      Math.floor(event.clientX - rect.left),
      Math.floor(event.clientY - rect.top),
    ]);
  }, []);

  const handleMouseUp = useCallback(() => {
    setDrawing(false);
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
    const cursorCanvas = cursorCanvasRef.current;
    const cursorCanvasContext = cursorCanvas.getContext('2d');

    cursorCanvasContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    const cursorPosition = getCursorPosition();
    if (!cursorPosition) {
      return;
    }

    const [x, y] = cursorPosition;

    cursorCanvasContext.fillStyle = 'red';

    cursorCanvasContext.fillRect(
      x - (brushOptions.size / 2),
      y - (brushOptions.size / 2),
      brushOptions.size,
      brushOptions.size,
    );
  }, [
    mousePosition,
    initialMousePosition,
    cursorCanvasRef,
    brushOptions.size,
  ]);

  // alter canvas
  useEffect(() => {
    const cursorPosition = getCursorPosition();
    if (!cursorPosition) {
      return;
    }

    const [x, y] = cursorPosition;

    if (drawing) {
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
    mousePosition,
    initialMousePosition,
  ]);

  // sync brush color
  useEffect(() => {
    viewCanvasRef.current.getContext('2d').fillStyle = brushOptions.color;
  }, [brushOptions.color]);

  const handleReset = useCallback(() => {
    const viewCanvas = viewCanvasRef.current;
    const context = viewCanvas.getContext('2d');
    context.clearRect(0, 0, viewCanvas.width, viewCanvas.height);
  }, [viewCanvasRef]);

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
              <canvas
                ref={cursorCanvasRef}
                className={c.cursorCanvas}
                width={canvasOptions.width}
                height={canvasOptions.height}
              />
              <canvas
                ref={viewCanvasRef}
                width={canvasOptions.width}
                height={canvasOptions.height}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          </div>
        </Col>
        <Col xs={3}>
          <BrushOptions value={brushOptions} onChange={setBrushOptions} />
          <Card className="mt-2">
            <Card.Header>Cursor</Card.Header>
            <ListGroup>
              <ListGroup.Item>
                X:
                {' '}
                {mousePosition ? mousePosition[0] : ''}
              </ListGroup.Item>
              <ListGroup.Item>
                Y:
                {' '}
                {mousePosition ? mousePosition[1] : ''}
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <CanvasOptions value={canvasOptions} onChange={setCanvasOptions} />
        </Col>
      </Row>
    </Container>
  );
}
