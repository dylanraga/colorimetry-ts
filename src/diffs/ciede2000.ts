import { ColorDifferenceMethod } from "../diff.js";
import { spaces } from "../space.js";

export const cie2000: ColorDifferenceMethod<{
  kL?: number;
  kC?: number;
  kH?: number;
  excludeLuminance?: boolean;
}> = (colorA, colorB, props = {}) => {
  const { kL = 1, kC = 1, kH = 1, excludeLuminance = false } = props;
  const [L1, a1, b1] = colorA.toSpace(spaces.lab).values;
  const [L2, a2, b2] = colorB.toSpace(spaces.lab).values;
  const r2d = 180 / Math.PI;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);

  const dLp = L2 - L1;
  const Lb = (L1 + L2) / 2;
  const Cb = (C1 + C2) / 2;
  const Cbk = Math.sqrt(Cb ** 7 / (Cb ** 7 + 6103515625));
  const a1p = a1 + (a1 / 2) * (1 - Cbk);
  const a2p = a2 + (a2 / 2) * (1 - Cbk);
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const Cbp = (C1p + C2p) / 2;
  const dCp = C2p - C1p;
  const h1p = (Math.atan2(b1, a1p) * r2d) % 360;
  const h2p = (Math.atan2(b2, a2p) * r2d) % 360;
  const dhp = Math.abs(h1p - h2p) <= 180 ? h2p - h1p : h2p <= h1p ? h2p - h1p + 360 : h2p - h1p - 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * r2d);
  const Hbp =
    Math.abs(h1p - h2p) <= 180 ? (h1p + h2p) / 2 : h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
  const T =
    1 -
    0.17 * Math.cos(Hbp - 30) +
    0.24 * Math.cos(2 * Hbp) +
    0.32 * Math.cos(3 * Hbp + 6) -
    0.2 * Math.cos(4 * Hbp - 63);
  const SL = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2);
  const SC = 1 + 0.045 * Cbp;
  const SH = 1 + 0.015 * Cbp * T;
  const RT = -2 * Cbk * Math.sin(60 * r2d * Math.exp(-(((Hbp - 275) / 25) ** 2))) * (180 / Math.PI);

  const dL = dLp / (kL * SL);
  const dC = dCp / (kC * SC);
  const dH = dHp / (kH * SH);
  const dE2000 = Math.sqrt((!excludeLuminance ? dL * dL : 0) + dC * dC + dH * dH + RT * dC * dH);
  return dE2000;
};
