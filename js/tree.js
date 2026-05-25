// Tree rendering. The y-axis represents lineage depth (rows of the
// layout), not strict chronology. We connect parents to children with
// curved SVG paths drawn under the nodes.
//
// Coordinates: x is a percentage of the canvas width (so the tree
// scales with viewport), y is an evenly-spaced row position.

import { MOVEMENTS, BRANCHES } from "./data.js";

const state = {
  branch: "all",
  // No movement is selected on load — the detail panel renders an
  // empty state instead. setNode() sets a real id; getState()
  // consumers check for falsy node.
  node: null,
  listeners: new Set(),
};

export function getState() { return { ...state }; }

export function subscribe(fn) {
  state.listeners.add(fn);
  return () => state.listeners.delete(fn);
}

function emit() {
  for (const fn of state.listeners) fn();
}

export function setBranch(branch) {
  if (!BRANCHES[branch]) return;
  state.branch = branch;
  emit();
}

export function setNode(id) {
  if (!MOVEMENTS[id]) return;
  state.node = id;
  emit();
}

function rowY(rowIndex, totalRows, canvasHeight) {
  // top/bottom are the y-coordinates of the *centers* of the first and
  // last rows. Padding here is half-row-height plus a margin, so nodes
  // don't clip the canvas edges.
  const top = 50;
  const bottom = canvasHeight - 50;
  if (totalRows <= 1) return top;
  return top + (rowIndex * (bottom - top)) / (totalRows - 1);
}

export function renderTree(container) {
  const branch = BRANCHES[state.branch];
  if (!branch) return;

  const rect = container.getBoundingClientRect();
  const canvasW = rect.width;
  const canvasH = 720;

  // Compute pixel positions for every node in this branch
  const positions = {};
  branch.rows.forEach((row, ri) => {
    for (const cell of row) {
      if (!cell) continue;
      const [id, xPct] = cell;
      positions[id] = {
        x: (xPct / 100) * canvasW,
        y: rowY(ri, branch.rows.length, canvasH),
      };
    }
  });

  // Build connector paths. We collect edges from BOTH directions —
  // a parent's children[] AND every child's inherits[] — and dedupe.
  // This is defensive against data mistakes where one side lists a
  // relationship but the other doesn't.
  //
  // Each edge runs from the visual center of the source node to the
  // visual center of the target node. Drawing through the nodes (and
  // letting the node backgrounds occlude the line where they overlap)
  // produces a much cleaner result than trying to anchor to the
  // bottom-edge and top-edge of nodes with varying heights.
  const seenEdges = new Set();
  const paths = [];
  function addEdge(parentId, childId) {
    if (!positions[parentId] || !positions[childId]) return;
    const key = `${parentId}->${childId}`;
    if (seenEdges.has(key)) return;
    seenEdges.add(key);
    const a = positions[parentId];
    const b = positions[childId];
    // Center-to-center using a cubic Bezier with vertical handles, so
    // edges enter and leave nodes vertically. The handles are pulled
    // by ~45% of the vertical gap, giving a soft S-curve even when
    // parent and child are far apart horizontally.
    const dy = b.y - a.y;
    const handle = Math.abs(dy) * 0.45;
    const path =
      `M${a.x} ${a.y} C ${a.x} ${a.y + handle}, ${b.x} ${b.y - handle}, ${b.x} ${b.y}`;
    paths.push(
      `<path d="${path}" fill="none" stroke="var(--rule-strong)" stroke-width="1" />`
    );
  }
  for (const [id, node] of Object.entries(positions)) {
    const m = MOVEMENTS[id];
    for (const childId of m.children || []) addEdge(id, childId);
    for (const parentId of m.inherits || []) addEdge(parentId, id);
  }

  // Build node HTML
  const nodes = Object.entries(positions).map(([id, pos]) => {
    const node = MOVEMENTS[id];
    const isActive = id === state.node;
    return `<div class="node ${node.color}${isActive ? " active" : ""}"
              style="left:${pos.x}px;top:${pos.y}px"
              data-id="${id}"
              role="button"
              tabindex="0"
              aria-pressed="${isActive}">
      <div class="nm">${node.name}</div>
    </div>`;
  }).join("");

  container.innerHTML = `
    <svg class="tree-svg" viewBox="0 0 ${canvasW} ${canvasH}" preserveAspectRatio="none">
      ${paths.join("")}
    </svg>
    ${nodes}
  `;

  // Wire up clicks
  container.querySelectorAll(".node").forEach((el) => {
    const handler = () => setNode(el.dataset.id);
    el.addEventListener("click", handler);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    });
  });
}

export function renderTabs(container) {
  container.innerHTML = Object.entries(BRANCHES)
    .map(([k, v]) => `<button class="tab${k === state.branch ? " active" : ""}" data-branch="${k}">${v.label}</button>`)
    .join("");
  container.querySelectorAll(".tab").forEach((el) => {
    el.addEventListener("click", () => setBranch(el.dataset.branch));
  });
}
