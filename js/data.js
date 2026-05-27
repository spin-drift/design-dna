// Design movement data. Each movement has:
//   name, years, region, color (palette key)
//   defining: one-sentence elevator pitch
//   designers: array of either strings OR {name, interiors: bool, note?}
//             — when interiors is true, the image search appends "interiors"
//   inherits: array of movement IDs this descends from
//   rebels: short list of what it's reacting against
//   children: array of movement IDs that descend from this
//   seeIn: where to encounter it in the wild (used as prose AND
//          comma-split into searchable fragments)
//   seeInAppendInteriors: when true, each "see it in" fragment gets
//                        " interiors" appended to its search
//   appendInteriorsToName: when true, "interiors" is appended to the
//                        movement name when searched (used for movements
//                        whose bare name returns mostly non-interior
//                        results — e.g. Bauhaus returns posters, De Stijl
//                        returns Mondrian paintings)
//   examples: array of {term, note} — the curated, canonical searches.
//             Curated terms are searched as-is; no append.
//   images: optional array of source URLs for hand-curated images.
//           Filenames are constructed: first is img/<id>.png, then
//           img/<id>2.png, img/<id>3.png, etc. Each array entry is the
//           original source URL the image came from (for attribution
//           on click). One image = no carousel UI; 2+ = carousel with
//           dots. When `images` is missing, the older img/manifest.json
//           is consulted as a fallback for a single linked image.
//
// Individual designers and see-in fragments can be objects with their
// own `interiors` override:
//   designers: [{ name: "...", interiors: true }]
//   seeInOverrides: { "specific fragment": { interiors: false } }
//
// To add a movement: pick an ID, add it to MOVEMENTS, and update the
// `children` and `inherits` arrays on adjacent nodes. Color values are
// palette keys defined in style.css.

