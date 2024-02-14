import { ColorSpaceConversion, addSpaceConversion } from "./conversion.js";
import { spaces } from "./spaces/index.js";

export type FunctionColorSpace = (context: any) => ColorSpace;
export type FunctionColorSpaceName = keyof typeof spaces;
export type FunctionColorSpaceFromName<T> = T extends FunctionColorSpaceName
  ? (typeof spaces)[T]
  : T extends FunctionColorSpace
  ? T
  : never;
export type ColorSpaceType = ColorSpace | FunctionColorSpace | FunctionColorSpaceName;
export type ColorSpaceContext<T extends ColorSpaceType> = T extends FunctionColorSpace
  ? Parameters<T>[0]
  : T extends string
  ? Parameters<FunctionColorSpaceFromName<T>>[0]
  : T extends ColorSpace
  ? undefined
  : never;
export type ColorSpaceFromColorSpaceType<T extends ColorSpaceType> = T extends ColorSpace
  ? T
  : T extends FunctionColorSpace
  ? ReturnType<T>
  : T extends string
  ? ReturnType<FunctionColorSpaceFromName<T>>
  : never;

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

// wrote a monad without even knowing what a monad was
// can apply `resolveSpace` to this.
// Default parameters passed in become optional keys in the output function
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export function fnSpace<T extends FunctionColorSpace, P extends Parameters<T>[0]>($fnSpace: T, defaultContext?: P) {
  return (context?: DistributiveOmit<Parameters<T>[0], keyof P> & Omit<Partial<P>, "id" | "name">) => {
    // console.log("context:", { ...defaultContext, ...context });
    return $fnSpace({ ...defaultContext, ...context }) as ReturnType<T> & P;
  };
}

// when resolving a function space with custom context, omit id for proper memoization
export const resolveSpace: {
  (space: ColorSpace): ColorSpace;
  <T extends FunctionColorSpace, P extends Parameters<T>[0]>(fnSpace: T, context?: P): ColorSpace;
  <T extends FunctionColorSpaceName, P extends Parameters<FunctionColorSpaceFromName<T>>[0]>(
    fnSpaceId: T,
    context?: P,
  ): ColorSpace;
  (spaceOrFnSpaceOrId: ColorSpaceType, context?: object): ColorSpace;
} = (spaceOrFnSpaceOrId: ColorSpaceType, context?: object): ColorSpace => {
  // is a true colorspace
  if (spaceOrFnSpaceOrId instanceof ColorSpace) {
    return spaceOrFnSpaceOrId;
  }

  const contextSansId = context ? { ...context, id: undefined } : context;

  // is a function
  if (spaceOrFnSpaceOrId instanceof Function) {
    return spaceOrFnSpaceOrId(contextSansId);
  }

  if (typeof spaceOrFnSpaceOrId === "string" && !(spaceOrFnSpaceOrId in spaces)) {
    throw new ReferenceError(`Colorspace id ${spaceOrFnSpaceOrId} does not exist`);
  }

  // console.log(spaces[spaceOrFnSpaceOrId]);

  // is a string
  return (spaces[spaceOrFnSpaceOrId] as FunctionColorSpace)(contextSansId);
};
