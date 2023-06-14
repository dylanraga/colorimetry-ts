import * as _gamuts from "./gamuts/index.js";
import { xy } from "./spaces/xy.js";

export interface ColorGamutPrimaries {
  readonly id?: string;
  readonly name?: string;
  readonly alias?: string[];
  readonly white: xy;
  readonly red: xy;
  readonly green: xy;
  readonly blue: xy;
  readonly black?: xy;
}

export type ColorGamutName = keyof typeof _gamuts;
export const gamuts = _gamuts as typeof _gamuts & Record<string, ColorGamutPrimaries>;
