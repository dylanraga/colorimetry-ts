/*===============================*/
/* Standard Tone Response Curves */
/*===============================*/

import { ToneResponse } from "./trc";

const TRC_GAMMA = new ToneResponse<{
	whiteLevel?: number;
	blackLevel?: number;
	gamma?: number;
}>(
	(V, options = {} ) => {
		const { whiteLevel = 1, blackLevel = 0, gamma = 2.2 } = options;
		const f = (x: number) => x ** gamma

		const L = (whiteLevel-blackLevel) * f(V) + blackLevel;
		return L;
	},
	(L, options = {}) => {
		const { whiteLevel = 1, blackLevel = 0, gamma = 2.2 } = options;
		const f = (x: number) => x ** (1/gamma);

		const V = f ( (L-blackLevel)/(whiteLevel-blackLevel) );
		return V;
	}
);

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
		const c = 0.5 - a*Math.log(4*a);
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
		const c = 0.5 - a*Math.log(4*a);
		const beta = Math.sqrt(3*(blackLevel/whiteLevel)**(1/gamma));

		const E = (L/whiteLevel) ** (1/gamma);
		let V = (E > 1/12)? a*Math.log(12*E-b)+c : Math.sqrt(E*3);
		V = Math.max(0, (+V.toPrecision(8)-beta)/(1-beta));

		return V;
	}
);

//Extended sRGB, using higher-precision constants
//https://entropymine.com/imageworsener/srgbformula/
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

/**
 * ST.2084 HDR absolute transfer function
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


const TRC_LSTAR = new ToneResponse<{
	whiteLevel?: number;
	blackLevel?: number;
}>(
	(V, options = {}) => {
		const { whiteLevel = 100, blackLevel = 0 } = options;
		const d = 6/29;
		const f = (x: number) => (x > d)? x*x*x : 3*(d*d)*(x-(4/29));
		const L = (whiteLevel-blackLevel) * f((100*V + 16)/116) + blackLevel;
		return L;
	},
	(L, options = {}) => {
		const { whiteLevel = 100, blackLevel = 0 } = options;
		const d = 6/29;
		const f = (x: number) => (x > d*d*d)? x**(1/3) : x/(3*d*d) + (4/29);
		const V = (116 * f((L-blackLevel)/(whiteLevel-blackLevel)) - 16) / 100;
		return V;
	}
);

export const curves = {
	"GAMMA": TRC_GAMMA,
	"SRGB": TRC_SRGB,
	"BT1886": TRC_BT1886,
	"ST2084": TRC_ST2084,
	"HLG": TRC_HLG,
	"LSTAR": TRC_LSTAR,
	/**
	 * Aliases
	 */
	"PQ": TRC_ST2084,
	"L*": TRC_LSTAR,
	"G2.2": TRC_GAMMA.options({ gamma: 2.2 }),
	"G2.4": TRC_GAMMA.options({ gamma: 2.4 }),
	"G2.6": TRC_GAMMA.options({ gamma: 2.6 })
};