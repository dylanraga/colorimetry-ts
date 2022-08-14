import { minv, mmult3333, mmult3331 } from './common/util.js';
import { xy_to_XnYnZn } from './space/chromaticity/xy.js';
import { Yxy, Yxy_to_XYZ } from './space/lab/cieyxy.js';

export type ChromaticAdaptationMethodName = 'xyz' | 'vonkries' | 'bradford' | 'cat02' | 'cat16';

//Von Kries
export const mVonKries = [
	[0.40024, 0.7076, -0.08081],
	[-0.2263, 1.16532, 0.0457],
	[0.0, 0.0, 0.91822],
];

//Bradford
export const mBradford = [
	[0.8951, 0.2664, -0.1614],
	[-0.7502, 1.7135, 0.0367],
	[0.0389, -0.0685, 1.0296],
];

//CAT02
//----

//CAT16
//----

const catMethodMtxMap: Record<string, number[][]> = {
	vonkries: mVonKries,
	bradford: mBradford,
};

function xyzScale([X, Y, Z]: number[], refWhiteSrc: Yxy, refWhiteDst: Yxy) {
	const [Xws, , Zws] = xy_to_XnYnZn([refWhiteSrc.x, refWhiteSrc.y]);
	const [Xwd, , Zwd] = xy_to_XnYnZn([refWhiteDst.x, refWhiteDst.y]);
	return [(X * Xwd) / Xws, (Y * refWhiteDst.Y) / refWhiteSrc.Y, (Z * Zwd) / Zws];
}

export function xyzCat(
	xyzSrc: number[],
	refWhiteSrc: Yxy,
	refWhiteDst: Yxy,
	method: ChromaticAdaptationMethodName = 'bradford'
) {
	if (method === 'xyz') {
		return xyzScale(xyzSrc, refWhiteSrc, refWhiteDst);
	}

	const MA = catMethodMtxMap[method];

	const [ρS, γS, βS] = mmult3331(MA, Yxy_to_XYZ([refWhiteSrc.Y, refWhiteSrc.x, refWhiteSrc.y]));
	const [ρD, γD, βD] = mmult3331(MA, Yxy_to_XYZ([refWhiteDst.Y, refWhiteDst.x, refWhiteDst.y]));

	const M1 = [
		[ρD / ρS, 0, 0],
		[0, γD / γS, 0],
		[0, 0, βD / βS],
	];
	const M2 = mmult3333(minv(MA), mmult3333(M1, MA));
	const xyzDst = mmult3331(M2, xyzSrc);

	return xyzDst;
}
