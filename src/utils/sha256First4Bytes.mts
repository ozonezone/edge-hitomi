/**
 * Computes SHA-256 hash of input text and returns first 4 bytes.
 * Used for creating search keys from text input. The hash is truncated to 4 bytes
 * as that's sufficient for the B-tree search implementation.
 *
 * @param {string} text - Input text to hash
 * @returns {Promise<Uint8Array>} First 4 bytes of SHA-256 hash
 *
 * @example
 * const key = await sha256First4Bytes("search term");
 */
export async function sha256First4Bytes(text: string): Promise<Uint8Array> {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	return new Uint8Array(hashBuffer.slice(0, 4));
}
