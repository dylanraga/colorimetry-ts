/*========================*/
/* Illuminant coordinates */
/*========================*/

interface xy {
	x: number;
	y: number;
}

//A
export const ILLUMINANT_A: xy = {
	x: 0.44757,
	y: 0.40744
};

//D50
export const ILLUMINANT_D50: xy = {
	x: 0.34567,
	y: 0.35850
};

//D55
export const ILLUMINANT_D55: xy = {
	x: 0.33242,
	y: 0.34743
};

//D65
export const ILLUMINANT_D65: xy = {
	x: 0.31271,
	y: 0.32901
};

//D75
export const ILLUMINANT_D75: xy = {
	x: 0.29902,
	y: 0.31485
};

//D93
export const ILLUMINANT_D93: xy = {
	x: 0.28315,
	y: 0.29711
};


export const illuminants = {
	"A": ILLUMINANT_A,
	"D50": ILLUMINANT_D50,
	"D55": ILLUMINANT_D55,
	"D65": ILLUMINANT_D65,
	"D75": ILLUMINANT_D75,
	"D93": ILLUMINANT_D93
};