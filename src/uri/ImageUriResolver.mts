import {edgeFetch} from "../utils/edgeFetch.mjs";
import {HitomiError} from "../utils/HitomiError.mjs";
import {ERROR_CODE, HITOMI_LA, HTTPS} from "../constants.mjs";
import {HitomiImage, ImageExtensions} from "../type.mjs";

export class ImageUriResolver {
	// As of ES2022, Symbol is not needed for private fields.
	static #pathCode: string;
	static #startsWithA: boolean;
	static #subdomainCodes: Set<number> = new Set<number>();
	static #response: string;

	/**
	 * Synchronizes the subdomain codes and path codes.
	 * @throws {HitomiError} - If the subdomain codes contain an invalid value
	 */
	static async synchronize(): Promise<void> {
		this.#response = await edgeFetch('ltn.', '/gg.js')
			.then(async (res)  => await res.text());

		let currentIndex: number = 0;
		let nextIndex: number = this.#response.indexOf('\n');

		this.#subdomainCodes.clear();

		// haha processor & memory go brrrr
		while(nextIndex !== -1) {
			switch(this.#response[currentIndex]) {
				// in gg.js it is the "case {number}:" lines
				case 'c': {
					this.#subdomainCodes.add(Number(this.#response.slice(currentIndex + 5, nextIndex - 1)));
					break;
				}
				// in gg.js it is the "o = {0 | 1}; break;" line
				case 'o': {
					this.#startsWithA = this.#response[currentIndex + 4] === '0';
					break;
				}
				// in gg.js it is the "b: {number}/" line
				case 'b': {
					this.#pathCode = this.#response.slice(currentIndex + 4, nextIndex - 2);
					break;
				}
			}

			currentIndex = nextIndex + 1;
			nextIndex = this.#response.indexOf('\n', currentIndex);
		}

		if(this.#subdomainCodes.has(NaN)) {
			this.#subdomainCodes.clear();
			throw new HitomiError(ERROR_CODE.INVALID_VALUE, "/gg.js");
		}

		return;
	}

	/**
	 * Returns the URI of the image with the given extension.
	 * @param {HitomiImage} image - The image object to get the URI of
	 * @param {ImageExtensions} extension - The extension of the image to get
	 * @param {Object} options - Optional object to specify the type of the image
	 * @param {boolean} options.isThumbnail - Whether the image is a thumbnail
	 * @param {boolean} options.isSmall - Whether the image is a small image
	 * @returns {string} - The URI of the image
	 * @throws {HitomiError} - If the image does not have the given extension
	 * @throws {HitomiError} - If the subdomain codes are not synchronized
	 * @throws {HitomiError} - If the image is not a thumbnail and is small
	 **/
	static getImageUri(
		image: HitomiImage,
		extension: ImageExtensions,
		options: { isThumbnail?: boolean; isSmall?: boolean; }): string {

		/*
		As of now, the fullsize image pathname is as follows:
		`/pathCode/imageHashCode/imageHash.extension`
		where `pathCode` is `b: nnnnnnnnnn/`,
		`imageHashCode` is the `s: some script here`
		and `imageHash` is the `hash` property of the {@link HitomiImage} object.

		References:
		make_source_element from /reader.js
		subdomain_from_url /common.js
		gg from /gg.js
		 */

		if(!options.isThumbnail && options.isSmall) {
			throw new HitomiError(ERROR_CODE.INVALID_VALUE, "isSmall", "used w/ isThumbnail");
		}

		if(!this.#subdomainCodes.size) {
			throw new HitomiError(ERROR_CODE.INVALID_VALUE, "getImageUri", "called after synchronize");
		}

		if(!image[`has${extension[0].toUpperCase()}${extension.slice(1)}` as keyof HitomiImage]) {
			throw new HitomiError(ERROR_CODE.INVALID_VALUE, `${image.name}`, `${extension}`);
		}

		let path: string = extension;
		let subdomain: string = 'a';
		const imageHashCodeParts = [image.hash.slice(-1), image.hash.slice(-3, -1)];
		const imageHashCode: number = Number.parseInt(imageHashCodeParts[0] + imageHashCodeParts[1], 16);
		// both webp and avif have smalltn and smallsmalltn,
		// bigtn thumbnails tend to be unreliable.
		if(options.isThumbnail) {
			path += `${options.isSmall ? "small" : ""}smalltn/${imageHashCodeParts[0]}/${imageHashCodeParts[1]}`;
			subdomain = "tn";
		} else {
			path += `/${this.#pathCode}/`;
		}
		// Reference subdomain_from_url from /common.js
		return `${HTTPS}${this.#subdomainCodes.has(imageHashCode) === this.#startsWithA ? "a" : "b"}${subdomain}.${HITOMI_LA}/${path}/${image.hash}.${extension}`
	}
}


