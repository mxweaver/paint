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
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faTrash } from '@fortawesome/free-solid-svg-icons';
import c from './App.module.scss';

const PRIMARY_MOUSE_BUTTON = 1;

enum Tool {
  Brush = 'brush',
}

export default function App() {
  const [brushSize, setBrushSize] = useState(5);
  const canvasSize = 600;

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

  const handleBrushSizeChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    setBrushSize(event.currentTarget.valueAsNumber);
  }, [setBrushSize]);

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
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={c.container}>
            <div className={c.inner}>
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
          </div>
        </Col>
        <Col xs={3}>
          <Card>
            <Card.Header>Brush</Card.Header>
            <ListGroup>
              <ListGroup.Item>
                <Form>
                  <Form.Group controlId="formBasicRange" as={Row}>
                    <Form.Label column xs={3} className="p-1">Size</Form.Label>
                    <Col xs={4} className="p-1">
                      <Form.Control
                        type="number"
                        min={1}
                        max={100}
                        value={brushSize}
                        onChange={handleBrushSizeChange}
                      />
                    </Col>
                    <Col xs={5} className="p-1">
                      <Form.Control
                        type="range"
                        min={1}
                        max={100}
                        value={brushSize}
                        onChange={handleBrushSizeChange}
                      />
                    </Col>
                  </Form.Group>
                </Form>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
