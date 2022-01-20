/*==============================*/
/* Full Color Space Definitions */
/*==============================*/

import Color from "./Color.js";
import ColorGamut from "./ColorGamut.js";
import ToneResponse from "./ToneResponse.js";

class ColorSpace {
	#gamut: ColorGamut;
	#trc: ToneResponse;
	name?: string;

	constructor(gamut?: ColorGamut|string, trc?: ToneResponse|string) {
		this.gamut = gamut;
		this.trc = trc;

	}

	/*
	 *	Member getters & setters
	 */

	get gamut(): ColorGamut {
		return this.#gamut;
	}

	set gamut(gamut: ColorGamut|string) {
		if (typeof gamut === 'string') {
			if (!ColorGamut[gamut.toUpperCase()]) throw new Error(`ColorGamut '${gamut}' does not exist`);
			this.#gamut = ColorGamut[gamut.toUpperCase()];
		} else{
			this.#gamut = gamut;
		}
	}

	get trc(): ToneResponse {
		return this.#trc;
	}

	set trc(trc: ToneResponse|string) {
		if (typeof trc === 'string') {
			if (!ToneResponse[trc.toUpperCase()]) throw new Error(`ToneResponse '${trc}' does not exist`);
			this.#trc = ToneResponse[trc.toUpperCase()];
		} else{
			this.#trc = trc;
		}
	}

	/*
	 *	Member methods
	 */

	whiteLevel(): number;
	whiteLevel(whiteLevel: number): ColorSpace;
	whiteLevel(whiteLevel?: number): ColorSpace|number {
		if(typeof whiteLevel === 'undefined')	return this.#gamut.whiteLevel();

		let newSpace = new ColorSpace(this.gamut, this.trc);
		Object.assign(newSpace, this);
		newSpace.gamut = newSpace.gamut.whiteLevel(whiteLevel);
		return newSpace;
	}

	blackLevel(): number;
	blackLevel(blackLevel: number): ColorSpace;
	blackLevel(blackLevel?: number): ColorSpace|number {
		if(typeof blackLevel === 'undefined')	return this.#gamut.blackLevel();

		let newSpace = new ColorSpace(this.gamut, this.trc);
		Object.assign(newSpace, this);
		newSpace.gamut = newSpace.gamut.blackLevel(blackLevel);
		return newSpace;
	}

	/*
	 *	Pre-defined standard color spaces
	 */
	static names = [
		'SRGB',
		'DISPLAYP3',
		'DCIP3',
		'BT2100',
		'REC709'
	];

	static SRGB = new ColorSpace(ColorGamut.SRGB, ToneResponse.SRGB);
	static DISPLAYP3 = new ColorSpace(ColorGamut.P3D65, ToneResponse.SRGB);
	static DCIP3 = new ColorSpace(ColorGamut.P3D65.whiteLevel(48), ToneResponse.GAMMA.options({gamma: 2.6}));
	static BT2100 = new ColorSpace(ColorGamut.BT2020.whiteLevel(10000), ToneResponse.ST2084);
	static BT2100_HLG = new ColorSpace(ColorGamut.BT2020.whiteLevel(1000), ToneResponse.HLG);
	static REC709 = new ColorSpace(ColorGamut.SRGB, ToneResponse.BT1886);

	/*
	 *	Aliases
	 */	

	static P3 = ColorSpace.DISPLAYP3;
	static REC2100 = ColorSpace.BT2100;

	static {
		//Set the names of each standard
		for (let k of this.names) {
			this[k].name = k;
		}
	}
}

export default ColorSpace;