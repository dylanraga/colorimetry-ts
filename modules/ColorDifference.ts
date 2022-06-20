/*==========================*/
/* Color Difference methods */
/*==========================*/
import Color from "./Color.js";

export interface dEOptions {
	dEMethod: DEMethod;
	excludeLuminance: boolean;
	[k: string]: any
}

type DEMethod = (colorA: Color, colorB: Color, options: Partial<dEOptions>) => number;



export const dEITP: DEMethod = (colorA, colorB, options = {}) => {
	const [I1, T1, P1]: number[] = colorA.get('ITP');
	const [I2, T2, P2]: number[] = colorB.get('ITP');
	
	let dEITP = 720 * Math.sqrt( (!options.excludeLuminance? (I1-I2)**2 : 0) + (T1-T2)**2 + (P1-P2)**2 );
	return dEITP;
};

export const dEuv: DEMethod = (colorA, colorB, options = {}) => {
	const [u1, v1]: number[] = colorA.get('uv');
	const [u2, v2]: number[] = colorB.get('uv');

	let dEuv: number = Math.sqrt( (u1-u2)**2 + (v1-v2)**2 );
	return dEuv;
};

export const dExy: DEMethod = (colorA, colorB, options = {}) => {
	const [x1, y1]: number[] = colorA.get('xy');
	const [x2, y2]: number[] = colorB.get('xy');

	let dEuv: number = Math.sqrt( (x1-x2)**2 + (y1-y2)**2 );
	return dEuv;
};

export const dE2000: DEMethod = (colorA, colorB, options = {}) => {
	const { kL = 1, kC = 1, kH = 1 } = options;
	const [L1, a1, b1]: number[] = colorA.get('Lab');
	const [L2, a2, b2]: number[] = colorB.get('Lab');

	let C1: number = Math.sqrt(a1*a1 + b1*b1);
	let C2: number = Math.sqrt(a2*a2 + b2*b2);

	let dLp: number = L2 - L1;
	let Lb: number = (L1 + L2) / 2;
	let Cb: number = (C1 + C2) / 2;
	let Cbk: number = Math.sqrt((Cb**7)/((Cb**7)+(6103515625)));
	let a1p: number = a1 + (a1/2)*(1-Cbk);
	let a2p: number = a2 + (a2/2)*(1-Cbk);
	let C1p: number = Math.sqrt(a1p*a1p + b1*b1);
	let C2p: number = Math.sqrt(a2p*a2p + b2*b2);
	let Cbp: number = (C1p + C2p) / 2;
	let dCp: number = C2p - C1p;
	let h1p: number = (Math.atan2(b1, a1p) * (180/Math.PI)) % 360;
	let h2p: number = (Math.atan2(b2, a2p) * (180/Math.PI)) % 360;
	let dhp: number = Math.abs(h1p-h2p)<=180? h2p-h1p : h2p<=h1p? h2p-h1p+360 : h2p-h1p-360;
	let dHp: number = 2*Math.sqrt(C1p*C2p)*Math.sin((dhp/2)*(Math.PI/180));
	let Hbp: number = Math.abs(h1p-h2p)<=180? (h1p+h2p)/2 : h1p+h2p<360? (h1p+h2p+360)/2 : (h1p+h2p-360)/2;
	let T: number = 1-0.17*Math.cos(Hbp-30)+0.24*Math.cos(2*Hbp)+0.32*Math.cos(3*Hbp+6)-0.20*Math.cos(4*Hbp-63);
	let SL: number = 1+((0.015*(Lb-50)**2)/Math.sqrt(20+(Lb-50)**2));
	let SC: number = 1+0.045*Cbp;
	let SH: number = 1+0.015*Cbp*T;
	let RT: number = -2*Cbk*Math.sin(60*(Math.PI/180)*Math.exp(-(((Hbp-275)/25)**2)))*(180/Math.PI);

	let dE2000: number = Math.sqrt( (!options.excludeLuminance? (dLp/(kL*SL))**2 : 0) + (dCp/(kC*SC))**2 + (dHp/(kH*SH))**2 + RT*(dCp/(kC*SC))*(dHp/(kH*SH)) );
	return dE2000;
};