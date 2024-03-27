/** Same as `Number.prototype.toFixed` but floors the stringed value. */
export function toFixedFloor(num: number, digits: number): string {
	// E.g., 1.23456789 digits 5
	// 1.23456789.toFixed(5) = 1.23457
	// toFixedFloor(1.23456789, 5) = 1.23456

	// 1.23456789.toFixed(5 + 1) = 1.234567 & remove the final digit
	const numStr = num.toFixed(digits + 1);
	return numStr.slice(0, numStr.length - 1);
}

// The below two functions can be tested in the TypeScript playground:
// https://www.typescriptlang.org/play?#code/PQKhAIBUCcFcDsDGBDALgUwM7lQC3eAOYCWAbuvOPLALYBG60OA9uAAYAO06ixmxzeG3D9C8YgDNiKeKnAATYiVSYAdAFgAUOBBad4KLj4LJExtgnRmNdqmYAFbr36DhAdyOJc4KwnnY8AmZYVA4Q8FJkABtYdA1tEGAtCQREVAFKVDgkNHRIZgBlJXEpGVQAESViFQAKLQBIahoALipaBmgAGgauHj4M1qaOrQBKVsws4nhCcABvBsRBCfBe53R5cABeNppVO0c+l3ga1f7BEYBuBslwGoA5dsYTpz51kfAAHm2m9-nNevqwGA4AAglFuMh5ABPcAMCg4bIoDDyVTgABK6FQsGglGQmAAtHx4gDuFicT50DRmOQAKIADw4ggo6Wid2YqDQGWehzeV3+AF8tELtAZwIt4MtTph1g8bNtZR1uWt5JcGkDwAVYHQssg0uBLNYcPgVi9pRtyNAjsT1QBGAAM4AAeitmG5GAB5CQAGTxqAAkvB5Og6eA3MQolEKWTMsb+AAvIISI0EKK+kTFSTSZCyEzKa3AuKEVSdcA3Jql7B21R2u02+02gCc4GzGylGQr4AArCW8MZjFWa4Pa7cPIwCIFwE2+CMFks5Iy3dBPT6JgGgyHtgBZNC4VSIdDhur-erbvCqKLMQj2pWveSy974k2HDINVX-cXLLKpXIbb60cCPvaOgQAuHrer6a7BnyopikszBRHEF6EDUsxPsqJZSjKtAlkh9qtKeu64XaN5mveGGumBK7+oGwY9oiP7gPyb71KS2KUNwVK0gyTKyMQrLspygg1F+OTInsDimlybbnG+gqaFooAQBinHjsabDoAA1MA+JCKWuIiJM0yZusOwdCW4oWuk0ylnIUx2M2JrMBwjB6BA+rMNANBoPEOhJJoKRIOkggUip9KMvAzJ8VEbIckFxxNOMhmEGMBnQFMMx-PUH5yAA2k0BRZCWwYcAV0AALpbDsqiYBwUTVDUABE6ANcxNw1PlWRbJs2x+OgUgRSqcwNPUeBWG4VDoONNLQFY0CNQGkR1RsQyMKl6UtXy9RydcSY1MVpVdT1NH9W8Q3Hqx5IddAm3be+c7gMVlUcMglroAGqB7QypUlvarW7Y93XbHavzDRdlBXTdwqzhKchXQA6tUuDBBU7KVVdqjcLVuroI1qgNSWDUbdDyzyOykEbrc6NTIgMRBpguMteAAD84A2uArTA+AGkPQy0Gih+8GIZeKFNCWV1FQyEslYVChkzRdJi7QpUI3gyPlOyTHCjB6psgofReZGz3QKgeiim18OI2r7LnhQhB4J82yk9R64gyKMEGGDOzK5bITq3I3MNXaDUY+gzloDUTvkwBXtZCrSO+9bCHTHgM5u4xpsGOqVZ0jnGelrtkfy584Cc387uip7gd41z4CB8HmPoOH+KFy7NcW6rCeoHzBhySxmJsbcw3t-HKOoNVdX7jUdoli3wbvAH1fc8PVtj5gE847PdKp-UsnCjTeLYCCmDSsbGTTbNPMYIG2Dnx5czp-5qRxc2x+MKgHyQAAfDUyCtJAJZ0D-q7GCbVkDgAAITdVhMA8uRoxoTXGkfE+cVb5zQamA0mWAqCo3QAAR1gNEWErQGo1wAFIFHdHcaqSVJBQh-vPWuECoEkO5uQyh1C0pGQkHQugIw3wwTkrdA+b9hL0QwPkIoYhMxlEqMoemVYbQ-RGATBRRNNDCONqI784jCgZlKNmCoVRagKIAEwAGYSwmOUbXUxaiNEfREkiPIuipH6NkLI6o9MbTmIACwljMdYhq3izFBzfPYrRolnGSJKFmdxRj6YNgAPoNhScklJ-jAkpIbEOOxr9NGONyBIvRsTDFyJqH48AAA2QJPjqw5LCXkhxYionFJkfEqedShx2myZ2BslSSw+MCQOLp3S7S9NycgiJTiimuJKR44xAyhmdImSIgpOjonSIMfM+mAAOHZlSTGqDMQ2HxJifEAHYQl2h2T47s4ArEEz2TWFqWhwlrJabMtpZThl2kqZ2HZ5zAWVJ2Z2X5FybRmJ2ZYpZg4-lqIFghc8wsGpgkjBgCY2Bnqv3kOAl5mggA

