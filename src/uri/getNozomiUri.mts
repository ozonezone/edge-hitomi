import {PopularityPeriod, Tag} from "../type.mjs";
import {HITOMI_LA, HTTPS} from "../constants.mjs";


/**
 * Generates a Nozomi URI based on the provided options.
 *
 * @param {Object} options - The options for generating the URI.
 * @param {Tag} [options.tag] - The tag to include in the URI.
 * @param {PopularityPeriod} [options.popularityOrderBy] - The popularity period to order by.
 * @returns {string} The generated Nozomi URI.
 */
export function getNozomiUri(options :  {
	tag?: Tag;
	popularityOrderBy?: PopularityPeriod;
	} = {}): string {

	let path: string;
	let tagPath: string = '';

	/**
	 * Generates URI for language tags.
	 * default: /index-korean.nozomi
	 * day: /popular/today-korean.nozomi
	 * week: /popular/week-korean.nozomi
	 * month: /popular/month-korean.nozomi
	 * year: /popular/year-korean.nozomi
	 */
	if(options.tag?.type === 'language') {
		path = !options.popularityOrderBy ?
			`index-${options.tag.name}` :
			`-${options.tag.name}`;
	}

	/**
	 * Generates URI for female or male tags.
	 * default: /tag/female:apron-all.nozomi
	 * day: /tag/popular/today/female:apron-all.nozomi
	 * week: /tag/popular/week/female:apron-all.nozomi
	 * month: /tag/popular/month/female:apron-all.nozomi
	 * year: /tag/popular/year/female:apron-all.nozomi
	 */
	else if(options.tag?.type === 'female' || options.tag?.type === 'male') {
		tagPath = 'tag/';
		path = `/${options.tag.type}:${encodeURIComponent(options.tag.name)}-all`;
	}

	// Generates URI for other tags.
	else if (options.tag){
		tagPath = `${options.tag?.type}/`;
		path = `/${encodeURIComponent(options.tag.name)}-all`;
	}

	// Generates default URI.
	else {
		path = !options.popularityOrderBy ?
			`index-all` :
			`-all`;
	}

	// Appends popularity period to the path if specified.
	if (options.popularityOrderBy) {
		path = options.popularityOrderBy === 'day' ?
			`popular/today${path}` :
			`popular/${options.popularityOrderBy}${path}`;
	}

	return `${HTTPS}ltn.${HITOMI_LA}/${tagPath}${path}.nozomi`;
}
