# colorimetry-ts

A type-safe color science library, written for Javascript.

## Installation

    npm install colorimetry-ts

Then import as an ES module:

```js
import { color } from "colorimetry-ts";
```

## Features

- Value conversions between most widely-used color spaces
  - Supports custom RGB (and non-RGB) color spaces
- Object definitions for common color gamut primaries and illuminants
- Function definitions for common tone response transfer functions
- Color differences
  - Includes CIE2000, ITP , CIE1976 (TODO), u′v′
  - Supports luminance component compensation
- Color gamut mapping
- Correlated color temperature
- Chromatic adaptation transforms
- ...and more

## Examples

Convert `sRGB` red primary to `display-p3` RGB encoding (using 8 bits):

```js
const srgbRed = color("srgb", [255, 0, 0], { bitDepth: 8 });
const srgbRedInP3 = srgbRed.toSpace("display-p3", { bitDepth: 8 });
console.log(srgbRedInP3.values);
// [ 234, 51, 35 ]
```

<sub>_The input/output of RGB values are normalized between 0–1 if no `bitDepth` value is passed to the color's context object argument._</sub>

Create an `XYZ` color space converter to convert multiple colors:

```js
const toXyz = color("xyz");
const color1 = color("srgb", [1, 1, 1]);
const color2 = color("display-p3", [1, 1, 1]);
const color3 = color("lab", [100, 0, 0]);
console.log(toXyz(color1), toXyz(color2), toXy(color3));
// [ 76.036, 80.000, 87.125 ]
// [ 76.036, 80.000, 87.125 ]
// [ 95.046, 100.00, 108.91 ]
```

Check if two colors are equal/indistinguishable from each other:

```js
// srgb and p3 share the same blue primary
// ...but their luminance is not equal!
const colorA = color("srgb", [0, 0, 1]);
const colorB = color("display-p3", [0, 0, 1]);
console.log(colorA.equals(colorB));
// false
// conversions should always be equal
console.log(srgbRed.equals(srgbRedInP3));
// true
```

# Roadmap

- Possibly support BigInt to avoid floating-point errors, for use in reference conversion values
