import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createMapImage, deleteMapImage, getMapImages } from "../api/mapImages";
import { MapImage } from "../models";

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
    <div>
      <h2>Hi</h2>
      <button onClick={onCreate}>Create</button>
      {mapImages.map((mapImage) => (
        <div key={mapImage.id}>
          <Link to={`/maps/${mapImage.id}`}>
            <img
              style={{
                width: "500px",
                height: "250px",
                border: "1px solid black",
              }}
              src={mapImage.dataUrl}
              alt=""
            />
          </Link>
          <button onClick={() => onDelete(mapImage.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
