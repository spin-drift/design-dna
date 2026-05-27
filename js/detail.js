// Detail panel for the selected movement.
//
// Renders the movement's facts as a series of fields. Most text in the
// panel is a clickable link to an external image search:
//
//   - The movement title's icons         → Google Images / Pinterest
//   - Each designer name                 → Google Images
//   - Each "see it in" fragment          → Google Images
//   - Each curated example               → Google Images
//   - The 📷 and P on inherits/descendants→ Google Images / Pinterest
//     (the name half of the chip navigates the tree)
//
// Everything that opens an external URL is rendered as an <a target=
// "_blank">. Native anchors flow as inline text with no styling
// gymnastics, and they show their destination in the browser's status
// bar, which is honest. Only the lineage-chip "name half" stays as a
// <button> because it changes app state (sets the selected node)
// rather than navigating away.

import {
  MOVEMENTS,
  getDesignerName,
  getDesignerNote,
  splitSeeInFragments,
} from "./data.js";
import { getState, setNode } from "./tree.js";
import { googleImagesUrl, pinterestSearchUrl } from "./images.js";
import { getImageSources } from "./manifest.js";

// ---------- icons ----------

const CAMERA_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9zm3 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>`;

const PINTEREST_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.547 2.14-.83 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>`;

// ---------- helpers ----------

function maybeInteriorsTerm(name, append) {
  if (!append) return name;
  if (/\binterior(s)?\b/i.test(name)) return name;
  return `${name} interiors`;
}

