import {Gallery} from "../newType";
import {HITOMI_LA, HTTPS} from "../namedConstants";

/**
 * Returns the URI for the given gallery or its ID\
 * The original was too complicated but this redirects to the gallery page.
 * @param {Gallery | number | string} gallery - The gallery object or its ID
 * @returns {string} - The URI for the gallery
 */
export function getGalleryUri(gallery: Gallery | number | string): string {
	//yes it was that easy. fight me.
	return `${HTTPS}${HITOMI_LA}/galleries/${typeof(gallery) === 'string' || typeof(gallery) === 'number' ? gallery : gallery.id}.html`;
}