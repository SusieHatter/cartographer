import React, { useState } from "react";
import useMapImage from "../hooks/useMapImage";
import Canvas from "../components/Canvas";
import { Pen } from "../models";
// assets
import { ReactComponent as Edit } from "../assets/edit-solid.svg";

type EditPageProps = {
  id: number;
};

function EditMapPage({ id }: EditPageProps) {
  const [mapImage, updateMapImage] = useMapImage(id);

  const [pen, setPen] = useState<Pen>({
    down: false,
    position: [0, 0],
    size: 1,
    color: "#000000",
  });
  const updatePen = (updatedPen: Partial<Pen>) => {
    setPen({
      ...pen,
      ...updatedPen,
    });
  };

  const [editingMapName, setEditingMapName] = useState(false);
  const [newMapName, setNewMapName] = useState<string | undefined>(undefined);

  const onChangePenSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    updatePen({ size: value });
  };

  const onChangePenColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePen({ color: e.target.value });
  };

  const onClickMapName = () => {
    setEditingMapName(true);
  };

  const onChangeMapName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMapName(e.target.value);
  };

  const onKeyDownMapName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setEditingMapName(false);
      updateMapImage({ name: newMapName });
    }
  };

  if (!mapImage) {
    return <></>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex bg-medium-light-grey text-white justify-between cursor-pointer py-1 px-2">
        <div className="flex items-center">
          <Edit className="w-4 h-4 mx-1" />
          {editingMapName ? (
            <input
              type="text"
              value={newMapName ?? mapImage.name}
              onChange={onChangeMapName}
              onKeyDown={onKeyDownMapName}
              className="bg-white text-grey text-lg"
            />
          ) : (
            <h4
              onClick={onClickMapName}
              className="cursor-pointer inline-block font-semibold text-lg"
            >
              {mapImage.name}
            </h4>
          )}
        </div>
        <div>
          <label htmlFor="pen size" className="font-ui text-sm">
            Pen size:{" "}
          </label>
          <input
            name="pen size"
            type="number"
            min="1"
            max="100"
            value={pen.size}
            onChange={onChangePenSize}
            className="bg-white text-grey px-1 rounded-md font-ui text-sm w-12"
          />
        </div>
      </div>
      <div className="flex flex-row flex-1">
        <div className="bg-grey w-20">100</div>
        {/* Canvas wrapping height has to take navbars into account by minusing their height */}
        <div className="flex flex-1 h-[calc(100vh-100px)] bg-dark-grey">
          <Canvas mapImage={mapImage} pen={pen} updatePen={updatePen} />
        </div>
        <div className="bg-grey w-60">
          <input type="color" value={pen.color} onChange={onChangePenColor} />
        </div>
      </div>
    </div>
  );
}

export default EditMapPage;