function escapeAttr(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Shared anchor attributes for any inline text link in this panel.
const linkAttrs = `target="_blank" rel="noopener" class="prose-link"`;

// ---------- field renderers ----------

function lineageChips(ids, emptyLabel) {
  if (!ids.length) {
    return `<span class="val empty">${emptyLabel}</span>`;
  }
  return `<div class="chips">${ids
    .map((id) => {
      const m = MOVEMENTS[id];
      if (!m) return "";
      const name = escapeAttr(m.name);
      const term = maybeInteriorsTerm(m.name, !!m.appendInteriorsToName);
      const gUrl = googleImagesUrl(term);
      const pUrl = pinterestSearchUrl(term);
      return `<span class="chip-group">
        <button class="chip js-nav-chip" data-id="${id}" title="Navigate to ${name}">${escapeHtml(m.name)}</button><a class="chip-cam" href="${gUrl}" target="_blank" rel="noopener" aria-label="Google Images for ${name}" title="Google Images for ${name}">${CAMERA_SVG}</a><a class="chip-cam chip-pin" href="${pUrl}" target="_blank" rel="noopener" aria-label="Pinterest for ${name}" title="Pinterest for ${name}">${PINTEREST_SVG}</a>
      </span>`;
    })
    .join("")}</div>`;
}

function designersHTML(designers, movement) {
  if (!designers.length) {
    return `<span class="val empty">—</span>`;
  }
  return designers
    .map((d) => {
      const name = getDesignerName(d);
      const note = getDesignerNote(d);
      const append = typeof d === "object" ? !!d.interiors : false;
      const term = maybeInteriorsTerm(name, append);
      const noteHTML = note
        ? ` <span class="designer-note">(${escapeHtml(note)})</span>`
        : "";
      return `<a ${linkAttrs} href="${googleImagesUrl(term)}">${escapeHtml(name)}</a>${noteHTML}`;
    })
    .join(", ");
}

function seeInHTML(seeIn, movement) {
  if (!seeIn) return `<span class="val empty">—</span>`;
  const fragments = splitSeeInFragments(seeIn);
  return fragments
    .map((frag) => {
      const term = maybeInteriorsTerm(frag, !!movement.seeInAppendInteriors);
      return `<a ${linkAttrs} href="${googleImagesUrl(term)}">${escapeHtml(frag)}</a>`;
    })
    .join(", ");
}

function examplesHTML(examples) {
  return examples
    .map(
      (ex) => `<a class="example" href="${googleImagesUrl(ex.term)}" target="_blank" rel="noopener">
        <div class="term">${escapeHtml(ex.term)}</div>
        <div class="note">${escapeHtml(ex.note || "")}</div>
      </a>`
    )
    .join("");
}

// ---------- main render ----------

export function renderDetail(container) {
  const { node: id } = getState();

  // Empty state: nothing selected yet. Render a quiet invitation
  // rather than the detail-panel scaffolding.
  if (!id || !MOVEMENTS[id]) {
    container.innerHTML = `
      <div class="detail-empty">
        <h3 class="detail-empty-title">Pick a movement to learn more.</h3>
        <p class="detail-empty-body">
          Example images may reflect modern interpretations rather than period styles.
          <br/><br/>No taxonomy of design can ever be complete or without bias.
        </p>
      </div>
    `;
    return;
  }

  const m = MOVEMENTS[id];

  const rebels = m.rebels.length ? m.rebels.join(", ") : "—";
  const movementTerm = maybeInteriorsTerm(m.name, !!m.appendInteriorsToName);
  const gUrl = googleImagesUrl(movementTerm);
  const pUrl = pinterestSearchUrl(movementTerm);
  const nameAttr = escapeAttr(m.name);

  // Hand-curated image(s), if any exist for this movement. Renders as
  // a single image when there's just one, or a quiet editorial
  // carousel when there are multiple. Each image may have its own
  // source URL; ones with a URL render wrapped in an anchor so
  // clicking credits the source.
  const imageSources = getImageSources(id);
  const imageHTML = imageSources.length === 0
    ? ""
    : renderImageBlock(imageSources, nameAttr);

  container.innerHTML = `
    <div class="detail-title-row">
      <h3 class="detail-title">${escapeHtml(m.name)}</h3>
      <div class="detail-title-actions">
        <a class="detail-title-action" href="${gUrl}" target="_blank" rel="noopener" aria-label="Google Images for ${nameAttr}" title="Google Images for ${nameAttr}">${CAMERA_SVG}</a>
        <a class="detail-title-action detail-title-pin" href="${pUrl}" target="_blank" rel="noopener" aria-label="Pinterest for ${nameAttr}" title="Pinterest for ${nameAttr}">${PINTEREST_SVG}</a>
      </div>
    </div>
    <div class="meta">${escapeHtml(m.years)} &middot; ${escapeHtml(m.region)}</div>
    ${imageHTML}

    <div class="field">
      <div class="lbl">Defining</div>
      <div class="val">${escapeHtml(m.defining)}</div>
    </div>
    <div class="field">
      <div class="lbl">Reacts to</div>
      <div class="val">${escapeHtml(rebels)}</div>
    </div>
    <div class="field">
      <div class="lbl">See it in</div>
      <div class="val see-in">${seeInHTML(m.seeIn, m)}</div>
    </div>
    <div class="field">
      <div class="lbl">Inherits</div>
      <div class="val">${lineageChips(m.inherits, "Root — no antecedents in this tree")}</div>
    </div>
    <div class="field">
      <div class="lbl">Descendants</div>
      <div class="val">${lineageChips(m.children, "Living movement — no clear successor yet")}</div>
    </div>
    <div class="field">
      <div class="lbl">Designers</div>
      <div class="val">${designersHTML(m.designers, m)}</div>
    </div>

    <div class="examples">
      <div class="lbl">Canonical examples</div>
      ${examplesHTML(m.examples)}
    </div>
  `;

  // The only click handler we still need: navigation chips. Everything
  // else is a native anchor that the browser handles.
  container.querySelectorAll(".js-nav-chip").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      setNode(el.dataset.id);
    });
  });

  // Wire the carousel, if there is one. Dot clicks switch which slide
  // is visible; missing image files hide their slide via the onerror
  // handler so we don't leave broken-image icons on screen.
  wireImageBlock(container);
}

// ---------- image block rendering ----------
//
// Layout principle: minimal editorial chrome. The image fills the
// panel width. When there's more than one, a quiet row of dots sits
// below as the only carousel UI — no arrows, no counters, no thumbnail
// filmstrip. The whole image area is the click target for the source
// link (when one exists). Clicking a dot crossfades to that slide.

