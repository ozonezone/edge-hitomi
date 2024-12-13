import {Gallery} from "../type.mjs";
import {HitomiError} from "../utils/HitomiError.mjs";
import {ERROR_CODE, HITOMI_LA, HTTPS} from "../constants.mjs";

/**
 * Returns the URI for the video of the given gallery
 * @param {Gallery} gallery - The gallery object to get the video URI of
 * @returns {string} - The URI for the video
 * @throws {HitomiError} - Throws an error if the gallery type is not 'anime'
 */
export function getVideoUri(gallery: Gallery) {
	if(gallery.type !== 'anime') {
		throw new HitomiError(ERROR_CODE.INVALID_VALUE, 'type', 'anime');
	}
	return `${HTTPS}streaming.${HITOMI_LA}/videos/${gallery.title.display.toLowerCase().replace(/\s/g, '-')}.mp4`;
}
