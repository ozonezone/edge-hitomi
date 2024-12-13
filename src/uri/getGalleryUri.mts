import {Gallery} from "../type.mjs";
import {HITOMI_LA, HTTPS} from "../constants.mjs";

/**
 * Generates the Hitomi Gallery URI.
 * @param {Gallery | number | string} gallery - The gallery object or ID.
 * @returns {string} The generated Hitomi Gallery URI.
 */
export function getGalleryUri(gallery: Gallery | number | string): string {
	//yes it was that easy. fight me.
	return `${HTTPS}${HITOMI_LA}/galleries/${typeof(gallery) === 'string' || typeof(gallery) === 'number' ? gallery : gallery.id}.html`;
}
