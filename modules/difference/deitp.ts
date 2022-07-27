import { LABSPACE_ITP } from "../../colorimetry";
import { DEMethod } from "../difference";

export const DE_ITP: DEMethod<{
	excludeLuminance?: boolean;
	scalar?: 240 | 720 | 1440;
}> = (colorA, colorB, options = {}) => {
	const { scalar = 720, excludeLuminance = false } = options;
	const [I1, T1, P1]: number[] = colorA.get(LABSPACE_ITP);
	const [I2, T2, P2]: number[] = colorB.get(LABSPACE_ITP);

	const dI = I1-I2;
	const dT = T1-T2;
	const dP = P1-P2;
	
	const dEITP = scalar * Math.sqrt( (!excludeLuminance? dI*dI : 0) + dT*dT + dP*dP );
	return dEITP;
}