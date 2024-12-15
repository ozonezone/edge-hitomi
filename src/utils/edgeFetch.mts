import {HitomiError} from "./HitomiError.mjs";
import {ERROR_CODE, HITOMI_LA, HTTPS} from "../constants.mjs";


/**
 * Fetches data after transformation of Headers
 * @param {string} URL - The URL to fetch data from
 * @param {HeadersInit} userHeaders - Optional User provided headers for the request to make request more realistic
 * @returns {Promise<Response>} - A promise that resolves to an ArrayBuffer containing the response data
 *
 * @throws {HitomiError} Throws if request is rejected (non 200/206 status)
 * @throws {HitomiError} Throws if response body is null
 * @throws {HitomiError} Throws if any network or processing error occurs
 *
 */
export async function edgeFetch(
	URL: string,
	userHeaders?: HeadersInit,
): Promise<Response> {
	const requestOptions: RequestInit = {
		method: 'GET',
		headers: {
			...(userHeaders || {}),
			Accept: '*/*',
			Connection: 'keep-alive',
			Referer: `${HTTPS}${HITOMI_LA}`,
			Origin: `${HTTPS}${HITOMI_LA}`,
		},
	};

	const response: Response = await fetch(
		URL,
		requestOptions);
	
	if (![200, 206].includes(response.status)) {
		throw new HitomiError(ERROR_CODE.REQUEST_REJECTED, response.status, URL);
	}
	
	if (!response?.body) {
		throw new HitomiError(ERROR_CODE.REQUEST_REJECTED, 422, URL);
	}
	return response;
}

/**
 * Converts the response to a Uint8Array.
 * @param {Response} response - The response object to convert.
 * @returns {Promise<Uint8Array>} A promise that resolves to a Uint8Array containing the response data.
 */
export async function toTypedArray(response: Response): Promise<Uint8Array> {
	const buffer = await response.arrayBuffer();
	return new Uint8Array(buffer);
}

export async function toTypedArraySlow(response: Response): Promise<Uint8Array> {
	const chunks: Uint8Array<ArrayBufferLike>[] = [],
		  reader = response.body!.getReader() ;
	let totalLength: number = 0;

	while (true) {
		const {done, value} = await reader.read();
		if (done) {
			break;
		}
		chunks.push(value);
		totalLength += value.length;
	}
	const outputArrayBuffer: Uint8Array<ArrayBuffer> = new Uint8Array(totalLength);
	let offset: number = 0;

	for (const chunk of chunks) {
		outputArrayBuffer.set(chunk, offset);
		offset += chunk.length;
	}
	return outputArrayBuffer;
}

