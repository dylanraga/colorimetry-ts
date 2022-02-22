/*======================*/
/* Tone Response Curves */
/*======================*/
import Decimal from './common/decimal.mjs';

type TransferFunctionOptions = {
	Lw?: number;
	Lb?: number;
	gamma?: number;
	Yn?: number;
	[k: string]: any;
}
type TransferFunction = (u: any, options?: TransferFunctionOptions) => any;

class ToneResponse {
	[key: string]: any;
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
		return new ToneResponse((V,o) => this.eotf(V, {...options, ...o}), (L,o) => this.oetf(L, {...options, ...o}));
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
		(V, options: TransferFunctionOptions = {}) => {
			const { Lw=1, Lb=0, gamma=2.2 } = options;
			let f = x => x ** gamma

			//let L = Decimal(Lw).minus(Lb).times(f(V)).plus(Lb);
			let L = (Lw-Lb) * f(V) + Lb;
			return L;
		},
		(L, options: TransferFunctionOptions = {}) => {
			const { Lw=1, Lb=0, gamma=2.2 } = options;
			let f = x => x ** (1/gamma);

			let V = f ( (L-Lb)/(Lw-Lb) );
			return V;
		}
	);

	static BT1886 = new ToneResponse(
		(V, options: TransferFunctionOptions = {}) => {
			const { Lw=1, Lb=0, gamma=2.4 } = options;
			//const a = Decimal(Lw).pow(Decimal(1).div(gamma)).minus(Decimal(Lb).pow(Decimal(1).div(gamma))).pow(gamma);
			const a = (Lw**(1/gamma) - Lb**(1/gamma)) ** gamma;
			//const b = Decimal(Lb).pow(Decimal(1).div(gamma)).div( Decimal(Lw).pow(Decimal(1).div(gamma)).minus(Decimal(Lb).pow(Decimal(1).div(gamma))) );
			const b = (Lb**(1/gamma))/(Lw**(1/gamma)-Lb**(1/gamma));

			//let L = Decimal(a).times(Decimal.max(Decimal(V).plus(b), 0).pow(gamma));
			let L = a * Math.max(V+b, 0)**gamma;
			return L;
		},
		(L, options: TransferFunctionOptions = {}) => {
			const { Lw=1, Lb=0, gamma=2.4 } = options;
			const a = (Lw**(1/gamma) - Lb**(1/gamma)) ** gamma;
			const b = (Lb**(1/gamma))/(Lw**(1/gamma)-Lb**(1/gamma));
			
			//let V = Decimal.max(Decimal(L).div(a).pow(Decimal(1).div(gamma)).minus(b), 0);
			let V = Math.max((L/a)**(1/gamma)-b, 0);
			return V;	
		}
	);

	static HLG = new ToneResponse(
		(V, options: TransferFunctionOptions = {}) => {
			const {
				Lw = 1000, Lb = 0,
				gamma = 1.2 + 0.42*Math.log10(Lw/1000)
				//gamma = Decimal(1.2).plus( Decimal(0.42).times(Decimal.log(Decimal(Lw).div(1000))) )
			} = options;
			const a = 0.17883277;
			const b = 0.28466892;
			//const c = Decimal(0.5).minus(Decimal(a).times(Decimal.ln(Decimal(a).times(4))));
			const c = 0.5 - a*Math.log(4*a);
			//const beta = Decimal.sqrt(Decimal(3).times(Decimal.pow(Decimal(Lb).div(Lw), Decimal(1).div(gamma))));
			const beta = Math.sqrt(3*(Lb/Lw)**(1/gamma));

			//let f = x => (x > 1/2)? Decimal.exp(Decimal(x).minus(c).div(a)).plus(b).div(12) : Decimal.pow(x, 2).div(3);
			let f = x => (x > 1/2)? (Math.exp((x-c)/a)+b)/12 : (x*x)/3;
			//let E = f(Decimal.max(0, Decimal(V).times(Decimal(1).minus(beta)).plus(beta)));
			let E = f(Math.max(0, V*(1-beta)+beta));
			//let L = Decimal(Lw).times(Decimal.pow(E, gamma));
			let L = Lw * E**gamma;

			return L.toPrecision(8);
		},
		(L, options: TransferFunctionOptions = {}) => {
			const {
				Lw = 1000, Lb = 0,
				gamma = 1.2 + 0.42*Math.log10(Lw/1000)
			} = options;
			const a = 0.17883277;
			const b = 0.28466892;
			const c = 0.5 - a*Math.log(4*a);
			const beta = Math.sqrt(3*(Lb/Lw)**(1/gamma));

			//let E = Decimal(L).div(Lw).pow(Decimal(1/gamma));
			let E = (L/Lw) ** (1/gamma);
			//let V = (E > 1/12)? Decimal(a).times( Decimal.ln(Decimal(12).times(E).minus(b)) ).plus(c) : Decimal.sqrt(Decimal(E).times(3));
			let V = (E > 1/12)? a*Math.log(12*E-b)+c : Math.sqrt(E*3);
			//V = Decimal.max(0, Decimal(V).toSignificantDigits(8).minus(beta).div(Decimal(1).minus(beta)) );
			V = Math.max(0, (+V.toPrecision(8)-beta)/(1-beta));

			return V;
		}
	);

	//Extended sRGB, using higher-precision constants
	static SRGB = new ToneResponse(
		(V, options: TransferFunctionOptions = {}) => {
			const { Lw=1, Lb=0 } = options;
			let f = x => (Math.abs(x) < 0.0392857)? x/12.9232102 : Math.sign(x)*((Math.abs(x) + 0.055)/1.055) ** 2.4;
			
			let L = (Lw-Lb)*f(V)+Lb;
			return L;
		},
		(L, options: TransferFunctionOptions = {}) => {
			const { Lw=1, Lb=0 } = options;
			let f = x => (Math.abs(x) < (0.0392857/12.9232102))? x*12.9232102 : Math.sign(x) * ((1.055*Math.abs(x)**(1/2.4)) - 0.055); 

			let V = f( (L-Lb)/(Lw-Lb) )
			return V;
		}
	);

	static ST2084 = new ToneResponse(
		(V, options: TransferFunctionOptions = {}) => {
			const { Lw=10000, Lb=0, m2=78.84375 } = options;
			const m1 = 0.1593017578125;
			const c1 = 0.8359375;
			const c2 = 18.8515625;
			const c3 = 18.6875;
		
			//let L = Decimal(10000).times( Decimal.pow(Decimal.max(Decimal.pow(V, Decimal(1).div(m2)).minus(c1), 0).div(Decimal(c2).minus(Decimal(c3).times(Decimal.pow(V,Decimal(1).div(m2))))), Decimal(1).div(m1) ));
			let L = 10000 * (Math.max(V**(1/m2)-c1, 0)/(c2-c3*V**(1/m2)))**(1/m1)

			return Math.max(Math.min(L, Lw), Lb);
			//return Decimal.max(Decimal.min(L, Lw), Lb).toSignificantDigits(13);
		},
		(L, options: TransferFunctionOptions = {}) => {
			const { Lw=10000, Lb=0, m2=78.84375 } = options;
			const m1 = 0.1593017578125;
			const c1 = 0.8359375;
			const c2 = 18.8515625;
			const c3 = 18.6875;
			
			let V = ((c1+c2*(L/10000)**m1)/(1+c3*(L/10000)**m1))**m2;
			
			return V;
		}
	);

	static LSTAR = new ToneResponse(
		(V, options: TransferFunctionOptions = {}) => {
			const { Lw=1, Lb=0, Yn=100 } = options;
			//let d = Decimal(6).div(29);
			const d = 6/29;
			//let f = x => (x > d)? Decimal(x).pow(3) : Decimal(d).times(3).pow(2).times(Decimal(x).minus(Decimal(4).div(29)));
			let f = x => (x > d)? x*x*x : (d*3)*(d*3)*(x-(4/29));
			//let L = Decimal(Lw).minus(Lb).times(f(Decimal(Yn).times(V).plus(16).div(116))).plus(Lb);
			let L = (Lw-Lb) * f((Yn*V + 16)/116) + Lb;
			return L;
		},
		(L, options: TransferFunctionOptions = {}) => {
			const { Lw=1, Lb=0, Yn=100 } = options;
			//let d = Decimal(6).div(29);
			const d = 6/29;
			//let f = x => (x > d**3)? Decimal(x).pow(Decimal(1).div(3)) : Decimal(x).div(3).times(Decimal(d).pow(2)).plus(Decimal(4).div(29));
			let f = x => (x > d*d*d)? x**(1/3) : (x/3)*(d*d)+(4/29);
			//let V = Decimal(116).times(f(Decimal(L).minus(Lb).div(Decimal(Lw).minus(Lb)))).minus(16).div(Yn);
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