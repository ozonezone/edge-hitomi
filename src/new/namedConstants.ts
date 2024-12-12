import {ContentTypes, TagTypes} from "./newType";

/**
 * Url Component Constants
 */
export const HITOMI_LA = 'hitomi.la';
export const HTTPS = 'https://';

/**
 * Error codes used throughout the application.
 */
export const ERROR_CODE = {
	INVALID_VALUE: 'INVALID_VALUE',
	DUPLICATED_ELEMENT: 'DUPLICATED_ELEMENT',
	LACK_OF_ELEMENT: 'LACK_OF_ELEMENT',
	REQUEST_REJECTED: 'REQUEST_REJECTED',
} as const;

/**
 * Common message templates for error messages.
 */
export const errorMessages = {
	mustBe: ' must be ',
	mustHave: ' must have ',
	mustNotBe: ' must not be ',
	requestRejected: 'Request error on ',
	valid: 'valid',
	duplicated: 'duplicated',
	moreElements: 'more elements'
} as const;

export const validTagTypes: Set<TagTypes> = new Set([
	'artist',
	'group',
	'type',
	'language',
	'series',
	'character',
	'tag',
	'male',
	'female'
]);

export const validContentTypes: Set<ContentTypes> = new Set<ContentTypes>([
	'doujinshi',
	'manga',
	'artistcg',
	'gamecg',
	'anime',
	'imageset']);