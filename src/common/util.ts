/*===================*/
/* Utility functions */
/*===================*/

// import { TransferFunction } from "../curves/trc.js";

export function arrayEquals(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * Rounds n.5 to the nearest even number
 * e.g.
 * - 3.5 => 4
 * - 6.5 => 6.
 */
export function roundHTE(a: number) {
  return a - (a | 0) === 0.5 ? 2 * Math.round(a / 2) : Math.round(a);
}

//Source: http://techref.massmind.org/Techref/method/math/matrix.htm
export function minv(M: number[][]): number[][] {
  // I use Guassian Elimination to calculate the inverse:
  // (1) 'augment' the matrix (left) by the identity (on the right)
  // (2) Turn the matrix on the left into the identity by elemetry row ops
  // (3) The matrix on the right is the inverse (was the identity matrix)
  // There are 3 elemtary row ops: (I combine b and c in my code)
  // (a) Swap 2 rows
  // (b) Multiply a row by a scalar
  // (c) Add 2 rows

  //if the matrix isn't square: exit (error)
  if (M.length !== M[0].length) throw new Error("Matrix isn't square");

  //create the identity matrix (I), and a copy (C) of the original
  const dim = M.length;
  let e = 0;
  const I: number[][] = [];
  const C: number[][] = [];
  for (let i = 0; i < dim; i += 1) {
    // Create the row
    I[I.length] = [];
    C[C.length] = [];
    for (let j = 0; j < dim; j += 1) {
      //if we're on the diagonal, put a 1 (for identity)
      if (i === j) {
        I[i][j] = 1;
      } else {
        I[i][j] = 0;
      }

      // Also, make the copy of the original
      C[i][j] = M[i][j];
    }
  }

  // Perform elementary row operations
  for (let i = 0; i < dim; i += 1) {
    // get the element e on the diagonal
    e = C[i][i];

    // if we have a 0 on the diagonal (we'll need to swap with a lower row)
    if (e === 0) {
      //look through every row below the i'th row
      for (let ii = i + 1; ii < dim; ii += 1) {
        //if the ii'th row has a non-0 in the i'th col
        if (C[ii][i] !== 0) {
          //it would make the diagonal have a non-0 so swap it
          for (let j = 0; j < dim; j++) {
            e = C[i][j]; //temp store i'th row
            C[i][j] = C[ii][j]; //replace i'th row by ii'th
            C[ii][j] = e; //repace ii'th by temp
            e = I[i][j]; //temp store i'th row
            I[i][j] = I[ii][j]; //replace i'th row by ii'th
            I[ii][j] = e; //repace ii'th by temp
          }
          //don't bother checking other rows since we've swapped
          break;
        }
      }
      //get the new diagonal
      e = C[i][i];
      //if it's still 0, not invertable (error)
      if (e === 0) throw new Error("Matrix isn't invertible");
    }

    // Scale this row down by e (so we have a 1 on the diagonal)
    for (let j = 0; j < dim; j++) {
      C[i][j] = C[i][j] / e; //apply to original matrix
      I[i][j] = I[i][j] / e; //apply to identity
    }

    // Subtract this row (scaled appropriately for each row) from ALL of
    // the other rows so that there will be 0's in this column in the
    // rows above and below this one
    for (let ii = 0; ii < dim; ii++) {
      // Only apply to other rows (we want a 1 on the diagonal)
      if (ii === i) {
        continue;
      }

      // We want to change this element to 0
      e = C[ii][i];

      // Subtract (the row above(or below) scaled by e) from (the
      // current row) but start at the i'th column and assume all the
      // stuff left of diagonal is 0 (which it should be if we made this
      // algorithm correctly)
      for (let j = 0; j < dim; j++) {
        C[ii][j] -= e * C[i][j]; //apply to original matrix
        I[ii][j] -= e * I[i][j]; //apply to identity
      }
    }
  }

  //we've done all operations, C should be the identity
  //matrix I should be the inverse:
  //64-bit round to 15 places for more reliable invertibility
  return I;
}

export const is2dArray = <T>(x: unknown[]): x is T[][] => Array.isArray(x[0]);

/**
 * Generic Matrix multication function
 * @param A -m×n matrix as 2D array, or 1×n rowspace as 1D array
 * @param B n×p matrix as 2D array, or n×1 colspace as 1D array
 * @returns m×p result as 2D array, or single colspaces/rowspaces as 1D array
 */
export function mmult(A: number[], B: number[][]): number[];
export function mmult(A: number[][], B: number[]): number[];
export function mmult(A: number[][], B: number[][]): number[][];
export function mmult(A: number[] | number[][], B: number[] | number[][]): number[] | number[][] {
  const isA2d = is2dArray<number>(A);
  const isB2d = is2dArray<number>(B);

  //P romote row-space and col-space inputs into 2D
  const M: number[][] = isA2d ? A : [A];
  const N: number[][] = isB2d ? B : B.map((u) => [u as number]);

  const M_cols = M.length;
  const N_rows = N.length;
  if (M_cols !== N_rows) throw new Error(`Matrix dimensions are not compatible`);

  const R_rows = M.length;
  const R_cols = N[0].length;

  let R = new Array(R_rows);
  for (let i = 0; i < R_rows; i++) {
    R[i] = new Array(M_cols).fill(0);
  }

  for (let i = 0; i < R_rows; i++) {
    const Ri = R[i];
    for (let j = 0; j < R_cols; j++) {
      let val = 0;
      for (let k = 0; k < N_rows; k++) {
        val += M[i][k] * N[k][j];
      }
      Ri[j] = val;
    }
  }

  //Flatten single-row / -column spaces
  if (R_rows === 1) R = [].concat(...R);
  if (R_cols === 1) R = R[0];

  return R;
}

/**
 * Optimized matrix multiplication for matrices M of size 3×3 and N of size 3×1
 * @param M 3×3 matrix as 2D array
 * @param N 3×1  matrix as 1D array
 * @returns 3×1  matrix as 1D array
 */
export function mmult3331(
  [[Ma, Mb, Mc], [Md, Me, Mf], [Mg, Mh, Mi]]: number[][],
  [Na, Nb, Nc]: number[],
): [number, number, number] {
  return [Ma * Na + Mb * Nb + Mc * Nc, Md * Na + Me * Nb + Mf * Nc, Mg * Na + Mh * Nb + Mi * Nc];
}

export function mmult3333(
  [[Ma, Mb, Mc], [Md, Me, Mf], [Mg, Mh, Mi]]: number[][],
  [[Na, Nb, Nc], [Nd, Ne, Nf], [Ng, Nh, Ni]]: number[][],
): [[number, number, number], [number, number, number], [number, number, number]] {
  return [
    [Ma * Na + Mb * Nd + Mc * Ng, Ma * Nb + Mb * Ne + Mc * Nh, Ma * Nc + Mb * Nf + Mc * Ni],
    [Md * Na + Me * Nd + Mf * Ng, Md * Nb + Me * Ne + Mf * Nh, Md * Nc + Me * Nf + Mf * Ni],
    [Mg * Na + Mh * Nd + Mi * Ng, Mg * Nb + Mh * Ne + Mi * Nh, Mg * Nc + Mh * Nf + Mi * Ni],
  ];
}

export const rad2deg = (x: number) => x * (180 / Math.PI);
export const deg2rad = (x: number) => x * (Math.PI / 180);

/**
 * Breadth-first search, used to find conversion path between `ColorSpace` objects
 * @param start Beginning node
 * @param end Node to find
 * @param nextEdges Next source of edges as a function of the current node
 * @returns Path array from `start` to `end`
 */
export function bfsPath<T>(start: T, end: T, nextEdges: (curr: T) => T[]) {
  let curr = start;
  const queue = [[curr]];
  const visited: T[][] = [[]];

  while (queue.length) {
    const path = queue.shift()!;

    curr = path.at(-1)!;
    visited.push(path);

    if (curr === end && path.length > 1) return path;

    if (!curr) continue;
    for (const k of nextEdges(curr)) {
      if (!visited.find((v) => v[v.length - 1] === k)) queue.push([...path, k]);
    }
  }
  return undefined;
}

export function evenFn(fn: (input: number) => number): (input: number) => number {
  return (input) => (input < 0 ? -1 * fn(-input) : fn(input));
}

export function withProps<F extends (...args: any) => any>(fn: F, props: Parameters<F>[1], propsArgNum = 1) {
  return ((...args) => {
    args[propsArgNum] = { ...props, ...args[propsArgNum] };
    return fn(...args);
  }) as F;
}

export const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

// Hex color strings conversions u16 arrays

export function hexFromArray(values: number[]): string {
  if (values.length !== 3) throw new Error("Input array must have exactly three values");
  return "#" + values.map((v) => v.toString(16).padStart(2, "0")).join("");
}
export function arrayFromHex(hex: string) {
  if (hex.length !== 7 || hex[0] !== "#") throw new Error("Invalid hex string");
  return [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((v) => parseInt(v, 16));
}

// Quantization

/**
 * Quantize float value to `bitDepth` bits
 */
export function quantize(
  float: number,
  bitDepth = 8,
  range: "full" | "limited" | "chrominance" = "full",
  roundHalfToEven = false,
) {
  const round = roundHalfToEven ? roundHTE : Math.round;
  const res = 1 << bitDepth;
  let sigMin, sigMax;
  switch (range) {
    case "full":
      sigMin = 0;
      sigMax = res - 1;
      break;
    case "limited":
      sigMin = 0.0625 * res;
      sigMax = 0.91796875 * res;
      break;
    case "chrominance":
      sigMin = 0.0625 * res;
      sigMax = 0.9375 * res;
      break;
  }
  return round(sigMin + float * (sigMax - sigMin));
}

export function dequantize(int: number, bitDepth = 8, range: "full" | "limited" | "chrominance" = "full") {
  const res = 1 << bitDepth;
  let sigMin, sigMax;
  switch (range) {
    case "full":
      sigMin = 0;
      sigMax = res - 1;
      break;
    case "limited":
      sigMin = 0.0625 * res;
      sigMax = 0.91796875 * res;
      break;
    case "chrominance":
      sigMin = 0.0625 * res;
      sigMax = 0.9375 * res;
      break;
  }
  return (int - sigMin) / (sigMax - sigMin);
}

// https://gist.github.com/davidfurlong/463a83a33b70a3b6618e97ec9679e490
export function deepObjSortStringify(obj: object) {
  const replacer = (key: string, value: any) =>
    value instanceof Object && !(value instanceof Array)
      ? Object.keys(value)
          .sort()
          .reduce((sorted: any, key: any) => {
            sorted[key] = value[key];
            return sorted;
          }, {})
      : value;

  return JSON.stringify(obj, replacer);
}

export const defaultMemoizeIdentifier = (...args: any[]) =>
  args.map((a) => (a instanceof Object && !(a instanceof Array) ? deepObjSortStringify(a) : String(a))).toString();

// ----------------
// TODO: make hard-coded space/gamut/curve name be default memoized identifier to avoid json string-parsing monstrosity
// ----------------
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  identifier: (...args: Parameters<T>) => any = defaultMemoizeIdentifier,
): T {
  const memoStore = new Map<any, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const id = identifier(...args);

    // console.log("identifier", id);
    const memoizedFn = fn(...args);

    if (id !== undefined && !memoStore.has(id)) {
      memoStore.set(id, memoizedFn);
    }

    return memoStore.get(id);
  }) as T;
}

export function clamp(num: number, min = 0, max = 1) {
  return num > max ? max : num < min ? min : num;
}
