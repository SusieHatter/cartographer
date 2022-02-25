import { useEffect, useState } from "react";
import { getMapImage } from "../api/mapImages";
import { MapImage } from "../models";

const useMapImage = (id: number): MapImage | undefined => {
  const [mapImage, setMapImage] = useState<MapImage | undefined>(undefined);
  useEffect(() => {
    getMapImage(id).then((mapImage) => setMapImage(mapImage));
  }, [id]);
  return mapImage;
};

export default useMapImage;
