import {ERROR_CODE, errorMessages} from "../namedConstants";
import {ErrorCodeType} from "../newType";

/**
 * Custom error class for handling Hitomi-specific errors
 */
export class HitomiError extends Error {
	/**
	 * Creates a new HitomiError instance
	 * @param {ErrorCodeType} errorCode - The error code from ERROR_CODE enum
	 * @param {(string | number)[]} values - Values to be added into the fomatted error message string
	 */
	constructor(errorCode: ErrorCodeType, ...values: (string | number)[]) {
		const formatter = errorFormatters[errorCode];
		if (!formatter) {
			throw new Error(`Unknown error code: ${errorCode}`);
		}
		
		super(formatter(values));
		this.name = `HitomiError[${errorCode}]`;
	}
}

/**
 * Error message formatter helper function for each error type
 */
const errorFormatters: Record<ErrorCodeType, (values: (string | number)[]) => string> = {
	[ERROR_CODE.INVALID_VALUE]: (values) =>
		`${values[0]}${errorMessages.mustBe}${values[1] || errorMessages.valid}`,
	
	[ERROR_CODE.DUPLICATED_ELEMENT]: (values) =>
		`${values[0]}${errorMessages.mustNotBe}${errorMessages.duplicated}`,
	
	[ERROR_CODE.LACK_OF_ELEMENT]: (values) =>
		`${values[0]}${errorMessages.mustHave}${values[1] || errorMessages.moreElements}`,
	
	[ERROR_CODE.REQUEST_REJECTED]: (values) =>
		`${errorMessages.requestRejected}[${values[0]}]${values[1]}`,

};
