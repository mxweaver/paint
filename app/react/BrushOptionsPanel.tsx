import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { BrushOptions } from '../utils';

interface Props {
  value: BrushOptions;
  onChange(value: BrushOptions): void;
}

export default function BrushOptionsPanel(props: Props) {
  const { onChange, value } = props;
  const { size, color } = value;

  const handleBrushSizeChange = (event: React.FormEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      size: event.currentTarget.valueAsNumber,
    });
  };

  const handleBrushColorChange = (event: React.FormEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      color: event.currentTarget.value,
    });
  };

  return (
    <Card>
      <Card.Header>Brush</Card.Header>
      <ListGroup>
        <ListGroup.Item>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column xs={3} className="p-1">Size</Form.Label>
              <Col xs={4} className="p-1">
                <Form.Control
                  type="number"
                  min={1}
                  max={100}
                  value={size}
                  onChange={handleBrushSizeChange}
                />
              </Col>
              <Col xs={5} className="p-1">
                <Form.Control
                  type="range"
                  min={1}
                  max={100}
                  value={size}
                  onChange={handleBrushSizeChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </ListGroup.Item>
        <ListGroup.Item>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column xs={3} className="p-1">Color</Form.Label>
              <Col xs={5} className="p-1">
                <Form.Control
                  type="text"
                  value={color}
                  onChange={handleBrushColorChange}
                />
              </Col>
              <Col xs={4} className="p-1">
                <Form.Control
                  type="color"
                  value={color}
                  onChange={handleBrushColorChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}
