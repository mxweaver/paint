import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { CanvasOptions } from '../utils';

interface Props {
  onChange(value: CanvasOptions): void;
  value: CanvasOptions;
}

export default function CanvasOptionsPanel(props: Props) {
  const { onChange, value } = props;
  const { width, height } = value;

  const handleWidthChange = (event: React.FormEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      width: event.currentTarget.valueAsNumber,
    });
  };

  const handleHeightChange = (event: React.FormEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      height: event.currentTarget.valueAsNumber,
    });
  };

  return (
    <Card className="mt-2">
      <Card.Header>Canvas</Card.Header>
      <ListGroup>
        <ListGroup.Item>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column xs={3} className="p-1">Width</Form.Label>
              <Col xs={9} className="p-1">
                <Form.Control
                  type="number"
                  value={width}
                  onChange={handleWidthChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </ListGroup.Item>
        <ListGroup.Item>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column xs={3} className="p-1">Height</Form.Label>
              <Col xs={9} className="p-1">
                <Form.Control
                  type="number"
                  value={height}
                  onChange={handleHeightChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}
