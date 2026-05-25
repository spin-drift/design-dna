// Theme toggle.
//
// Three states: "system" (no class, follows prefers-color-scheme),
// "light" (force light), "dark" (force dark). Stored in localStorage
// under the key "theme". The synchronous inline script in index.html
// applies the saved class before paint to avoid a flash on load; this
// module handles user clicks and keeps the toggle UI in sync.

const STORAGE_KEY = "theme";
const VALID = ["system", "light", "dark"];

function read() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VALID.includes(v) ? v : "system";
  } catch {
    return "system";
  }
}

function write(theme) {
  try {
    if (theme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* localStorage unavailable; choice won't persist across reloads */
  }
}

function apply(theme) {
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark");
  if (theme === "light") root.classList.add("theme-light");
  else if (theme === "dark") root.classList.add("theme-dark");
}

function updateToggle(theme) {
  document.querySelectorAll(".theme-opt").forEach((el) => {
    const isActive = el.dataset.theme === theme;
    el.classList.toggle("active", isActive);
    el.setAttribute("aria-checked", isActive ? "true" : "false");
  });
}

export function initTheme() {
  const current = read();
  apply(current);
  updateToggle(current);

  document.querySelectorAll(".theme-opt").forEach((el) => {
    el.addEventListener("click", () => {
      const theme = el.dataset.theme;
      if (!VALID.includes(theme)) return;
      write(theme);
      apply(theme);
      updateToggle(theme);
    });
  });
}
