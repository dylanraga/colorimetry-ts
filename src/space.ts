import { ColorSpaceConversion, addSpaceConversion } from "./conversion.js";
import { spaces } from "./spaces/index.js";

export type ColorSpaceName = keyof typeof spaces;
export type ColorSpaceFromName<T> = T extends ColorSpaceName ? typeof spaces[T] : T extends ColorSpace ? T : never;

interface ColorSpaceConstructorProps {
  readonly id?: string;
  readonly name?: string;
  readonly keys: readonly string[];
  readonly conversions?: {
    spaceB: ColorSpace;
    aToB: ColorSpaceConversion;
    bToA: ColorSpaceConversion;
  }[];
}

export class ColorSpace {
  public readonly id?: string;
  public readonly name?: string;
  public readonly keys: readonly string[];

  constructor({ id, name, keys, conversions = [] }: ColorSpaceConstructorProps) {
    this.id = id;
    this.name = name;
    this.keys = keys;

    for (const { spaceB, aToB, bToA } of conversions) {
      addSpaceConversion(this, spaceB, aToB, bToA);
    }
  }
}
