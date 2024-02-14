export type { ColorDifferenceMethod } from "../diff.js";

import { cie2000 } from "./cie2000.js";
import { uv } from "./cieuv.js";
import { itp, itp_c, itp_h } from "./deitp.js";

export const diffs = { cie2000, uv, itp, itp_c, itp_h };
