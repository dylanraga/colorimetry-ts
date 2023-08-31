/*=================*/
/* Color Structure */
/*=================*/

// import * as spaces from "./spaces/index.js";
import { ColorSpace, ColorSpaceFromName, ColorSpaceName } from "./space.js";
import { getSpaceConversion } from "./conversion.js";
import { spaces } from "./spaces/index.js";

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

// type ColorValueFormat = 'float' | ;

export interface ColorLike<T extends ColorSpace | ColorSpaceName = ColorSpace> {
  space: T;
  values: [number, number, number];
  context?: Partial<ColorSpaceFromName<T>>;
  // format?:
}

export class Color<T extends ColorSpace = ColorSpace> {
  public readonly space: T;
  public readonly values: [number, number, number];
  public readonly context?: Partial<T>;

  constructor(space: T, values: [number, number, number], context?: Partial<T>) {
    this.space = space;
    this.values = values;
    this.context = context;
  }

  /**
   * Returns a new Color in the desired color space.
   * @param dstSpace Output color space as a `ColorSpace` object or as a `string` name of a registered `ColorSpace`
   * @param dstSpaceContext Optional properties to apply to the `ColorSpace`
   */
  public toSpace<T extends ColorSpace | ColorSpaceName>(dstSpace: T, dstSpaceContext?: Partial<ColorSpaceFromName<T>>) {
    if (typeof dstSpace === "string" && !(dstSpace in spaces)) {
      throw new ReferenceError(`Colorspace ${dstSpace} does not exist`);
    }

    const _dstSpace = typeof dstSpace === "string" ? spaces[dstSpace as ColorSpaceName] : (dstSpace as ColorSpace);

    if (this.space === _dstSpace) return new Color(_dstSpace, this.values, dstSpaceContext);

    const convert = getSpaceConversion(this.space, _dstSpace, { ...this.context }, { ...dstSpaceContext });
    const newValues = convert(this.values);

    const newColor = new Color(_dstSpace, newValues, dstSpaceContext);

    return newColor;
  }
}

type CurriedColorReturnType<T extends ColorSpace> = {
  (values: [number, number, number], context?: Partial<T>): Color<T>;
  (color: Color<any>, context?: Partial<T>): Color<T>;
};

function color<T extends ColorSpaceName>(color: ColorLike<T>): Color<ColorSpaceFromName<T>>;
function color<T extends ColorSpace>(color: ColorLike<T>): Color<T>;

function color<T extends ColorSpaceName>(
  spaceId: T,
  values: [number, number, number] | Color<any>,
  context?: Partial<ColorSpaceFromName<T>>
): Color<ColorSpaceFromName<T>>;

function color<T extends ColorSpace>(
  space: T,
  values: [number, number, number] | Color<any>,
  context?: Partial<T>
): Color<T>;

function color<T extends ColorSpaceName>(spaceId: T): CurriedColorReturnType<ColorSpaceFromName<T>>;
function color<T extends ColorSpace>(space: T): CurriedColorReturnType<T>;

function color(
  spaceOrIdOrColor: ColorSpace | ColorSpaceName | ColorLike,
  valuesOrColor?: [number, number, number] | Color<any>,
  context?: object
) {
  if (typeof spaceOrIdOrColor === "object" && "space" in spaceOrIdOrColor && "values" in spaceOrIdOrColor) {
    return color(spaceOrIdOrColor.space, spaceOrIdOrColor.values, spaceOrIdOrColor.context);
  }
  if (typeof spaceOrIdOrColor === "string" && !(spaceOrIdOrColor in spaces)) {
    throw new ReferenceError(`Colorspace ${spaceOrIdOrColor} does not exist`);
  }
  const space = typeof spaceOrIdOrColor === "string" ? spaces[spaceOrIdOrColor as ColorSpaceName] : spaceOrIdOrColor;
  const values = valuesOrColor instanceof Color ? valuesOrColor.toSpace(space).values : valuesOrColor;

  if (values === undefined) {
    const colorCurried: CurriedColorReturnType<typeof space> = (valuesOrColor2, context2?) =>
      color(space, valuesOrColor2, context2);
    return colorCurried;
  }

  return new Color(space, values, context);
}
export { color };

const c1 = color({ space: "srgb", values: [1, 1, 1] });

// export const Color = ColorClass as ColorConstructor;
