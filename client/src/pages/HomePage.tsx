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
    <div className="bg-beige h-100 flex-col px-6 py-3 flex-1">
      <div className="flex justify-between py-3">
        <h2 className="font-sans text-2xl">Map Collection</h2>
        <ConfirmButton onClick={onCreate}>Create</ConfirmButton>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mapImages.map((mapImage) => (
          <div
            key={mapImage.id}
            className="group bg-brown font-serif shadow-md rounded-t-lg p-2 relative"
          >
            <CancelButton
              onClick={() => onDelete(mapImage.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-0 top-0"
            >
              ×
            </CancelButton>
            <Link to={`/maps/${mapImage.id}`}>
              <img
                src={mapImage.dataUrl}
                alt=""
                className="border bg-[white]"
              />
            </Link>
            <h4 className="text-white font-sans text-lg">Map Name</h4>
            <p className="text-beige font-serif text-xs">
              Last edited: 10/Feb/2022
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
