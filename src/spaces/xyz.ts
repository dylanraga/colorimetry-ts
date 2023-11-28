//
// CIE XYZ 1931
//

import { memoize } from "../common/util.js";
import { ColorSpace, fnSpace } from "../space.js";

export interface XYZ {
  X: number;
  Y: number;
  Z: number;
}

const xyzSpace = new ColorSpace({ id: "ciexyz", name: "CIE XYZ", keys: ["X", "Y", "Z"] });

const normalizedXyzSpace = memoize((context: { whiteLuminance: number }) =>
  Object.assign(
    new ColorSpace({
      id: "ciexyz-normalized",
      name: "XYZ Normalized",
      keys: ["Xn", "Yn", "Zn"],
      conversions: [
        {
          spaceB: xyz(),
          aToB: (values) => xyzNToXyz(values, context.whiteLuminance),
          bToA: (values) => xyzToXyzN(values, context.whiteLuminance),
        },
      ],
    }),
    context,
  ),
);

export const xyz = (context?: object) => xyzSpace;
export const xyz_n = fnSpace(normalizedXyzSpace, { whiteLuminance: 100 });

export function xyzToXyzN([X, Y, Z]: number[], whiteLuminance = 100): [number, number, number] {
  const Yn = Y / whiteLuminance;
  const Xn = X / whiteLuminance;
  const Zn = Z / whiteLuminance;
  return [Xn, Yn, Zn];
}

export function xyzNToXyz([Xn, Yn, Zn]: number[], whiteLuminance = 100): [number, number, number] {
  const Y = whiteLuminance * Yn;
  const X = whiteLuminance * Xn;
  const Z = whiteLuminance * Zn;
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
