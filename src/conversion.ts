import { bfsPath } from "./common/util.js";
import { spaces } from "./spaces/index.js";
import { ColorSpace } from "./space.js";

export const conversionMap = new Map<ColorSpace, Map<ColorSpace, { path: ColorSpace[]; fn: ColorSpaceConversion }>>();

export function addSpaceConversion(
  spaceA: ColorSpace<any>,
  spaceB: ColorSpace<any>,
  aToB: ColorSpaceConversion,
  bToA?: ColorSpaceConversion
) {
  if (!conversionMap.has(spaceA)) conversionMap.set(spaceA, new Map());
  conversionMap.get(spaceA)?.set(spaceB, { path: [spaceA, spaceB], fn: aToB });

  if (bToA) {
    if (!conversionMap.has(spaceB)) conversionMap.set(spaceB, new Map());
    conversionMap.get(spaceB)?.set(spaceA, { path: [spaceB, spaceA], fn: bToA });
  }
}

/**
 * Gets color space conversion function to transform current `ColorSpace` values into `dstSpace`.
 * Retrieves conversion from pre-defined `conversions` property, else find a path via BFS
 * and add it to its `conversions` if a path exists.
 * @param srcSpace Source `ColorSpace` or `ColorSpaceName`
 * @param dstSpace Destination `ColorSpace` or `ColorSpaceName`
 * @returns Function composition transforming source space into the destination color space
 */
export function getSpaceConversion(
  srcSpace: ColorSpace,
  dstSpace: ColorSpace,
  srcSpaceContext: object = {},
  dstSpaceContext: object = {}
): ColorSpaceConversion {
  const _srcSpace = typeof srcSpace === "string" ? spaces[srcSpace] : srcSpace;
  const _dstSpace = typeof dstSpace === "string" ? spaces[dstSpace] : dstSpace;

  // if (_srcSpace === _dstSpace) return (values: number[]) => values;

  const existingConversion = conversionMap.get(_srcSpace)?.get(_dstSpace)?.fn;
  if (existingConversion) {
    return (values, props) =>
      existingConversion(values, {
        srcSpaceContext,
        dstSpaceContext,
        ...srcSpaceContext,
        ...dstSpaceContext,
        ...props,
      });
  }

  // let precisionMin = _dstSpace.precision > _srcSpace.precision ? _srcSpace.precision : _dstSpace.precision;
  const path = bfsPath(_srcSpace, _dstSpace, (curr) =>
    // Consider only direct paths (path length 2 => [spaceA, spaceB])
    // [...(conversionMap.get(curr)?.keys() ?? [])].filter((s) => conversionMap.get(curr)?.get(s)?.path.length === 2)
    [...(conversionMap.get(curr)?.keys() ?? [])]
  );
  if (!path) throw new Error(`No conversion path found from ${_srcSpace.name} to ${_dstSpace.name}`);

  // console.log(path.map((p) => p.name));

  const fnList: Array<ColorSpaceConversion> = [];
  for (let i = 0; i < path.length - 1; i++) {
    fnList.push(getSpaceConversion(path[i], path[i + 1]));
  }
  const newConversion = composeFnList(fnList);

  addSpaceConversion(_srcSpace, _dstSpace, newConversion);

  return getSpaceConversion(_srcSpace, _dstSpace, srcSpaceContext, dstSpaceContext);

  // i === 0 ? srcSpaceContext : {},
  // i === path.length - 2 ? dstSpaceContext : {}

  //   rgbWhiteLuminance: _srcSpace.convertingProps?.rgbWhiteLuminance ?? _dstSpace.convertingProps?.rgbWhiteLuminance,
  //   rgbBlackLuminance: _srcSpace.convertingProps?.rgbBlackLuminance ?? _dstSpace.convertingProps?.rgbBlackLuminance,
  // });

  // Add conversions for every color space along the path towards destination
  // conversionMap.get(_srcSpace)?.set(_dstSpace, { path, fn: conversion });
  // for (let i = 0; i < path.length - 2; i++) {
  //   conversionMap.get(path[i])?.set(_dstSpace, {
  //     path,
  //     fn: composeFnList(fnList.slice(i), {
  //       rgbWhiteLuminance: path[i].convertingProps?.rgbWhiteLuminance ?? _dstSpace.convertingProps?.rgbWhiteLuminance,
  //       rgbBlackLuminance: path[i].convertingProps?.rgbBlackLuminance ?? _dstSpace.convertingProps?.rgbBlackLuminance,
  //     }),
  //   });
  // }
  //console.log(`Added path to map: [${path.map((u) => u.name).join(' → ')}]`);

  //const conversionWithPrecision: ColorSpaceConvertingFunction = (values, props) =>
  //	(conversion as ColorSpaceConvertingFunction)(values, props).map((u) => Number(u.toFixed(precisionMin)));

  // return ((values, props) =>
  //   newConversion(values, { ...srcSpaceContext, ...dstSpaceContext, ...props })) as ColorSpaceConversion;
}

function composeFnList(fnList: ColorSpaceConversion[]): ColorSpaceConversion {
  // return (values, props = {}) => fnList.reduce((a, b) => b(a, Object.assign({ ...defaultProps }, props)), values);
  return (values, { srcSpaceContext, dstSpaceContext, ...props } = {}) =>
    fnList.reduce(
      (a, b, i) =>
        b(
          a,
          i === 0
            ? { srcSpaceContext, ...srcSpaceContext }
            : i === fnList.length - 1
            ? { dstSpaceContext, ...dstSpaceContext }
            : {}
        ),
      values
    );
}

export type ColorSpaceConversion = (values: number[], props?: any) => number[];
