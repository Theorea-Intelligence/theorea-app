/**
 * Théorea — Product catalogue
 * Central source of truth for all teas across Lou suggestions and Marketplace.
 */

export interface TeaProduct {
  id: string;
  name: string;
  brand: string;
  brandTag: "theorea" | "partner";
  type: string;
  origin: string;
  profile: string;
  flavourNote: string; // short 2-part note for Lou suggestion cards
  price: string;
  weight: string;
  available: boolean;
  imageUrl: string;
  slug: string;
}

// ── Maison Théorea signature teas ─────────────────────────────────────────────

export const THEOREA_PRODUCTS: TeaProduct[] = [
  {
    id: "da-hong-pao",
    name: "Da Hong Pao",
    brand: "Maison Théorea",
    brandTag: "theorea",
    type: "Oolong",
    origin: "Wuyi, Fujian",
    profile: "Roasted chestnut, mineral, lingering sweetness",
    flavourNote: "Roasted chestnut · mineral",
    price: "£28",
    weight: "50g",
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    slug: "da-hong-pao",
  },
  {
    id: "jasmin-snow-buds",
    name: "Jasmin Snow Buds",
    brand: "Maison Théorea",
    brandTag: "theorea",
    type: "Green Tea, Scented",
    origin: "Fuding, Fujian",
    profile: "Jasmine blossom, clean, delicate",
    flavourNote: "Jasmine blossom · delicate",
    price: "£24",
    weight: "50g",
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80",
    slug: "jasmin-snow-buds",
  },
];

// ── Curated partner teas (coming soon) ───────────────────────────────────────

export const PARTNER_PRODUCTS: TeaProduct[] = [
  {
    id: "gyokuro-asahi",
    name: "Gyokuro Asahi",
    brand: "Ippodo Tea",
    brandTag: "partner",
    type: "Green Tea",
    origin: "Uji, Kyoto",
    profile: "Deep umami, seaweed, sweet finish",
    flavourNote: "Deep umami · sweet finish",
    price: "£38",
    weight: "40g",
    available: false,
    imageUrl:
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=600&q=80",
    slug: "gyokuro-asahi",
  },
  {
    id: "silver-needle",
    name: "Silver Needle",
    brand: "White2Tea",
    brandTag: "partner",
    type: "White Tea",
    origin: "Fuding, Fujian",
    profile: "Honeydew, light floral, silk texture",
    flavourNote: "Honeydew · light floral",
    price: "£32",
    weight: "50g",
    available: false,
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    slug: "silver-needle",
  },
  {
    id: "aged-sheng-puerh",
    name: "Aged Sheng Pu-erh",
    brand: "Yunnan Sourcing",
    brandTag: "partner",
    type: "Pu-erh",
    origin: "Yunnan",
    profile: "Dried fruit, leather, camphor depth",
    flavourNote: "Dried fruit · camphor",
    price: "£45",
    weight: "357g cake",
    available: false,
    imageUrl:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80",
    slug: "aged-sheng-puerh",
  },
  {
    id: "ali-shan",
    name: "Ali Shan High Mountain",
    brand: "Ten Ren",
    brandTag: "partner",
    type: "Oolong",
    origin: "Chiayi, Taiwan",
    profile: "Orchid, creamy, clean high-mountain air",
    flavourNote: "Orchid · creamy",
    price: "£34",
    weight: "75g",
    available: false,
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    slug: "ali-shan",
  },
];

export const ALL_PRODUCTS: TeaProduct[] = [
  ...THEOREA_PRODUCTS,
  ...PARTNER_PRODUCTS,
];

// ── Nearby tea venues (London) ────────────────────────────────────────────────

export interface TeaVenue {
  name: string;
  area: string;
  type: string;
  rating: number;
  distance: string;
  mapsQuery: string;
}

export const LONDON_TEA_VENUES: TeaVenue[] = [
  {
    name: "Postcard Teas",
    area: "Mayfair",
    type: "Specialist",
    rating: 4.9,
    distance: "0.4 mi",
    mapsQuery: "Postcard+Teas+Mayfair+London",
  },
  {
    name: "Lalani & Co.",
    area: "Notting Hill",
    type: "Boutique",
    rating: 4.8,
    distance: "1.1 mi",
    mapsQuery: "Lalani+and+Co+Notting+Hill+London",
  },
  {
    name: "The Savoy Tea",
    area: "Strand",
    type: "Afternoon Tea",
    rating: 4.7,
    distance: "1.4 mi",
    mapsQuery: "The+Savoy+Tea+London",
  },
  {
    name: "Fortnum & Mason",
    area: "Piccadilly",
    type: "Heritage",
    rating: 4.6,
    distance: "0.8 mi",
    mapsQuery: "Fortnum+and+Mason+Piccadilly+London",
  },
  {
    name: "Rare Tea Company",
    area: "Notting Hill",
    type: "Single Origin",
    rating: 4.8,
    distance: "1.3 mi",
    mapsQuery: "Rare+Tea+Company+London",
  },
];

// ── Smart suggestion engine for Lou ──────────────────────────────────────────

/**
 * Returns 3 product suggestions based on keywords detected in Lou's response.
 * Falls back to a curated default mix if no specific teas are mentioned.
 */
export function getSuggestionsForResponse(responseText: string): TeaProduct[] {
  const text = responseText.toLowerCase();
  const suggestions: TeaProduct[] = [];

  const push = (product: TeaProduct) => {
    if (!suggestions.find((s) => s.id === product.id)) {
      suggestions.push(product);
    }
  };

  // Keyword matching — order matters (more specific → more general)
  if (
    text.includes("da hong pao") ||
    text.includes("rock oolong") ||
    text.includes("wuyi") ||
    (text.includes("oolong") && text.includes("roast"))
  )
    push(THEOREA_PRODUCTS[0]);

  if (
    text.includes("jasmin") ||
    text.includes("jasmine") ||
    text.includes("snow buds") ||
    text.includes("scented")
  )
    push(THEOREA_PRODUCTS[1]);

  if (
    text.includes("gyokuro") ||
    text.includes("umami") ||
    text.includes("japanese green") ||
    text.includes("uji")
  )
    push(PARTNER_PRODUCTS[0]);

  if (
    text.includes("silver needle") ||
    text.includes("white tea") ||
    text.includes("bai hao")
  )
    push(PARTNER_PRODUCTS[1]);

  if (
    text.includes("pu-erh") ||
    text.includes("puerh") ||
    text.includes("aged tea") ||
    text.includes("fermented")
  )
    push(PARTNER_PRODUCTS[2]);

  if (
    text.includes("ali shan") ||
    text.includes("high mountain") ||
    text.includes("taiwan") ||
    text.includes("taiwanese")
  )
    push(PARTNER_PRODUCTS[3]);

  // General oolong / green fallback
  if (text.includes("oolong") && suggestions.length === 0)
    push(THEOREA_PRODUCTS[0]);
  if (
    (text.includes("green tea") || text.includes("floral")) &&
    !suggestions.find((s) => s.id === "jasmin-snow-buds")
  )
    push(THEOREA_PRODUCTS[1]);

  // Fill remaining slots to reach 3
  for (const product of ALL_PRODUCTS) {
    if (suggestions.length >= 3) break;
    push(product);
  }

  return suggestions.slice(0, 3);
}
