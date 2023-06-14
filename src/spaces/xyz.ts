// import { ChromaticAdaptationMethodName, xyzCat } from "../cat.js";
// import { ColorSpace } from "../space.js";
// import { xy } from "./chromaticity/xy.js";

import { ColorSpace } from "../space.js";

export interface XYZ {
  X: number;
  Y: number;
  Z: number;
}

export const xyz = new ColorSpace({ name: "CIE XYZ", keys: ["X", "Y", "Z"] });

export const xyz_n = new ColorSpace<{ whiteLuminance: number }>({
  name: "XYZ Normalized",
  keys: ["Xn", "Yn", "Zn"],
  conversions: [{ spaceB: xyz, aToB: xyzNToXyz, bToA: xyzToXyzN }],
});

export function xyzToXyzN(
  [X, Y, Z]: number[],
  { whiteLuminance = 100, blackLuminance = 0 }: { whiteLuminance?: number; blackLuminance?: number } = {
    whiteLuminance: 1,
    blackLuminance: 0,
  }
) {
  const Yn = (Y - blackLuminance) / (whiteLuminance - blackLuminance);
  const Xn = Y !== 0 ? X * (Yn / Y) : X;
  const Zn = Y !== 0 ? Z * (Yn / Y) : Z;
  return [Xn, Yn, Zn];
}

export function xyzNToXyz(
  [Xn, Yn, Zn]: number[],
  { whiteLuminance = 100, blackLuminance = 0 }: { whiteLuminance?: number; blackLuminance?: number } = {
    whiteLuminance: 1,
    blackLuminance: 0,
  }
) {
  const Y = (whiteLuminance - blackLuminance) * Yn + blackLuminance;
  const X = Yn !== 0 ? Xn / (Y / Yn) : Xn;
  const Z = Yn !== 0 ? Zn / (Y / Yn) : Zn;
  return [X, Y, Z];
}

// type XyzColorSpace = ColorSpace & { illuminant: xy };

// export function createXyzColorSpace<T extends ColorSpace>(illuminant: xy, space: T) {
//   const newSpace = Object.create(space) as XyzColorSpace;

//   Object.assign(newSpace, { illuminant });

//   return newSpace;
// }

// 	return {  }
//   public readonly illuminant: xy;

//   constructor(space: ColorSpace, illuminant: xy) {
//     super({ name, keys, ...props });
//     this.illuminant = illuminant;
//   }

//   public cat(dstIlluminant: xy, method: ChromaticAdaptationMethodName = "bradford") {
//     const { x: srcx, y: srcy } = this.illuminant;
//     const { x: dstx, y: dsty } = dstIlluminant;

//     if (srcx === dstx && srcy === dsty) return this;

//     const dstSpace = new XYZSpace({
//       name: `XYZ ColorSpace (CAT ${dstx} ${dsty})`,
//       illuminant: dstIlluminant,
//       conversions: [
//         {
//           space: this,
//           toFn: (dstXYZ) => xyzCat(dstXYZ, { x: dstx, y: dsty, Y: 1 }, { x: srcx, y: srcy, Y: 1 }, method),
//           fromFn: (srcXYZ) => xyzCat(srcXYZ, { x: srcx, y: srcy, Y: 1 }, { x: dstx, y: dsty, Y: 1 }, method),
//         },
//       ],
//     });

//     return dstSpace;
//   }

//   /**
//    * Static
//    */
//   public static named = {} as XYZSpaceNamedMap & Record<string, XYZSpace>;
// }

// export interface XYZSpaceNamedMap {}
// export type XYZSpaceName = keyof XYZSpaceNamedMap | (string & Record<never, never>);

// declare module "../space" {
//   interface ColorSpaceNamedMap extends XYZSpaceNamedMap {}
// }

// export const xyzSpaces = XYZSpace.named;

// export { XYZSpace };
