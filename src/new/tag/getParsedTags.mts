import {ERROR_CODE, validTagTypes} from "../namedConstants";
import {TagTypes, Tag} from "../newType";
import {HitomiError} from "../utils/HitomiError";

/**
 * Parses the stringified tags and returns a set of tags. Accepts a delimiter to split
 * the stringified tags.
 *
 * @param {string} stringifiedTags - The string tags to parse
 * @param {string | RegExp} delimiter - The delimiter to split the strings of tags. Accepts a string or a RegExp
 * Defaults to `/\s+/`. **Note:** While it is *optional*, if your string of tags contains spaces within the tag,
 * it is **recommended** to have a custom delimiter as a lot of tags have spaces some even have special characters.
 * @returns {Set<Tag>} - A set of tags in {@link Tag} format.
 * (Original `node-hitomi` had an array of tags but due to speed constraints, it was changed to a set)
 * @throws {HitomiError} - If the tag type is not valid.
 * @example
 * getParsedTags('language:korean+-female:big breasts+type:doujinshi', '+');
 * // Output:
 * // Set { { type: 'language', name: 'korean', isNegative: false },
 * // { type: 'female', name: 'big breasts', isNegative: true },
 * // { type: 'type', name: 'doujinshi', isNegative: false } }
 */
export function getParsedTags(stringifiedTags: string, delimiter?: string | RegExp): Set<Tag> {
	const tags: Set<Tag> = new Set();
	stringifiedTags
		.split(!delimiter ? /\s+/ : delimiter)
		.forEach(tag => {
			const isNegative = tag.startsWith('-');
			const [type, name] = (isNegative ? tag.slice(1) : tag)
				.split(':')
				.map(s => s.trim());

			if (!validTagTypes.has(type as TagTypes)) {
				throw new HitomiError(ERROR_CODE.INVALID_VALUE, type);
			}

			tags.add({ type, name, isNegative } as Tag);
		});

	return tags;
}