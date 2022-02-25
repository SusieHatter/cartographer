import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { drawLine } from "../draw";
import useCanvas from "../hooks/useCanvas";
import useSyncCanvas from "../hooks/useSyncCanvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import useMapImage from "../hooks/useMapImage";

type Position = [number, number];

const WIDTH = 3000;
const HEIGHT = 1500;

function EditMapPage() {
  const { id: idStr } = useParams();
  const navigate = useNavigate();

  if (!idStr) {
    throw Error("EditMapPage requires an id in the url params");
  }
  const id = parseInt(idStr);
  useEffect(() => {
    if (Number.isNaN(id)) {
      navigate("/", { replace: true });
    }
  }, [id, navigate]);

  const { ctx, ref } = useCanvas(WIDTH, HEIGHT);
  const mapImage = useMapImage(id);
  useSyncCanvas(ctx, mapImage, 5000);

  const scaleClientToCanvasPosition = ([x, y]: Position): Position => {
    if (!ctx) {
      return [0, 0];
    }
    const bounds = ctx.canvas.getBoundingClientRect();
    const scale = WIDTH / bounds.width;
    return [(x - bounds.x) * scale, (y - bounds.y) * scale];
  };

  const [spaceDown, setSpaceDown] = useState(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === " ") {
      setSpaceDown(true);
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === " ") {
      setSpaceDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const [penDown, setPenDown] = useState(false);
  const [[x, y], setPenPosition] = useState([0, 0]);
  const [penSize, setPenSize] = useState(1);
  const [penColor, setPenColor] = useState("#000000");

  const putPenDown = (clientPosition: Position) => {
    setPenDown(true);
    const position = scaleClientToCanvasPosition(clientPosition);
    setPenPosition(position);
  };

  const draw = (clientPosition: Position) => {
    if (!penDown || !ctx || spaceDown) {
      return;
    }
    const [newX, newY] = scaleClientToCanvasPosition(clientPosition);
    drawLine(ctx, x, y, newX, newY, penColor, penSize);
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
    const value = String(e.target.value);
    setPenColor(value);
  };

  if (!mapImage) {
    return <></>;
  }

  return (
    <div className="flex flex-col">
      <div className="bg-green">
        <h4>{mapImage.name}</h4>
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
