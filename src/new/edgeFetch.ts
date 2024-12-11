import {HitomiError} from "./HitomiError";
import {ERROR_CODE, HITOMI_LA, HTTPS} from "./namedConstants";


/**
 * Fetches data after transformation of Headers
 * @param {'' | `${string}.`} [subdomain] - Optional subdomain for the request
 * @param {'/' | `/${string}`} [path] - path component of the URL
 * @param {Headers} userHeaders - Optional User provided headers for the request to make request more realistic
 * @returns {Promise<ArrayBufferLike>} Promise that resolves to an ArrayBuffer containing the response data
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
): Promise<Uint8Array<ArrayBuffer>> {
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
		throw new HitomiError(ERROR_CODE.REQUEST_REJECTED, response.status, <string>path);
	}
	
	if (!response?.body) {
		throw new HitomiError(ERROR_CODE.REQUEST_REJECTED, 204, <string>path);
	}
	
	const chunks: Uint8Array<ArrayBufferLike>[] = [],
		reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>> = response.body.getReader();
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
