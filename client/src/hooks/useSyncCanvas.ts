import { useEffect } from "react";
import { getMapImage, updateMapImage } from "../api/mapImages";
import { MapImage } from "../models";

const loadCanvas = async (
  ctx: CanvasRenderingContext2D,
  mapImageId: number
): Promise<void> => {
  const mapImage = await getMapImage(mapImageId);
  const dataUrl =
    mapImage.dataUrl || (await postCanvas(ctx, mapImageId)).dataUrl;
  const img = new Image();
  return new Promise((resolve) => {
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.src = dataUrl;
  });
};

const postCanvas = async (
  ctx: CanvasRenderingContext2D,
  mapImageId: number
): Promise<MapImage> => {
  const dataUrl = ctx.canvas.toDataURL();
  return await updateMapImage(mapImageId, { dataUrl });
};

type Milliseconds = number;

const useSyncCanvas = (
  ctx: CanvasRenderingContext2D | undefined | null,
  mapImageId: number,
  postInterval: Milliseconds
) => {
  useEffect(() => {
    if (!ctx) {
      return;
    }
    let timer: NodeJS.Timer;
    loadCanvas(ctx, mapImageId).then(() => {
      timer = setInterval(() => {
        postCanvas(ctx, mapImageId);
      }, postInterval);
    });
    return () => {
      clearInterval(timer);
    };
  }, [ctx, mapImageId, postInterval]);
};

export default useSyncCanvas;
