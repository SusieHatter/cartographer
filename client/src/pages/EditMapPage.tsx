import React, { useState } from "react";
import { drawLine } from "../draw";
import useCanvas from "../hooks/useCanvas";
import useSyncCanvas from "../hooks/useSyncCanvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import useMapImage from "../hooks/useMapImage";
import useKeys from "../hooks/useKeys";
import { Position } from "../models";
import { scaleClientToCanvasPosition } from "../utils";

const WIDTH = 3000;
const HEIGHT = 1500;

type EditPageProps = {
  id: number;
};

function EditMapPage({ id }: EditPageProps) {
  const { canvas, ctx, ref } = useCanvas(WIDTH, HEIGHT);
  const [mapImage, updateMapImage] = useMapImage(id);
  useSyncCanvas(ctx, mapImage, 5000);

  const { isDown } = useKeys();
  const spaceDown = isDown(" ");

  const [penDown, setPenDown] = useState(false);
  const [[x, y], setPenPosition] = useState([0, 0]);
  const [penSize, setPenSize] = useState(1);
  const [penColor, setPenColor] = useState("#000000");

  const [editingMapName, setEditingMapName] = useState(false);
  const [newMapName, setNewMapName] = useState<string | undefined>(undefined);

  const putPenDown = (clientPosition: Position) => {
    setPenDown(true);
    const position = scaleClientToCanvasPosition(
      clientPosition,
      canvas.current
    );
    setPenPosition(position);
  };

  const draw = (clientPosition: Position) => {
    if (!penDown || spaceDown) {
      return;
    }
    const [newX, newY] = scaleClientToCanvasPosition(
      clientPosition,
      canvas.current
    );
    drawLine(ctx.current, x, y, newX, newY, penColor, penSize);
    setPenPosition([newX, newY]);
  };

  const liftPenUp = () => {
    setPenDown(false);
  };

  const onMouseDown = (e: React.MouseEvent) =>
    putPenDown([e.clientX, e.clientY]);
  const onMouseMove = (e: React.MouseEvent) => draw([e.clientX, e.clientY]);
  const onMouseUp = () => liftPenUp();

  const onTouchStart = (e: React.TouchEvent) =>
    putPenDown([e.touches[0].clientX, e.touches[0].clientY]);
  const onTouchMove = (e: React.TouchEvent) =>
    draw([e.touches[0].clientX, e.touches[0].clientY]);
  const onTouchEnd = () => liftPenUp();

  const onChangePenSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setPenSize(value);
  };

  const onChangePenColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenColor(e.target.value);
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
          value={penSize}
          onChange={onChangePenSize}
        />
      </div>
      <div className="flex flex-row flex-1">
        <div className="bg-light-red w-20">100</div>
        <div className="flex flex-1 h-full">
          <TransformWrapper panning={{ disabled: !spaceDown }}>
            <TransformComponent
              wrapperStyle={{
                height: "100%",
                background: "brown",
                alignItems: "center",
              }}
            >
              <canvas
                ref={ref}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="w-full bg-[white]"
              ></canvas>
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className="bg-red w-60">
          <input type="color" value={penColor} onChange={onChangePenColor} />
        </div>
      </div>
    </div>
  );
}

export default EditMapPage;
