import { quantizeToBits } from '../common/util.js';
import { ColorGamut, ColorGamutName, ColorGamutNamedMap, gamuts } from '../gamut.js';
import { ColorSpace, ColorSpaceConstructorProps } from '../space.js';
import { curves, ToneResponse, ToneResponseName, ToneResponseNamedMap } from '../trc.js';
import { RGBLinearSpace } from './rgb-linear.js';

interface RGBEncodedSpaceConstructorProps extends ColorSpaceConstructorProps {
	trc: ToneResponse | ToneResponseName;
	gamut: ColorGamut | ColorGamutName;
	bpc?: 0 | 8 | 10 | 12;
	whiteLuminance?: number;
	blackLuminance?: number;
	peakLuminance?: number;
}

export class RGBEncodedSpace extends ColorSpace {
	public readonly trc: ToneResponse;
	public readonly gamut: ColorGamut;
	public readonly bpc: number;

	constructor({
		name = 'RGB Encoded ColorSpace',
		keys = ['r', 'g', 'b'],
		trc,
		gamut,
		bpc = 0,
		whiteLuminance = 100,
		blackLuminance = 0,
		...props
	}: RGBEncodedSpaceConstructorProps) {
		const convertingProps = { rgbWhiteLuminance: whiteLuminance, rgbBlackLuminance: blackLuminance };
		super({ name, keys, convertingProps, ...props });
		if (typeof trc === 'string') trc = curves[trc as keyof ToneResponseNamedMap];
		if (typeof gamut === 'string') gamut = gamuts[gamut as keyof ColorGamutNamedMap];

		this.trc = trc.props({ whiteLuminance, blackLuminance });
		this.gamut = gamut;
		this.bpc = bpc;

		// Creates a corresponding linear RGB Space
		this.toLinear();
	}

	/**
	 * Returns a linear RGB Space of the current encoded RGB Space
	 */
	public toLinear() {
		const rgbLinearSpace = RGBLinearSpace.getSpaceByGamut(this.gamut);

		if (!rgbLinearSpace.hasConversionToSpace(this)) {
			rgbLinearSpace.addConversion({
				space: this,
				// RGBLinear -> RGBEncoded
				toFn: (
					RGBLinear,
					{
						rgbWhiteLuminance = this.convertingProps?.rgbWhiteLuminance ?? 1,
						rgbBlackLuminance = this.convertingProps?.rgbBlackLuminance ?? 0,
					} = {}
				) =>
					RGBLinear_to_RGBEncoded(RGBLinear, {
						trc: this.trc,
						rgbWhiteLuminance,
						rgbBlackLuminance,
						bpc: this.bpc,
					}),
				// RGBEncoded -> RGBLinear
				fromFn: (
					RGBEncoded,
					{
						rgbWhiteLuminance = this.convertingProps?.rgbWhiteLuminance ?? 1,
						rgbBlackLuminance = this.convertingProps?.rgbBlackLuminance ?? 0,
					} = {}
				) =>
					RGBEncoded_to_RGBLinear(RGBEncoded, {
						trc: this.trc,
						rgbWhiteLuminance,
						rgbBlackLuminance,
						bpc: this.bpc,
					}),
			});
		}

		return rgbLinearSpace;
	}

	public toDigital(bpc: 8 | 10 | 12) {
		const newSpace = new RGBEncodedSpace({
			name: `${this.name} (${bpc}-bit)`,
			trc: this.trc,
			gamut: this.gamut,
			bpc,
			whiteLuminance: this.convertingProps?.rgbWhiteLuminance,
			blackLuminance: this.convertingProps?.rgbBlackLuminance,
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

function RGBLinear_to_RGBEncoded(
	RGBLinear: number[],
	{
		trc,
		rgbWhiteLuminance = 1,
		rgbBlackLuminance = 0,
		bpc = 0,
	}: { trc: ToneResponse; rgbWhiteLuminance: number; rgbBlackLuminance: number; bpc: number }
) {
	let rgbEncoded = RGBLinear.map((u) =>
		trc.invEotf(u, { whiteLuminance: rgbWhiteLuminance, blackLuminance: rgbBlackLuminance })
	);

	if (bpc > 0) {
		rgbEncoded = rgbEncoded.map((u) => quantizeToBits(u, bpc));
	}

	return rgbEncoded;
}

function RGBEncoded_to_RGBLinear(
	RGBEncoded: number[],
	{
		trc,
		rgbWhiteLuminance = 1,
		rgbBlackLuminance = 0,
		bpc = 0,
	}: { trc: ToneResponse; rgbWhiteLuminance: number; rgbBlackLuminance: number; bpc: number }
) {
	return RGBEncoded.map((u) =>
		trc.eotf(bpc > 0 ? u / ((2 << (bpc - 1)) - 1) : u, {
			whiteLuminance: rgbWhiteLuminance,
			blackLuminance: rgbBlackLuminance,
		})
	);
}

export interface RGBEncodedSpaceNamedMap {}
export type RGBEncodedSpaceName = keyof RGBEncodedSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends RGBEncodedSpaceNamedMap {}
}

export const rgbSpaces = RGBEncodedSpace.named;
