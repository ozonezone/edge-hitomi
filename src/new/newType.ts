import {ERROR_CODE} from "./namedConstants";

/**
 * Type representing the values of the ERROR_CODE object.
 */
export type ErrorCodeType = typeof ERROR_CODE[keyof typeof ERROR_CODE];
