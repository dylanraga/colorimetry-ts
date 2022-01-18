/*==========================*/
/* Color Gamuts & Primaries */
/*==========================*/

import { xy, xyY } from "./ColorModel";
import { minv, mmult } from "./util.js";

class ColorGamut {
	white: xyY;
	red: xy;
	green: xy;
	blue: xy;
	black?: xyY;
	#mRGB?: number[][];
	#mXYZ?: number[][];

	constructor(white?: xyY, red?: xy, green?: xy, blue?: xy) {
		this.white = white;
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.black = {...white, Y: 0};
	}

	/*
	 *	Member getters & setters
	 */

	set mXYZ(mXYZ: Array<number>[]) {
		this.#mXYZ = mXYZ;
	}

	get mXYZ(): number[][] {
		if (this.#mXYZ)	return this.#mXYZ;

		const colors = [this.white, this.red, this.green, this.blue];

		const [Xw, Xr, Xg, Xb] = colors.map(u => +(u.x/u.y).toPrecision(15));
		const [Zw, Zr, Zg, Zb] = colors.map(u => +(+(1-u.x-u.y).toPrecision(15)/u.y).toPrecision(15));

		const [Sr, Sg, Sb] = mmult(minv([[Xr,Xg,Xb],[1,1,1],[Zr,Zg,Zb]]), [Xw, 1, Zw]);
		let mXYZ = [[Sr*Xr,Sg*Xg,Sb*Xb],[Sr*1,Sg*1,Sb*1],[Sr*Zr,Sg*Zg,Sb*Zb]].map(u => u.map(v => +v.toPrecision(15)));
		return this.#mXYZ = mXYZ;
	}

	set mRGB(mRGB: number[][]) {
		this.#mRGB = mRGB;
	}

	get mRGB(): number[][] {
		if (this.#mRGB)	return this.#mRGB;

		//just get the inverse of mXYZ
		let mRGB = minv(this.mXYZ);
		return this.#mRGB = mRGB;
	}

	/*
	 *	Member methods
	 */

	whiteLevel(): number;
	whiteLevel(whiteLevel: number): ColorGamut;
	whiteLevel(whiteLevel?: number): ColorGamut|number {
		if(typeof whiteLevel === 'undefined')	return this.white.Y;

		let newGamut = new ColorGamut();
		Object.assign(newGamut, this);
		newGamut.white = {...this.white};
		newGamut.white.Y = whiteLevel;
		
		return newGamut;
	}

	blackLevel(): number;
	blackLevel(blackLevel: number): ColorGamut;
	blackLevel(blackLevel?: number): ColorGamut|number {
		if(typeof blackLevel === 'undefined')	return this.black.Y;

		let newGamut = new ColorGamut();
		Object.assign(newGamut, this);
		newGamut.black = {...this.black};
		newGamut.black.Y = blackLevel;

		return newGamut;
	}

	
	/*
	 *	Pre-defined Standard Color Gamuts
	 */
	
	static names = [
		'SRGB',
		'P3D65',
		'BT2020'
	];

	static SRGB = new ColorGamut(
		{x: 0.3127, y: 0.3290, Y: 1},
		{x: 0.6400, y: 0.3300},
		{x: 0.3000, y: 0.6000},
		{x: 0.1500, y: 0.0600}
	);

	static P3D65 = new ColorGamut(
		{x: 0.3127, y: 0.3290, Y: 1},
		{x: 0.6800, y: 0.3200},
		{x: 0.2650, y: 0.6900},
		{x: 0.1500, y: 0.0600}
	);

	static BT2020 = new ColorGamut(
		{x: 0.3127, y: 0.3290, Y: 1},
		{x: 0.7080, y: 0.2920},
		{x: 0.1700, y: 0.7970},
		{x: 0.1310, y: 0.0460}
	);


	/*
	 *	Aliases
	 */

	static BT709 = ColorGamut.SRGB;
	static REC709 = ColorGamut.SRGB;
	static DISPLAYP3 = ColorGamut.P3D65;
	static REC2020 = ColorGamut.BT2020;
	
	static {
		//Set the names of each standard
		for (let k of this.names) {
			this[k].name = k;
		}

	}
	
}


export default ColorGamut;