export const MOVEMENTS = {
  // ---------- pre-1900 roots ----------
  japonisme: {
    name: "Japonisme",
    years: "1860s–1900s",
    region: "Europe (esp. France, UK)",
    color: "neutral",
    images: [
      "https://www.christies.com/en/lot/lot-6356905",
      "https://www.christies.com/en/lot/lot-6356905"
    ],
    defining: "European absorption of Japanese aesthetics after Japan reopened — flat composition, asymmetry, restraint, natural motifs. A cross-cutting influence rather than a coherent movement.",
    designers: [
      { name: "Christopher Dresser", interiors: true },
      { name: "James McNeill Whistler", interiors: true },
      { name: "Edward William Godwin", interiors: true },
    ],
    inherits: [],
    rebels: ["Victorian maximalism", "Victorian clutter"],
    children: ["arts_crafts", "art_nouveau", "wabi_sabi"],
    seeIn: "Liberty & Co.'s early imports, ukiyo-e prints in Western collections, Whistler's Peacock Room, Godwin's Anglo-Japanese furniture",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Godwin Anglo-Japanese sideboard", note: "The proto-modern silhouette" },
      { term: "Whistler Peacock Room interior", note: "Japonisme as total interior" },
      { term: "Christopher Dresser teapot", note: "Industrial design's first beat" },
      { term: "Hokusai Great Wave Kanagawa", note: "The ukiyo-e print everyone copied" },
    ],
  },
  arts_crafts: {
    name: "Arts & Crafts",
    years: "1880s–1910s",
    region: "UK, then US",
    color: "neutral",
    defining: "Handcraft, honest materials, visible joinery, nature-inspired patterns, rejection of industrial ornament.",
    designers: [
      { name: "William Morris", interiors: true },
      { name: "Gustav Stickley", interiors: true },
      { name: "Charles Voysey", interiors: true },
    ],
    inherits: ["japonisme"],
    rebels: ["Victorian industrial ornamentation"],
    children: ["bauhaus", "scandi_func", "de_stijl", "vienna_secession", "english_country"],
    seeIn: "Stickley furniture, Morris textiles, the bungalow",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "William Morris textile patterns", note: "The wallpaper that started it all" },
      { term: "Gustav Stickley furniture", note: "American mission-style oak" },
      { term: "Red House Bexleyheath Morris", note: "Morris's own home" },
      { term: "Greene and Greene Gamble House", note: "American Arts & Crafts at its peak" },
    ],
  },
  art_nouveau: {
    name: "Art Nouveau",
    years: "1890–1910",
    region: "France, Belgium, Austria, Spain",
    color: "neutral",
    defining: "Whiplash curves, organic forms, ornament as structure. A sibling of Arts & Crafts that embraced new materials (iron, glass) but kept the handcraft ethos.",
    designers: [
      { name: "Hector Guimard", interiors: true },
      { name: "Victor Horta", interiors: true },
      { name: "Antoni Gaudí", interiors: true },
      { name: "Louis Comfort Tiffany", interiors: true },
    ],
    inherits: ["japonisme", "arts_crafts"],
    rebels: ["Academic historicism", "neoclassical revival"],
    children: ["vienna_secession"],
    seeIn: "Paris Métro entrances, Brussels townhouses, Gaudí's Barcelona, Tiffany lamps",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Guimard Paris Metro entrance", note: "Cast iron as botany" },
      { term: "Horta Tassel House Brussels", note: "The Art Nouveau interior" },
      { term: "Gaudi Casa Batllo Barcelona", note: "Art Nouveau at its most expressive" },
      { term: "Tiffany Wisteria lamp", note: "Stained glass as nature study" },
    ],
  },
  vienna_secession: {
    name: "Vienna Secession",
    years: "1897–1932",
    region: "Austria",
    color: "modernist",
    defining: "The geometric, proto-modernist wing of Art Nouveau. Total works of art (Gesamtkunstwerk), grids softening curves, applied arts as fine arts. Bridges Art Nouveau directly to Bauhaus.",
    designers: [
      { name: "Josef Hoffmann", interiors: true },
      { name: "Koloman Moser", interiors: true },
      { name: "Otto Wagner", interiors: true },
    ],
    inherits: ["arts_crafts", "art_nouveau"],
    rebels: ["Whiplash Art Nouveau excess", "historicist academicism"],
    children: ["bauhaus", "de_stijl", "art_deco"],
    seeIn: "Wiener Werkstätte objects, Stoclet Palace, Otto Wagner's Postal Savings Bank",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Hoffmann Stoclet Palace Brussels", note: "The Gesamtkunstwerk in built form" },
      { term: "Otto Wagner Postal Savings Bank Vienna", note: "Proto-modernist civic architecture" },
      { term: "Wiener Werkstatte tea service Hoffmann", note: "Grids in silver" },
      { term: "Koloman Moser textile design", note: "Where Art Nouveau meets the grid" },
    ],
  },

  // ---------- early 20th century modernist trunk ----------
  art_deco: {
    name: "Art Deco",
    years: "1920s–1930s",
    region: "France, US, global",
    color: "reaction",
    defining: "Glamorous machine-age modernism. Stepped silhouettes, sunburst motifs, exotic veneers, lacquer, chrome, mirrored surfaces, geometric repetition. The opulent twin of austere modernism — luxury Bauhaus.",
    designers: [
      { name: "Émile-Jacques Ruhlmann", interiors: true },
      { name: "Jean-Michel Frank", interiors: true },
      { name: "Eileen Gray", interiors: true },
      { name: "Donald Deskey", interiors: true },
    ],
    inherits: ["vienna_secession"],
    rebels: ["Art Nouveau curves", "Edwardian heaviness"],
    children: ["hollywood_regency"],
    seeIn: "Chrysler Building lobby, Radio City Music Hall, Miami's South Beach, ocean liner interiors, Hollywood Regency",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Chrysler Building lobby interior", note: "Deco at its civic best" },
      { term: "Radio City Music Hall interior", note: "The Deco palace" },
      { term: "Ruhlmann macassar ebony cabinet", note: "Deco furniture at its most luxe" },
      { term: "Jean-Michel Frank straw marquetry interior", note: "Deco's subtler, modernist wing" },
      { term: "Eileen Gray E-1027 villa interior", note: "Deco meets modernism on the Riviera" },
      { term: "Miami South Beach Art Deco hotel", note: "Streamline Moderne by the sea" },
    ],
  },

  // ---------- early 20th century modernist trunk (continued) ----------
  de_stijl: {
    name: "De Stijl",
    years: "1917–1931",
    region: "Netherlands",
    color: "modernist",
    defining: "Pure geometry, primary colors plus black and white, asymmetric balance, total abstraction.",
    designers: [
      { name: "Piet Mondrian", interiors: false },
      { name: "Gerrit Rietveld", interiors: true },
      { name: "Theo van Doesburg", interiors: false },
    ],
    inherits: ["arts_crafts", "vienna_secession"],
    rebels: ["Ornament", "representational form"],
    children: ["bauhaus", "international"],
    seeIn: "Rietveld's furniture, Mondrian's grids, Rietveld Schröder House",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Rietveld Red and Blue Chair", note: "Furniture as a Mondrian painting" },
      { term: "Rietveld Schröder House", note: "Architecture as De Stijl manifesto" },
      { term: "Mondrian Composition with Red Blue Yellow", note: "The grid that defined a movement" },
    ],
  },
  bauhaus: {
    name: "Bauhaus",
    years: "1919–1933",
    region: "Germany",
    color: "modernist",
    defining: "Form follows function. Tubular steel, primary colors, mass-production thinking, unity of art and industry.",
    designers: [
      { name: "Walter Gropius", interiors: true },
      { name: "Marcel Breuer", interiors: true },
      { name: "Mies van der Rohe", interiors: true },
    ],
    inherits: ["arts_crafts", "de_stijl", "vienna_secession"],
    rebels: ["Decorative excess", "art-craft separation"],
    children: ["international", "scandi_mod"],
    seeIn: "Wassily Chair, Barcelona Chair, the Dessau school building",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Breuer Wassily Chair B3", note: "Tubular steel breakthrough" },
      { term: "Bauhaus Dessau building Gropius", note: "The school as its own manifesto" },
      { term: "Barcelona Chair Mies van der Rohe", note: "Modernist luxury" },
      { term: "Bauhaus poster Herbert Bayer", note: "Graphic design template" },
    ],
  },
  scandi_func: {
    name: "Scandinavian functionalism",
    years: "1930s",
    region: "Sweden, Denmark, Finland",
    color: "scandi",
    defining: "Functionalism softened by warmth. Light woods, natural light, hand-feel preserved alongside industrial methods.",
    designers: [
      { name: "Alvar Aalto", interiors: true },
      { name: "Bruno Mathsson", interiors: true },
    ],
    inherits: ["arts_crafts"],
    rebels: ["Bauhaus austerity", "industrial coldness"],
    children: ["scandi_mod"],
    seeIn: "Aalto Stool 60, Paimio Chair, bent-plywood everything",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Aalto Paimio Chair", note: "Bent plywood for tuberculosis patients" },
      { term: "Aalto Stool 60", note: "Three L-legs, still in production" },
      { term: "Aalto Savoy Vase", note: "Organic curves in glass" },
      { term: "Villa Mairea Aalto", note: "Functionalism gets a soul" },
    ],
  },

  // ---------- ancient/imported aesthetic ----------
  wabi_sabi: {
    name: "Wabi-sabi",
    years: "16th c. Japan; absorbed into Western design 1990s–",
    region: "Japan; global from the 1990s",
    color: "scandi",
    defining: "Beauty in imperfection, impermanence, and incompleteness. A Japanese aesthetic philosophy, not a movement — but adopted as a design vocabulary in the West and now a direct input to Japandi.",
    designers: [
      { name: "Axel Vervoordt", interiors: true, note: "Western adopter" },
      { name: "Leonard Koren", interiors: false, note: "popularizer" },
    ],
    inherits: ["japonisme"],
    rebels: ["Perfectionism", "gloss", "mass-produced sameness"],
    children: ["japandi", "organic_mod"],
    seeIn: "Tea ceremony rooms, kintsugi pottery, Axel Vervoordt interiors, restrained Belgian and Japanese spaces",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "kintsugi gold repair pottery", note: "Imperfection as feature" },
      { term: "Axel Vervoordt wabi sabi interior", note: "The Belgian-Japanese hybrid" },
      { term: "Japanese tea room interior", note: "The original reference" },
      { term: "raku ware tea bowl", note: "Pottery with the maker's hand visible" },
    ],
  },

  // ---------- mid-century modernist branches ----------
  international: {
    name: "International Style",
    years: "1932–1960s",
    region: "Global, US-centered",
    color: "modernist",
    defining: "Glass curtain walls, steel frames, no ornament, volume over mass. The look of corporate modernism.",
    designers: [
      { name: "Mies van der Rohe", interiors: true },
      { name: "Le Corbusier", interiors: true },
      { name: "Philip Johnson", interiors: true },
    ],
    inherits: ["bauhaus", "de_stijl"],
    rebels: ["Regional vernacular", "decorative tradition"],
    children: ["mid_century", "brutalism", "minimalism"],
    seeIn: "Seagram Building, Farnsworth House, every glass office tower",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Seagram Building Mies", note: "The ur-skyscraper" },
      { term: "Farnsworth House Mies van der Rohe", note: "Glass-box minimalism" },
      { term: "Villa Savoye Le Corbusier", note: "Five points of architecture" },
      { term: "Glass House Philip Johnson", note: "The American glass pavilion" },
    ],
  },
  scandi_mod: {
    name: "Scandinavian Modern",
    years: "1940s–1960s",
    region: "Denmark, Sweden, Finland",
    color: "scandi",
    defining: "Warm functionalism. Teak and oak, organic curves, democratic design — beautiful things for everyone.",
    designers: [
      { name: "Hans Wegner", interiors: true },
      { name: "Arne Jacobsen", interiors: true },
      { name: "Finn Juhl", interiors: true },
    ],
    inherits: ["scandi_func", "bauhaus"],
    rebels: ["Cold steel-and-glass modernism"],
    children: ["danish_mod", "mid_century", "contemp_scandi"],
    seeIn: "Wishbone Chair, Egg Chair, Series 7",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Wegner Wishbone Chair CH24", note: "The Y-back icon" },
      { term: "Jacobsen Egg Chair", note: "Sculpture as seating" },
      { term: "Jacobsen Series 7 chair", note: "Most-copied chair ever" },
      { term: "Finn Juhl 45 Chair", note: "Floating wood and upholstery" },
    ],
  },
  mid_century: {
    name: "Mid-Century Modern",
    years: "1945–1969",
    region: "US, especially California",
    color: "modernist",
    defining: "Postwar optimism plus émigré Bauhaus ideas plus new materials. Molded plywood, fiberglass shells, atomic motifs, indoor-outdoor living.",
    designers: [
      { name: "Charles & Ray Eames", interiors: true },
      { name: "Eero Saarinen", interiors: true },
      { name: "George Nelson", interiors: true },
    ],
    inherits: ["international", "scandi_mod"],
    rebels: ["Heavy traditional American furniture"],
    children: ["california_mod", "organic_mod", "mcm_revival"],
    seeIn: "Eames Lounge Chair, Tulip Table, Case Study Houses",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Eames Lounge Chair 670", note: "The leather-and-plywood classic" },
      { term: "Saarinen Tulip Table", note: "One pedestal, no leg-tangle" },
      { term: "Nelson Ball Clock", note: "Atomic-age wall clock" },
      { term: "Case Study House 22 Stahl", note: "Los Angeles as MCM showroom" },
      { term: "Noguchi coffee table IN-50", note: "Sculpture you can set drinks on" },
    ],
  },
  danish_mod: {
    name: "Danish Modern",
    years: "1950s–1960s",
    region: "US import of Danish design",
    color: "scandi",
    defining: "Same DNA as Scandinavian Modern but specifically what was marketed and sold in postwar America.",
    designers: [
      { name: "Hans Wegner", interiors: true },
      { name: "Arne Jacobsen", interiors: true },
      { name: "Børge Mogensen", interiors: true },
    ],
    inherits: ["scandi_mod"],
    rebels: [],
    children: ["contemp_scandi"],
    seeIn: "The teak credenza in every 1960s American living room",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "teak credenza Danish modern", note: "The icon of the postwar American home" },
      { term: "Mogensen Spanish Chair", note: "Saddle leather over oak" },
      { term: "Wegner Papa Bear Chair", note: "Wingback reimagined" },
    ],
  },
  california_mod: {
    name: "California Modernism",
    years: "1945–1970s",
    region: "Los Angeles, Palm Springs",
    color: "modernist",
    defining: "Glass walls, flat roofs, post-and-beam, swimming pools, climate-driven openness. Includes Desert Modernism (Palm Springs).",
    designers: [
      { name: "Richard Neutra", interiors: true },
      { name: "Rudolph Schindler", interiors: true },
      { name: "Albert Frey", interiors: true },
    ],
    inherits: ["international", "mid_century"],
    rebels: ["Closed-off traditional homes"],
    children: ["minimalism"],
    seeIn: "Stahl House, Kaufmann House, every Palm Springs A-frame",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Kaufmann House Neutra Palm Springs", note: "Desert modernism at its purest" },
      { term: "Frey House II Palm Springs", note: "House around a boulder" },
      { term: "Schindler House Kings Road", note: "The Los Angeles ur-house" },
    ],
  },
  // ---------- global modernist branches ----------
  // The Mexican, Brazilian, and Tropical schools were full-fledged
  // modernist regional movements, not just provincial echoes of the
  // European trunk. Each one took International Style ideas and turned
  // them into something rooted in place: Barragán's saturated walls,
  // Niemeyer's curves, Bawa's indoor-outdoor pavilions. They belong
  // alongside MCM, not downstream of it.
  mexican_mod: {
    name: "Mexican Modernism",
    years: "1940s–present",
    region: "Mexico",
    color: "reaction",
    defining: "Modernist forms grounded in Mexican vernacular and color. Saturated planes of pink, ochre, and indigo against rough plaster; water features; volcanic stone; massive doors. Modernism with the sun left on.",
    designers: [
      { name: "Luis Barragán", interiors: true },
      { name: "Ricardo Legorreta", interiors: true },
      { name: "Mathias Goeritz", interiors: false, note: "sculptor-collaborator" },
      { name: "Pedro Friedeberg", interiors: true },
    ],
    inherits: ["international"],
    rebels: ["Cold International Style universality", "colonial pastiche"],
    children: [],
    seeIn: "Casa Barragán in Mexico City, Hotel Camino Real, Casa Gilardi's pink pool, contemporary CDMX restaurants",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Casa Barragan Mexico City interior", note: "The architect's own house, now a museum" },
      { term: "Casa Gilardi pink pool Barragan", note: "The most-photographed Barragán room" },
      { term: "Hotel Camino Real Legorreta Mexico", note: "Mexican Modernism at hotel scale" },
      { term: "Cuadra San Cristobal Barragan", note: "Pink walls, water, horses" },
      { term: "Pedro Friedeberg Hand Chair", note: "The most iconic Mexican modern object" },
    ],
  },
  brazilian_mod: {
    name: "Brazilian Modernism",
    years: "1940s–1970s, revival now",
    region: "Brazil (São Paulo, Rio)",
    color: "modernist",
    defining: "Curves where European modernism kept straight lines, tropical hardwoods (jacarandá, ipê), generous indoor-outdoor flow, sculptural concrete. Sensual and structural at once — modernism that could be relaxed in.",
    designers: [
      { name: "Oscar Niemeyer", interiors: true },
      { name: "Lina Bo Bardi", interiors: true },
      { name: "Sergio Rodrigues", interiors: true },
      { name: "Roberto Burle Marx", interiors: false, note: "landscape" },
      { name: "Jorge Zalszupin", interiors: true },
    ],
    inherits: ["international"],
    rebels: ["Bauhaus rigidity", "colonial Portuguese heaviness"],
    children: ["tropical_mod"],
    seeIn: "Niemeyer's Brasilia interiors, Lina Bo Bardi's Casa de Vidro, Sergio Rodrigues Mole chair in every cool São Paulo apartment",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Casa de Vidro Lina Bo Bardi", note: "Glass house in the São Paulo jungle" },
      { term: "Sergio Rodrigues Mole armchair", note: "Leather-and-jacaranda icon" },
      { term: "Oscar Niemeyer Canoas House Rio", note: "Curves into the hillside" },
      { term: "SESC Pompeia Lina Bo Bardi", note: "Industrial-meets-tropical conversion" },
      { term: "Brazilian modernist living room jacaranda", note: "The residential vernacular" },
    ],
  },
  tropical_mod: {
    name: "Tropical Modern",
    years: "1960s–present",
    region: "Sri Lanka, Southeast Asia, then global luxury hospitality",
    color: "scandi",
    defining: "Indoor-outdoor pavilions, deep overhangs, courtyards and water, locally sourced stone and wood, restraint plus climate sense. The aesthetic of the contemporary luxury resort — plus increasingly residential.",
    designers: [
      { name: "Geoffrey Bawa", interiors: true },
      { name: "Kerry Hill", interiors: true },
      { name: "Ed Tuttle", interiors: true, note: "Aman Resorts" },
      { name: "Bill Bensley", interiors: true },
    ],
    inherits: ["mid_century", "brazilian_mod"],
    rebels: ["Imported International Style without climate sense"],
    children: [],
    seeIn: "Every Aman resort, Bawa's Lunuganga and Number 11, Alila and Como hotels, any luxury villa in Bali",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Geoffrey Bawa Lunuganga estate", note: "The architect's garden-home" },
      { term: "Bawa Number 11 Colombo", note: "Bawa's Colombo townhouse" },
      { term: "Aman resort interior Ed Tuttle", note: "The hospitality archetype" },
      { term: "Kerry Hill Amanusa Bali", note: "Pavilion-style tropical modernism" },
      { term: "Geoffrey Bawa Kandalama hotel", note: "Building into a tropical rock face" },
      { term: "tropical modern villa Bali interior", note: "The residential expression" },
    ],
  },

  // ---------- 1930s–1960s glamour, 1960s pop, and 1980s luxe ----------
  hollywood_regency: {
    name: "Hollywood Regency",
    years: "1930s–1960s, revival 2000s–2010s",
    region: "Los Angeles and New York",
    color: "reaction",
    defining: "Mid-century glamour. Dorothy Draper's outsized neoclassical references, William Haines's polished Hollywood-actor commissions, chinoiserie, oversized scale, lacquered finishes, high-contrast pattern (especially black-and-white), brass and mirrors. The residential expression of Art Deco's glamour after Art Deco itself went out of fashion — kept alive in Beverly Hills until the 2000s, when Jonathan Adler made it accessible again.",
    designers: [
      { name: "Dorothy Draper", interiors: true },
      { name: "William Haines", interiors: true, note: "Hollywood clients" },
      { name: "Tony Duquette", interiors: true },
      { name: "Jonathan Adler", interiors: true, note: "revival" },
      { name: "Kelly Wearstler", interiors: true, note: "early career" },
    ],
    inherits: ["art_deco"],
    rebels: ["Mid-century austerity", "Bauhaus moral seriousness"],
    children: ["cocaine_mod", "grandmillennial"],
    seeIn: "The Greenbrier hotel, Carlyle Hotel lobby, Joan Crawford's Brentwood house, every Jonathan Adler showroom, early Viceroy hotels",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Dorothy Draper Greenbrier interior", note: "The Draper manifesto, still operating" },
      { term: "Dorothy Draper Carlyle Hotel", note: "The hotel that codified the look" },
      { term: "William Haines Joan Crawford house", note: "Hollywood Regency at celebrity scale" },
      { term: "Tony Duquette interior", note: "The theatrical maximalist wing" },
      { term: "Jonathan Adler living room interior", note: "The 2000s revival, mass market" },
      { term: "Viceroy hotel Santa Monica Wearstler", note: "Wearstler's early Hollywood Regency revival" },
      { term: "Hollywood Regency black white floor pattern", note: "The signature checkered move" },
      { term: "chinoiserie wallpaper Hollywood Regency", note: "The signature wall" },
    ],
  },
  pop_art: {
    name: "Pop Art",
    years: "mid-1960s–early 1970s",
    region: "Europe and US",
    color: "reaction",
    defining: "Plastic-fantastic optimism. Molded plastics in candy colors, modular foam seating, geometric pop motifs, futurism without dystopia. Mid-century modernism's late, weird, joyful phase — and the direct ancestor of Memphis.",
    designers: [
      { name: "Verner Panton", interiors: true },
      { name: "Pierre Paulin", interiors: true },
      { name: "Joe Colombo", interiors: true },
      { name: "Eero Aarnio", interiors: true },
      { name: "Olivier Mourgue", interiors: true },
    ],
    inherits: ["mid_century"],
    rebels: ["Mid-century woodgrain seriousness", "Bauhaus moral seriousness"],
    children: ["memphis"],
    seeIn: "The Panton Chair in every design book, Aarnio's Ball Chair, 2001: A Space Odyssey set design, late-60s European hotel lobbies",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Verner Panton chair red", note: "The first single-form plastic chair" },
      { term: "Eero Aarnio Ball Chair", note: "Pop's most-photographed object" },
      { term: "Pierre Paulin Tongue chair", note: "Foam sculpted into furniture" },
      { term: "Joe Colombo Tube Chair", note: "Modular, stackable, plastic" },
      { term: "2001 Space Odyssey hotel set Mourgue", note: "Pop Art at cinematic scale" },
      { term: "Verner Panton Visiona interior", note: "Total pop environment, 1970" },
    ],
  },
  cocaine_mod: {
    name: "Cocaine Chic",
    years: "late 1970s–mid 1980s",
    region: "NYC, LA, Miami",
    color: "reaction",
    defining: "The commercial-residential luxe of the disco era. Mirrored walls, smoked glass, chrome, brass, lacquered black, cream shag, oversized leather sectionals, glass block, palm motifs. A retroactive name for a real moment — not in the textbooks but unmistakable when you see it. The Tony Montana mansion is the joke version; John Saladino's actual interiors are the serious one.",
    designers: [
      { name: "John Saladino", interiors: true },
      { name: "Angelo Donghia", interiors: true },
      { name: "Michael Taylor", interiors: true },
      { name: "Steve Chase", interiors: true },
    ],
    inherits: ["hollywood_regency", "international"],
    rebels: ["1970s earth-tone domesticity", "hippie maximalism"],
    children: [],
    seeIn: "Scarface's mansion, American Psycho's apartment, Halston's townhouse, every late-70s Architectural Digest",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "John Saladino interior 1980s", note: "The serious, scholarly version" },
      { term: "Angelo Donghia interior penthouse", note: "Mainstream luxe glamour" },
      { term: "Halston townhouse Paul Rudolph interior", note: "The era's most-photographed home" },
      { term: "Scarface Tony Montana mansion interior", note: "The joke version of the look" },
      { term: "American Psycho Patrick Bateman apartment", note: "Cinematic shorthand" },
      { term: "1980s lacquer mirror glass living room", note: "The generic period archetype" },
      { term: "Steve Chase Palm Springs interior", note: "Desert luxe version" },
    ],
  },

  brutalism: {
    name: "Brutalism",
    years: "1950s–1970s",
    region: "UK, then global",
    color: "modernist",
    defining: "Raw concrete (béton brut), monumental mass, expressed structure, civic ambition. Honesty taken to extremes.",
    designers: [
      { name: "Le Corbusier", interiors: true, note: "late" },
      { name: "Paul Rudolph", interiors: true },
      { name: "Ernő Goldfinger", interiors: true },
    ],
    inherits: ["international"],
    rebels: ["Slickness of glass-box modernism"],
    children: ["postmodern", "industrial"],
    seeIn: "Barbican, Trellick Tower, Boston City Hall",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Barbican Estate London", note: "Concrete utopia, mostly" },
      { term: "Trellick Tower Goldfinger", note: "Brutalist housing icon" },
      { term: "Boston City Hall brutalism", note: "Civic concrete in America" },
      { term: "Unité d'Habitation Le Corbusier", note: "Where it all started" },
    ],
  },

  // ---------- reaction / postmodern branch ----------
  postmodern: {
    name: "Postmodernism",
    years: "1972–1990s",
    region: "US, Italy",
    color: "reaction",
    defining: "Ornament returns. Historical quotation, irony, color, references — explicit rejection of modernist purity.",
    designers: [
      { name: "Robert Venturi", interiors: true },
      { name: "Michael Graves", interiors: true },
      { name: "Philip Johnson", interiors: true, note: "late" },
    ],
    inherits: ["brutalism"],
    rebels: ["Modernism", "International Style", "'less is more'"],
    children: ["memphis", "maximalism", "mcmansion"],
    seeIn: "Portland Building, AT&T Building, Vanna Venturi House",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Portland Building Michael Graves", note: "Color and column on a civic block" },
      { term: "AT&T Building Philip Johnson", note: "Chippendale skyscraper" },
      { term: "Vanna Venturi House", note: "The postmodern manifesto, built" },
    ],
  },
  memphis: {
    name: "Memphis",
    years: "1981–1987",
    region: "Milan",
    color: "reaction",
    defining: "Loud patterns, plastic laminates, geometric shapes, jarring color. Postmodernism turned up to eleven, briefly.",
    designers: [
      { name: "Ettore Sottsass", interiors: true },
      { name: "Michele De Lucchi", interiors: true },
    ],
    inherits: ["postmodern", "pop_art"],
    rebels: ["Good taste itself"],
    children: ["maximalism"],
    seeIn: "Carlton Bookshelf, anything that looks like a 1985 music video",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Sottsass Carlton Bookshelf", note: "The Memphis poster child" },
      { term: "Memphis Group Milan 1981", note: "Group portrait of the movement" },
      { term: "Sottsass Casablanca sideboard", note: "Laminate as high design" },
    ],
  },

  // ---------- the durable american middle and its inflated cousin ----------
  suburban_traditional: {
    name: "Suburban Traditional",
    years: "1950s–present (peak 1980s–2000s)",
    region: "US, then global suburbs",
    color: "neutral",
    defining: "The unmarked steady-state of late-20th-century American suburban interiors. Heavy oak or cherry furniture, Tuscan or French-country kitchens, formal living rooms, floral upholstery, wall-to-wall carpet, saturated paint colors. The aesthetic almost nobody chooses on purpose but everybody recognizes — and the thing that most contemporary lifestyle styles are reacting to.",
    designers: [],
    inherits: [],
    rebels: ["Mid-Century Modern austerity"],
    children: ["mcmansion"],
    seeIn: "Pottery Barn 1998 catalog, Tuscan kitchens, formal dining rooms, oak entertainment centers, beige berber carpet",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Tuscan kitchen 2000s interior", note: "The signature aspirational kitchen" },
      { term: "oak entertainment center living room", note: "The bulky 90s anchor piece" },
      { term: "formal dining room cherry furniture", note: "The room nobody used" },
      { term: "Pottery Barn 1998 catalog interior", note: "The mass-market codifier" },
      { term: "floral upholstery living room 1990s", note: "The chintz era in America" },
    ],
  },
  mcmansion: {
    name: "McMansion",
    years: "1985–present",
    region: "US suburban spec building",
    color: "reaction",
    defining: "Postmodern eclecticism applied to spec building, at scale. Two-story foyers, soaring great-room ceilings, palladian windows, mismatched roof gables, a Tuscan column or two glued onto a Colonial body. Not so much a style as a syndrome — but absolutely a recognizable aesthetic.",
    designers: [
      { name: "Toll Brothers", interiors: true, note: "as a developer aesthetic" },
    ],
    inherits: ["postmodern", "suburban_traditional"],
    rebels: ["Modesty", "restraint", "coherence"],
    children: [],
    seeIn: "Two-story foyers, palladian windows, mismatched gables, granite-and-cherry kitchens, the McMansion Hell blog catalogues thousands",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "McMansion two story foyer interior", note: "The signature room" },
      { term: "McMansion great room cathedral ceiling", note: "The other signature room" },
      { term: "McMansion granite kitchen cherry cabinets", note: "The aspirational kitchen, again" },
      { term: "McMansion exterior palladian window", note: "Outside diagnostic, since it's so distinctive" },
      { term: "McMansion Hell blog example", note: "Kate Wagner's catalog of crimes" },
    ],
  },

  // ---------- contemporary minimalist/warm cluster ----------
  minimalism: {
    name: "Minimalism",
    years: "1960s–present",
    region: "Global",
    color: "modernist",
    defining: "Reduction to essentials. Monochrome palettes, hidden storage, negative space as design element.",
    designers: [
      { name: "John Pawson", interiors: true },
      { name: "Tadao Ando", interiors: true },
      { name: "Donald Judd", interiors: true },
    ],
    inherits: ["international", "california_mod"],
    rebels: ["Decorative accumulation"],
    children: ["japandi", "contemp_scandi"],
    seeIn: "Calvin Klein flagships, Ando concrete houses, white-box galleries",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "John Pawson interior minimalism", note: "British minimalism at its purest" },
      { term: "Tadao Ando Church of Light", note: "Concrete and a cross-shaped opening" },
      { term: "Donald Judd 101 Spring Street", note: "Living inside a Judd installation" },
    ],
  },
  contemp_scandi: {
    name: "Contemporary Scandi",
    years: "1990s–present",
    region: "Nordic, global IKEA effect",
    color: "scandi",
    defining: "Mass-market Scandinavian: light woods, white walls, hygge, functional restraint, accessible price points.",
    designers: [
      { name: "Cecilie Manz", interiors: true },
      { name: "Jaime Hayon", interiors: true },
      { name: "IKEA", interiors: true, note: "collective" },
    ],
    inherits: ["scandi_mod", "danish_mod", "minimalism"],
    rebels: [],
    children: ["japandi", "organic_mod", "hamptons", "modern_farmhouse"],
    seeIn: "Most IKEA catalogs, Muuto, Hay, Fritz Hansen reissues",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Muuto Fiber Chair", note: "Updated Scandi for the 2010s" },
      { term: "Hay About a Chair AAC", note: "Wegner DNA, IKEA price point" },
      { term: "hygge living room interior", note: "The Instagram-ready archetype" },
    ],
  },
  mcm_revival: {
    name: "Mid-century revival",
    years: "2000s–present",
    region: "US, global",
    color: "modernist",
    defining: "The conscious reissuing of MCM as a 21st-century style — original designs back in production, plus mass-market interpretations. Bridges MCM into the contemporary scene and feeds directly into Organic Modern.",
    designers: [
      { name: "Herman Miller", interiors: true, note: "reissues" },
      { name: "Knoll", interiors: true, note: "reissues" },
      { name: "West Elm", interiors: true, note: "mass market" },
    ],
    inherits: ["mid_century"],
    rebels: ["Heavy traditional and McMansion aesthetics of the 90s"],
    children: ["organic_mod", "modern_farmhouse"],
    seeIn: "Eames reissues, every West Elm catalog 2010+, Mad Men's set design, Dwell magazine",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Herman Miller Eames reissue catalog", note: "MCM back in production" },
      { term: "Dwell magazine cover home", note: "The MCM revival house, photographed" },
      { term: "West Elm mid century living room", note: "Mass-market interpretation" },
      { term: "Mad Men Draper apartment set", note: "The MCM revival's biggest ad campaign" },
    ],
  },
  organic_mod: {
    name: "Organic Modern",
    years: "2015–present",
    region: "US, then global",
    color: "scandi",
    defining: "Modernist bones, natural materials. Live-edge wood, boucle, plaster, plants, warm minimalism.",
    designers: [
      { name: "Kelly Wearstler", interiors: true, note: "some work" },
      { name: "Athena Calderone", interiors: true },
    ],
    inherits: ["mid_century", "contemp_scandi", "mcm_revival", "wabi_sabi"],
    rebels: ["Cold minimalism, sterile MCM"],
    children: ["japandi", "modern_med"],
    seeIn: "Most Architectural Digest interiors 2018+, boucle armchairs everywhere",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "organic modern living room interior", note: "The reference look" },
      { term: "boucle armchair plaster walls", note: "Signature texture combo" },
      { term: "live edge dining table modern", note: "The slab as centerpiece" },
      { term: "Athena Calderone interior", note: "One of the style's leading voices" },
    ],
  },
  japandi: {
    name: "Japandi",
    years: "2016–present",
    region: "Global",
    color: "scandi",
    defining: "Scandinavian minimalism meets Japanese wabi-sabi. Even more restrained than Scandi, more textural than minimalism.",
    designers: [
      { name: "Norm Architects", interiors: true },
      { name: "Keiji Ashizawa", interiors: true },
    ],
    inherits: ["contemp_scandi", "minimalism", "organic_mod", "wabi_sabi"],
    rebels: ["Layered maximalism"],
    children: [],
    seeIn: "Norm Architects projects, Karimoku Case Study, restrained airbnbs",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Norm Architects Japandi interior", note: "The studio that codified the look" },
      { term: "Karimoku Case Study furniture", note: "Japanese craft, Scandi silhouette" },
      { term: "Japandi bedroom wabi sabi", note: "Restraint with texture" },
    ],
  },

  industrial: {
    name: "Industrial",
    years: "1970s–present",
    region: "NYC SoHo origins, then global",
    color: "modernist",
    defining: "Exposed brick, blackened steel, Edison bulbs, concrete floors, ductwork, leather and reclaimed wood. Born when artists colonized SoHo cast-iron buildings in the 1970s; commodified as a residential style from the 1990s on.",
    designers: [
      { name: "Roman Williams", interiors: true, note: "Stephen Alesch and Robin Standefer" },
      { name: "Restoration Hardware", interiors: true, note: "mass market" },
    ],
    inherits: ["brutalism", "international"],
    rebels: ["Suburban Traditional", "pristine domesticity"],
    children: [],
    seeIn: "NYC SoHo loft conversions, Restoration Hardware showrooms, exposed-brick coffee shops, Ace Hotel lobbies",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "SoHo loft interior exposed brick", note: "The Manhattan archetype" },
      { term: "industrial loft kitchen blackened steel", note: "The signature kitchen move" },
      { term: "Edison bulb pendant industrial interior", note: "The single most-cloned detail" },
      { term: "Ace Hotel lobby interior", note: "Industrial chic at hospitality scale" },
      { term: "Restoration Hardware Modern showroom", note: "Mass-market industrial" },
      { term: "Roman and Williams interior", note: "The boutique-hotel codifiers" },
    ],
  },

  // ---------- contemporary maximalist and reaction currents ----------
  maximalism: {
    name: "Maximalism",
    years: "2015–present",
    region: "Global",
    color: "reaction",
    defining: "Pattern-on-pattern, saturated color, collected objects, deliberate excess. Reaction to a decade of grayscale minimalism.",
    designers: [
      { name: "Kelly Wearstler", interiors: true },
      { name: "Luke Edward Hall", interiors: true },
      { name: "Beata Heuman", interiors: true },
    ],
    inherits: ["postmodern", "memphis"],
    rebels: ["Minimalism", "Japandi restraint"],
    children: ["cottagecore", "dark_academia", "boho"],
    seeIn: "Pattern-clashing rooms on Instagram, Wearstler hotel interiors",
    seeInAppendInteriors: false,
    appendInteriorsToName: true,
    examples: [
      { term: "Kelly Wearstler hotel interior", note: "Mainstream maximalism" },
      { term: "Luke Edward Hall interior", note: "Color-drenched English maximalism" },
      { term: "Beata Heuman interior design", note: "Whimsical pattern-on-pattern" },
    ],
  },
  english_country: {
    name: "English Country",
    years: "1960s–present (rooted in 19th c.)",
    region: "UK, then global anglophile",
    color: "reaction",
    defining: "Chintz, layered patterns, faded reds and blues, antique rugs over rugs, dogs on sofas, books on every surface. The aspirational English country house aesthetic codified by Colefax & Fowler and exported worldwide.",
    designers: [
      { name: "Nancy Lancaster", interiors: true },
      { name: "John Fowler", interiors: true },
      { name: "Sister Parish", interiors: true, note: "American interpreter" },
      { name: "Mark Hampton", interiors: true },
      { name: "Robert Kime", interiors: true },
    ],
    inherits: ["arts_crafts"],
    rebels: ["Modernist austerity", "Bauhaus rejection of ornament"],
    children: ["grandmillennial"],
    seeIn: "Country Life magazine spreads, National Trust houses, Colefax & Fowler showrooms, every Mitford-novel adaptation",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "English country house drawing room", note: "The reference room type" },
      { term: "Colefax and Fowler interior", note: "The firm that defined the look" },
      { term: "Robert Kime sitting room", note: "Contemporary English country at its best" },
      { term: "Nancy Lancaster yellow drawing room", note: "The most-photographed English room of the 20th c." },
      { term: "English country bedroom chintz", note: "Pattern-on-pattern done right" },
      { term: "layered antique rugs English interior", note: "The signature flooring move" },
    ],
  },
  boho: {
    name: "Boho",
    years: "1960s–present (peak 2014–present as named style)",
    region: "Global",
    color: "reaction",
    defining: "Saturated, layered, designer-coded boho. Deep terracottas and emerald greens, plants spilling everywhere, Moroccan rugs layered three deep, vintage objects from travel, intentional curated chaos. The Jungalow version — a direct descendant of 1970s hippie maximalism, brought back through Instagram.",
    designers: [
      { name: "Justina Blakeney", interiors: true, note: "Jungalow" },
      { name: "Bohemian Society", interiors: true },
    ],
    inherits: ["maximalism"],
    rebels: ["All-white minimalism", "Modern Farmhouse beige-fatigue"],
    children: ["modern_boho"],
    seeIn: "Justina Blakeney's Jungalow, plant-filled apartments on Instagram, vintage rattan everywhere, deep-saturated bedrooms",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Jungalow Justina Blakeney interior", note: "The Jungalow codifier" },
      { term: "deep saturated boho living room", note: "The high-color version" },
      { term: "Moroccan rug layered boho bedroom", note: "The signature textile move" },
      { term: "1970s bohemian living room", note: "The original this is mining" },
    ],
  },
  modern_boho: {
    name: "Modern Boho",
    years: "2017–present",
    region: "US, then global mass market",
    color: "reaction",
    defining: "Boho's vocabulary executed in Modern Farmhouse's palette. Single macramé on a dowel above the bed, rattan pendant, woven baskets, faux-fur throw, one fiddle-leaf fig, all in cream and beige. What happened when Modern Farmhouse wanted texture without committing to color, and Boho went to Target.",
    designers: [
      { name: "Target", interiors: true, note: "Project 62, Opalhouse" },
      { name: "World Market", interiors: true },
      { name: "Magnolia Home", interiors: true, note: "Boho line" },
      { name: "Anthropologie", interiors: true, note: "mass-market boho" },
    ],
    inherits: ["boho", "modern_farmhouse"],
    rebels: ["Saturated maximalism", "actual hippie clutter"],
    children: [],
    seeIn: "Target Project 62, World Market catalogs, Magnolia Home Boho line, Wayfair 'modern boho' filter, mid-tier Anthropologie home",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "modern boho bedroom macrame neutral", note: "The bedroom archetype" },
      { term: "neutral boho living room rattan", note: "The living-room archetype" },
      { term: "Target Project 62 boho interior", note: "The mass-market codifier" },
      { term: "World Market boho bedroom", note: "The other big retailer driving the look" },
      { term: "Anthropologie home catalog boho", note: "Boho-by-Anthropologie at scale" },
      { term: "cream beige boho dining room", note: "The full beige-boho execution" },
    ],
  },
  grandmillennial: {
    name: "Grandmillennial",
    years: "2018–present",
    region: "US, internet-native, global",
    color: "reaction",
    defining: "Millennial-aged 'granny chic' — chinoiserie, ruffled lampshades, dust ruffles, blue-and-white porcelain, skirted tables, pleated lampshades, deliberately fussy details. The next generation falling in love with their grandmother's aesthetic.",
    designers: [
      { name: "Caitlin Wilson", interiors: true },
      { name: "Cathy Kincaid", interiors: true },
      { name: "Ashley Whittaker", interiors: true },
    ],
    inherits: ["cottagecore", "english_country", "hollywood_regency"],
    rebels: ["Minimalism", "Modern Farmhouse", "Scandi sparseness"],
    children: [],
    seeIn: "House Beautiful's 'grandmillennial' tagged interiors 2019+, blue-and-white china collections, skirted tables on Instagram",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "grandmillennial style living room", note: "The signature look" },
      { term: "chinoiserie wallpaper bedroom", note: "The signature wall" },
      { term: "blue and white porcelain styling shelf", note: "The signature collection" },
      { term: "skirted table interior grandmillennial", note: "The reborn dust ruffle" },
      { term: "Caitlin Wilson interior", note: "A leading practitioner" },
      { term: "pleated lampshade interior", note: "The detail that says 'grandmillennial'" },
    ],
  },

  modern_farmhouse: {
    name: "Modern Farmhouse",
    years: "2010s–present",
    region: "US (then global)",
    color: "reaction",
    defining: "Shiplap, black metal, barn doors, white walls, reclaimed wood. Joanna Gaines and HGTV exported it everywhere. A reaction to McMansion excess that became its own cliché.",
    designers: [
      { name: "Joanna Gaines", interiors: true },
      { name: "Leanne Ford", interiors: true },
    ],
    inherits: ["contemp_scandi", "mcm_revival"],
    rebels: ["McMansion excess", "Suburban Traditional"],
    children: ["modern_boho"],
    seeIn: "Fixer Upper episodes, anywhere with shiplap walls, every new build in Texas 2015–2022",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Joanna Gaines farmhouse kitchen", note: "The look that defined a decade" },
      { term: "shiplap white modern farmhouse interior", note: "The signature wall" },
      { term: "black metal barn door interior", note: "The other signature move" },
    ],
  },
  modern_med: {
    name: "Modern Mediterranean",
    years: "2015–present",
    region: "US, Australia, global",
    color: "scandi",
    defining: "Plaster walls, arches, terracotta, warm whites, organic curves, woven materials. A Mediterranean update that absorbed Organic Modern's textural vocabulary.",
    designers: [
      { name: "Amber Lewis", interiors: true },
      { name: "Sarah Sherman Samuel", interiors: true },
      { name: "Studio McGee", interiors: true, note: "partial" },
    ],
    inherits: ["organic_mod", "contemp_scandi"],
    rebels: ["Cold Scandi minimalism", "hard-edged MCM", "Suburban Traditional"],
    children: [],
    seeIn: "Amber Interiors projects, California spec homes 2018+, Architectural Digest's plaster-arch era",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Amber Lewis interior plaster arch", note: "The leading practitioner" },
      { term: "modern mediterranean kitchen terracotta", note: "Warm whites and warm tile" },
      { term: "plaster arch doorway interior modern", note: "The defining architectural move" },
      { term: "limewash walls modern interior", note: "The Instagram texture" },
    ],
  },
  hamptons: {
    name: "Hamptons",
    years: "1990s–present (rooted in 1880s Shingle Style)",
    region: "US East Coast, then global",
    color: "scandi",
    defining: "Coastal New England via Long Island money. White slipcovers, sisal rugs, weathered teak, board-and-batten walls, navy and white stripes, hydrangeas. A lighter, breezier descendant of the Shingle Style cottage tradition that became its own aspirational lifestyle aesthetic.",
    designers: [
      { name: "Aerin Lauder", interiors: true },
      { name: "Steven Gambrel", interiors: true },
      { name: "Victoria Hagan", interiors: true },
      { name: "Mark Sikes", interiors: true },
    ],
    inherits: ["contemp_scandi"],
    rebels: ["Urban density", "dark formal traditional"],
    children: [],
    seeIn: "Nancy Meyers movie sets, Ralph Lauren ad campaigns, Aerin home line, every Sag Harbor share house",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "Hamptons style living room", note: "The white-slipcover archetype" },
      { term: "Nancy Meyers kitchen interior", note: "The cinematic shorthand" },
      { term: "Aerin Lauder Hamptons home", note: "The brand-defining version" },
      { term: "Steven Gambrel Hamptons interior", note: "More sophisticated, less beachy" },
      { term: "shingle style cottage interior", note: "The 1880s ancestor still alive" },
      { term: "coastal grandmother aesthetic", note: "The TikTok rebrand of the same idea" },
    ],
  },

  cottagecore: {
    name: "Cottagecore",
    years: "2018–present",
    region: "Internet-native, global",
    color: "reaction",
    defining: "Pastoral romanticism, vintage florals, layered textiles, gathered flowers, a return to slow domesticity. An internet aesthetic that became a real interior style.",
    designers: [
      { name: "Beata Heuman", interiors: true, note: "high end" },
    ],
    inherits: ["maximalism"],
    rebels: ["Sleek tech-era minimalism", "urban hustle culture"],
    children: ["grandmillennial"],
    seeIn: "Tumblr/TikTok cottagecore tags, English cottage Airbnbs, vintage Laura Ashley revival",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "cottagecore interior bedroom", note: "The defining aesthetic" },
      { term: "Beata Heuman cottage style", note: "Cottagecore at the designer end" },
      { term: "Laura Ashley vintage floral interior", note: "The 80s precursor being mined" },
    ],
  },
  dark_academia: {
    name: "Dark Academia",
    years: "2019–present",
    region: "Internet-native, global",
    color: "reaction",
    defining: "Wood paneling, leather, brass, library lamps, oxblood and forest green. The interior wing of a literary internet aesthetic — Oxford college rooms by way of TikTok.",
    designers: [],
    inherits: ["maximalism"],
    rebels: ["Sterile white minimalism", "open-plan Scandi"],
    children: [],
    seeIn: "TikTok dark academia tags, college library aesthetics, moody studies and home libraries",
    seeInAppendInteriors: true,
    appendInteriorsToName: true,
    examples: [
      { term: "dark academia interior library", note: "The signature room type" },
      { term: "Oxford college study interior", note: "The reference" },
      { term: "moody home library interior dark wood", note: "Residential interpretation" },
    ],
  },
};

