import { illuminants } from "../illuminants";
import { XYZSpace } from "./xyz";

export const XYZSPACE_D65 = new XYZSpace(illuminants.D65, 'CIE 1931 2deg');
XYZSPACE_D65.register('XYZD65');

declare module './xyz' {
	interface XYZSpaceNamedMap {
		XYZD65: typeof XYZSPACE_D65;
	}
}