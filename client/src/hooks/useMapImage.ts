import { useEffect, useState } from "react";
import { getMapImage, UpdatedMapImage, updateMapImage } from "../api/mapImages";
import { MapImage } from "../models";

const useMapImage = (
  id: number
): [MapImage | undefined, (updated: UpdatedMapImage) => void] => {
  const [mapImage, setMapImage] = useState<MapImage | undefined>(undefined);
  useEffect(() => {
    getMapImage(id).then((mapImage) => setMapImage(mapImage));
  }, [id]);
  const update = (updated: UpdatedMapImage) => {
    updateMapImage(id, updated).then((mapImage) => setMapImage(mapImage));
  };
  return [mapImage, update];
};

export default useMapImage;
