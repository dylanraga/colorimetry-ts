/*======================*/
/* Tone Response Curves */
/*======================*/

type TransferFunctionOptions = {
	Lw?: number;
	Lb?: number;
	gamma?: number;
	Yn?: number;
}
type TransferFunction = (u: number, options?: TransferFunctionOptions) => number;

class ToneResponse {
	eotf: TransferFunction;
	oetf: TransferFunction;
	name?: string;

	constructor(eotf: TransferFunction, oetf: TransferFunction) {
		this.eotf = eotf;
		this.oetf = oetf;
	}

	/*
	 *	Member methods
	 */

	 options(options: TransferFunctionOptions): ToneResponse {
		return new ToneResponse(V => this.eotf(V, options), L => this.oetf(L, options));
	}
	/*
	 *	Pre-defined Standard Transfer Functions
	 */

	static names = [
		'GAMMA',
		'SRGB',
		'BT1886',
		'ST2084',
		'HLG',
		'LSTAR'
	];

	static GAMMA = new ToneResponse(
		(V, { Lw=1, Lb=0, gamma=2.2 }={}) => {
			let f = x => Math.pow(x, gamma);

			let L = (Lw-Lb) * f(V) + Lb;
			return L;
		},
		(L, { Lw=1, Lb=0, gamma=2.2 }={}) => {
			let f = x => Math.pow(x, 1/gamma)

			let V = f((L-Lb)/(Lw-Lb));
			return V;
		}
	);

	static BT1886 = new ToneResponse(
		(V, { Lw=1, Lb=0, gamma=2.4 }={}) => {
			const a = Math.pow( Math.pow(Lw, 1/gamma)-Math.pow(Lb, 1/gamma), gamma);
			const b = Math.pow(Lb, 1/gamma) / (Math.pow(Lw, 1/gamma)-Math.pow(Lb, 1/gamma));
			
			let L = a*Math.pow(Math.max(V+b, 0), gamma);
			return L;
		},
		(L, { Lw=1, Lb=0, gamma=2.4 }={}) => {
			const a = Math.pow( Math.pow(Lw, 1/gamma)-Math.pow(Lb, 1/gamma), gamma);
			const b = Math.pow(Lb, 1/gamma) / (Math.pow(Lw, 1/gamma)-Math.pow(Lb, 1/gamma));
			
			let V = Math.max(Math.pow(L/a, 1/gamma)-b, 0);
			return V;	
		}
	);

	static HLG = new ToneResponse(
		(V, { Lw=1000, Lb=0, gamma=1.2 }={}) => {
			const a = 0.17883277;
			const b = 0.28466892;
			const c = 0.55991073;
			const alpha = (Lw-Lb) / Math.pow(12, gamma);

			let E = (V > 1/2)? Math.exp((V-c)/a)+b : 4*Math.pow(V, 2);

			let L = alpha * Math.pow(E, gamma) + Lb;

			//round to the precision of our constants
			return parseFloat(L.toPrecision(8));
		},
		(L, { Lw=1000, Lb=0, gamma=1.2 }={}) => {
			const a = 0.17883277;
			const b = 0.28466892;
			const c = 0.55991073;
			const alpha = (Lw-Lb) / Math.pow(12, gamma);

			let E = Math.pow((L - Lb) / alpha, 1/gamma);

			let V = (E > 1)? a*Math.log(E-b)+c : Math.sqrt(E)/2;
			
			//round to the precision of our constants
			return parseFloat(V.toPrecision(8));
		}
	);

	//Extended sRGB, using higher-precision constants
	static SRGB = new ToneResponse(
		(V, { Lw=1, Lb=0 }={}) => {
			let f = x => (Math.abs(x) < 0.0392857)? x/12.9232102 : Math.sign(x)*Math.pow( (Math.abs(x)+0.055)/1.055 , 2.4);
			
			let L = (Lw-Lb) * f(V) + Lb;
			return parseFloat(L.toPrecision(6));
		},
		(L, { Lw=1, Lb=0 }={}) => {
			let f = x => (Math.abs(x) < (0.0392857/12.9232102))? x*12.9232102 : Math.sign(x)*1.055*Math.pow(Math.abs(x), 1/2.4)-0.055;

			let V = f((L-Lb)/(Lw-Lb));
			return parseFloat(V.toPrecision(6));
		}
	);

	static ST2084 = new ToneResponse(
		(V, { Lw=10000, Lb=0 }={}) => {
			const m1 = (2610/4096) / 4;
			const m2 = (2523/4096) * 128;
			const c1 = (3424/4096);
			const c2 = (2413/4096) * 32;
			const c3 = (2392/4096) * 32;
		
			let L = 10000 * Math.pow( Math.max(Math.pow(V,1/m2) - c1,0) / (c2 - c3 * Math.pow(V,1/m2)), 1/m1);
			
			return Math.max(Math.min(L, Lw), Lb);
		},
		L => {
			const m1 = (2610/4096) / 4;
			const m2 = (2523/4096) * 128;
			const c1 = (3424/4096);
			const c2 = (2413/4096) * 32;
			const c3 = (2392/4096) * 32;
		
			let V = Math.pow( (c1 + c2*Math.pow(L/10000,m1)) / (1 + c3 * Math.pow(L/10000,m1)) , m2);
			
			return V;
		}
	);

	static LSTAR = new ToneResponse(
		(V, { Lw=1, Lb=0, Yn=100 }={}) => {
			let d = 6/29
			let f = x => (x > d)? x**3 : 3*d**2*(x-4/29);
			let L = (Lw-Lb) * f((Yn*V+16)/116) + Lb;
			return L;
		},
		(L, { Lw=1, Lb=0, Yn=100 }={}) => {
			let d = 6/29
			let f = x => (x > d**3)? x**(1/3) : x/(3*(d**2))+(4/29);
			let V = (116 * f((L-Lb)/(Lw-Lb)) - 16) / Yn;
			return V;
		}
	);


	/*
	 *	Aliases
	 */

	static PQ = ToneResponse.ST2084;
	
	static {
		//Set the names of each standard
		for (let k of this.names) {
			this[k].name = k;
		}
	}
}

export default ToneResponse;
export { TransferFunction, TransferFunctionOptions };