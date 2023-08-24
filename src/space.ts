import { EncodedRGBColorSpace } from "../colorimetry.js";
import { ColorSpaceConversion, addSpaceConversion } from "./conversion.js";
import { spaces } from "./spaces/index.js";

export type ColorSpaceName = keyof typeof spaces;
export type ColorSpaceFromName<T> = T extends ColorSpaceName ? typeof spaces[T] : T;
export type ColorSpaceContext<T> = T extends ColorSpace<infer R> ? R : never;

type test = ColorSpaceContext<EncodedRGBColorSpace>;

interface ColorSpaceConstructorProps<T extends object = Record<string, any>> {
  readonly name?: string;
  readonly keys: readonly string[];
  readonly conversions?: {
    spaceB: ColorSpace;
    aToB: ColorSpaceConversion;
    bToA: ColorSpaceConversion;
  }[];
  readonly context?: T;
}

export class ColorSpace<T extends object = Record<string, any>> {
  public readonly name?: string;
  public readonly keys: readonly string[];
  // public readonly conversions?: {
  //   spaceB: ColorSpace;
  //   aToB: ColorSpaceConversion;
  //   bToA: ColorSpaceConversion;
  // }[];

  constructor({ name, keys, conversions = [] }: ColorSpaceConstructorProps<T>) {
    this.name = name;
    this.keys = keys;

    for (const { spaceB, aToB, bToA } of conversions) {
      addSpaceConversion(this, spaceB, aToB, bToA);
    }
  }
}
