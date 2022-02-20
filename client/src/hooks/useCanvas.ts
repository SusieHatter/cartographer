import { useCallback, useState } from "react";

type UseCanvas = {
  canvas: HTMLCanvasElement | undefined;
  ctx: CanvasRenderingContext2D | undefined | null;
  ref: (canvas: HTMLCanvasElement) => void;
};

const useCanvas = (width: number, height: number): UseCanvas => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const ref = useCallback(
    (canvas) => {
      if (!canvas) {
        return;
      }
      canvas.width = width;
      canvas.height = height;
      setCanvas(canvas);
    },
    [width, height]
  );
  return { canvas, ctx: canvas?.getContext("2d"), ref };
};

export default useCanvas;
