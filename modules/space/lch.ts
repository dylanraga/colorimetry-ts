import { deg2rad, rad2deg } from '../common/util.js';
import { ColorSpace, ColorSpaceConstructorProps } from '../space.js';
import { LabSpace } from './lab.js';

export class LChSpace extends ColorSpace {
	constructor({ name = 'LCh ColorSpace', keys = ['L', 'C', 'h'], ...props }: ColorSpaceConstructorProps) {
		super({ name, keys, ...props });
	}

	/**
	 * Returns the cartesion Lab form of the current LCH space
	 */
	toLab() {
		const labSpace = new LabSpace({
			name: `Lab ColorSpace (${this.name})`,
			conversions: [
				{
					space: this,
					toFn: Lab_to_LCh,
					fromFn: LCh_to_Lab,
				},
			],
		});

		return labSpace;
	}

	/**
	 * Static
	 */
	public static named: Record<string, LChSpace> = {};
}

export function Lab_to_LCh([L, a, b]: number[]) {
	return [L, (a * a + b * b) ** (1 / 2), rad2deg(Math.atan2(b, a))];
}

export function LCh_to_Lab([L, C, h]: number[]) {
	return [L, C * Math.cos(deg2rad(h)), C * Math.sin(deg2rad(h))];
}
