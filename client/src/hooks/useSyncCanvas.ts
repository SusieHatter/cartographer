import { useEffect } from "react";
import { updateMapImage } from "../api/mapImages";
import { MapImage } from "../models";

const loadCanvas = async (
  ctx: CanvasRenderingContext2D,
  src: string
): Promise<void> => {
  const img = new Image();
  return new Promise((resolve) => {
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.src = src;
  });
};

const updateDataUrl = async (
  ctx: CanvasRenderingContext2D,
  mapImageId: number
): Promise<string> => {
  const dataUrl = ctx.canvas.toDataURL();
  await updateMapImage(mapImageId, { dataUrl });
  return dataUrl;
};

type Milliseconds = number;

const useSyncCanvas = (
  ctx: CanvasRenderingContext2D | undefined | null,
  mapImage: MapImage | undefined,
  postInterval: Milliseconds
) => {
  useEffect(() => {
    if (!ctx || !mapImage) {
      return;
    }
    let timer: NodeJS.Timer;
    (async () => {
      const dataUrl =
        mapImage.dataUrl || (await updateDataUrl(ctx, mapImage.id));
      await loadCanvas(ctx, dataUrl);
      timer = setInterval(() => {
        updateDataUrl(ctx, mapImage.id);
      }, postInterval);
    })();
    return () => {
      clearInterval(timer);
    };
  }, [ctx, mapImage, postInterval]);
};

export default useSyncCanvas;
