/**
 * Url Component Constants
 */
export const HITOMI_LA: string = 'hitomi.la';
export const HTTPS: string = 'https://';

/**
 * Error codes used throughout the application.
 */
export const ERROR_CODE = {
	INVALID_VALUE: 'INVALID_VALUE',
	INVALID_CALL: 'INVALID_CALL',
	DUPLICATED_ELEMENT: 'DUPLICATED_ELEMENT',
	LACK_OF_ELEMENT: 'LACK_OF_ELEMENT',
	REQUEST_REJECTED: 'REQUEST_REJECTED'
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
