/*==========================*/
/* Color Difference methods */
/*==========================*/

import { Color } from "./color";
import { DE_ITP } from "./difference/deitp";

export type DEMethod<Options = {}> = (colorA: Color, colorB: Color, options: Options) => number;

/**
 * Calculates Delta E between two Colors depending on method
 */
function getDifference(colorA: Color, colorB: Color, options: {[k: string]: any} = {}) {
	const { method = DE_ITP } = options;
	return method(colorA, colorB, options);
}

/**
 * Member method for getDifference
 */
function _getDifference(this: Color, colorB: Color, options: Parameters<typeof getDifference>['2'] = {}) {
	getDifference(this, colorB, options);
}

declare module './color' {
	interface ColorConstructor {
		dE: typeof getDifference;
	}
	interface Color {
		dE: typeof _getDifference;
	}	
}

Object.defineProperty(Color, 'dE', getDifference);
Object.defineProperty(Color.prototype, 'dE', _getDifference);






export const DE_UV: DEMethod = (colorA, colorB, options = {}) => {
	const [u1, v1]: number[] = colorA.get('uv');
	const [u2, v2]: number[] = colorB.get('uv');

	const du = u1-u2;
	const dv = v1-v2;

	const dEuv: number = Math.sqrt( du*du + dv*dv );
	return dEuv;
};

export const DE_XY: DEMethod = (colorA, colorB, options = {}) => {
	const [x1, y1]: number[] = colorA.get('xy');
	const [x2, y2]: number[] = colorB.get('xy');

	const dx = x1-x2;
	const dy = y1-y2;

	const dEuv: number = Math.sqrt( dx*dx + dy*dy );
	return dEuv;
};