export type FoodImageSource = "curated-photography" | "category-fallback" | "branded-fallback";

export interface FoodImage {
  src: string;
  alt: string;
  source: FoodImageSource;
  attribution: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

const catalog: Record<string, FoodImage> = {
  "oats with chia and banana": { src: unsplash("photo-1517673400267-0251440c45dc"), alt: "Oats topped with banana and chia seeds in a bowl.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "greek yogurt berry bowl": { src: unsplash("photo-1488477181946-6428a0291777"), alt: "Greek yogurt berry bowl with fresh fruit.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "moong dal chilla with mint curd": { src: unsplash("photo-1601050690597-df0568f70950"), alt: "Golden lentil pancakes served with a cooling dip.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "tofu scramble millet toast": { src: unsplash("photo-1540420773420-3366772f4999"), alt: "Tofu scramble with toast and fresh vegetables.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "egg white veggie omelette": { src: unsplash("photo-1540420773420-3366772f4999"), alt: "Egg white vegetable omelette with herbs and greens.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "quinoa chickpea power bowl": { src: unsplash("photo-1512621776951-a57141f2eefd"), alt: "Quinoa and chickpea power bowl with colorful vegetables.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "paneer tikka salad bowl": { src: unsplash("photo-1540189549336-e6e99c3679fe"), alt: "Paneer tikka salad bowl with fresh greens and vegetables.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "grilled chicken brown rice plate": { src: unsplash("photo-1532550907401-a500c9a57435"), alt: "Grilled chicken with brown rice and vegetables on a plate.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "rajma brown rice with salad": { src: unsplash("photo-1512058564366-18510be2db19"), alt: "Red kidney bean curry with rice and salad.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "lentil soup with roasted vegetables": { src: unsplash("photo-1547592166-23ac45744acd"), alt: "Lentil soup served with roasted vegetables.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "salmon avocado greens": { src: unsplash("photo-1467003909585-2f8a72700288"), alt: "Salmon with avocado and leafy greens.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "soya chunk masala with phulka": { src: unsplash("photo-1601050690117-94f5f6fa8bd7"), alt: "Soya masala served with soft whole-wheat flatbread.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "sprouts bhel with peanuts": { src: unsplash("photo-1512621776951-a57141f2eefd"), alt: "Sprouted bean snack with vegetables and peanuts.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "apple with almond butter": { src: unsplash("photo-1560806887-1e4cd0b6cbd6"), alt: "Sliced apple served with almond butter.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "protein smoothie with spinach": { src: unsplash("photo-1553530666-ba11a7da3888"), alt: "Green protein smoothie in a glass with spinach.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "cucumber hummus plate": { src: unsplash("photo-1577805947697-89e18249d767"), alt: "Hummus plate with cucumber and fresh vegetables.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "turkey lettuce wraps": { src: unsplash("photo-1559339352-11d035aa65de"), alt: "Turkey lettuce wraps arranged on a serving plate.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "vegetable khichdi with curd": { src: unsplash("photo-1601050690597-df0568f70950"), alt: "Vegetable khichdi served with a small bowl of curd.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "tofu stir fry cauliflower rice": { src: unsplash("photo-1512621776951-a57141f2eefd"), alt: "Tofu stir-fry with vegetables and cauliflower rice.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." },
  "whole wheat pasta with beans": { src: unsplash("photo-1551183053-bf91a1d81141"), alt: "Whole-wheat pasta with beans and vegetables.", source: "curated-photography", attribution: "Unsplash direct image; verify attribution before public deployment." }
};

const fallbackByCategory: Record<string, FoodImage> = {
  breakfast: { src: unsplash("photo-1490645935967-10de6ba17061"), alt: "A balanced breakfast bowl with grains, fruit, and vegetables.", source: "category-fallback", attribution: "Unsplash category fallback; verify attribution before public deployment." },
  lunch: { src: unsplash("photo-1512621776951-a57141f2eefd"), alt: "A colorful balanced lunch bowl with grains and vegetables.", source: "category-fallback", attribution: "Unsplash category fallback; verify attribution before public deployment." },
  dinner: { src: unsplash("photo-1547592180-85f173990554"), alt: "A warm balanced dinner with grains and vegetables.", source: "category-fallback", attribution: "Unsplash category fallback; verify attribution before public deployment." },
  snack: { src: unsplash("photo-1498837167922-ddd27525d0d4"), alt: "A fresh healthy snack arranged on a plate.", source: "category-fallback", attribution: "Unsplash category fallback; verify attribution before public deployment." }
};

const normalize = (value: string) => value.toLowerCase().replace(/[–—]/g, "-").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

export function getFoodImage(name: string, category?: string): FoodImage {
  const exact = catalog[normalize(name)];
  if (exact) return exact;
  const categoryImage = category ? fallbackByCategory[normalize(category)] : undefined;
  return categoryImage ?? { src: "", alt: `${name} food image unavailable; nutrition information remains available.`, source: "branded-fallback", attribution: "No external image used." };
}

export function foodImageCatalog() {
  return catalog;
}
