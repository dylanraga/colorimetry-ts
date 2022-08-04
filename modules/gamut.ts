/*==========================*/
/* Color Gamuts & Primaries */
/*==========================*/

import { Optional } from "./common/types";
import { minv, mmult3331 as mmult } from "./common/util";

/**
 * RGB Space Color Gamut
 */
class ColorGamut {
	public primaries: ColorGamutPrimaries;
	private mRGBCached?: number[][];
	private mXYZCached?: number[][];
	public static named: { [k: string]: ColorGamut } = {};

	constructor(options: Optional<ColorGamutPrimaries, 'black'>) {
		const { white, red, green, blue, black = { ...white, Y: 0 } } = options;
		this.primaries = {
			white, red, green, blue, black
		};
	}

	//
	//Member getters & setters
	//

	public set mXYZ(mXYZ: Array<number[]>) {
		this.mXYZCached = mXYZ;
	}

	public get mXYZ(): number[][] {
		if (this.mXYZCached) return this.mXYZCached;

		const colors = [this.primaries.white, this.primaries.red, this.primaries.green, this.primaries.blue];

		const [Xw, Xr, Xg, Xb] = colors.map(u => u.x/u.y);
		const [Zw, Zr, Zg, Zb] = colors.map(u => (1-u.x-u.y)/u.y);

		const [Sr, Sg, Sb] = mmult(minv([[Xr,Xg,Xb],[1,1,1],[Zr,Zg,Zb]]), [Xw, 1, Zw]);
		let mXYZ = [[Sr*Xr,Sg*Xg,Sb*Xb],[Sr,Sg,Sb],[Sr*Zr,Sg*Zg,Sb*Zb]];
		return this.mXYZ = mXYZ;
	}

	public set mRGB(mRGB: number[][]) {
		this.mRGBCached = mRGB;
	}

	public get mRGB(): number[][] {
		if (this.mRGBCached) return this.mRGBCached;

		//just get the inverse of mXYZ
		return this.mRGBCached = minv(this.mXYZ);
	}

	public get whiteLevel() {
		return this.primaries.white.Y;
	}

	public set whiteLevel(value: number) {
		this.primaries.white.Y = value;
	}

	public get blackLevel() {
		return this.primaries.black.Y;
	}

	public set blackLevel(value: number) {
		this.primaries.black.Y = value;
	}

	/**
	 * Member methods
	 */

	public options(newProps: { [P in keyof ColorGamut]?: ColorGamut[P] }) {
		const newGamut = new ColorGamut({
			white: { ...this.primaries.white },
			red: { ...this.primaries.red },
			green: { ...this.primaries.green },
			blue: { ...this.primaries.blue },
			black: { ...this.primaries.black }
		});
		
		Object.assign(newGamut, { ...newProps });
		return newGamut;
	}

	public register(nameList: string[]): void;
	public register(name: string): void;
	public register(arg1: string | string[]): void {
		if (Array.isArray(arg1)) {
			for (const name of arg1) {
				ColorGamut.named[name] = this;
			}
		} else {
			ColorGamut.named[arg1] = this;
		}
	}
	
}

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
	black: xyY;
}

export interface ColorGamutNamedMap { };
export type ColorGamutName = keyof ColorGamutNamedMap | (string & Record<never, never>);
type ColorGamutNamedMapType = ColorGamutNamedMap & { [k: string]: ColorGamut };

export const gamuts = ColorGamut.named as ColorGamutNamedMapType;

export { ColorGamut, ColorGamutPrimaries };