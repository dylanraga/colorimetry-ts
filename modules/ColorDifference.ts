/*==========================*/
/* Color Difference methods */
/*==========================*/
import { Color } from "./Color";
import { LABSPACE_CIELAB } from "./ColorSpace/Lab/CIELab";
import { LABSPACE_ITP } from "./ColorSpace/Lab/ICtCp";

export type DEMethod<Options = {}> = (colorA: Color, colorB: Color, options: Options) => number;

export const DE_ITP: DEMethod<{
	excludeLuminance?: boolean;
	scalar?: 240 | 720 | 1440;
}> = (colorA, colorB, options = {}) => {
	const { scalar = 720, excludeLuminance = false } = options;
	const [I1, T1, P1]: number[] = colorA.get(LABSPACE_ITP);
	const [I2, T2, P2]: number[] = colorB.get(LABSPACE_ITP);
	
	const dEITP = scalar * Math.sqrt( (!excludeLuminance? (I1-I2)*(I1-I2) : 0) + (T1-T2)*(T1-T2) + (P1-P2)*(P1-P2) );
	return dEITP;
}

export const DE_UV: DEMethod = (colorA, colorB, options = {}) => {
	const [u1, v1]: number[] = colorA.get('uv');
	const [u2, v2]: number[] = colorB.get('uv');

	const dEuv: number = Math.sqrt( (u1-u2)*(u1-u2) + (v1-v2)*(v1-v2) );
	return dEuv;
};

export const DE_XY: DEMethod = (colorA, colorB, options = {}) => {
	const [x1, y1]: number[] = colorA.get('xy');
	const [x2, y2]: number[] = colorB.get('xy');

	const dEuv: number = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
	return dEuv;
};

export const DE_CIE2000: DEMethod<{
	kL?: number;
	kC?: number;
	kH?: number;
	excludeLuminance?: boolean;
}> = (colorA, colorB, options = {}) => {
	const { kL = 1, kC = 1, kH = 1, excludeLuminance = false } = options;
	const [L1, a1, b1] = colorA.get(LABSPACE_CIELAB);
	const [L2, a2, b2] = colorB.get(LABSPACE_CIELAB);
	const r2d = 180/Math.PI;

	const C1 = Math.sqrt(a1*a1 + b1*b1);
	const C2 = Math.sqrt(a2*a2 + b2*b2);

	const dLp = L2 - L1;
	const Lb = (L1 + L2) / 2;
	const Cb = (C1 + C2) / 2;
	const Cbk = Math.sqrt((Cb**7)/((Cb**7)+(6103515625)));
	const a1p = a1 + (a1/2)*(1-Cbk);
	const a2p = a2 + (a2/2)*(1-Cbk);
	const C1p = Math.sqrt(a1p*a1p + b1*b1);
	const C2p = Math.sqrt(a2p*a2p + b2*b2);
	const Cbp = (C1p + C2p) / 2;
	const dCp = C2p - C1p;
	const h1p = (Math.atan2(b1, a1p) * r2d) % 360;
	const h2p = (Math.atan2(b2, a2p) * r2d) % 360;
	const dhp = Math.abs(h1p-h2p)<=180? h2p-h1p : h2p<=h1p? h2p-h1p+360 : h2p-h1p-360;
	const dHp = 2*Math.sqrt(C1p*C2p)*Math.sin((dhp/2)*r2d);
	const Hbp = Math.abs(h1p-h2p)<=180? (h1p+h2p)/2 : h1p+h2p<360? (h1p+h2p+360)/2 : (h1p+h2p-360)/2;
	const T = 1-0.17*Math.cos(Hbp-30)+0.24*Math.cos(2*Hbp)+0.32*Math.cos(3*Hbp+6)-0.20*Math.cos(4*Hbp-63);
	const SL = 1+((0.015*(Lb-50)**2)/Math.sqrt(20+(Lb-50)**2));
	const SC = 1+0.045*Cbp;
	const SH = 1+0.015*Cbp*T;
	const RT = -2*Cbk*Math.sin(60*r2d*Math.exp(-(((Hbp-275)/25)**2)))*(180/Math.PI);

	const dE2000 = Math.sqrt( (!excludeLuminance? (dLp/(kL*SL))**2 : 0) + (dCp/(kC*SC))**2 + (dHp/(kH*SH))**2 + RT*(dCp/(kC*SC))*(dHp/(kH*SH)) );
	return dE2000;
};