function renderImageBlock(sources, nameAttr) {
  if (sources.length === 1) {
    const s = sources[0];
    return renderSingleImage(s, nameAttr);
  }
  // Multi-image carousel.
  const slides = sources
    .map((s, i) => {
      const isActive = i === 0;
      const altIndex = i + 1;
      const inner = `<img src="${s.file}" alt="${nameAttr} interior, image ${altIndex}" loading="lazy" onerror="this.closest('.movement-image-slide').remove()" />`;
      const wrappedInner = s.sourceUrl
        ? `<a href="${s.sourceUrl}" target="_blank" rel="noopener" title="Image source" class="movement-image-slide-link">${inner}</a>`
        : inner;
      return `<div class="movement-image-slide${isActive ? " active" : ""}" data-index="${i}">${wrappedInner}</div>`;
    })
    .join("");
  const dots = sources
    .map(
      (_, i) =>
        `<button class="movement-image-dot${i === 0 ? " active" : ""}" data-index="${i}" aria-label="Show image ${i + 1}"></button>`
    )
    .join("");
  // Hover-only navigation zones — left third and right third of the
  // image for prev/next, plus a middle third with a small external-link
  // icon that opens the active slide's source URL. All three fade in
  // on hover. The link element's href is updated in show() as the
  // active slide changes.
  const initialSourceUrl = sources[0].sourceUrl || "";
  const navZones = `
    <button class="movement-image-nav prev" data-direction="-1" aria-label="Previous image">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 6 9 12 15 18"/></svg>
    </button>
    <a class="movement-image-source" href="${initialSourceUrl}" target="_blank" rel="noopener" aria-label="View image source" title="View image source"${initialSourceUrl ? "" : ' style="display:none"'}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>
    </a>
    <button class="movement-image-nav next" data-direction="1" aria-label="Next image">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>
    </button>`;
  return `<div class="movement-image movement-image-carousel" data-count="${sources.length}" tabindex="0" role="region" aria-label="${nameAttr} image carousel">
    <div class="movement-image-stack">
      ${slides}
      ${navZones}
    </div>
    <div class="movement-image-dots">${dots}</div>
  </div>`;
}

function renderSingleImage(source, nameAttr) {
  const img = `<img src="${source.file}" alt="${nameAttr} interior" loading="lazy" onerror="this.closest('.movement-image').style.display='none'" />`;
  if (source.sourceUrl) {
    return `<a class="movement-image" href="${source.sourceUrl}" target="_blank" rel="noopener" title="Image source">${img}</a>`;
  }
  return `<div class="movement-image movement-image-static">${img}</div>`;
}

function wireImageBlock(container) {
  const carousel = container.querySelector(".movement-image-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".movement-image-slide"));
  const dots = Array.from(carousel.querySelectorAll(".movement-image-dot"));
  const navs = Array.from(carousel.querySelectorAll(".movement-image-nav"));
  const sourceLink = carousel.querySelector(".movement-image-source");
  if (slides.length === 0 || dots.length === 0) return;

  // Source URLs indexed by slide position. We read them off the slide
  // anchor (if present) so the source-link icon in the middle of the
  // carousel always points to the active slide's URL.
  const slideUrls = slides.map((slide) => {
    const a = slide.querySelector(".movement-image-slide-link");
    return a ? a.getAttribute("href") : "";
  });

  // Source of truth for the active index. We don't read it from the
  // DOM because slide elements can be removed by onerror handlers
  // (broken images), which would skew DOM-based index math.
  let activeIndex = 0;

  function show(index) {
    // Wrap around at both ends, so left from slide 0 lands on the
    // last slide, and right from the last lands on slide 0.
    const n = slides.length;
    activeIndex = ((index % n) + n) % n;
    slides.forEach((el, i) => el.classList.toggle("active", i === activeIndex));
    dots.forEach((el, i) => el.classList.toggle("active", i === activeIndex));
    // Update the source-link icon to point at the active slide's URL.
    // Hide it if this slide has no URL.
    if (sourceLink) {
      const url = slideUrls[activeIndex];
      if (url) {
        sourceLink.setAttribute("href", url);
        sourceLink.style.display = "";
      } else {
        sourceLink.removeAttribute("href");
        sourceLink.style.display = "none";
      }
    }
  }

  function advance(direction) {
    show(activeIndex + direction);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      show(i);
    });
  });

  navs.forEach((nav) => {
    nav.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const direction = parseInt(nav.dataset.direction, 10);
      advance(direction);
    });
  });

  // Keyboard navigation. Scoped to the document because the carousel
  // doesn't naturally hold focus while the user reads the panel; we
  // bind once per render and tear down when the panel re-renders.
  // (renderDetail clobbers innerHTML on each call, so listeners on
  // removed nodes go away with them; the document-level listener is
  // the only one we need to clean up.)
  const onKey = (e) => {
    // Don't hijack arrow keys if the user is in a text field. There
    // currently aren't any, but this future-proofs.
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      advance(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      advance(1);
    }
  };
  document.addEventListener("keydown", onKey);
  // Store the cleanup so the next renderDetail call can remove it.
  // We attach it to the carousel itself; a MutationObserver would be
  // overkill, and the next render replaces innerHTML wholesale, so
  // the carousel disappears — we just need to make sure we don't leak
  // listeners across navigations.
  if (container._carouselCleanup) container._carouselCleanup();
  container._carouselCleanup = () => document.removeEventListener("keydown", onKey);
}
