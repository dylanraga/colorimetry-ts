import { ColorDifferenceMethod } from "../diff.js";
import { uv as uvSpace } from "../spaces/uv.js";

// DE_UPVP = 0.0040 correlates to a JND
export const uv: ColorDifferenceMethod = (colorA, colorB) => {
  const [u1, v1] = colorA.toSpace(uvSpace).values;
  const [u2, v2] = colorB.toSpace(uvSpace).values;

  const du = u1 - u2;
  const dv = v1 - v2;

  return Math.sqrt(du * du + dv * dv);
};
