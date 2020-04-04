import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

interface Props {
  position?: number[];
}

export default function CursorOptions(props: Props) {
  const { position } = props;

  return (
    <Card className="mt-2">
      <Card.Header>Cursor</Card.Header>
      <ListGroup>
        <ListGroup.Item>
          X:
          {' '}
          {position ? position[0] : ''}
        </ListGroup.Item>
        <ListGroup.Item>
          Y:
          {' '}
          {position ? position[1] : ''}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}
