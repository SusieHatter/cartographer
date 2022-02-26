import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { drawLine } from "../draw";
import useCanvas from "../hooks/useCanvas";
import useKeys from "../hooks/useKeys";
import useSyncCanvas from "../hooks/useSyncCanvas";
import { MapImage, Pen, Position } from "../models";
import { scaleClientToCanvasPosition } from "../utils";

const WIDTH = 3000;
const HEIGHT = 1500;

type CanvasProps = {
  mapImage: MapImage;
  pen: Pen;
  updatePen: (updatedPen: Partial<Pen>) => void;
};

const Canvas = ({ mapImage, pen, updatePen }: CanvasProps) => {
  const { canvas, ctx, ref } = useCanvas(WIDTH, HEIGHT);
  useSyncCanvas(ctx, mapImage, 5000);

  const { isDown } = useKeys();
  const spaceDown = isDown(" ");

  const putPenDown = (clientPosition: Position) => {
    const position = scaleClientToCanvasPosition(
      clientPosition,
      canvas.current
    );
    updatePen({ down: true, position });
  };

  const draw = (clientPosition: Position) => {
    if (!pen.down || spaceDown) {
      return;
    }

    const position = scaleClientToCanvasPosition(
      clientPosition,
      canvas.current
    );
    drawLine(ctx.current, ...pen.position, ...position, pen.color, pen.size);
    updatePen({ position });
  };

  const liftPenUp = () => {
    updatePen({ down: false });
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

  return (
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
  );
};

export default Canvas;
