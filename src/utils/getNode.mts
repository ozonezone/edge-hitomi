import {BinaryReader} from "./BinaryReader.mjs";
import {Node} from "../type.mjs";

/**
 * Parses binary data into a Node structure.
 * The binary format is strictly defined as follows:
 * - 4 bytes: number of keys (keyCount)
 * - For each key:
 *   - 4 bytes: key size (must be between 1 and 31)
 *   - keySize bytes: key data
 * - 4 bytes: number of data entries (dataCount)
 * - For each data entry:
 *   - 8 bytes: offset (BigInt)
 *   - 4 bytes: length
 * - 17 * 8 bytes: subnode addresses
 *
 * @param {ArrayBuffer} data - Raw binary data to parse
 * @returns {Node} Parsed node structure
 * @throws {Error} If key size is invalid (not between 1 and 31)
 */
export function getNode(data: ArrayBuffer): Node {
	const reader = new BinaryReader(data);
	const node: Node = {
		keys: [],
		datas: [],
		subnodeAddresses: []
	};

	const keyCount = reader.readInt32BE();

	// Read keys
	for (let i = 0; i < keyCount; i++) {
		const keySize = reader.readInt32BE();

		if (keySize > 0 && keySize < 32) {
			node.keys.push(reader.readBytes(keySize));
		} else {
			throw new Error('Invalid keySize: must be between 1 and 31');
		}
	}
	
	// Read data entries (offset, length pairs)
	const dataCount = reader.readInt32BE();
	for (let i = 0; i < dataCount; i++) {
		node.datas.push([
			reader.readBigUInt64BE(),
			reader.readInt32BE()
		]);
	}
	
	// Read 17 fixed subnode addresses
	for (let i = 0; i < 17; i++) {
		node.subnodeAddresses.push(reader.readBigUInt64BE());
	}

	return node;
}
