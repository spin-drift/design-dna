// Detail panel for the selected movement.
//
// Renders the movement's facts as a series of fields. Most text in the
// panel is clickable — clicking any of these opens the image modal for
// that specific search:
//
//   - The movement title (h3)              → movement-name search
//   - Each designer name                   → that designer's search
//   - Each "see it in" fragment            → that fragment's search
//   - Each curated example                 → that example's search
//   - The 📷 icon on inherits/descendants  → that movement's search
//                                            (clicking the pill itself
//                                             still navigates the tree)
//
// Markup conventions: behavior selectors (.js-*) are separate from the
// cosmetic class names, so a future restyle can repaint without
// touching this file's logic.

import {
  MOVEMENTS,
  getSearchId,
  getMovementSearchId,
  getDesignerName,
  getDesignerNote,
  splitSeeInFragments,
} from "./data.js";
import { getState, setNode } from "./tree.js";
import { openImagePanelById } from "./images.js";

// ---------- helpers ----------

const CAMERA_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9zm3 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>`;

function maybeInteriorsTerm(name, append) {
  if (!append) return name;
  if (/\binterior(s)?\b/i.test(name)) return name;
  return `${name} interiors`;
}

// ---------- chip rendering ----------
//
// Inherits and descendants are rendered as composite chips: the name
// half navigates the tree, the camera half opens the image modal.

function lineageChips(ids, emptyLabel) {
  if (!ids.length) {
    return `<span class="val empty">${emptyLabel}</span>`;
  }
  return `<div class="chips">${ids
    .map((id) => {
      const m = MOVEMENTS[id];
      if (!m) return "";
      return `<span class="chip-group">
        <button class="chip js-nav-chip" data-id="${id}" title="Navigate to ${escapeAttr(m.name)}">${escapeHtml(m.name)}</button><button class="chip-cam js-images-movement" data-id="${id}" aria-label="Show images for ${escapeAttr(m.name)}" title="Show images for ${escapeAttr(m.name)}">${CAMERA_SVG}</button>
      </span>`;
    })
    .join("")}</div>`;
}

// ---------- designer rendering ----------

function designersHTML(designers, movementId) {
  if (!designers.length) {
    return `<span class="val empty">—</span>`;
  }
  return designers
    .map((d) => {
      const name = getDesignerName(d);
      const note = getDesignerNote(d);
      const noteHTML = note
        ? ` <span class="designer-note">(${escapeHtml(note)})</span>`
        : "";
      return `<button class="link-like js-images-designer" data-movement="${movementId}" data-name="${escapeAttr(name)}">${escapeHtml(name)}</button>${noteHTML}`;
    })
    .join(", ");
}

// ---------- see-in rendering ----------
//
// We render the original see-in string with the comma separators
// preserved, but each fragment between commas becomes its own button.

function seeInHTML(seeIn, movementId) {
  if (!seeIn) return `<span class="val empty">—</span>`;
  const fragments = splitSeeInFragments(seeIn);
  return fragments
    .map(
      (frag) =>
        `<button class="link-like js-images-seein" data-movement="${movementId}" data-fragment="${escapeAttr(frag)}">${escapeHtml(frag)}</button>`
    )
    .join(", ");
}

// ---------- examples rendering ----------

function examplesHTML(examples, movementId) {
  return examples
    .map(
      (ex) => `<div class="example js-images-example" data-movement="${movementId}" data-term="${escapeAttr(ex.term)}">
        <div class="term">${escapeHtml(ex.term)}</div>
        <div class="note">${escapeHtml(ex.note || "")}</div>
      </div>`
    )
    .join("");
}

// ---------- escapes ----------

function escapeAttr(s) {
  return String(s || "").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/&/g, "&amp;");
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---------- main render ----------

export function renderDetail(container) {
  const { node: id } = getState();
  const m = MOVEMENTS[id];
  if (!m) return;

  const rebels = m.rebels.length ? m.rebels.join(", ") : "—";

  container.innerHTML = `
    <button class="js-images-movement detail-title-btn" data-id="${id}" title="Show images for ${escapeAttr(m.name)}">
      <h3>${escapeHtml(m.name)} <span class="title-cam">${CAMERA_SVG}</span></h3>
    </button>
    <div class="meta">${escapeHtml(m.years)} &middot; ${escapeHtml(m.region)}</div>

    <div class="field">
      <div class="lbl">Defining</div>
      <div class="val">${escapeHtml(m.defining)}</div>
    </div>
    <div class="field">
      <div class="lbl">Designers</div>
      <div class="val">${designersHTML(m.designers, id)}</div>
    </div>
    <div class="field">
      <div class="lbl">Inherits</div>
      <div class="val">${lineageChips(m.inherits, "Root — no antecedents in this tree")}</div>
    </div>
    <div class="field">
      <div class="lbl">Reacts to</div>
      <div class="val">${escapeHtml(rebels)}</div>
    </div>
    <div class="field">
      <div class="lbl">Descendants</div>
      <div class="val">${lineageChips(m.children, "Living movement — no clear successor yet")}</div>
    </div>
    <div class="field">
      <div class="lbl">See it in</div>
      <div class="val see-in">${seeInHTML(m.seeIn, id)}</div>
    </div>

    <div class="examples">
      <h4>Canonical examples</h4>
      ${examplesHTML(m.examples, id)}
    </div>
  `;

  wireHandlers(container);
}

// ---------- event wiring ----------

function wireHandlers(container) {
  // Navigation pills (the name half of a lineage chip).
  container.querySelectorAll(".js-nav-chip").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      setNode(el.dataset.id);
    });
  });

  // Movement-image triggers: title button and pill camera icons. Both
  // resolve to the same kind of search.
  container.querySelectorAll(".js-images-movement").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const movementId = el.dataset.id;
      const movement = MOVEMENTS[movementId];
      if (!movement) return;
      const term = maybeInteriorsTerm(movement.name, !!movement.appendInteriorsToName);
      openImagePanelById(getMovementSearchId(movementId), {
        label: movement.name,
        term,
        subtitle: `Movement · ${movement.years}`,
      });
    });
  });

  // Designer links.
  container.querySelectorAll(".js-images-designer").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const movementId = el.dataset.movement;
      const designerName = el.dataset.name;
      const movement = MOVEMENTS[movementId];
      if (!movement) return;
      const designer = (movement.designers || []).find(
        (d) => getDesignerName(d) === designerName
      );
      const append = typeof designer === "object" ? !!designer.interiors : false;
      const term = maybeInteriorsTerm(designerName, append);
      openImagePanelById(getSearchId(movementId, "designer", designerName), {
        label: designerName,
        term,
        subtitle: `Designer · ${movement.name}`,
      });
    });
  });

  // See-in fragment links.
  container.querySelectorAll(".js-images-seein").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const movementId = el.dataset.movement;
      const fragment = el.dataset.fragment;
      const movement = MOVEMENTS[movementId];
      if (!movement) return;
      const term = maybeInteriorsTerm(fragment, !!movement.seeInAppendInteriors);
      openImagePanelById(getSearchId(movementId, "see_in", fragment), {
        label: fragment,
        term,
        subtitle: `Where you see it · ${movement.name}`,
      });
    });
  });

  // Curated example tiles.
  container.querySelectorAll(".js-images-example").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const movementId = el.dataset.movement;
      const term = el.dataset.term;
      const movement = MOVEMENTS[movementId];
      if (!movement) return;
      openImagePanelById(getSearchId(movementId, "example", term), {
        label: term,
        term,
        subtitle: `Canonical · ${movement.name}`,
      });
    });
  });
}
