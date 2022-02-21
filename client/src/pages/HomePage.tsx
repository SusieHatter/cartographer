import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapImage } from "../models";

const HomePage = () => {
  const navigate = useNavigate();
  const [mapImages, setMapImages] = useState<MapImage[]>([]);
  useEffect(() => {
    fetch("http://localhost:8090/maps/")
      .then((res) => res.json())
      .then((mapImages) => setMapImages(mapImages));
  }, []);

  const onCreate = () => {
    fetch("http://localhost:8090/maps/", {
      method: "post",
    })
      .then((res) => res.json())
      .then((newMapImage) => {
        navigate(`/maps/${newMapImage.id}`);
      });
  };

  const onDelete = () => {};

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
          <button onClick={onDelete}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
