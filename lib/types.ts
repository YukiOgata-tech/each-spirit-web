export type SourceType = "official" | "map" | "sns" | "editorial" | "user-review" | "government" | "tourism" | "local-media" | "other";

export type Source = {
  title: string;
  url: string;
  sourceType: SourceType;
  collectedAt: string;
  note: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type Author = {
  name: string;
  role: string;
  url: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  tagline: string;
  href: string;
  status: "live" | "planned";
  contentTypes: string[];
  searchFacets: string[];
  plannedTopics: string[];
  theme: {
    primary: string;
    accent: string;
    background: string;
  };
};

export type SearchResult = {
  id: string;
  type: "article" | "ranking" | "item" | "category";
  title: string;
  description: string;
  category: string;
  href: string;
  tags: string[];
  updatedAt?: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: Author;
  summary: string[];
  whatYouLearn: string[];
  markdownFile: string;
  sources: Source[];
  faqs: FAQ[];
  relatedSlugs: string[];
};

export type OfficialLink = {
  label: string;
  url: string;
  type: "website" | "map" | "instagram" | "x" | "facebook" | "other";
};

export type Item = {
  slug: string;
  name: string;
  description: string;
  area: string;
  address: string;
  phone?: string;
  genre: string;
  tags: string[];
  recommendedMenu: string;
  priceRange: string;
  parking: boolean;
  parkingNote?: string;
  businessHours: string;
  closedDays: string;
  officialUrl: string;
  mapUrl: string;
  officialLinks: OfficialLink[];
  editorComment: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
  relatedRankingSlugs: string[];
};

export type RankingItem = {
  rank: number;
  itemSlug: string;
  score: number;
  reason: string;
  isPr: boolean;
};

export type BeautyRegion = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  imageUrl: string;
  status: "live" | "planned";
};

export type ProteinType = "whey-wpc" | "whey-wpi" | "casein" | "soy" | "pea" | "plant-blend";

export type ProteinTarget = "women" | "men" | "trainer" | "student" | "diet" | "beginner";

export type ProteinProduct = {
  slug: string;
  brand: string;
  name: string;
  description: string;
  proteinType: ProteinType;
  targets: ProteinTarget[];
  servingSize: number;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  packageWeight: number;
  packagePrice: number;
  pricePerKg: number;
  flavors: string[];
  features: string[];
  pros: string[];
  cons: string[];
  officialUrl: string;
  imageUrl: string;
  editorNote: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
};

export type ProteinTargetInfo = {
  slug: ProteinTarget;
  name: string;
  description: string;
  tagline: string;
  imageUrl: string;
  keyNeeds: string[];
  proteinPerDay: string;
  recommendedTypes: ProteinType[];
  status: "live" | "planned";
};

export type ProteinRankingEntry = {
  rank: number;
  productSlug: string;
  score: number;
  reason: string;
};

export type ProteinRanking = {
  slug: string;
  target: ProteinTarget;
  title: string;
  description: string;
  criteria: string[];
  conclusion: string;
  quickTableLabel: string;
  lastUpdatedAt: string;
  items: ProteinRankingEntry[];
  sources: Source[];
  faqs: FAQ[];
};

export type Treatment =
  | "cut"
  | "color"
  | "highlight"
  | "perm"
  | "straightening"
  | "treatment"
  | "headSpa"
  | "hairQuality";

export type AgeGroup = "teens" | "twenties" | "thirties" | "forties" | "fifties";

export type Salon = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  area: string;
  address: string;
  phone?: string;
  access: string;
  treatments: Treatment[];
  ageGroups: AgeGroup[];
  priceRange: string;
  cutPrice: string;
  colorPrice?: string;
  parking: boolean;
  parkingNote?: string;
  childrenWelcome: boolean;
  menWelcome: boolean;
  businessHours: string;
  closedDays: string;
  officialUrl: string;
  mapUrl: string;
  instagram?: string;
  officialLinks: OfficialLink[];
  editorComment: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
  relatedRankingSlugs: string[];
  imageUrl: string;
};

export type Ranking = {
  slug: string;
  title: string;
  description: string;
  criteria: string[];
  conclusion: string;
  quickTableLabel: string;
  lastUpdatedAt: string;
  items: RankingItem[];
  sources: Source[];
  faqs: FAQ[];
};

export type LeisureKind = "outdoor" | "indoor" | "hybrid";

export type LeisureSpot = {
  slug: string;
  name: string;
  description: string;
  region: string;
  area: string;
  address: string;
  phone?: string;
  kind: LeisureKind;
  genre: string;
  tags: string[];
  bestFor: string[];
  highlight: string;
  priceRange: string;
  parking: boolean;
  parkingNote?: string;
  businessHours: string;
  closedDays: string;
  officialUrl: string;
  mapUrl: string;
  officialLinks: OfficialLink[];
  editorComment: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
  relatedRankingSlugs: string[];
};

export type LeisureRanking = Omit<Ranking, "items"> & {
  items: RankingItem[];
};