// Branch layouts. Each entry is a row; each row is an array of either
// [movementId, xPercent] or null for an empty slot. xPercent is 0-100
// across the tree canvas, so the layout scales with viewport width.
//
// Y position is computed by row index (lineage depth, not strict
// chronology — see README for why).
export const BRANCHES = {
  all: {
    label: "Full tree",
    rows: [
      [["japonisme", 30], ["arts_crafts", 70]],
      [["art_nouveau", 15], ["vienna_secession", 45], ["wabi_sabi", 90]],
      [["de_stijl", 12], ["bauhaus", 30], ["art_deco", 52], ["scandi_func", 78]],
      [["international", 26], ["scandi_mod", 62], ["english_country", 92]],
      [["brutalism", 6], ["california_mod", 19], ["mid_century", 36], ["mexican_mod", 50], ["brazilian_mod", 64], ["danish_mod", 78], ["minimalism", 92]],
      // Layer 5a (1930s–1960s starts): the older half of the
      // postwar-through-1970 layer, split off so the row doesn't pack
      // 9 nodes into one band. Hollywood Regency sits under its parent
      // Art Deco; Pop Art and Tropical Modern sit near their MCM-era
      // parents; Suburban Traditional sits right where its McMansion
      // child will land below.
      [["pop_art", 30], ["hollywood_regency", 52], ["tropical_mod", 70], ["suburban_traditional", 92]],
      // Layer 5b (1970s+ starts): the postmodern-and-after half. Same
      // lineage depth, later chronology, distinct visual band.
      [["industrial", 8], ["postmodern", 22], ["cocaine_mod", 42], ["mcm_revival", 60], ["contemp_scandi", 85]],
      [["memphis", 6], ["maximalism", 20], ["organic_mod", 38], ["japandi", 54], ["modern_farmhouse", 70], ["mcmansion", 84], ["hamptons", 96]],
      [["boho", 6], ["cottagecore", 22], ["dark_academia", 38], ["modern_med", 52], ["modern_boho", 66], ["grandmillennial", 82]],
    ],
  },
  scandi: {
    label: "Scandi → Japandi",
    rows: [
      [["japonisme", 25], ["arts_crafts", 75]],
      [["scandi_func", 50], ["wabi_sabi", 90]],
      [["scandi_mod", 50]],
      [["danish_mod", 25], ["contemp_scandi", 65]],
      [["organic_mod", 18], ["japandi", 45], ["modern_med", 72], ["hamptons", 92]],
    ],
  },
  modernist: {
    label: "Bauhaus → MCM",
    rows: [
      [["arts_crafts", 20], ["art_nouveau", 50], ["vienna_secession", 80]],
      [["de_stijl", 15], ["bauhaus", 40], ["art_deco", 75]],
      [["international", 50]],
      [["mid_century", 18], ["brutalism", 38], ["california_mod", 58], ["mexican_mod", 78], ["brazilian_mod", 95]],
      [["minimalism", 12], ["pop_art", 30], ["mcm_revival", 48], ["tropical_mod", 66], ["industrial", 84], ["cocaine_mod", 95]],
    ],
  },
  reaction: {
    label: "Reaction lineage",
    rows: [
      [["arts_crafts", 20], ["international", 70]],
      [["brutalism", 70], ["suburban_traditional", 30]],
      [["postmodern", 50], ["english_country", 15], ["hollywood_regency", 80]],
      [["cocaine_mod", 80], ["memphis", 25], ["maximalism", 60], ["mcmansion", 88]],
      [["boho", 10], ["cottagecore", 28], ["dark_academia", 46], ["modern_farmhouse", 64], ["modern_boho", 80], ["grandmillennial", 95]],
    ],
  },
  contemporary: {
    label: "Today's scene",
    rows: [
      [["scandi_mod", 10], ["mid_century", 28], ["minimalism", 45], ["wabi_sabi", 65], ["english_country", 88]],
      [["contemp_scandi", 10], ["mcm_revival", 28], ["tropical_mod", 48], ["maximalism", 68], ["suburban_traditional", 88]],
      [["organic_mod", 6], ["modern_med", 19], ["hamptons", 32], ["modern_farmhouse", 47], ["industrial", 60], ["boho", 73], ["cottagecore", 85], ["dark_academia", 96]],
      [["japandi", 20], ["grandmillennial", 60]],
    ],
  },
};

