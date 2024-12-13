import {getNode} from "./getNode.mjs";
import {Node} from "../type.mjs";

export async function getNodeAtAddress(address: bigint, version: string): Promise<Node | undefined> {
	const response = await fetch(
		`ltn.hitomi.la/galleriesindex/galleries.${version}.index`,
		{
			headers: {
				'Range': `bytes=${address}-${address + 463n}`
			}
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
