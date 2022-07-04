/*==========================*/
/* Color Gamuts & Primaries */
/*==========================*/

import { minv, mmult3331 } from "../common/util";

interface xyY {
	x: number;
	y: number;
	Y: number;
}
type xy = Omit<xyY, 'Y'>;

interface ColorGamutPrimaries {
	white: xyY;
	red: xy;
	green: xy;
	blue: xy;
}

interface ColorGamutPrimariesWithBlack extends ColorGamutPrimaries {
	black: xyY;
}
interface ColorGamutPrimariesWithOptionalBlack extends ColorGamutPrimaries {
	black?: xyY;
}

/**Class representing a color gamut */
class ColorGamut {
	public white: xyY;
	public red: xy;
	public green: xy;
	public blue: xy;
	public black: xyY;
	private mRGBCached?: number[][];
	private mXYZCached?: number[][];

	/**
	 * Create a color gamut
	 * @param {number} options The object containing the data of the color gamut primaries. 
	 */
	constructor(options: ColorGamutPrimariesWithOptionalBlack) {
		const { white, red, green, blue, black = { ...white, Y: 0 } } = options;
		this.white = white;
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.black = black;
	}

	//
	//Member getters & setters
	//

	set mXYZ(mXYZ: Array<number>[]) {
		this.mXYZCached = mXYZ;
	}

	get mXYZ(): number[][] {
		if (this.mXYZCached) return this.mXYZCached;

		const colors = [this.white, this.red, this.green, this.blue];

		const [Xw, Xr, Xg, Xb] = colors.map(u => u.x/u.y);
		const [Zw, Zr, Zg, Zb] = colors.map(u => (1-u.x-u.y)/u.y);

		const [Sr, Sg, Sb] = mmult3331(minv([[Xr,Xg,Xb],[1,1,1],[Zr,Zg,Zb]]), [Xw, 1, Zw]);
		let mXYZ = [[Sr*Xr,Sg*Xg,Sb*Xb],[Sr,Sg,Sb],[Sr*Zr,Sg*Zg,Sb*Zb]];
		return this.mXYZ = mXYZ;
	}

	set mRGB(mRGB: number[][]) {
		this.mRGBCached = mRGB;
	}

	get mRGB(): number[][] {
		if (this.mRGBCached) return this.mRGBCached;

		//just get the inverse of mXYZ
		return this.mRGBCached = minv(this.mXYZ);
	}

	/*
	 *	Member methods
	 */

	/**
	 * returns new ColorGamut (non-destructive) with new whiteLevel
	 */
	whiteLevel(): number;
	whiteLevel(whiteLevel: number): ColorGamut;
	whiteLevel(whiteLevel?: number): ColorGamut|number {
		if (typeof whiteLevel === 'undefined') return this.white.Y;

		let newGamut = new ColorGamut({
			...this,
			white: { ...this.white, Y: whiteLevel }
		});

		return newGamut;
	}

	/**
	 * returns new ColorGamut (non-destructive) with new blackLevel
	 */
	blackLevel(): number;
	blackLevel(blackLevel: number): ColorGamut;
	blackLevel(blackLevel?: number): ColorGamut|number {
		if(typeof blackLevel === 'undefined')	return this.black.Y;

		let newGamut = new ColorGamut({
			...this,
			black: { ...this.black, Y: blackLevel }
		});

		return newGamut;
	}
	
}

export { ColorGamut };