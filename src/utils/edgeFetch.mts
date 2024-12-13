import {HitomiError} from "./HitomiError.mjs";
import {ERROR_CODE, HITOMI_LA, HTTPS} from "../constants.mjs";


/**
 * Fetches data after transformation of Headers
 * @param {'' | `${string}.`} [subdomain] - The subdomain for the request must be empty string or a string ending with a period. `''` or `'ltn.'`
 * @param {'/' | `/${string}`} [path] - The pathname component of the URL. Must be `'/'` or in the form of {@link URL.pathname} string
 * @param {Headers} userHeaders - Optional User provided headers for the request to make request more realistic
 * @returns {Promise<Response>} - A promise that resolves to an ArrayBuffer containing the response data
 *
 * @throws {HitomiError} Throws if request is rejected (non 200/206 status)
 * @throws {HitomiError} Throws if response body is null
 * @throws {HitomiError} Throws if any network or processing error occurs
 *
 * @example
 * const headers = request.headers;
 * const typedArray = await edgeFetch('ltn., '/path', headers);
 */
export async function edgeFetch(
	subdomain: '' | `${string}.`,
	path: '/' | `/${string}`,
	userHeaders?: Headers,
): Promise<Response> {
	const requestOptions: RequestInit = {
		method: 'GET',
		headers: {
			...(userHeaders || {}),
			Accept: '*/*',
			Connection: 'keep-alive',
			Referer: `${HTTPS}${HITOMI_LA}`,
			Origin: `${HTTPS}${HITOMI_LA}`,
		} as HeadersInit,
	};
	const response: Response = await fetch(
		`${HTTPS}${subdomain}${HITOMI_LA}${path}`,
		requestOptions);
	
	if (![200, 206].includes(response.status)) {
		throw new HitomiError(ERROR_CODE.REQUEST_REJECTED, response.status, path);
	}
	
	if (!response?.body) {
		throw new HitomiError(ERROR_CODE.REQUEST_REJECTED, 422, path);
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

