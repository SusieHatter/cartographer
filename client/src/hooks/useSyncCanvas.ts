import { useEffect } from "react";
import { getMapImage, updateMapImage } from "../api/mapImages";

const loadCanvas = async (
  ctx: CanvasRenderingContext2D,
  mapImageId: number
) => {
  const mapImage = await getMapImage(mapImageId);
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  };
  img.src = mapImage.dataUrl;
};

const postCanvas = async (
  ctx: CanvasRenderingContext2D,
  mapImageId: number
) => {
  const dataUrl = ctx.canvas.toDataURL();
  await updateMapImage(mapImageId, { dataUrl });
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
