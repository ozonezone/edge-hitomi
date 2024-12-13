import {IdSet} from "../type.mjs";
import {ERROR_CODE, IS_NEGATIVE} from "../constants.mjs";
import {HitomiError} from "./HitomiError.mjs";

/**
 * Converts a buffer of 32-bit aligned integers into a Set of numbers.
 * Each integer is stored in 4 bytes:
 * - Byte 1: Sign byte (0x00 for positive, 0xFF for negative)
 * - Bytes 2-4: 24-bit big-endian integer value
 *
 * The entire set can also be marked as negative using the IS_NEGATIVE property,
 * which is separate from individual number signs in the buffer.
 *
 * @example
 * Example buffer values:
 * [0x00, 0x30, 0x23, 0x27] represents +3147559
 * [0xFF, 0x30, 0x23, 0x27] represents -3147559
 *
 * @param buffer - Uint8Array containing 4-byte aligned integers
 * @param isNegative - Optional flag to mark entire set as negative
 * @returns IdSet containing decoded integers with isNegative property
 * @throws {Error} If buffer length is not a multiple of 4
 */
export function getIdSet(buffer: Uint8Array, isNegative: boolean = false): IdSet {

	// nozomi files are encoded in 4-byte aligned integers (24-bit magnitude + 1-bit sign).

	const len = buffer.length;
	// Quick bitwise check if length is multiple of 4
	if (len & 3) throw new HitomiError(ERROR_CODE.INVALID_VALUE, 'buffer length', 'multiple of 4');

	// Create Set and add the isNegative property
	const integers = new Set<number>() as IdSet;
	integers[IS_NEGATIVE] = isNegative;

	// Cache bit shifts for performance
	const shift16 = 16, shift8 = 8;

	for (let i = 0; i < len; i += 4) {
		// Combine the 3 magnitude bytes into a 24-bit integer
		// If sign byte is 0xFF, subtract 0x1000000 to convert from two's complement
		integers.add(
			buffer[i] === 0xFF
				? ((buffer[i + 1] << shift16) | (buffer[i + 2] << shift8) | buffer[i + 3]) - 0x1000000
				: ((buffer[i + 1] << shift16) | (buffer[i + 2] << shift8) | buffer[i + 3])
		);
	}

	return integers;
}
