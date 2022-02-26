import { MutableRefObject, useCallback, useRef } from "react";

type UseCanvas = {
  canvas: MutableRefObject<HTMLCanvasElement>;
  ctx: MutableRefObject<CanvasRenderingContext2D>;
  ref: (canvas: HTMLCanvasElement) => void;
};

const useCanvas = (width: number, height: number): UseCanvas => {
  const canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const _ctx = canvas.current.getContext("2d");
  if (!_ctx) {
    throw Error("could not create context");
  }
  const ctx = useRef<CanvasRenderingContext2D>(_ctx);
  const ref = useCallback(
    (_canvas: HTMLCanvasElement) => {
      if (!_canvas) {
        return;
      }
      _canvas.width = width;
      _canvas.height = height;
      canvas.current = _canvas;
      const _ctx = _canvas.getContext("2d");
      if (!_ctx) {
        throw Error("could not create context");
      }
      ctx.current = _ctx;
    },
    [width, height]
  );
  return { canvas, ctx, ref };
};

export default useCanvas;
