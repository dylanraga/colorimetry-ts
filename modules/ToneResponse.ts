/*======================*/
/* Tone Response Curves */
/*======================*/
import Decimal from './decimal.mjs';

type TransferFunctionOptions = {
	Lw?: number;
	Lb?: number;
	gamma?: number;
	Yn?: number;
}
type TransferFunction = (u: any, options?: TransferFunctionOptions) => any;

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
			let f = x => Decimal(x).pow(gamma);

			let L = Decimal(Lw).minus(Lb).times(f(V)).plus(Lb);
			return L;
		},
		(L, { Lw=1, Lb=0, gamma=2.2 }={}) => {
			let f = x => Decimal(x).pow(Decimal(1).div(gamma));

			let V = f( Decimal(L).minus(Lb).div(Decimal(Lw).minus(Lb)) );
			return V;
		}
	);

	static BT1886 = new ToneResponse(
		(V, { Lw=1, Lb=0, gamma=2.4 }={}) => {
			const a = Decimal(Lw).pow(Decimal(1).div(gamma)).minus(Decimal(Lb).pow(Decimal(1).div(gamma))).pow(gamma);
			const b = Decimal(Lb).pow(Decimal(1).div(gamma)).div( Decimal(Lw).pow(Decimal(1).div(gamma)).minus(Decimal(Lb).pow(Decimal(1).div(gamma))) );
			
			let L = Decimal(a).times(Decimal.max(Decimal(V).plus(b), 0).pow(gamma));
			return L;
		},
		(L, { Lw=1, Lb=0, gamma=2.4 }={}) => {
			const a = Decimal(Lw).pow(Decimal(1).div(gamma)).minus(Decimal(Lb).pow(Decimal(1).div(gamma))).pow(gamma);
			const b = Decimal(Lb).pow(Decimal(1).div(gamma)).div( Decimal(Lw).pow(Decimal(1).div(gamma)).minus(Decimal(Lb).pow(Decimal(1).div(gamma))) );
			
			let V = Decimal.max(Decimal(L).div(a).pow(Decimal(1).div(gamma)).minus(b), 0);
			return V;	
		}
	);

	static HLG = new ToneResponse(
		(V, options: TransferFunctionOptions = {}) => {
			const {
				Lw = 1000, Lb = 0,
				gamma = Decimal(1.2).plus( Decimal(0.42).times(Decimal.log(Decimal(Lw).div(1000))) )
			} = options;
			const a = 0.17883277;
			const b = 0.28466892;
			const c = Decimal(0.5).minus(Decimal(a).times(Decimal.ln(Decimal(a).times(4))));
			const beta = Decimal.sqrt(Decimal(3).times(Decimal.pow(Decimal(Lb).div(Lw), Decimal(1).div(gamma))));
			
			let f = x => (x > 1/2)? Decimal.exp(Decimal(x).minus(c).div(a)).plus(b).div(12) : Decimal.pow(x, 2).div(3);
			let E = f(Decimal.max(0, Decimal(V).times(Decimal(1).minus(beta)).plus(beta)));
			let L = Decimal(Lw).times(Decimal.pow(E, gamma));
		
			return L.toSignificantDigits(8);
		},
		(L, options: TransferFunctionOptions = {}) => {
			const {
				Lw = 1000, Lb = 0,
				gamma = Decimal(1.2).plus( Decimal(0.42).times(Decimal.log(Decimal(Lw).div(1000))) )
			} = options;
			const a = 0.17883277;
			const b = 0.28466892;
			const c = Decimal(0.5).minus(Decimal(a).times(Decimal.ln(Decimal(a).times(4))));
			const beta = Decimal.sqrt(Decimal(3).times(Decimal.pow(Decimal(Lb).div(Lw), Decimal(1).div(gamma))));

			let E = Decimal(L).div(Lw).pow(Decimal(1/gamma));
			let V = (E > 1/12)? Decimal(a).times( Decimal.ln(Decimal(12).times(E).minus(b)) ).plus(c) : Decimal.sqrt(Decimal(E).times(3));
			V = Decimal.max(0, Decimal(V).toSignificantDigits(8).minus(beta).div(Decimal(1).minus(beta)) );

			return V;
		}
	);

	//Extended sRGB, using higher-precision constants
	static SRGB = new ToneResponse(
		(V, { Lw=1, Lb=0 }={}) => {
			let f = x => (Math.abs(x) < 0.0392857)? Decimal(x).div(12.9232102) : Decimal.abs(x).plus(0.055).div(1.055).pow(2.4).times(Math.sign(x));
			
			let L = Decimal(Lw).minus(Lb).times(f(V)).plus(Lb);
			return L;
		},
		(L, { Lw=1, Lb=0 }={}) => {
			let f = x => (Math.abs(x) < (0.0392857/12.9232102))? Decimal(x).times(12.9232102) : Decimal(1.055).times(Decimal.abs(x).pow(Decimal(1).div(2.4))).minus(0.055).times(Math.sign(x)); 

			let V = f( Decimal(L).minus(Lb).div(Decimal(Lw).minus(Lb)));
			return V;
		}
	);

	static ST2084 = new ToneResponse(
		(V, { Lw=10000, Lb=0 }={}) => {
			const m1 = 0.1593017578125;
			const m2 = 78.84375;
			const c1 = 0.8359375;
			const c2 = 18.8515625
			const c3 = 18.6875;
		
			let L = Decimal(10000).times( Decimal.pow(Decimal.max(Decimal.pow(V, Decimal(1).div(m2)).minus(c1), 0).div(Decimal(c2).minus(Decimal(c3).times(Decimal.pow(V,Decimal(1).div(m2))))), Decimal(1).div(m1) ));
			//let L = 10000 * Math.pow( Math.max(Math.pow(V,1/m2) - c1,0) / (c2 - c3 * Math.pow(V,1/m2)), 1/m1);

			return Decimal.max(Decimal.min(L, Lw), Lb).toSignificantDigits(13);
		},
		L => {
			const m1 = 0.1593017578125;
			const m2 = 78.84375;
			const c1 = 0.8359375;
			const c2 = 18.8515625
			const c3 = 18.6875;
			
			L = Decimal(L).toSignificantDigits(13);
			let V = Decimal.pow( Decimal(c1).plus(Decimal(c2).times(Decimal.pow(Decimal(L/10000), m1))).div(Decimal(1).plus(Decimal(c3).times(Decimal.pow(Decimal(L/10000), m1)))), m2);
			//let V = Decimal.pow( (c1 + c2*Math.pow(L/10000,m1)) / (1 + c3 * Math.pow(L/10000,m1)) , m2);
			
			return V;
		}
	);

	static LSTAR = new ToneResponse(
		(V, { Lw=1, Lb=0, Yn=100 }={}) => {
			let d = Decimal(6).div(29);
			let f = x => (x > d)? Decimal(x).pow(3) : Decimal(d).times(3).pow(2).times(Decimal(x).minus(Decimal(4).div(29)));
			let L = Decimal(Lw).minus(Lb).times(f(Decimal(Yn).times(V).plus(16).div(116))).plus(Lb);
			return L;
		},
		(L, { Lw=1, Lb=0, Yn=100 }={}) => {
			let d = Decimal(6).div(29);
			let f = x => (x > d**3)? Decimal(x).pow(Decimal(1).div(3)) : Decimal(x).div(3).times(Decimal(d).pow(2)).plus(Decimal(4).div(20));
			let V = Decimal(116).times(f(Decimal(L).minus(Lb).div(Decimal(Lw).minus(Lb)))).minus(16).div(Yn);
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