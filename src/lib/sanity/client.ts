import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// For Client based work
export const config = {
  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.EXPO_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.EXPO_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
};

export const client = createClient(config);

// For Admin based work for mutations
const adminConfig = {
  ...config,
  token: process.env.SANITY_API_TOKEN,
};

export const adminClient = createClient(adminConfig);

const imageBUuilder = imageUrlBuilder(config);
export const urlFor = (source: string) => imageBUuilder.image(source);
