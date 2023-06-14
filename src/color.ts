/*=================*/
/* Color Structure */
/*=================*/

// import * as spaces from "./spaces/index.js";
import { ColorSpace, ColorSpaceContext, ColorSpaceFromName, ColorSpaceName, spaces } from "./space.js";
import { getSpaceConversion } from "./conversion.js";

// export interface ColorConstructor<T extends ColorSpace> {
//   /**
//    * Creates a new `Color` instance
//    * @param space Data color space of the input values as a `ColorSpace` object or as a `string` name of a registered `ColorSpace`
//    * @param values Values of the desired color in terms of `space`
//    * @param props Optional properties to apply to the `ColorSpace`
//    */
//   new (
//     space: T,
//     values: number[],
//     context?: ColorSpaceContext<T>
//     //props?: Partial<ColorSpaceTypeProps<S>>
//     // props?: Record<string, unknown>
//   ): Color<T>;

//   readonly prototype: Color<T>;
// }

// export interface Color<T extends ColorSpace = ColorSpace> extends ColorClass<T> {}

export class Color<T extends ColorSpace | ColorSpaceName = ColorSpace | ColorSpaceName> {
  public readonly space: ColorSpace;
  public values: number[];
  public context?: Partial<ColorSpaceContext<T extends ColorSpaceName ? typeof spaces[T] : T>>;

  constructor(space: T, values: number[], context?: Partial<ColorSpaceContext<ColorSpaceFromName<T>>>) {
    this.space = typeof space === "string" ? spaces[space] : space;
    this.values = values;
    this.context = context;
  }

  /**
   * Returns a new Color in the desired color space.
   * @param dstSpace Output color space as a `ColorSpace` object or as a `string` name of a registered `ColorSpace`
   * @param dstSpaceContext Optional properties to apply to the `ColorSpace`
   */
  public toSpace<T extends ColorSpace | ColorSpaceName>(
    dstSpace: T,
    dstSpaceContext?: Partial<ColorSpaceContext<ColorSpaceFromName<T>>>
  ) {
    const _dstSpace: ColorSpace = typeof dstSpace === "string" ? spaces[dstSpace] : dstSpace;

    if (this.space === _dstSpace) return new Color(this.space, this.values, dstSpaceContext);

    const convert = getSpaceConversion(this.space, _dstSpace, { ...this.context }, { ...dstSpaceContext });
    const newValues = convert(this.values);

    const newColor = new Color(_dstSpace, newValues, dstSpaceContext);

    return newColor;
  }
}

export function color<T extends ColorSpace | ColorSpaceName = ColorSpace | ColorSpaceName>(
  space: T,
  values: number[],
  context?: Partial<ColorSpaceContext<ColorSpaceFromName<T>>>
) {
  return new Color(space, values, context);
}

// export const Color = ColorClass as ColorConstructor;
