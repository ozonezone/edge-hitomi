import {ERROR_CODE} from "./namedConstants";

/**
 * Type representing the values of the ERROR_CODE object.
 */
export type ErrorCodeType = typeof ERROR_CODE[keyof typeof ERROR_CODE];

/**
 * Type representing the values of the Response from /galleries endpoint.
 */
export type JSONGallery = {
	artists: Array<{artist: string; url: string}> | null;
	blocked: number;
	characters: Array<{character: string; url: string}> | null;
	date: string;
	datepublished: string | null;
	files: Array<{hasavif: number; hash: string; hasjxl: number; haswebp: number; height: number; name: string; single?: number; width: number}>;
	galleryurl: string;
	groups: Array<{group: string; url: string}> | null;
	id: number | string;
	japanese_title: string | null;
	language: string | null;
	language_localname: string | null;
	language_url: string | null;
	languages: Array<{galleryid: number; language_localname: string; name: string; url: string}>;
	parodys: Array<{parody: string; url: string}> | null;
	related: Array<number>;
	scene_indexes: Array<number>;
	tags: Array<{tag: string; url: string; female?: string | number; male?: string | number}>
	title: string;
	type: string;
	video: string | null;
	videofilename: string | null;
};

/**
 * Type representing the values of valid Content Types.
 */
export type ContentTypes = 'doujinshi' | 'manga' | 'artistcg' | 'gamecg' | 'anime' | 'imageset';

/**
 * Type representing the values of valid Tag Types.
 */
export type TagTypes = 'artist' | 'group' | 'type' | 'language' | 'series' | 'character' | 'male' | 'female' | 'tag';

/**
 * Type representing the tag object.
 */
export type Tag = {
	type: TagTypes;
	name: string;
	isNegative?: boolean;
}

/**
 * Type representing the gallery object.
 */
export type Gallery = {
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
}

/**
 * Type representing the image object.
 */
export type HitomiImage = {
	index: number;
	hash: string;
	name: string;
	hasAvif: boolean;
	hasWebp: boolean;
	hasJxl: boolean;
	width: number;
	height: number;
}

/**
 * Type representing the values of the Image Extensions.
 */
export type ImageExtensions = 'avif' | 'webp' | 'jxl';

/**
 * Type representing the values of the Starting Character for Tags.
 */
export type StartingCharacter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '0-9';

/**
 * Type representing the values of the popularity periods.
 */
export type PopularityPeriod = 'day' | 'week' | 'month' | 'year';