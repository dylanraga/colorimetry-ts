/*===============================*/
/* Standard Tone Response Curves */
/*===============================*/

import { ToneResponse, curves } from "./trc";

/**
 * Simple gamma power function
 */
const TRC_GAMMA = new ToneResponse<{
	whiteLevel?: number;
	blackLevel?: number;
	gamma?: number;
}>(
	(V, options = {} ) => {
		const { whiteLevel = 1, blackLevel = 0, gamma = 2.2 } = options;
		const f = (x: number) => x > 0 ? x ** gamma : -((-x) ** gamma);

		const L = (whiteLevel-blackLevel) * f(V) + blackLevel;
		return L;
	},
	(L, options = {}) => {
		const { whiteLevel = 1, blackLevel = 0, gamma = 2.2 } = options;
		const f = (x: number) => x > 0 ? x ** (1/gamma) : -((-x) ** (1/gamma));

		const V = f ( (L-blackLevel)/(whiteLevel-blackLevel) );
		return V;
	}
);
TRC_GAMMA.register('GAMMA');
TRC_GAMMA.options({ gamma: 1.8 }).register('G18');
TRC_GAMMA.options({ gamma: 2.2 }).register('G22');
TRC_GAMMA.options({ gamma: 2.4 }).register('G24');
TRC_GAMMA.options({ gamma: 2.6 }).register('G26');

declare module './trc' {
	interface ToneResponseNamedMap {
		GAMMA: typeof TRC_GAMMA;
		G18: typeof TRC_GAMMA;
		G22: typeof TRC_GAMMA;
		G24: typeof TRC_GAMMA;
		G26: typeof TRC_GAMMA;
	}
}


/**
 * ITU-R BT.1886
 */
const TRC_BT1886 = new ToneResponse<{
	whiteLevel?: number;
	blackLevel?: number;
	gamma?: number
}>(
	(V, options = {}) => {
		const { whiteLevel = 1, blackLevel = 0, gamma = 2.4 } = options;
		const a = (whiteLevel**(1/gamma) - blackLevel**(1/gamma)) ** gamma;
		const b = (blackLevel**(1/gamma))/(whiteLevel**(1/gamma)-blackLevel**(1/gamma));

		const L = a * Math.max(V+b, 0)**gamma;
		return L;
	},
	(L, options = {}) => {
		const { whiteLevel = 1, blackLevel = 0, gamma = 2.4 } = options;
		const a = (whiteLevel**(1/gamma) - blackLevel**(1/gamma)) ** gamma;
		const b = (blackLevel**(1/gamma))/(whiteLevel**(1/gamma)-blackLevel**(1/gamma));
		
		const V = Math.max((L/a)**(1/gamma)-b, 0);
		return V;	
	}
);
TRC_BT1886.register('BT1886');

declare module './trc' {
	interface ToneResponseNamedMap {
		BT1886: typeof TRC_BT1886;
	}
}


/**
 * Hybrid-Log Gamma / Rec.2100 / ARIB STD-B67
 */
const TRC_HLG = new ToneResponse<{
	whiteLevel?: number;
	blackLevel?: number;
	gamma?: number;
}>(
	(V, options = {}) => {
		const {
			whiteLevel = 1000, blackLevel = 0,
			gamma = 1.2 + 0.42*Math.log10(whiteLevel/1000)
		} = options;
		const a = 0.17883277;
		const b = 0.28466892;
		const c = 0.55991073;
		const beta = Math.sqrt(3*(blackLevel/whiteLevel)**(1/gamma));

		const f = (x: number) => (x > 1/2)? (Math.exp((x-c)/a)+b)/12 : (x*x)/3;
		const E = f(Math.max(0, V*(1-beta)+beta));
		const L = whiteLevel * E**gamma;

		return Number(L.toPrecision(8));
	},
	(L, options = {}) => {
		const {
			whiteLevel = 1000, blackLevel = 0,
			gamma = 1.2 + 0.42*Math.log10(whiteLevel/1000)
		} = options;
		const a = 0.17883277;
		const b = 0.28466892;
		const c = 0.55991073;
		const beta = Math.sqrt(3*(blackLevel/whiteLevel)**(1/gamma));

		const E = (L/whiteLevel) ** (1/gamma);
		let V = (E > 1/12)? a*Math.log(12*E-b)+c : Math.sqrt(E*3);
		V = Math.max(0, (+V.toPrecision(8)-beta)/(1-beta));

		return V;
	}
);
TRC_HLG.register('HLG');

