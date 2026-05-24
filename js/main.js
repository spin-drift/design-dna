// App bootstrap.

import { renderTree, renderTabs, subscribe, getState, setNode } from "./tree.js";
import { renderDetail } from "./detail.js";
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
  const hash = `#${branch}/${node}`;
  if (location.hash !== hash) {
    history.replaceState(null, "", hash);
  }
}

function readHash() {
  const m = location.hash.match(/^#([^/]+)\/([^/]+)$/);
  if (!m) return;
  const [, branch, node] = m;
  if (MOVEMENTS[node]) setNode(node);
}

subscribe(renderAll);
readHash();
renderAll();

// Re-render tree on resize so xPct positions adapt to new canvas width.
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => renderTree(canvasEl), 100);
});
