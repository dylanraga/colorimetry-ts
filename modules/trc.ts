/*===========================*/
/* Tone Response Curve Class */
/*===========================*/

class ToneResponse<Options = ToneResponseDefaultOptions> {
	public static named: { [k: string]: ToneResponse<any> } = {};

	constructor(
		public eotf: TransferFunction<Options>,
		public invEotf: TransferFunction<Options>
	) { }

	/*
	 *	Member methods
	 */

	public options(newOptions: Options): ToneResponse<Options> {
		return new ToneResponse((V,o) => this.eotf(V, {...newOptions, ...o}), (L,o) => this.invEotf(L, {...newOptions, ...o}));
	}

	public register(nameList: string[]): void;
	public register(name: string): void;
	public register(arg1: string | string[]): void {
		const strings = typeof arg1 === 'string'? [arg1] : arg1;
		
		for (const name of strings) {
			ToneResponse.named[name] = this;
		}
	}

}


type TransferFunction<Options> = (u: number, options?: Options) => number;
interface ToneResponseDefaultOptions { whiteLevel?: number, blackLevel?: number };

export interface ToneResponseNamedMap { };
export type ToneResponseName = keyof ToneResponseNamedMap | (string & Record<never, never>);
type ToneResponseNamedMapType = ToneResponseNamedMap & { [k: string]: ToneResponse<any> };

export const curves = ToneResponse.named as ToneResponseNamedMapType;

export { ToneResponse };