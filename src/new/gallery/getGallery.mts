import {Gallery, HitomiImage, Tag} from "../newType";
import {edgeFetch} from "../utils/edgeFetch.mjs";
import {ContentTypes, JSONGallery} from "../newType";
import {HitomiError} from "../utils/HitomiError";
import {ERROR_CODE} from "../namedConstants";

/**
 * Fetches and formats the gallery object with the given ID
 * @param {number} id - The gallery ID to fetch
 * @param {Headers} userHeaders - Optional User provided headers for the request to make request more realistic
 * @returns {Promise<Gallery>} - A promise that resolves to the gallery object
 */
export async function getGallery(id: number, userHeaders?: Headers): Promise<Gallery> {
	const response = await edgeFetch('ltn.', `/galleries/${id}.js`, userHeaders)
		.then(res => res.text())
		.then(text => JSON.parse(text.replace(/^var +\w+ *= */, '')) as JSONGallery);
	console.log(response);
	return {
		id: Number.parseInt(response.id as string),
		title: {
			display: response.title,
			japanese: response.japanese_title as string
		},
		type: response.type as ContentTypes,
		languageName: {
			english: response.language as string,
			local: response.language_localname as string
		},
		artists: response.artists?.map(({artist}) => artist) || [],
		groups: response.groups?.map(({group}) => group) || [],
		series: response.parodys?.map(({parody}) => parody) || [],
		characters: response.characters?.map(({character}) => character) || [],
		tags: response.tags?.map(({tag, male, female}) => {
			if (!male && !female) return {type: 'tag', name: tag} as Tag;
			// see /galleries/111.js for numeric literals, new galleries have string literals
			else if (male == '' && (female == 1 || female == '1')) return {type: 'female', name: tag} as Tag;
			else if (female == '' && (male == 1 || male == '1')) return {type: 'male', name: tag} as Tag;
			else throw new HitomiError(ERROR_CODE.INVALID_VALUE, tag);
		}) || [],
		files: response.files?.map(({hash, name, hasavif, haswebp, hasjxl, width, height}, index) => ({
			index,
			hash,
			name,
			hasAvif: Boolean(hasavif),
			hasWebp: Boolean(haswebp),
			hasJxl: Boolean(hasjxl),
			width,
			height,
		} as HitomiImage)) || [],
		publishedDate: new Date(response.date),
		translations: response.languages?.map(({galleryid, language_localname, name}) => ({
			id: galleryid,
			languageName: {
				english: name,
				local: language_localname
			}
		} as Pick<Gallery, 'id' | 'languageName'>)),
		relatedIds: response.related,
	};
}
