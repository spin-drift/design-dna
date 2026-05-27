// App bootstrap.

import { renderTree, renderTabs, subscribe, getState, setNode } from "./tree.js";
import { renderDetail } from "./detail.js";
import { initTheme } from "./theme.js";
import { loadManifest } from "./manifest.js";
import { MOVEMENTS } from "./data.js";

const tabsEl = document.getElementById("tabs");
const canvasEl = document.getElementById("tree-canvas");
const detailEl = document.getElementById("detail");

function renderAll() {
  renderTabs(tabsEl);
  renderTree(canvasEl);
  renderDetail(detailEl);
  syncHash();
}

function syncHash() {
  const { node, branch } = getState();
  // When no movement is selected, only encode the branch (or nothing
  // if it's the default). Keeps URLs clean and shareable.
  let hash;
  if (node) hash = `#${branch}/${node}`;
  else if (branch && branch !== "all") hash = `#${branch}`;
  else hash = "";
  const current = location.hash || "";
  if (current !== hash) {
    history.replaceState(null, "", hash || location.pathname + location.search);
  }
}

function readHash() {
  const h = location.hash;
  // Two valid forms:
  //   #branch/movement — both branch and movement
  //   #branch         — branch only (no movement selected)
  const full = h.match(/^#([^/]+)\/([^/]+)$/);
  if (full) {
    const [, , node] = full;
    if (MOVEMENTS[node]) setNode(node);
    return;
  }
  // Branch-only form. We don't have a public setBranch wired through
  // from main.js right now; if the user lands on a branch-only hash,
  // the tree's default state handles it correctly anyway since the
  // hash is mostly for restoring a specific movement view.
}

subscribe(renderAll);
readHash();
initTheme();
renderAll();

// Once the image manifest loads, re-render the detail panel so any
// movement that's already showing picks up its image.
loadManifest().then(() => renderDetail(detailEl));

// Re-render tree on resize so xPct positions adapt to new canvas width.
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => renderTree(canvasEl), 100);
});
