import {getGallery} from "./gallery/getGallery.mjs";
import {getGalleryIds} from "./gallery/getGalleryIds.mjs";
import {getParsedTags} from "./tag/getParsedTags.mjs";
import {getTags} from "./tag/getTags.mjs";
import {getNozomiUri} from "./uri/getNozomiUri.mjs";
import {getTagUri} from "./uri/getTagUri.mjs";
import {getVideoUri} from "./uri/getVideoUri.mjs";
import {getGalleryUri} from "./uri/getGalleryUri.mjs";
import {edgeFetch} from "./utils/edgeFetch.mjs";
import {ImageUriResolver} from "./uri/ImageUriResolver.mjs";

export {
	getGallery,
	getGalleryIds,
	getParsedTags,
	getTags,
	getNozomiUri,
	getTagUri,
	getVideoUri,
	getGalleryUri,
	ImageUriResolver,
	edgeFetch
};

// If you really need a default export
export default {
	getGallery,
	getGalleryIds,
	getParsedTags,
	getTags,
	getNozomiUri,
	getTagUri,
	getVideoUri,
	getGalleryUri,
	ImageUriResolver,
	edgeFetch
};
