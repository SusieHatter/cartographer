export type Position = [number, number];

export type Pen = {
  down: boolean;
  position: Position;
  size: number;
  color: string;
};

export type MapImage = {
  readonly id: number;
  readonly dataUrl: string;
  readonly name: string;
  readonly lastEdited: number;
};
