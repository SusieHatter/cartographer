import { useEffect } from "react";

const loadCanvas = async (ctx: CanvasRenderingContext2D, serverUrl: string) => {
  const src = await fetch(serverUrl).then((res) => res.text());
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  };
  img.src = src;
};

const postCanvas = async (ctx: CanvasRenderingContext2D, serverUrl: string) => {
  const imageData = ctx.canvas.toDataURL();
  fetch(serverUrl, {
    method: "post",
    body: imageData,
  });
};

type Milliseconds = number;

const useSyncCanvas = (
  ctx: CanvasRenderingContext2D | undefined | null,
  serverUrl: string,
  postInterval: Milliseconds
) => {
  useEffect(() => {
    if (!ctx) {
      return;
    }
    let timer: NodeJS.Timer;
    loadCanvas(ctx, serverUrl).then(() => {
      timer = setInterval(() => {
        postCanvas(ctx, serverUrl);
      }, postInterval);
    });
    return () => {
      clearInterval(timer);
    };
  }, [ctx, serverUrl, postInterval]);
};

export default useSyncCanvas;
