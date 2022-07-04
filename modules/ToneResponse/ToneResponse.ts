/*======================*/
/* Tone Response Curves */
/*======================*/


type TransferFunction<Options> = (u: number, options?: Options) => number;

interface ToneResponeDefaultOptions { whiteY?: number, blackY?: number }

class ToneResponse<Options = ToneResponeDefaultOptions> {
	constructor(
		public eotf: TransferFunction<Options>,
		public invEotf: TransferFunction<Options>
	) { }

	/*
	 *	Member methods
	 */

	options(defaultOptions: Options): ToneResponse<Options> {
		return new ToneResponse((V,o) => this.eotf(V, {...defaultOptions, ...o}), (L,o) => this.invEotf(L, {...defaultOptions, ...o}));
	}
}

export { ToneResponse };