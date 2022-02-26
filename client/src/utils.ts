import { Position } from "./models";

export const scaleClientToCanvasPosition = (
  [x, y]: Position,
  canvas: HTMLCanvasElement
): Position => {
  const bounds = canvas.getBoundingClientRect();
  const scale = canvas.width / bounds.width;
  return [(x - bounds.x) * scale, (y - bounds.y) * scale];
};
