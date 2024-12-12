import {Gallery, Image, Tag} from "../type";
import {edgeFetch} from "./edgeFetch";
import {contentTypes, JSONGallery} from "./newType";
import {HitomiError} from "./HitomiError";
import {ERROR_CODE} from "./namedConstants";

export async function getGallery(id: number, userHeaders?: Headers): Promise<Gallery> {
	const response: JSONGallery = await edgeFetch('ltn.', `/galleries/${id}.js`, userHeaders)
		.then((res: Uint8Array<ArrayBuffer>) =>
			JSON.parse((new TextDecoder().decode(res)).replace(/^var +\w+ *= */, '')) as unknown as JSONGallery);
	const gallery = {
		id: Number.parseInt(response.id as string),
		title: {
			display: response.title,
			japanese: response.japanese_title as string
		},
		type: response.type as contentTypes,
		languageName: {
			english: response.language as string,
			local: response.language_localname as string
		},
		artists: response.artists?.map(({ artist }) => artist) || [],
		groups: response.groups?.map(({ group }) => group) || [],
		series: response.parodys?.map(({ parody }) => parody) || [],
		characters: response.characters?.map(({ character }) => character) || [],
		tags: response.tags?.map(({ tag, male, female }) => {
			if (!male && !female) return { type: 'tag', name: tag } as Tag;
			// see /galleries/111.js for numeric literals, new galleries have string literals
			else if (male == '' && (female == 1 || female == '1')) return { type: 'female', name: tag } as Tag;
			else if (female == '' && (male == 1 || male == '1')) return {type: 'male', name: tag} as Tag;
			else throw new HitomiError(ERROR_CODE.INVALID_TAG, tag);
		}),
		files: response.files?.map(({ hash, name, hasavif, haswebp, hasjxl, width, height }, index) => ({
			index,
			hash,
			name,
			hasAvif: Boolean(hasavif),
			hasWebp: Boolean(haswebp),
			hasJxl: Boolean(hasjxl),
			width,
			height,
		} as Image)),
		publishedDate: new Date(response.date),
		translations: response.languages?.map(({ galleryid, language_localname, name }) => ({
			id: galleryid,
			languageName: {
				english: name,
				local: language_localname
			}
		} as Pick<Gallery, 'id' | 'languageName'>)),
		relatedIds: response.related,
	}
	return gallery;
}
