import {TagTypes, StartingCharacter} from "../newType";
import {ERROR_CODE, HITOMI_LA, HTTPS, validTagTypes} from "../namedConstants";
import {HitomiError} from "../utils/HitomiError";

/**
 * Returns the URI for the specified tag type.
 * @param {string} type - The type of tag to get the URI for. (except 'type' type)
 * @param {StartingCharacter} startsWith - The starting character for the tag URI.
 * *Note: startsWith is required for non-language types.*
 * @returns {string} - The URI for the specified tag type.
 * @throws {HitomiError} - Throws an error if the type is invalid or if startsWith is not provided for non-language types.
 */
export function getTagUri(type: TagTypes, startsWith?: StartingCharacter) {
	if(type === 'language') {
		return `${HTTPS}ltn.${HITOMI_LA}/language_support.js`
	}

	if(!startsWith) {
		throw new HitomiError(ERROR_CODE.LACK_OF_ELEMENT, 'non-language types', 'startsWith');
	}

	if(startsWith !== '0-9' && !/^[a-z]$/.test(startsWith)) {
		throw new HitomiError(ERROR_CODE.INVALID_VALUE, 'startsWith');
	}

	if(!validTagTypes.has(type) || type === 'type') {
		throw new HitomiError(ERROR_CODE.INVALID_VALUE, 'type');
	}

	let path: string = 'all';

	if(type === 'tag' || type ==='female' || type === 'male') {
		path += 'tags';
	}
	else {
		if(type === 'series')
			path += type;
		else
			path += type + 's';
	}

	path += `-${startsWith !== '0-9' ? startsWith : '123'}.html`;
	return `${HTTPS}${HITOMI_LA}/${path}`;
}