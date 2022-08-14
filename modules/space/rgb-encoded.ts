import { quantizeToBits } from '../common/util.js';
import { ColorGamut, ColorGamutName, gamuts } from '../gamut.js';
import { ColorSpace, ColorSpaceConstructorProps } from '../space.js';
import { curves, ToneResponse, ToneResponseName } from '../trc.js';
import { RGBLinearSpace } from './rgb-linear.js';

interface RGBEncodedSpaceConstructorProps extends ColorSpaceConstructorProps {
	trc: ToneResponse | ToneResponseName;
	gamut?: ColorGamut | ColorGamutName;
	whiteLevel?: number;
	blackLevel?: number;
	peakLuminance?: number;
}

export class RGBEncodedSpace extends ColorSpace {
	public readonly trc: ToneResponse;

	constructor({
		name = 'RGB Encoded ColorSpace',
		keys = ['r', 'g', 'b'],
		trc,
		gamut,
		whiteLevel = 100,
		blackLevel = 0,
		...props
	}: RGBEncodedSpaceConstructorProps) {
		const convertingProps = { rgbWhiteLevel: whiteLevel, rgbBlackLevel: blackLevel };
		super({ name, keys, convertingProps, ...props });
		if (typeof trc === 'string') trc = curves[trc];
		if (typeof gamut === 'string') gamut = gamuts[gamut];

		this.trc = trc.props({ whiteLevel, blackLevel });

		// Creates a corresponding linear RGB Space
		if (gamut) {
			this.toLinear(gamut);
		}
	}

	/**
	 * Returns a linear RGB Space of the current encoded RGB Space
	 */
	public toLinear(gamut: ColorGamut | ColorGamutName) {
		if (typeof gamut === 'string') gamut = gamuts[gamut];
		const rgbLinearSpace = RGBLinearSpace.getSpaceByGamut(gamut);

		if (!rgbLinearSpace.hasConversionToSpace(this)) {
			rgbLinearSpace.addConversion({
				space: this,
				// RGBLinear -> RGBEncoded
				toFn: (RGBLinear, { rgbWhiteLevel, rgbBlackLevel } = {}) =>
					RGBLinear_to_RGBEncoded(RGBLinear, {
						trc:
							rgbWhiteLevel || rgbBlackLevel
								? this.trc.props({ whiteLevel: rgbWhiteLevel, blackLevel: rgbBlackLevel })
								: this.trc,
					}),
				// RGBEncoded -> RGBLinear
				fromFn: (RGBEncoded, { rgbWhiteLevel, rgbBlackLevel } = {}) =>
					RGBEncoded_to_RGBLinear(RGBEncoded, {
						trc:
							rgbWhiteLevel || rgbBlackLevel
								? this.trc.props({ whiteLevel: rgbWhiteLevel, blackLevel: rgbBlackLevel })
								: this.trc,
					}),
			});
		}

		return rgbLinearSpace;
	}

	public toDigital(bpc: 8 | 10 | 12) {
		const newSpace = new RGBEncodedSpace({
			name: `${this.name} (${bpc}-bit)`,
			trc: this.trc,
			whiteLevel: this.convertingProps?.rgbWhiteLevel,
			blackLevel: this.convertingProps?.rgbBlackLevel,
			conversions: [
				{
					space: this,
					toFn: (RGBQuantized) => RGBQuantized.map((u) => u / (2 ** bpc - 1)),
					fromFn: (RGBEncoded) => RGBEncoded.map((u) => quantizeToBits(u, bpc)),
				},
			],
			precision: Math.ceil(Math.log10(2 ** bpc)),
		});

		return newSpace;
	}

	/**
	 * Static
	 */
	public static named = {} as RGBEncodedSpaceNamedMap & Record<string, RGBEncodedSpace>;
}

function RGBLinear_to_RGBEncoded(RGBLinear: number[], { trc }: { trc: ToneResponse }) {
	return RGBLinear.map((u) => trc.invEotf(u));
}

function RGBEncoded_to_RGBLinear(RGBEncoded: number[], { trc }: { trc: ToneResponse }) {
	return RGBEncoded.map((u) => trc.eotf(u));
}

export interface RGBEncodedSpaceNamedMap {}
export type RGBEncodedSpaceName = keyof RGBEncodedSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends RGBEncodedSpaceNamedMap {}
}

export const rgbSpaces = RGBEncodedSpace.named;
