import { minv, mmult3331 as mmult } from "../../common/util";
import { LabSpace } from "../lab";
import { XYZSPACE_D65 } from "../xyz.standard";


export const LABSPACE_OKLAB = new LabSpace();
LABSPACE_OKLAB.name = 'OKLab';
LABSPACE_OKLAB.keys = ['L', 'a', 'b'];

LABSPACE_OKLAB.addConversion<{ whiteLevel: number }>(XYZSPACE_D65,
	//OKLab -> XYZD65
	(OKLab: number[], { whiteLevel }) => OKLab_to_XYZ(OKLab, { whiteLevel }),
	//XYZD65 -> OKLab
	(XYZ: number[], { whiteLevel }) => XYZ_to_OKLab(XYZ, { whiteLevel })
);

LABSPACE_OKLAB.register('OKLAB');

declare module '../lab' {
	interface LabSpaceNamedMap {
		OKLAB: LabSpace;
	}
}

/**
 * XYZ <-> OKLab conversion functions
 */

const M1 = [
	[0.8189330101, 0.3618667424, -0.1288597137],
	[0.0329845436, 0.9293118715, 0.0361456387],
	[0.0482003018, 0.2643662691, 0.6338517070]
];
const M1Inv = minv(M1);

const M2 = [
	[0.2104542553, 0.7936177850, -0.0040720468],
	[1.9779984951, -2.4285922050, 0.4505937099],
	[0.0259040371, 0.7827717662, -0.8086757660]
];
const M2Inv = minv(M2);


function XYZ_to_OKLab([X, Y, Z]: number[], { whiteLevel = 1 }) {
	const XYZn = [X, Y, Z].map(u => u / whiteLevel);
	const LMS = mmult(M1, XYZn);
	const LMSp = LMS.map(u => u >= 0 ? u**(1/3) : -((-u)**(1/3)));
	const Lab = mmult(M2, LMSp);

	return Lab;
}

function OKLab_to_XYZ(Lab: number[], { whiteLevel = 1 }) {
	const LMSp = mmult(M2Inv, Lab);
	const LMS = LMSp.map(u => u*u*u);
	const XYZn = mmult(M1Inv, LMS);
	const XYZ = XYZn.map(u => whiteLevel*u);

	return XYZ;
}