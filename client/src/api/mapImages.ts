import { BASE_SERVER_URL } from "../config";
import { MapImage } from "../models";

const MAPS_URL = `${BASE_SERVER_URL}/maps`;

const verifyMapImage = (x: any): MapImage => {
  if (x["id"] === undefined) {
    throw Error("MapImage must have an id");
  }
  if (x["dataUrl"] === undefined) {
    throw Error("MapImage must have an dataUrl");
  }
  if (x["name"] === undefined) {
    throw Error("MapImage must have an name");
  }
  if (x["lastEdited"] === undefined) {
    throw Error("MapImage must have an lastEdited");
  }
  return x;
};

export const createMapImage = async (): Promise<MapImage> => {
  return fetch(`${MAPS_URL}/`, { method: "post" })
    .then((res) => res.json())
    .then(verifyMapImage);
};

export const getMapImage = async (id: number): Promise<MapImage> => {
  return fetch(`${MAPS_URL}/${id}`)
    .then((res) => res.json())
    .then(verifyMapImage);
};

export const getMapImages = async (): Promise<MapImage[]> => {
  return fetch(`${MAPS_URL}/`)
    .then((res) => res.json())
    .then((x) => x.map(verifyMapImage));
};

export type UpdatedMapImage = Partial<Pick<MapImage, "dataUrl" | "name">>;

export const updateMapImage = async (
  id: number,
  updatedMapImage: UpdatedMapImage
): Promise<MapImage> => {
  return fetch(`${MAPS_URL}/${id}`, {
    method: "put",
    body: JSON.stringify(updatedMapImage),
  })
    .then((res) => res.json())
    .then(verifyMapImage);
};

export const deleteMapImage = async (id: number): Promise<void> => {
  fetch(`${MAPS_URL}/${id}`, { method: "delete" });
};
