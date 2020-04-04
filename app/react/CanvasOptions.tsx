import React, { useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

interface Value {
  width: number;
  height: number;
}

interface Props {
  onChange(value: Value): void;
  value: Value;
}

export default function CanvasOptions(props: Props) {
  const { onChange, value } = props;
  const { width, height } = value;

  const handleWidthChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      width: event.currentTarget.valueAsNumber,
    });
  }, [onChange, value]);

  const handleHeightChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      height: event.currentTarget.valueAsNumber,
    });
  }, [onChange, value]);

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
