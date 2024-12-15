import {getNode} from "./getNode.mjs";
import {Node} from "../type.mjs";
import {edgeFetch} from "./edgeFetch.mjs";
import {HITOMI_LA, HTTPS} from "../constants.mjs";

export async function getNodeAtAddress(address: bigint, version: string): Promise<Node | undefined> {
	const response = await edgeFetch(`${HTTPS}ltn.${HITOMI_LA}/galleriesindex/galleries.${version}.index`,
			{
				Range: `bytes=${address}-${address + 463n}`
			}
	);

	if (response.status === 206) {  // Partial Content
		const arrayBuffer = await response.arrayBuffer();
		if (arrayBuffer.byteLength > 0) {
			return getNode(arrayBuffer);
		}
	}
	return undefined;
}
