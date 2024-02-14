/*=================*/
/* Color Structure */
/*=================*/

import {
  ColorSpace,
  ColorSpaceContext,
  ColorSpaceFromColorSpaceType,
  ColorSpaceType,
  FunctionColorSpace,
  FunctionColorSpaceFromName,
  FunctionColorSpaceName,
  resolveSpace,
} from "./space.js";
import { getSpaceConversion } from "./conversion.js";

export interface ColorLike<T extends FunctionColorSpace | FunctionColorSpaceName = FunctionColorSpace> {
  space: T;
  values: [number, number, number];
  context?: Parameters<FunctionColorSpaceFromName<T>>[0];
}

export class Color {
  public readonly space: ColorSpace;
  public readonly values: [number, number, number];

  constructor(space: ColorSpace, values: [number, number, number]) {
    this.space = space;
    this.values = values;
  }

  /**
   * Returns a new Color in the desired color space.
   * @param dstSpace Output color space as a `ColorSpace` object or as a `string` name of a registered `ColorSpace`
   * @param dstSpaceContext Optional properties to apply to the `ColorSpace`
   */
  public toSpace<T extends ColorSpaceType, P extends Parameters<FunctionColorSpaceFromName<T>>[0]>(
    dstSpace: T,
    dstSpaceContext?: P,
  ) {
    const space = resolveSpace(dstSpace, dstSpaceContext);
    if (this.space === space) return new Color(space, this.values);

    // const convert = getSpaceConversion(this.space, _dstSpace, { ...this.context }, { ...dstSpaceContext });
    const convert = getSpaceConversion(this.space, space);
    const newValues = convert(this.values);

    const newColor = new Color(space, newValues);

    return newColor;
  }
}

type ColorCurriedReturnType<T extends ColorSpaceType> = (
  values: [number, number, number] | Color,
  context?: ColorSpaceContext<T>,
) => Color;

function color<T extends FunctionColorSpace | FunctionColorSpaceName>(color: ColorLike<T>): Color;

// function color<T extends ColorSpace>(space: T, values: [number, number, number] | Color<any>): Color<T>;

function color<T extends ColorSpaceType>(space: T): ColorCurriedReturnType<T>;

function color<T extends ColorSpaceType, P extends ColorSpaceContext<T>>(
  space: T,
  values: [number, number, number] | Color,
  context?: P,
): Color;

function color(
  spaceTypeOrColor: ColorSpaceType | ColorLike,
  valuesOrColor?: [number, number, number] | Color,
  context?: object,
) {
  if (typeof spaceTypeOrColor === "object" && "space" in spaceTypeOrColor && "values" in spaceTypeOrColor) {
    return color(spaceTypeOrColor.space, spaceTypeOrColor.values, spaceTypeOrColor.context);
  }

  if (valuesOrColor === undefined) {
    // const colorCurried: ColorCurriedReturnType<typeof spaceTypeOrColor> = (valuesOrColor2, context2) =>
    //   color(spaceTypeOrColor, valuesOrColor2, context2);
    const colorCurried = color.bind(null, spaceTypeOrColor); // as ColorCurriedReturnType<typeof spaceTypeOrColor>;
    return colorCurried;
  }

  const space = resolveSpace(spaceTypeOrColor, context);

  const values = valuesOrColor instanceof Color ? valuesOrColor.toSpace(space).values : valuesOrColor;

  return new Color(space, values);
}

export { color };

// export const Color = ColorClass as ColorConstructor;
