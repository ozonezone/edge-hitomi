import { getGallery, getGalleryIds } from './gallery';
import { getParsedTags, getTags } from './tag';
import { getNozomiUri, getTagUri, getVideoUri, getGalleryUri, ImageUriResolver } from './uri';

export default {
	getGallery, // TODO: REFACTORED
	getGalleryIds,
	getParsedTags, // TODO: REFACTORED
	getTags, // TODO: REFACTORED
	getNozomiUri,
	getTagUri, // TODO: REFACTORED
	getVideoUri, // TODO: REFACTORED
	getGalleryUri, // TODO: REFACTORED
	ImageUriResolver, // TODO: REFACTORED
	default: {
		getGallery,
		getGalleryIds,
		getParsedTags,
		getTags,
		getNozomiUri,
		getTagUri,
		getVideoUri,
		getGalleryUri,
		ImageUriResolver
	}
}