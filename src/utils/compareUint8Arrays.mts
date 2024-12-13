/**
 * Compares two Uint8Arrays lexicographically.
 * Performs byte-by-byte comparison until a difference is found or one array ends.
 *
 * @param {Uint8Array} a - First array to compare
 * @param {b} b - Second array to compare
 * @returns {number} Negative if a < b, 0 if equal, positive if a > b
 *
 * @example
 * const result = compareUint8Arrays(new Uint8Array([1, 2]), new Uint8Array([1, 3]));
 * console.log(result); // -1
 */
export function compareUint8Arrays(a: Uint8Array, b: Uint8Array): number {
	const minLength = Math.min(a.length, b.length);
	for (let i = 0; i < minLength; i++) {
		if (a[i] !== b[i]) {
			return a[i] < b[i] ? -1 : 1;
		}
	}
	return a.length - b.length;
}
