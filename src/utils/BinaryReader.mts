/**
 * A utility class for reading binary data sequentially from an ArrayBuffer.
 * Provides methods to read different data types in big-endian format.
 *
 * @class
 * @example
 * const reader = new BinaryReader(arrayBuffer);
 * const int32 = reader.readInt32BE();
 * const bigInt = reader.readBigUInt64BE();
 * const bytes = reader.readBytes(4);
 */
export class BinaryReader {
	private view: DataView;
	private offset: number = 0;
	
	/**
	 * Creates a new BinaryReader instance.
	 * @param {ArrayBuffer} buffer - The buffer to read from
	 */
	constructor(buffer: ArrayBuffer) {
		this.view = new DataView(buffer);
	}
	
	/**
	 * Reads a 32-bit integer in big-endian format and advances the offset.
	 * @returns {number} The read 32-bit integer
	 */
	readInt32BE(): number {
		const value = this.view.getInt32(this.offset, false);
		this.offset += 4;
		return value;
	}
	
	/**
	 * Reads a 64-bit unsigned integer in big-endian format and advances the offset.
	 * @returns {bigint} The read 64-bit unsigned integer
	 */
	readBigUInt64BE(): bigint {
		const value = this.view.getBigUint64(this.offset, false);
		this.offset += 8;
		return value;
	}
	
	/**
	 * Reads specified number of bytes and advances the offset.
	 * @param {number} length - Number of bytes to read
	 * @returns {Uint8Array} Array containing the read bytes
	 */
	readBytes(length: number): Uint8Array {
		const bytes = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length);
		this.offset += length;
		return bytes;
	}
	
	/**
	 * Gets current position in the buffer.
	 * @returns {number} Current offset in bytes
	 */
	get position(): number {
		return this.offset;
	}
}
