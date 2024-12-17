/**
 * Error codes used throughout the application.
 */
declare const ERROR_CODE: {
    readonly INVALID_VALUE: "INVALID_VALUE";
    readonly DUPLICATED_ELEMENT: "DUPLICATED_ELEMENT";
    readonly LACK_OF_ELEMENT: "LACK_OF_ELEMENT";
    readonly REQUEST_REJECTED: "REQUEST_REJECTED";
};
/**
 * Symbol for tracking if entire set represents negative IDs
 */
declare const IS_NEGATIVE: unique symbol;

/**
 * Type representing the values of the ERROR_CODE object.
 */
type ErrorCodeType = typeof ERROR_CODE[keyof typeof ERROR_CODE];
/**
 * Type representing the values of the Response from /galleries endpoint.
 */
type JSONGallery = {
    artists: Array<{
        artist: string;
        url: string;
    }> | null;
    blocked: number;
    characters: Array<{
        character: string;
        url: string;
    }> | null;
    date: string;
    datepublished: string | null;
    files: Array<{
        hasavif: number;
        hash: string;
        hasjxl: number;
        haswebp: number;
        height: number;
        name: string;
        single?: number;
        width: number;
    }>;
    galleryurl: string;
    groups: Array<{
        group: string;
        url: string;
    }> | null;
    id: number | string;
    japanese_title: string | null;
    language: string | null;
    language_localname: string | null;
    language_url: string | null;
    languages: Array<{
        galleryid: number;
        language_localname: string;
        name: string;
        url: string;
    }>;
    parodys: Array<{
        parody: string;
        url: string;
    }> | null;
    related: Array<number>;
    scene_indexes: Array<number>;
    tags: Array<{
        tag: string;
        url: string;
        female?: string | number;
        male?: string | number;
    }>;
    title: string;
    type: string;
    video: string | null;
    videofilename: string | null;
};
/**
 * Type representing the values of valid Content Types.
 */
type ContentTypes = 'doujinshi' | 'manga' | 'artistcg' | 'gamecg' | 'anime' | 'imageset';
/**
 * Type representing the values of valid Tag Types.
 */
type TagTypes = 'artist' | 'group' | 'type' | 'language' | 'series' | 'character' | 'male' | 'female' | 'tag';
/**
 * Type representing the tag object.
 */
type Tag = {
    type: TagTypes;
    name: string;
    isNegative?: boolean;
};
/**
 * Type representing the gallery object.
 */
type Gallery = {
    id: number;
    title: {
        display: string;
        japanese: string | null;
    };
    type: ContentTypes;
    languageName: {
        english: string | null;
        local: string | null;
    };
    artists: string[];
    groups: string[];
    series: string[];
    characters: string[];
    tags: Tag[];
    files: HitomiImage[];
    publishedDate: Date;
    translations: Pick<Gallery, 'id' | 'languageName'>[];
    relatedIds: number[];
};
/**
 * Type representing the image object.
 */
type HitomiImage = {
    index: number;
    hash: string;
    name: string;
    hasAvif: boolean;
    hasWebp: boolean;
    hasJxl: boolean;
    width: number;
    height: number;
};
/**
 * Type representing the values of the Image Extensions.
 */
type ImageExtensions = 'avif' | 'webp' | 'jxl';
/**
 * Type representing the values of the Starting Character for Tags.
 */
type StartingCharacter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '0-9';
/**
 * Type representing the values of the popularity periods.
 */
type PopularityPeriod = 'day' | 'week' | 'month' | 'year';
/**
 * Extended Set type that includes isNegative flag for the entire collection
 */
interface IdSet extends Set<number> {
    [IS_NEGATIVE]: boolean;
}
/**
 * Represents a node in the binary search tree used for gallery indexing.
 * Each node contains keys for searching, data pointers, and references to child nodes.
 *
 * @interface
 */
interface Node {
    /** Array of keys used for searching */
    keys: Uint8Array[];
    /** Array of [offset, length] pairs pointing to gallery data */
    datas: [bigint, number][];
    /** Array of addresses pointing to child nodes */
    subnodeAddresses: bigint[];
}

/**
 * Fetches and formats the gallery object with the given ID
 * @param {number} id - The gallery ID to fetch
 * @param {Headers} userHeaders - Optional User provided headers for the request to make request more realistic
 * @returns {Promise<Gallery>} - A promise that resolves to the gallery object
 */
declare function getGallery(id: number, userHeaders?: Headers): Promise<Gallery>;

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
declare function getGalleryIds(options?: {
    title?: string;
    tags?: Tag[];
    range?: {
        start?: number;
        end?: number;
    };
    popularityOrderBy?: PopularityPeriod;
}): Promise<number[]>;

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
declare function getParsedTags(stringifiedTags: string, delimiter?: string | RegExp): Set<Tag>;

