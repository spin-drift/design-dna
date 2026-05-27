// Image discovery for hand-curated movement images.
//
// Two sources, in priority order:
//   1. The `images` array on the movement entry in data.js. Each entry
//      is a source URL; filenames are constructed from the movement id
//      and the array index (img/<id>.png, img/<id>2.png, img/<id>3.png,
//      and so on — note the unsuffixed first file).
//   2. The legacy img/manifest.json file, which maps id → single URL.
//      Used only when the movement has no `images` array. Single image.
//
// If neither has anything but a file might still exist on disk, we
// return a single unlinked entry at img/<id>.png. The detail panel
// renders it as a plain image (no anchor) if there's no source URL.
//
// All paths returned are relative to the site root.

import { MOVEMENTS } from "./data.js";

const MANIFEST_URL = "img/manifest.json";

let manifestPromise = null;
let manifest = {};

export function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        manifest = data;
        return data;
      })
      .catch((err) => {
        console.warn("Couldn't load image manifest:", err.message);
        manifest = {};
        return manifest;
      });
  }
  return manifestPromise;
}

// Build the filename for image at index `i` (0-based) of a movement.
// First image is bare (japonisme.png), subsequent get numbered starting
// at 2 (japonisme2.png, japonisme3.png) — matches user's filing scheme.
function imageFileFor(movementId, index) {
  const suffix = index === 0 ? "" : String(index + 1);
  return `img/${movementId}${suffix}.png`;
}

// Returns an array of {file, sourceUrl} objects. sourceUrl may be null
// if no link is available for that image. Returns empty array only if
// nothing is known (no `images` array, no manifest entry); callers
// should treat that as "no image block at all."
//
// Note: we don't probe the filesystem (browsers can't), so this trusts
// that if a `images` array claims N entries, N files exist on disk.
// Missing files will render as broken images. Curators fix this by
// keeping `data.js` and `img/` in sync.
export function getImageSources(movementId) {
  const movement = MOVEMENTS[movementId];
  if (!movement) return [];

  // Priority 1: per-movement images array in data.js.
  if (Array.isArray(movement.images) && movement.images.length > 0) {
    return movement.images.map((sourceUrl, index) => ({
      file: imageFileFor(movementId, index),
      sourceUrl: sourceUrl || null,
    }));
  }

  // Priority 2: legacy manifest.json entry. Single image, with link.
  const manifestUrl = manifest[movementId];
  if (manifestUrl) {
    return [
      {
        file: imageFileFor(movementId, 0),
        sourceUrl: manifestUrl,
      },
    ];
  }

  // Priority 3: nothing declared, but file might still exist on disk.
  // Return a single unlinked entry; the <img> tag will render the file
  // if present, or quietly fail otherwise. The detail panel hides the
  // image block via JS once it knows the file 404'd.
  return [
    {
      file: imageFileFor(movementId, 0),
      sourceUrl: null,
    },
  ];
}

// Back-compat shim for the existing call site. Returns the first image
// in the standard {file, sourceUrl} shape, or null if there isn't one.
export function getImageSource(movementId) {
  const sources = getImageSources(movementId);
  return sources.length > 0 ? sources[0] : null;
}
