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
          This is a family tree. Lines connect ancestors and descendants.
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

  container.innerHTML = `
    <div class="detail-title-row">
      <h3 class="detail-title">${escapeHtml(m.name)}</h3>
      <div class="detail-title-actions">
        <a class="detail-title-action" href="${gUrl}" target="_blank" rel="noopener" aria-label="Google Images for ${nameAttr}" title="Google Images for ${nameAttr}">${CAMERA_SVG}</a>
        <a class="detail-title-action detail-title-pin" href="${pUrl}" target="_blank" rel="noopener" aria-label="Pinterest for ${nameAttr}" title="Pinterest for ${nameAttr}">${PINTEREST_SVG}</a>
      </div>
    </div>
    <div class="meta">${escapeHtml(m.years)} &middot; ${escapeHtml(m.region)}</div>

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
}