/** Truncates the given number to `precision` significant digits.
 *
 *  This differs from `toPrecision` which rounds the output value.
 */
export function truncateToSignificantDigits(
	num: number,
	precision: number
): string {
	const precised = num.toPrecision(precision);
	if (Number(precised) <= num) {
		// Already been truncated. Return as-is.
		return removeExponentialNotation(precised);
	}

	const precisedNum = Number(precised);
	// Subtract from the precised version.
	// 10 ^ powerOfLastIndex will return the size of the last significant digit.
	// e.g., if num is 0.0011019 and precision is 5, this is 0.0000001 (where the 9 is)
	const powerOfLastIndex = Math.ceil(Math.log10(precisedNum) - precision);
	const truncated = num - 10 ** powerOfLastIndex;
	return removeExponentialNotation(truncated.toPrecision(precision));
}

/** Remove the `e+/-n` in a stringified number, converting it into a proper
 *  format.
 */
export function removeExponentialNotation(num: string): string {
	const [numStr, expStr] = num.split("e");
	if (numStr === undefined) {
		throw new Error("Invalid number string");
	}

	if (expStr === undefined) {
		return numStr;
	}

	const exp = parseInt(expStr, 10);
	if (exp === 0) {
		return numStr;
	}

	const numStrWithoutDot = numStr.replace(".", "");
	const dotIndex = (numStr.includes(".") ? 1 : 0) + exp;

	// No decimal part
	if (numStrWithoutDot.length <= dotIndex) {
		return numStrWithoutDot + "0".repeat(dotIndex - numStrWithoutDot.length);
	}
	// 0.xxx
	if (dotIndex < 0) {
		return "0." + "0".repeat(-dotIndex) + numStrWithoutDot;
	}
	return (
		numStrWithoutDot.slice(0, dotIndex) + "." + numStrWithoutDot.slice(dotIndex)
	);
}

/**
 * Linearly interpolates between two values.
 * @param start - The starting value.
 * @param end - The ending value.
 * @param t - The interpolation value between 0 and 1.
 * @returns The interpolated value between start and end.
 */
export function lerp(start: number, end: number, t: number) {
	return start * (1 - t) + end * t;
}

/** Euler mod of two numbers. */
export function mod(a: number, b: number): number {
	return ((a % b) + b) % b;
}
