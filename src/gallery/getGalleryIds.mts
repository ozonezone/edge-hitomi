import {IdSet, PopularityPeriod, Tag} from "../type.mjs";
import {getNozomiUri} from "../uri/getNozomiUri.mjs";
import {getIdSet} from "../utils/getIdSet.mjs";
import {sha256First4Bytes} from "../utils/sha256First4Bytes.mjs";
import {getNodeAtAddress} from "../utils/getNodeAtAddress.mjs";
import {binarySearch} from "../utils/binarySearch.mjs";
import {edgeFetch, toTypedArray} from "../utils/edgeFetch.mjs";
import {HITOMI_LA, HTTPS, IS_NEGATIVE} from "../constants.mjs";
/**
 * Main function to fetch and filter gallery IDs based on various criteria.
 * Implements a complex search and filter pipeline with multiple stages:
 *
 * 1. Title-based search:
 *    - Each word in the title is hashed
 *    - B-tree is searched for each hash
 *    - Results are intersected
 *
 * 2. Tag-based filtering:
 *    - Positive tags: Results must contain all tags
 *    - Negative tags: Results must not contain any tags
 *
 * 3. Popularity-based ordering:
 *    - Optional sorting by different popularity metrics
 *
 * 4. Range-based pagination:
 *    - Can be applied at HTTP level for simple queries
 *    - Applied after filtering for complex queries
 *
 * @param {Object} options - Search and filter options
 * @param {string} [options.title] - Title to search for
 * @param {Tag[]} [options.tags] - Array of tags to filter by
 * @param {Object} [options.range] - Pagination range
 * @param {number} [options.range.start] - Start index
 * @param {number} [options.range.end] - End index
 * @param {PopularityPeriod} [options.popularityOrderBy] - Popularity sorting option
 * @returns {Promise<number[]>} Array of matching gallery IDs
 *
 * @example
 * // Search for galleries with specific title and tags
 * const ids = await getGalleryIds({
 *   title: "search term",
 *   tags: [{name: "tag1", isNegative: false}],
 *   range: {start: 0, end: 10}
 * });
 */
export async function getGalleryIds(options: {
	title?: string;
	tags?: Tag[];
	range?: {
		start?: number;
		end?: number;
	};
	popularityOrderBy?: PopularityPeriod;
} = {}): Promise<number[]> {
	// Get version first
	const response = await edgeFetch(`${HTTPS}ltn.${HITOMI_LA}/galleriesindex/version`);
	const version = await response.text();
	
	// Initialize our primary result set
	let resultSet: IdSet;
	
	// Handle base case - either popularity order or default list
	const baseUri = getNozomiUri({ popularityOrderBy: options.popularityOrderBy });
	const baseRange = options.range?.start !== undefined || options.range?.end !== undefined ?
		{ 'Range': `bytes=${(options.range?.start ?? 0) * 4}-${((options.range?.end ?? 0) * 4) - 1}` }
	 : undefined;



	const baseResponse = await edgeFetch(baseUri, baseRange)
		.then(response => toTypedArray(response))
		.then(buffer => buffer);
	resultSet = getIdSet(baseResponse);

	// Handle title search if present
	if (options.title?.trim()) {
		const words = options.title.toLowerCase().trim().split(/\s+/);

		for (const word of words) {
			if (!word) continue;

			const key = await sha256First4Bytes(word);
			const node = await getNodeAtAddress(0n, version);

			if (!node) continue;

			const searchResult = await binarySearch(key, node, version);
			if (!searchResult) {
				// If any word has no results, the entire search should have no results
				resultSet = getIdSet(new Uint8Array(0));
				break;
			}

			const [offset, length] = searchResult;
			const dataUri = `${HTTPS}ltn.${HITOMI_LA}/galleriesindex/galleries.${version}.data`;
			const range = `bytes=${offset + 4n}-${offset + BigInt(length) - 1n}`;

			const wordBuffer = await edgeFetch(dataUri, {'Range': range })
				.then(response => toTypedArray(response))
				.then(buffer => buffer);
			const wordIds = getIdSet(wordBuffer);
			
			// Intersect with existing results
			const newResultSet = getIdSet(new Uint8Array(0));
			newResultSet[IS_NEGATIVE] = resultSet[IS_NEGATIVE];
			
			for (const id of resultSet) {
				if (wordIds.has(id)) {
					newResultSet.add(id);
				}
			}
			
			resultSet = newResultSet;
			
			// If we have no results after intersection, we can stop
			if (resultSet.size === 0) {
				break;
			}
		}
	}

	// Handle tags (rest of function remains the same...)
	if (options.tags?.length) {
		for (const tag of options.tags) {
			const tagUri = getNozomiUri({ tag });
			const tagBuffer = await edgeFetch(tagUri)
				.then(response => toTypedArray(response))
				.then(buffer => buffer);

			const tagIds = getIdSet(tagBuffer, tag.isNegative);

			if (tag.isNegative) {
				for (const id of tagIds) {
					resultSet.delete(id);
				}
			} else {
				for (const id of resultSet) {
					if (!tagIds.has(id)) {
						resultSet.delete(id);
					}
				}
			}
		}
	}

	let result = Array.from(resultSet);

	if (options.range && (options.title || options.tags)) {
		const start = options.range.start || 0;
		const end = options.range.end || result.length;
		result = result.slice(start, end);
	}

	return result;
}
