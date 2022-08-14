import { gamuts } from '../../gamut.js';
import { RGBLinearSpace } from '../rgb-linear.js';

// sRGB / ITU-R BT.709
export const RGBLINEARSPACE_SRGB = new RGBLinearSpace({
	id: 'srgb_linear',
	name: 'sRGB Linear',
	gamut: gamuts.srgb,
});

// P3-D65
export const RGBLINEARSPACE_P3D65 = new RGBLinearSpace({
	id: 'p3_d65_linear',
	name: 'P3-D65 Linear',
	gamut: gamuts.p3_d65,
});

// P3-DCI Cinema
export const RGBLINEARSPACE_P3DCI = new RGBLinearSpace({
	id: 'p3_dci_linear',
	name: 'P3-DCI Linear',
	gamut: gamuts.p3_dci,
});

// BT. 2020
export const RGBLINEARSPACE_BT2020 = new RGBLinearSpace({
	id: 'bt2020_linear',
	name: 'BT.2020 Linear',
	gamut: gamuts.bt2020,
});

// ACEScg
export const RGBLINEARSPACE_ACESCG = new RGBLinearSpace({
	id: 'acescg',
	name: 'ACEScg',
	gamut: gamuts.aces_p1,
});

declare module '../rgb-linear' {
	interface RGBLinearSpaceNamedMap {
		srgb_linear: typeof RGBLINEARSPACE_SRGB;
		p3_d65_linear: typeof RGBLINEARSPACE_P3D65;
		p3_dci_linear: typeof RGBLINEARSPACE_P3DCI;
		bt2020_linear: typeof RGBLINEARSPACE_BT2020;
		acescg: typeof RGBLINEARSPACE_ACESCG;
	}
}
