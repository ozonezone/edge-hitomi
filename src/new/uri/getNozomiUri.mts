import {PopularityPeriod, Tag} from "../newType";

export function getNozomiUri(options: {
	tag?: Tag;
	popularityOrderBy?: PopularityPeriod;
}): string {
	let path: string = 'index';
	let language: string = 'all';

	if(options.tag?.type === 'language') {
		// TODO: KILL ME
	}
}