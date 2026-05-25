// URL builders for external image searches.
//
// Earlier versions of this module had an "open the image panel" abstraction
// that was meant to one day render images inline. The site now just opens
// a new tab to the search URL, so the URL builders are all we actually
// need — the detail panel renders them straight into <a href> tags.
//
// If you want to add other image sources later (Are.na, Unsplash, museum
// APIs), add a urlFor<Source>(term) function here and use it the same
// way from detail.js.

export function googleImagesUrl(term) {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term)}`;
}

// Pinterest's pin-search URL. Used for movement-level browsing where we
// want the vibe-and-mood-board feeling Pinterest is good at, rather than
// the specific-thing-from-the-web that Google Images returns. Designer
// names and see-in fragments still go to Google because they're looking
// for specific imagery.
export function pinterestSearchUrl(term) {
  return `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(term)}`;
}
