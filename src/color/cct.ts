/**
 * Correlated Color Temperature module
 */

import { uvToCct } from "../cct.js";
import { Color } from "../color.js";
import { uv76 } from "../spaces/uv.js";

/**
 * Calculates the Correlated Color Temperature of a Color in Kelvin
 * @param color Color to find CCT of
 */
function getCCT(color: Color) {
  const [up, vp] = color.toSpace(uv76).values.slice(1, 3);

  return uvToCct([up, (2 * vp) / 3]);
}

function _getCCT(this: Color) {
  return getCCT(this);
}

declare module "../color" {
  interface Color {
    readonly cct: ReturnType<typeof _getCCT>;
  }
}

Object.defineProperty(Color.prototype, "cct", { get: _getCCT });
