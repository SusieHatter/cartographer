import React, { useState } from "react";
import useMapImage from "../hooks/useMapImage";
import Canvas from "../components/Canvas";
import { Pen } from "../models";

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
      <div className="bg-green">
        {editingMapName ? (
          <input
            type="text"
            value={newMapName ?? mapImage.name}
            onChange={onChangeMapName}
            onKeyDown={onKeyDownMapName}
          />
        ) : (
          <h4 onClick={onClickMapName} className="cursor-pointer inline-block">
            {mapImage.name}
          </h4>
        )}
        <input
          type="number"
          min="1"
          max="100"
          value={pen.size}
          onChange={onChangePenSize}
        />
      </div>
      <div className="flex flex-row flex-1">
        <div className="bg-light-red w-20">100</div>
        <div className="flex flex-1 h-full">
          <Canvas mapImage={mapImage} pen={pen} updatePen={updatePen} />
        </div>
        <div className="bg-red w-60">
          <input type="color" value={pen.color} onChange={onChangePenColor} />
        </div>
      </div>
    </div>
  );
}

export default EditMapPage;
