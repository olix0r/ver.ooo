export interface DogUpdate {
  // A new social media profile.
  profile: ProfileUpdate;

  // The type of the stuffed animal described in the post.
  animal: string;

  // The primary color chosen in the post.
  color: string;

  // A post announcing the update.
  post: Post;
}

export interface ProfileUpdate {
  // A new display name for the social media profile.
  displayName: string;

  // A new description for the social media profile. MUST be at most 100
  // characters.
  //
  // May reference the location described in the post.
  description: string;

  // A Dall-E-3 prompt to genererate an avatar image.
  //
  // Image guidelines:
  // * Use cosmic new-age psychedelic web art style.
  // * Feature a background patterned with stuffed animals that have been torn
  //   and mangled by a dog, with stuffing flowing out of their torn exteriors.
  // * Overlay a saintly depiction of a small black pit-lab mix dog's head in
  //   the foreground.
  // * Depict the dog's chakra energy within its head, symbolizing its
  //   connection to cosmic oneness.
  avatarPrompt: string;

  // A Dall-E-3 prompt to genererate an banner image.
  //
  // The image should be abstract, themed around the lore and location of the
  // post.
  bannerPrompt: string;
}

export interface Post {
  // The text of the post. MUST be at most 200 characters.
  text: string;

  // All location references in the post.
  locationRefs: LocationRef[];
}

export interface LocationRef {
  // The substring withing the text that references the location.
  text: string;

  // The latitude of the location.
  lat: number;

  // The longitude of the location.
  lon: number;
}
