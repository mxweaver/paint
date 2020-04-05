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

export function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const context = canvas.getContext('2d');
  const tempCanvas = document.createElement('canvas');
  const tempContext = tempCanvas.getContext('2d');

  tempCanvas.width = width;
  tempCanvas.height = height;
  tempContext.fillStyle = 'transparent';
  tempContext.fillRect(0, 0, width, height);
  tempContext.drawImage(canvas, 0, 0);

  canvas.width = width;
  canvas.height = height;
  context.drawImage(tempCanvas, 0, 0);
}
