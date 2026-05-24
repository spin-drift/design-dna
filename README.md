# Design DNA

A lineage tree of 20th and 21st century design movements. Click any movement to see what it inherits, what it rebels against, and what it became. Click any term — the movement title, a designer, a "see it in" fragment, a canonical example, or the camera icon on a lineage pill — to open a Google Images search for it in a new tab.

## Running locally

It's a pure static site — no build step, no dependencies.

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

(`npx serve .` also works. Opening `index.html` directly via `file://` works in most browsers since ES modules are now widely supported there, but a server is friendlier.)

## Deploying

### Netlify (drag-and-drop)
1. Go to https://app.netlify.com/drop
2. Drag the entire `design-dna` folder onto the page.
3. Done. You'll get a `*.netlify.app` URL immediately.

### Netlify (from GitHub)
1. Push this repo to GitHub.
2. In Netlify, click "Add new site" → "Import an existing project" → pick this repo.
3. Build command: (leave blank). Publish directory: `.` (the root).
4. Deploy.

### GitHub Pages
1. Push this repo to GitHub.
2. Repo Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`.
3. Site goes live at `https://<user>.github.io/design-dna/`.

## Project layout

```
design-dna/
├── index.html           # The shell
├── style.css            # All styles
├── js/
│   ├── data.js          # Movements + branch layouts (the thing to edit)
│   ├── tree.js          # Tree rendering and state
│   ├── detail.js        # Right-hand info panel
│   ├── images.js        # Builds Google Images URLs (+ no-op scaffolding for a future inline gallery)
│   └── main.js          # Entry point
├── netlify.toml         # Netlify defaults (cache headers, fallback)
└── README.md
```

## How the tree positioning works

The vertical axis is **lineage depth**, not strict chronology. Row 0 is the root, row 1 is everything one inheritance step down, and so on. Siblings sit at the same generation even if their actual founding years differ by decades — this keeps parent-to-child arrows short and the tree readable.

If you want a strict-chronology view, that's a future addition: add a numeric `startYear` to each movement and render an alternate layout that uses year-to-y mapping instead of row index. The data and rendering layers are decoupled.

## Adding a movement

In `js/data.js`:

1. Add a new entry to `MOVEMENTS`:
   ```js
   my_movement: {
     name: "...",
     years: "1990s–present",
     region: "...",
     color: "scandi" | "modernist" | "reaction" | "neutral",
     defining: "One-sentence elevator pitch.",
     designers: [
       { name: "Some Designer", interiors: true },  // interiors: true appends "interiors" to the image search
     ],
     inherits: ["parent_id_1", "parent_id_2"],
     rebels: ["thing it reacts against"],
     children: [],
     seeIn: "Where you encounter it.",
     seeInAppendInteriors: true,        // append "interiors" to each see-in fragment search
     appendInteriorsToName: true,       // append "interiors" to the movement-name search
     examples: [
       { term: "Specific search term", note: "Why this is canonical" },
     ],
   }
   ```
2. Add the ID to the `children` array on every parent.
3. Place it in one or more `BRANCHES` layouts as `[id, xPercent]`.

## How the "see images" affordances work

Clicking any of these opens a new tab with a Google Images search:

- The **movement title** (h3)
- Each **designer** name in the panel
- Each **"see it in"** fragment between commas
- Each **canonical example**
- The **📷 icon** on inheritance/descendant chips (clicking the chip itself still navigates the tree)

The interiors-research focus is baked into the search terms via three flags in `data.js`:

- `appendInteriorsToName` — when true, "interiors" is added to the movement-name search (e.g. "Bauhaus interiors" instead of "Bauhaus", since bare "Bauhaus" returns mostly posters)
- `seeInAppendInteriors` — when true, every see-in fragment gets "interiors" appended
- `{ interiors: true }` on a designer — appends "interiors" for that designer specifically (good for interior/architecture designers; off for painters, graphic designers, popularizers)

## Why Google Images and not an embedded gallery?

Earlier iterations tried scraping Google Images with a Playwright script and storing a 50–500 MB image cache in the repo. The scraping turned out to be fragile (Google's HTML structure rotates) and stale within months (a research tool benefits from live results), and the open APIs that *would* be stable (Wikimedia, Openverse, Unsplash, Are.na, museum collections) all have uneven coverage across the movement tree.

The thing that does work reliably and gives consistently good results: opening a new tab with a Google Images search for a well-chosen term. The data layer is set up to generate well-chosen terms, so the affordances all just become "open this query."

The image-loading scaffolding (`openImagePanelById`, `getSearchId`) is preserved in `js/images.js` as a no-op, so a future inline gallery — backed by a curated image cache, a real API, or any other source — can be added without touching the detail panel.

## Ideas worth building next

- A "compare" mode that diffs two movements field by field
- Style fingerprints (palette swatches, material icons, ornament level) as a quick visual diagnostic
- A guessing-game quiz mode: show an interior, guess the style, reveal the lineage path
- A strict-chronology layout toggle (data is already there)
- Adding more movements: Shaker, Streamline Moderne, Hollywood Regency, Memphis-era postmodern subspecies, regional vernaculars (Mediterranean Revival proper, Spanish Colonial)
- An "evolution" animation that walks down a lineage step by step
- A layered inline image source (Are.na for contemporary, museum APIs for historical) using the preserved `openImagePanelById` interface

## License

The code here is MIT-licensed; do whatever you like with it.
