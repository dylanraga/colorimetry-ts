import { deg2rad, memoize, rad2deg } from "../common/util.js";
import { ColorSpace } from "../space.js";

export const lchSpaceFromLabSpace = memoize(
  <T extends ColorSpace>(labSpace: T, context?: { name?: string; keys?: string[] }) => {
    const newSpace = new ColorSpace({
      name: context?.name ?? labSpace.name + " (LCh)" ?? "LCh Color Space",
      keys: context?.keys ?? ["L", "C", "h"],
      conversions: [{ spaceB: labSpace, aToB: lchToLab, bToA: labToLch }],
    });

    const { name, keys, ...labSpaceContext } = labSpace;

    Object.assign(newSpace, labSpaceContext);

    return newSpace as T;
  },
  (arg1: ColorSpace) => arg1
);

function labToLch([L, a, b]: [number, number, number]): [number, number, number] {
  const hp = rad2deg(Math.atan2(b, a));
  return [L, (a * a + b * b) ** (1 / 2), hp < 0 ? hp + 360 : hp];
}

function lchToLab([L, C, h]: [number, number, number]): [number, number, number] {
  return [L, C * Math.cos(deg2rad(h)), C * Math.sin(deg2rad(h))];
}
