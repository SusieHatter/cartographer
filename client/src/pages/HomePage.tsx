import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createMapImage, deleteMapImage, getMapImages } from "../api/mapImages";
import { MapImage } from "../models";
// Components
import { ConfirmButton, CancelButton } from "../ui/buttons";

const HomePage = () => {
  const navigate = useNavigate();
  const [mapImages, setMapImages] = useState<MapImage[]>([]);

  useEffect(() => {
    getMapImages().then((mapImages) => setMapImages(mapImages));
  }, []);

  const onCreate = () => {
    createMapImage().then((newMapImage) => {
      navigate(`/maps/${newMapImage.id}`);
    });
  };

  const onDelete = (id: number) => {
    deleteMapImage(id).then(() =>
      setMapImages(mapImages.filter((mapImage) => mapImage.id !== id))
    );
  };

  return (
    <div className="bg-beige h-screen w-screen p-6">
      <h2 className="font-sans text-2xl">Map Collection</h2>
      <ConfirmButton onClick={onCreate}>Create</ConfirmButton>
      <div className="flex flex-wrap">
        {mapImages.map((mapImage) => (
          <div
            key={mapImage.id}
            className="group basis-full sm:basis-1/2 md:basis-1/4 p-2 relative"
          >
            <CancelButton
              onClick={() => onDelete(mapImage.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-0 top-0"
            >
              ×
            </CancelButton>
            <Link to={`/maps/${mapImage.id}`}>
              <img src={mapImage.dataUrl} alt="" className="border bg-white" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
