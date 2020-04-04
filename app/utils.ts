export type Position = number[];

export interface BrushOptions {
  size: number;
  color: string;
}

export interface CanvasOptions {
  width: number;
  height: number;
}

export function getLockedCursorPosition(
  currentPosition?: Position,
  initialPosition?: Position,
): Position | undefined {
  if (currentPosition === null) {
    return null;
  }

  if (currentPosition !== null) {
    const [x, y] = currentPosition;
    const [iX, iY] = initialPosition;

    const dX = Math.abs(iX - x);
    const dY = Math.abs(iY - y);

    if (dX < dY) {
      return [iX, y];
    }
    return [x, iY];
  }

  return currentPosition;
}
