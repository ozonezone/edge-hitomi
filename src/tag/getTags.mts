
import {ContentTypes, StartingCharacter, Tag, TagTypes} from "../type.mjs";
import {ERROR_CODE, validContentTypes, validTagTypes} from "../constants.mjs";
import {HitomiError} from "../utils/HitomiError.mjs";
import {getTagUri} from "../uri/getTagUri.mjs";
import {edgeFetch} from "../utils/edgeFetch.mjs";

/**
 * Fetches tags based on the provided type and optional starting character.
 *
 * @param {TagTypes} type - The type of tags to fetch.
 * @param {StartingCharacter} [startsWith] - Optional starting character to filter tags.
 * *Note: startsWith is required for non-language and non-type types.*
 * @returns {Promise<Tag[]>} - A promise that resolves to an array of tags.
 * @throws {HitomiError} - Throws an error if the type is invalid.
 */
export async function getTags(type: TagTypes, startsWith?: StartingCharacter): Promise<Tag[]> {
	if(!validTagTypes.has(type)) {
		throw new HitomiError(ERROR_CODE.INVALID_VALUE, 'type');
	}
	if (type === 'type') {
		return Promise.resolve(
			Array.from(validContentTypes, (contentType: ContentTypes): Tag => ({
				type: 'type',
				name: contentType
            }))
        );
	}
	const path: string = getTagUri(type, startsWith);
	
	const response: string = await edgeFetch(path)
		.then(res => res.text())
		.then(text => text);
	
	if (type === 'language') {
		const languages = JSON.parse(response
			.replace(/^\/(.|\n)*language_localname *= */, '')
			.replace(/;$/, '')) as Record<string, string>;
		return Object.entries(languages).map(([ , localName]: [string, string]): Tag => ({
			type: 'language',
			name: localName,
		}));
	}
	const tags: Tag[] = [];
	const target: string = `${type === "male" || type === "female" ? `/${type}%3A` : `${type}/`}[^-]+`;
	const targetRegex: RegExp = new RegExp(target, 'g');
	const anchorTags = response.match(targetRegex);
	if (!anchorTags) {
		return tags;
	}
	anchorTags.map((anchorTag: string): void => {
		if (type === 'male' || type === 'female') {
			tags.push({
				type: type,
				name: decodeURIComponent(anchorTag.replace(`/${type}%3A`, ''))
			});
        } else {
			tags.push({
				type: type,
				name: decodeURIComponent(anchorTag.replace(`${type}/`, ''))
			});
		}
	});

	return tags;
}