declare module './trc' {
	interface ToneResponseNamedMap {
		HLG: typeof TRC_HLG;
	}
}

/**
 * Extended sRGB, using higher-precision constants
 * https://entropymine.com/imageworsener/srgbformula/
 */
const TRC_SRGB = new ToneResponse<{
	whiteLevel?: number;
	blackLevel?: number
}>(
	(V, options = {}) => {
		const { whiteLevel = 1, blackLevel = 0 } = options;
		let f = (x: number) => (Math.abs(x) <= 0.0404482362771082)? x/12.92 : Math.sign(x)*((Math.abs(x) + 0.055)/1.055) ** 2.4;
		
		const L = (whiteLevel-blackLevel)*f(V)+blackLevel;
		return L;
	},
	(L, options = {}) => {
		const { whiteLevel = 1, blackLevel = 0 } = options;
		let f = (x: number) => (Math.abs(x) <= 0.00313066844250063)? x*12.92 : Math.sign(x) * ((1.055*Math.abs(x)**(1/2.4)) - 0.055); 

		const V = f( (L-blackLevel)/(whiteLevel-blackLevel) )
		return V;
	}
);
TRC_SRGB.register('SRGB');

declare module './trc' {
	interface ToneResponseNamedMap {
		SRGB: typeof TRC_SRGB;
	}
}

/**
 * ST.2084 HDR / Rec.2100
 * TODO: Add tonemap knee w.r.t whiteLevel & blackLevel
 */
const TRC_ST2084 = new ToneResponse<{
	whiteLevel?: number
	blackLevel?: number;
	m2?: number;
	Yn?: number;
}>(
	(V, options = {}) => {
		const { whiteLevel=10000, blackLevel=0, m2=78.84375, Yn=10000 } = options;
		const m1 = 0.1593017578125;
		const c1 = 0.8359375;
		const c2 = 18.8515625;
		const c3 = 18.6875;
	
		const L = Yn * (Math.max(V**(1/m2)-c1, 0)/(c2-c3*V**(1/m2)))**(1/m1)

		return Math.max(Math.min(L, Yn), blackLevel);
	},
	(L, options = {}) => {
		const { whiteLevel=10000, blackLevel=0, m2=78.84375, Yn=10000 } = options;
		const m1 = 0.1593017578125;
		const c1 = 0.8359375;
		const c2 = 18.8515625;
		const c3 = 18.6875;
		
		const V = ((c1+c2*(L/Yn)**m1)/(1+c3*(L/Yn)**m1))**m2;
		
		return V;
	}
);
TRC_ST2084.register(['ST2084', 'PQ']);

declare module './trc' {
	interface ToneResponseNamedMap {
		ST2084: typeof TRC_ST2084;
		PQ: typeof TRC_ST2084;
	}
}

/**
 * CIELab L*
 * http://www.brucelindbloom.com/index.html?Eqn_Luv_to_XYZ.html
 */
const TRC_LSTAR = new ToneResponse<{
	whiteLevel?: number;
	blackLevel?: number;
}>(
	(V, options = {}) => {
		const { whiteLevel = 100, blackLevel = 0 } = options;
		const κ = 24389/27;
		const f = (x: number) => (x > 6/29)? ((x+16)/116)**3 : x/κ;
		const L = (whiteLevel-blackLevel) * f(V) + blackLevel;
		return L;
	},
	(L, options = {}) => {
		const { whiteLevel = 100, blackLevel = 0 } = options;
		const ϵ = 216/24389;
		const κ = 24389/27;
		const f = (x: number) => (x > ϵ)? 116*(x**(1/3))-16 : κ*x;
		const V = f((L-blackLevel)/(whiteLevel-blackLevel));
		return V;
	}
);
TRC_LSTAR.register(['LSTAR', 'L*'])

declare module './trc' {
	interface ToneResponseNamedMap {
		LSTAR: typeof TRC_LSTAR;
		'L*': typeof TRC_LSTAR;
	}
}