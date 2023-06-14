import { deg2rad, rad2deg } from "../common/util.js";
import { ColorSpace } from "../space.js";

export function lchSpace(labSpace: ColorSpace, props?: { name?: string; keys?: string[] }) {
  const newSpace = new ColorSpace({
    name: props?.name ?? labSpace.name + " (LCh)" ?? "LCh Color Space",
    keys: props?.keys ?? ["L", "C", "h"],
    conversions: [{ spaceB: labSpace, aToB: lchToLab, bToA: labToLch }],
  });

  return newSpace;
}

function labToLch([L, a, b]: number[]) {
  const hp = rad2deg(Math.atan2(b, a));
  return [L, (a * a + b * b) ** (1 / 2), hp < 0 ? hp + 360 : hp];
}

function lchToLab([L, C, h]: number[]) {
  return [L, C * Math.cos(deg2rad(h)), C * Math.sin(deg2rad(h))];
}
