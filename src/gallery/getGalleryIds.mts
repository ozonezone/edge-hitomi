import {IdSet, PopularityPeriod, Tag} from "../type.mjs";
import {getNozomiUri} from "../uri/getNozomiUri.mjs";
import {getIdSet} from "../utils/getIdSet.mjs";
import {sha256First4Bytes} from "../utils/sha256First4Bytes.mjs";
import {getNodeAtAddress} from "../utils/getNodeAtAddress.mjs";
import {binarySearch} from "../utils/binarySearch.mjs";
import {edgeFetch, toTypedArray} from "../utils/edgeFetch.mjs";
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
	const response = await edgeFetch('ltn.','/galleriesindex/version');
	const version = await response.text();


	// Handle base case - either popularity order or default list
	const baseUri = new URL(getNozomiUri({ popularityOrderBy: options.popularityOrderBy }));
	const baseRange = options.range?.start !== undefined || options.range?.end !== undefined ?
		new Headers ({ 'Range': `bytes=${(options.range?.start ?? 0) * 4}-${((options.range?.end ?? 0) * 4) - 1}` })
	 : undefined;



	const baseResponse = await edgeFetch('ltn.', baseUri.pathname as `/${string}`, baseRange)
		.then(response => toTypedArray(response))
		.then(buffer => buffer);
	const resultSet: IdSet = getIdSet(baseResponse);

	// Handle title search if present
	if (options.title?.trim()) {
		const words = options.title.toLowerCase().trim().split(/\s+/);

		for (const word of words) {
			if (!word) continue;

			const key = await sha256First4Bytes(word);
			const node = await getNodeAtAddress(0n, version);

			if (!node) continue;

			const searchResult = await binarySearch(key, node, version);
			if (!searchResult) continue;

			const [offset, length] = searchResult;
			const dataUri = `/galleriesindex/galleries.${version}.data`;
			const range = `bytes=${offset + 4n}-${offset + BigInt(length) - 1n}`;

			const wordResponse = await edgeFetch('ltn.', dataUri as `/${string}`,
				new Headers({'Range': range })
			);
			const wordBuffer = await wordResponse.arrayBuffer();
			const wordIds = getIdSet(new Uint8Array(wordBuffer));

			// Intersect with existing results
			for (const id of resultSet) {
				if (!wordIds.has(id)) {
					resultSet.delete(id);
				}
			}
		}
	}

	// Handle tags (rest of function remains the same...)
	if (options.tags?.length) {
		for (const tag of options.tags) {
			const tagUri = new URL(getNozomiUri({ tag }));
			const tagBuffer = await edgeFetch('ltn.', tagUri.pathname as `/${string}`)
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
