import { ColorSpaceConversion, addSpaceConversion } from "./conversion.js";
import * as _spaces from "./spaces/index.js";

export type ColorSpaceContext<T> = T extends ColorSpace<infer R> ? R : never;

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

export type ColorSpaceName = keyof typeof _spaces;
export type ColorSpaceFromName<T> = T extends ColorSpaceName ? typeof _spaces[T] : T;
export const spaces = _spaces as typeof _spaces & Record<string, ColorSpace>;