// ---------- search set generation ----------
//
// Single source of truth for which terms get scraped and which are
// available in the frontend modal. Both the scraper and the frontend
// import this so they can't drift apart.
//
// Each search has:
//   id: a stable unique key, used as the manifest key
//   term: the actual Google search string
//   intent: "movement" | "designer" | "see_in" | "example"
//   target: how many images we want
//   movementId: which movement triggered this search
//   label: human-readable description (used for the modal title)

const CURATED_EXAMPLE_TARGET = 15;
const MOVEMENT_NAME_TARGET = 20;
const DESIGNER_TARGET = 6;
const SEE_IN_TARGET = 6;

function splitSeeIn(seeIn) {
  // Split on commas and semicolons, trim, drop empties.
  return seeIn
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function maybeInteriors(base, shouldAppend) {
  if (!shouldAppend) return base;
  // Don't double up if it's already there.
  if (/\binterior(s)?\b/i.test(base)) return base;
  return `${base} interiors`;
}

function searchId(parts) {
  return parts
    .map((p) =>
      String(p)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean)
    .join("::");
}

export function buildSearchSet() {
  const out = [];

  for (const [movementId, m] of Object.entries(MOVEMENTS)) {
    // 1. The movement name itself. Append "interiors" when the bare
    //    name returns mostly non-interior results (paintings, posters,
    //    architecture exteriors, fashion).
    const movementTerm = maybeInteriors(m.name, !!m.appendInteriorsToName);
    out.push({
      id: searchId([movementId, "movement"]),
      term: movementTerm,
      intent: "movement",
      target: MOVEMENT_NAME_TARGET,
      movementId,
      label: m.name,
    });

    // 2. Each designer.
    for (const d of m.designers || []) {
      const name = typeof d === "string" ? d : d.name;
      const interiorsFlag = typeof d === "object" ? !!d.interiors : false;
      const term = maybeInteriors(name, interiorsFlag);
      out.push({
        id: searchId([movementId, "designer", name]),
        term,
        intent: "designer",
        target: DESIGNER_TARGET,
        movementId,
        label: name,
      });
    }

    // 3. Each "see it in" fragment.
    if (m.seeIn) {
      for (const fragment of splitSeeIn(m.seeIn)) {
        const term = maybeInteriors(fragment, !!m.seeInAppendInteriors);
        out.push({
          id: searchId([movementId, "see-in", fragment]),
          term,
          intent: "see_in",
          target: SEE_IN_TARGET,
          movementId,
          label: fragment,
        });
      }
    }

    // 4. Each curated example.
    for (const ex of m.examples || []) {
      out.push({
        id: searchId([movementId, "example", ex.term]),
        term: ex.term,
        intent: "example",
        target: CURATED_EXAMPLE_TARGET,
        movementId,
        label: ex.term,
        note: ex.note,
      });
    }
  }

  // De-dupe by id (movement name could collide with a designer in
  // pathological cases). Keep first occurrence.
  const seen = new Set();
  return out.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}

// ---------- search lookups for the frontend ----------
//
// The detail panel needs to find specific searches by (intent,
// movementId, label) when rendering clickable affordances. Computing
// the search id directly from those inputs lets the UI hand the modal
// a stable id without rebuilding the whole search set.

export function getSearchId(movementId, intent, label) {
  // Mirrors searchId() above. For "movement" intent the label is
  // ignored (one movement-name search per movement).
  switch (intent) {
    case "movement":
      return searchId([movementId, "movement"]);
    case "designer":
      return searchId([movementId, "designer", label]);
    case "see_in":
      return searchId([movementId, "see-in", label]);
    case "example":
      return searchId([movementId, "example", label]);
    default:
      throw new Error(`Unknown search intent: ${intent}`);
  }
}

// Quick accessors used by the detail panel.

export function getMovementSearchId(movementId) {
  return getSearchId(movementId, "movement", null);
}

export function getDesignerName(designer) {
  return typeof designer === "string" ? designer : designer.name;
}

export function getDesignerNote(designer) {
  return typeof designer === "object" && designer.note ? designer.note : "";
}

export function splitSeeInFragments(seeIn) {
  return splitSeeIn(seeIn);
}
