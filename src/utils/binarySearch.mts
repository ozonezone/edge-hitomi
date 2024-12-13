import {Node} from "../type.mjs";
import {compareUint8Arrays} from "./compareUint8Arrays.mjs";
import {getNodeAtAddress} from "./getNodeAtAddress.mjs";

/**
 * Performs binary search in the gallery index B-tree.
 * The search is performed recursively, traversing the tree based on key comparisons.
 * At each node:
 * 1. Compare the search key with node keys
 * 2. If exact match found, return associated data
 * 3. If no match, recurse into appropriate child node
 * 4. If leaf node reached with no match, return undefined
 *
 * @param {Uint8Array} key - Search key (4 bytes from SHA-256 hash)
 * @param {Node} node - Current node being searched
 * @param {string} version - Gallery index version
 * @returns {Promise<[bigint, number] | undefined>} Tuple of [offset, length] pointing to matching gallery data, or undefined if not found
 *
 * @example
 * const key = await sha256First4Bytes("search term");
 * const rootNode = await getNodeAtAddress(0n, version);
 * const result = await binarySearch(key, rootNode, version);
 */
export async function binarySearch(
	key: Uint8Array,
	node: Node,
	version: string
): Promise<[bigint, number] | undefined> {
	if (node.keys.length === 0) {
		return undefined;
	}
	
	let index = 0;
	let compareResult = -1;
	
	// Find insertion point for key
	while (index < node.keys.length) {
		compareResult = compareUint8Arrays(key, node.keys[index]);
		if (compareResult <= 0) break;
		index++;
	}
	
	// Exact match found
	if (compareResult === 0) {
		return node.datas[index];
	}
	
	// No matching subnode
	if (node.subnodeAddresses[index] === 0n) {
		return undefined;
	}
	
	// Check if we're at a leaf node
	const isLeaf = node.subnodeAddresses.every(addr => addr === 0n);
	if (isLeaf) {
		return undefined;
	}
	
	// Recurse into appropriate subnode
	const subnode = await getNodeAtAddress(node.subnodeAddresses[index], version);
	if (!subnode) {
		return undefined;
	}
	
	return binarySearch(key, subnode, version);
}
