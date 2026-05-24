// Image affordances.
//
// Current behavior: every "see images" click opens a new tab with a
// Google Images search for the term. Google's first-page results give
// the right gestalt for every search we generate, the data is always
// current, and there's nothing to scrape or maintain.
//
// ----------------------------------------------------------------
// Why this module still exists / what's intentionally preserved
// ----------------------------------------------------------------
//
// Earlier iterations of this project scraped Google Images via a
// Playwright script and stored results in `images/manifest.json`,
// which an in-app modal then read. That approach got abandoned (slow,
// fragile, results stale within months) but the scaffolding is kept
// here as a no-op for two reasons:
//
//   1. Detail-panel handlers still call openImagePanelById(searchId,
//      { label, term }) so the call site doesn't change if we ever
//      want to revive an inline image grid (e.g. layering Unsplash,
//      Are.na, or museum APIs on top of the Google links).
//
//   2. getSearchId from data.js continues to produce stable ids per
//      search, so any future image cache can key into them without
//      another data-model migration.
//
// To revive the modal: restore the manifest-fetching version of
// openImagePanelById (see git history) and flip
// USE_INLINE_MODAL to true. The detail panel needs no changes.
// ----------------------------------------------------------------

const USE_INLINE_MODAL = false;

export function googleImagesUrl(term) {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term)}`;
}

export function openImagePanelById(searchId, fallback) {
  if (USE_INLINE_MODAL) {
    // Reserved for a future inline gallery. See the comment block above.
    console.warn("Inline modal not implemented in this build.");
    return;
  }
  const term = fallback?.term || fallback?.label || "";
  if (!term) return;
  window.open(googleImagesUrl(term), "_blank", "noopener");
}

// Backwards-compatible older entry point. Same destination.
export function openImagePanel(term /* , movementId */) {
  if (!term) return;
  window.open(googleImagesUrl(term), "_blank", "noopener");
}

// Kept for parity with the modal version; no-op now since there's
// nothing to close. Safe to call.
export function closeImagePanel() {}
