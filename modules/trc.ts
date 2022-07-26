/*===========================*/
/* Tone Response Curve Class */
/*===========================*/


type TransferFunction<Options> = (u: number, options?: Options) => number;

interface ToneResponeDefaultOptions { whiteLevel?: number, blackLevel?: number };

export class ToneResponse<Options = ToneResponeDefaultOptions> {
	constructor(
		public eotf: TransferFunction<Options>,
		public invEotf: TransferFunction<Options>
	) { }

	/*
	 *	Member methods
	 */

	public options(defaultOptions: Options): ToneResponse<Options> {
		return new ToneResponse((V,o) => this.eotf(V, {...defaultOptions, ...o}), (L,o) => this.invEotf(L, {...defaultOptions, ...o}));
	}
}