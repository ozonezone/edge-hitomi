import {ERROR_CODE} from "./namedConstants";

/**
 * Type representing the values of the ERROR_CODE object.
 */
export type ErrorCodeType = typeof ERROR_CODE[keyof typeof ERROR_CODE];

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

export type contentTypes = 'doujinshi' | 'manga' | 'artistcg' | 'gamecg' | 'anime' | 'imageset';