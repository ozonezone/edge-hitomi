import {getNode} from "./getNode.mjs";
import {Node} from "../type.mjs";
import {edgeFetch} from "./edgeFetch.mjs";

export async function getNodeAtAddress(address: bigint, version: string): Promise<Node | undefined> {
	const response = await edgeFetch(
		"ltn.", `/galleriesindex/galleries.${version}.index`,
			new Headers({
				'Range': `bytes=${address}-${address + 463n}`
			})
	);

	if (response.status === 206) {  // Partial Content
		const arrayBuffer = await response.arrayBuffer();
		if (arrayBuffer.byteLength > 0) {
			return getNode(arrayBuffer);
		}
	}
	return undefined;
}
