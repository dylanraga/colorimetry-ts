import { Optional } from './common/types.js';
import { minv, mmult3331 as mmult } from './common/util.js';
import { Registerable, RegisterableConstructorProps } from './registerable.js';
import { xy } from './space/chromaticity/xy.js';

interface ColorGamutConstructorProps extends RegisterableConstructorProps {
	primaries: Optional<ColorGamutPrimaries, 'black'>;
}

/**
 * RGB Space Color Gamut
 */
export class ColorGamut extends Registerable {
	public readonly primaries: ColorGamutPrimaries;
	private cachedMatrixRGBToXYZ?: number[][];
	private cachedMatrixXYZToRGB?: number[][];

	constructor({
		name = 'Unnamed ColorGamut',
		primaries: { white, black = { ...white }, ...rgb },
		...props
	}: ColorGamutConstructorProps) {
		super({ name, ...props });
		this.primaries = { white, black, ...rgb };
	}

	public getMatrixRGBToXYZ(): number[][] {
		if (this.cachedMatrixRGBToXYZ) return this.cachedMatrixRGBToXYZ;

		const colors = [this.primaries.white, this.primaries.red, this.primaries.green, this.primaries.blue];

		const [Xw, Xr, Xg, Xb] = colors.map((u) => u.x / u.y);
		const [Zw, Zr, Zg, Zb] = colors.map((u) => (1 - u.x - u.y) / u.y);

		const [Sr, Sg, Sb] = mmult(
			minv([
				[Xr, Xg, Xb],
				[1, 1, 1],
				[Zr, Zg, Zb],
			]),
			[Xw, 1, Zw]
		);
		const mtxRGBToXYZ = [
			[Sr * Xr, Sg * Xg, Sb * Xb],
			[Sr, Sg, Sb],
			[Sr * Zr, Sg * Zg, Sb * Zb],
		];

		return (this.cachedMatrixRGBToXYZ = mtxRGBToXYZ);
	}

	public getMatrixXYZToRGB(): number[][] {
		if (this.cachedMatrixXYZToRGB) return this.cachedMatrixXYZToRGB;

		return (this.cachedMatrixXYZToRGB = minv(this.getMatrixRGBToXYZ()));
	}

	/**
	 * Member methods
	 */

	public props(newProps: { [P in keyof ColorGamut]?: ColorGamut[P] }) {
		const newGamut = new ColorGamut({
			name: `${this.name} (copy)`,
			primaries: {
				white: { ...this.primaries.white },
				red: { ...this.primaries.red },
				green: { ...this.primaries.green },
				blue: { ...this.primaries.blue },
				black: { ...this.primaries.black },
			},
		});

		Object.assign(newGamut, { ...newProps });
		return newGamut;
	}

	/**
	 * Static
	 */
	public static named = {} as ColorGamutNamedMap & Record<string, ColorGamut>;
}

interface ColorGamutPrimaries {
	white: xy;
	red: xy;
	green: xy;
	blue: xy;
	black: xy;
}

//export interface ColorGamutNamedMap {}
export type ColorGamutName = keyof ColorGamutNamedMap | (string & Record<never, never>);

export const gamuts = ColorGamut.named;
