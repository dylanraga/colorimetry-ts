import { mmult3331 as mmult } from '../common/util.js';
import { ColorGamut, ColorGamutName, ColorGamutNamedMap, gamuts } from '../gamut.js';
import { ColorSpace, ColorSpaceConstructorProps } from '../space.js';
import { XYZSPACE_D65 } from './xyz/predefined.js';

interface RGBLinearSpaceConstructorProps extends ColorSpaceConstructorProps {
	gamut: ColorGamut | ColorGamutName;
}

export class RGBLinearSpace extends ColorSpace {
	public readonly gamut: ColorGamut;

	constructor({
		name = 'RGB Linear ColorSpace',
		keys = ['R', 'G', 'B'],
		gamut,
		...props
	}: RGBLinearSpaceConstructorProps) {
		super({ name, keys, ...props });
		this.gamut = typeof gamut === 'string' ? gamuts[gamut as keyof ColorGamutNamedMap] : gamut;

		const xyzConversionSpace = XYZSPACE_D65.cat(this.gamut.primaries.white);
		this.addConversion({
			space: xyzConversionSpace,
			toFn: (RGBLinear) => RGBLinear_to_XnYnZn(RGBLinear, { gamut: this.gamut }),
			fromFn: (XnYnZn) => XnYnZn_to_RGBLinear(XnYnZn, { gamut: this.gamut }),
		});
	}

	/**
	 * Static
	 */
	public static named = {} as RGBLinearSpaceNamedMap & Record<string, RGBLinearSpace>;

	/**
	 * Retrieves a RGB Linear ColorSpace corresponding to a color gamut
	 * If it does not exist, create one and return it
	 * @param gamut ColorGamut
	 */
	public static getSpaceByGamut(gamut: ColorGamut | ColorGamutName) {
		if (typeof gamut === 'string') gamut = gamuts[gamut as keyof ColorGamutNamedMap];

		let space = Object.values(this.named).find((s) => s.gamut === gamut);
		if (!space) {
			space = new RGBLinearSpace({ name: `${gamut.name} (Linear)`, gamut });
		}

		return space;
	}
}

function XnYnZn_to_RGBLinear(XnYnZn: number[], { gamut }: { gamut: ColorGamut }) {
	return mmult(gamut.getMatrixXYZToRGB(), XnYnZn);
}

function RGBLinear_to_XnYnZn(RGBLinear: number[], { gamut }: { gamut: ColorGamut }) {
	return mmult(gamut.getMatrixRGBToXYZ(), RGBLinear);
}

export interface RGBLinearSpaceNamedMap {}
export type RGBLinearSpaceName = keyof RGBLinearSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends RGBLinearSpaceNamedMap {}
}

export const rgbLinearSpaces = RGBLinearSpace.named;