/**
 * Fetches tags based on the provided type and optional starting character.
 *
 * @param {TagTypes} type - The type of tags to fetch.
 * @param {StartingCharacter} [startsWith] - Optional starting character to filter tags.
 * *Note: startsWith is required for non-language and non-type types.*
 * @returns {Promise<Tag[]>} - A promise that resolves to an array of tags.
 * @throws {HitomiError} - Throws an error if the type is invalid.
 */
declare function getTags(type: TagTypes, startsWith?: StartingCharacter): Promise<Tag[]>;

/**
 * Generates a Nozomi URI based on the provided options.
 *
 * @param {Object} options - The options for generating the URI.
 * @param {Tag} [options.tag] - The tag to include in the URI.
 * @param {PopularityPeriod} [options.popularityOrderBy] - The popularity period to order by.
 * @returns {string} The generated Nozomi URI.
 */
declare function getNozomiUri(options?: {
    tag?: Tag;
    popularityOrderBy?: PopularityPeriod;
}): string;

/**
 * Returns the URI for the specified tag type.
 * @param {string} type - The type of tag to get the URI for. (except 'type' type)
 * @param {StartingCharacter} startsWith - The starting character for the tag URI.
 * *Note: startsWith is required for non-language types.*
 * @returns {string} - The URI for the specified tag type.
 * @throws {HitomiError} - Throws an error if the type is invalid or if startsWith is not provided for non-language types.
 */
declare function getTagUri(type: TagTypes, startsWith?: StartingCharacter): string;

/**
 * Returns the URI for the video of the given gallery
 * @param {Gallery} gallery - The gallery object to get the video URI of
 * @returns {string} - The URI for the video
 * @throws {HitomiError} - Throws an error if the gallery type is not 'anime'
 */
declare function getVideoUri(gallery: Gallery): string;

/**
 * Generates the Hitomi Gallery URI.
 * @param {Gallery | number | string} gallery - The gallery object or ID.
 * @returns {string} The generated Hitomi Gallery URI.
 */
declare function getGalleryUri(gallery: Gallery | number | string): string;

/**
 * Fetches data after transformation of Headers
 * @param {string} URL - The URL to fetch data from
 * @param {HeadersInit} userHeaders - Optional User provided headers for the request to make request more realistic
 * @returns {Promise<Response>} - A promise that resolves to an ArrayBuffer containing the response data
 *
 * @throws {HitomiError} Throws if request is rejected (non 200/206 status)
 * @throws {HitomiError} Throws if response body is null
 * @throws {HitomiError} Throws if any network or processing error occurs
 *
 */
declare function edgeFetch(URL: string, userHeaders?: HeadersInit): Promise<Response>;

declare class ImageUriResolver {
    #private;
    /**
     * Synchronizes the subdomain codes and path codes.
     * @throws {HitomiError} - If the subdomain codes contain an invalid value
     */
    static synchronize(): Promise<void>;
    /**
     * Returns the URI of the image with the given extension.
     * @param {HitomiImage} image - The image object to get the URI of
     * @param {ImageExtensions} extension - The extension of the image to get
     * @param {Object} options - Optional object to specify the type of the image
     * @param {boolean} options.isThumbnail - Whether the image is a thumbnail
     * @param {boolean} options.isSmall - Whether the image is a small image
     * @returns {string} - The URI of the image
     * @throws {HitomiError} - If the image does not have the given extension
     * @throws {HitomiError} - If the subdomain codes are not synchronized
     * @throws {HitomiError} - If the image is not a thumbnail and is small
     **/
    static getImageUri(image: HitomiImage, extension: ImageExtensions, options?: {
        isThumbnail?: boolean;
        isSmall?: boolean;
    }): string;
}

declare const _default: {
    getGallery: typeof getGallery;
    getGalleryIds: typeof getGalleryIds;
    getParsedTags: typeof getParsedTags;
    getTags: typeof getTags;
    getNozomiUri: typeof getNozomiUri;
    getTagUri: typeof getTagUri;
    getVideoUri: typeof getVideoUri;
    getGalleryUri: typeof getGalleryUri;
    ImageUriResolver: typeof ImageUriResolver;
    edgeFetch: typeof edgeFetch;
};

export { type ContentTypes, type ErrorCodeType, type Gallery, type HitomiImage, type IdSet, type ImageExtensions, ImageUriResolver, type JSONGallery, type Node, type PopularityPeriod, type StartingCharacter, type Tag, type TagTypes, _default as default, edgeFetch, getGallery, getGalleryIds, getGalleryUri, getNozomiUri, getParsedTags, getTagUri, getTags, getVideoUri };
