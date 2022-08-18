import { ColorDifferenceMethod, deMethods } from '../difference.js';
import { CHROMATICITY_UV } from '../space/chromaticity/uv.js';

// DE_UPVP = 0.0040 correlates to a JND
export const DE_UPVP: ColorDifferenceMethod = (colorA, colorB, options = {}) => {
	const [up1, vp1]: number[] = colorA.get(CHROMATICITY_UV);
	const [up2, vp2]: number[] = colorB.get(CHROMATICITY_UV);

	const dUp = up1 - up2;
	const dVp = vp1 - vp2;

	return Math.sqrt(dUp * dUp + dVp * dVp);
};

declare module '../difference' {
	interface ColorDifferenceMethodNamedMap {
		dupvp: typeof DE_UPVP;
	}
}

deMethods.dupvp = DE_UPVP;
