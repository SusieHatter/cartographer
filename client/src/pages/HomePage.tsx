import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapImage } from "../models";

const HomePage = () => {
  const [mapImages, setMapImages] = useState<MapImage[]>([]);
  useEffect(() => {
    fetch("http://localhost:8090/maps/")
      .then((res) => res.json())
      .then((mapImages) => setMapImages(mapImages));
  }, []);

  return (
    <div>
      <h2>Hi</h2>
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
        </div>
      ))}
    </div>
  );
};

export default HomePage;
