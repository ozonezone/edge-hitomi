import { getGallery } from "./gallery/getGallery.mjs";
import { getGalleryIds } from "./gallery/getGalleryIds.mjs";
import { getParsedTags } from "./tag/getParsedTags.mjs";
import { getTags } from "./tag/getTags.mjs";
import { getNozomiUri } from "./uri/getNozomiUri.mjs";
import { getTagUri } from "./uri/getTagUri.mjs";
import { getVideoUri } from "./uri/getVideoUri.mjs";
import { getGalleryUri } from "./uri/getGalleryUri.mjs";
import { edgeFetch, setFetch } from "./utils/edgeFetch.mjs";
import { ImageUriResolver } from "./uri/ImageUriResolver.mjs";
import {
  ContentTypes,
  ErrorCodeType,
  Gallery,
  HitomiImage,
  IdSet,
  ImageExtensions,
  JSONGallery,
  Node,
  PopularityPeriod,
  StartingCharacter,
  Tag,
  TagTypes,
} from "./type.mjs";

export {
  ContentTypes,
  edgeFetch,
  ErrorCodeType,
  Gallery,
  getGallery,
  getGalleryIds,
  getGalleryUri,
  getNozomiUri,
  getParsedTags,
  getTags,
  getTagUri,
  getVideoUri,
  HitomiImage,
  IdSet,
  ImageExtensions,
  ImageUriResolver,
  JSONGallery,
  Node,
  PopularityPeriod,
  setFetch,
  StartingCharacter,
  Tag,
  TagTypes,
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
  edgeFetch,
};
