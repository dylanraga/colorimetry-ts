/*===================*/
/* Utility functions */
/*===================*/
import Decimal from "./decimal.mjs";

export const arrayEquals = (a, b)=>
	a.length === b.length &&
	a.every((v, i) => v === b[i]);

export const arrayEqualsApprox = (a, b)=>
	a && b &&
	a.length === b.length &&
	a.every((v, i) => v.toFixed(4) === b[i].toFixed(4));

export const shallowEquals = (a, b)=> {
	if(typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
		return (
			Object.keys(a).length === Object.keys(b).length &&
			Object.keys(b).every(key => a[key] === b[key])
		);
	}
	else if((a === null && a === null) || (a === undefined && b === undefined)) {
		return true;
	}

	return false;
}

export const roundHTE = a =>
	a % 1 === 0.5 ? 2 * Math.round(a / 2) : Math.round(a);

export const sleep = ms => {
	return new Promise(res => setTimeout(res, ms));
};

//Source: http://techref.massmind.org/Techref/method/math/matrix.htm
function minv(M: number[][]){
	// I use Guassian Elimination to calculate the inverse:
	// (1) 'augment' the matrix (left) by the identity (on the right)
	// (2) Turn the matrix on the left into the identity by elemetry row ops
	// (3) The matrix on the right is the inverse (was the identity matrix)
	// There are 3 elemtary row ops: (I combine b and c in my code)
	// (a) Swap 2 rows
	// (b) Multiply a row by a scalar
	// (c) Add 2 rows
	
	//if the matrix isn't square: exit (error)
	if(M.length !== M[0].length){return;}
	
	//create the identity matrix (I), and a copy (C) of the original
	var i=0, ii=0, j=0, dim=M.length, e=0;
	var I = [], C = [];
	for(i=0; i<dim; i+=1){
			// Create the row
			I[I.length]=[];
			C[C.length]=[];
			for(j=0; j<dim; j+=1){
					
					//if we're on the diagonal, put a 1 (for identity)
					if(i===j){ I[i][j] = 1; }
					else{ I[i][j] = 0; }
					
					// Also, make the copy of the original
					C[i][j] = M[i][j];
			}
	}
	
	// Perform elementary row operations
	for(i=0; i<dim; i+=1){
			// get the element e on the diagonal
			e = C[i][i];
			
			// if we have a 0 on the diagonal (we'll need to swap with a lower row)
			if(e===0){
					//look through every row below the i'th row
					for(ii=i+1; ii<dim; ii+=1){
							//if the ii'th row has a non-0 in the i'th col
							if(C[ii][i] !== 0){
									//it would make the diagonal have a non-0 so swap it
									for(j=0; j<dim; j++){
											e = C[i][j];       //temp store i'th row
											C[i][j] = C[ii][j];//replace i'th row by ii'th
											C[ii][j] = e;      //repace ii'th by temp
											e = I[i][j];       //temp store i'th row
											I[i][j] = I[ii][j];//replace i'th row by ii'th
											I[ii][j] = e;      //repace ii'th by temp
									}
									//don't bother checking other rows since we've swapped
									break;
							}
					}
					//get the new diagonal
					e = C[i][i];
					//if it's still 0, not invertable (error)
					if(e===0){return}
			}
			
			// Scale this row down by e (so we have a 1 on the diagonal)
			for(j=0; j<dim; j++){
					C[i][j] = Decimal(C[i][j]).div(e); //apply to original matrix
					I[i][j] = Decimal(I[i][j]).div(e); //apply to identity
			}
			
			// Subtract this row (scaled appropriately for each row) from ALL of
			// the other rows so that there will be 0's in this column in the
			// rows above and below this one
			for(ii=0; ii<dim; ii++){
					// Only apply to other rows (we want a 1 on the diagonal)
					if(ii===i){continue;}
					
					// We want to change this element to 0
					e = C[ii][i];
					
					// Subtract (the row above(or below) scaled by e) from (the
					// current row) but start at the i'th column and assume all the
					// stuff left of diagonal is 0 (which it should be if we made this
					// algorithm correctly)
					for(j=0; j<dim; j++){
							C[ii][j] = Decimal(C[ii][j]).minus(Decimal(e).times(C[i][j])); //apply to original matrix
							I[ii][j] = Decimal(I[ii][j]).minus(Decimal(e).times(I[i][j])); //apply to identity
					}
			}
	}
	
	//we've done all operations, C should be the identity
	//matrix I should be the inverse:
	//64-bit round to 15 places for more reliable invertibility
	return I;
}

function mmult(A: number[], B: number[]): number[];
function mmult(A: number[][], B: number[]): number[];
function mmult(A: number[], B: number[][]): number[][];
function mmult(A: number[][], B: number[][]): number[][];
function mmult(A: number[]|number[][], B: number[][]|number[]): number[][]|number[] {
	if (typeof A[0] === 'undefined' || typeof B[0] === 'undefined')	throw new Error(`Matrices must have values`);

	let A_cols = Array.isArray(A[0])? A[0].length : A.length;
	let B_rows = B.length;
	if (A_cols !== B_rows) throw new Error(`Matrix dimensions do not match`);
	
	let M_rows = Array.isArray(A[0])? A.length : 1;
	let M_cols = Array.isArray(B[0])? B[0].length : 1;

	let M = new Array(M_rows);
	for (let i in A){
		M[i] = (M_cols > 1)? new Array(M_cols).fill(0) : 0;
	}

	for (let i = 0; i < M_rows; i++) {
		for (let j = 0; j < M_cols; j++) {
			var val = 0;
			for (let k = 0; k < M_rows; k++) {
					val = (Array.isArray(B[k]))? Decimal(val).plus(Decimal(A[i][k]).times(B[k][j])) : Decimal(val).plus(Decimal(A[i][k]).times(B[k]));
			}
			
			if (M_cols > 1)
				M[i][j] = val;
			else
				M[i] = val;
		}
	}

	//64-bit round to 15 places for more reliable invertibility
	//M = M.map(u => Array.isArray(u)? u.map(v => +(v.toPrecision(15))) : +(u.toPrecision(15)))

	return M;
}

export const quantize = (v, bitDepth)=> roundHTE((Math.pow(2, bitDepth)-1)*v)/(Math.pow(2, bitDepth)-1);

function bfsPath(start: any, end: any, graph: {[key: string]: any}): any[] {
	let queue = [[start]];
	let visited = [];
	let curr = start;
	while (queue.length) {
		let path = queue.shift();
		curr = path[path.length-1];
		visited.push(curr);
		if (curr === end) return path;
		
		if (!graph[curr]) continue;
		for (let k of graph[curr]) {
			if (!visited.includes(k))
				queue.push([...path, k]);
		}
	}
	return [];
};

export {mmult, minv, bfsPath};