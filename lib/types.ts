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

export type RelatedLink = {
  title: string;
  url: string;
  type: "article" | "item" | "ranking" | "category" | "external";
  note?: string;
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
  images?: CategoryImage[];
};

export type ContentSection = {
  majorCategory: string;
  sectionSlug: string;
  label: string;
  description: string;
  href: string;
  contentModel: string;
  itemPathSegment?: string;
  regionMode: "none" | "optional" | "required";
  targetMode: "none" | "optional" | "required";
  status: "draft" | "published" | "archived";
  sortOrder: number;
  displayConfig: Record<string, unknown>;
  seoConfig: Record<string, unknown>;
  metadata: Record<string, unknown>;
  /** 作成/編集フォームのフィールド定義（DB駆動）。{ itemClass?, itemKind?, itemKinds?, fields[] } */
  itemSchema?: Record<string, unknown>;
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
  imageUrl?: string;
};

export type Article = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  majorCategory?: string;
  sectionSlug?: string;
  canonicalPath?: string;
  region?: string;
  coverImageUrl?: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: Author;
  summary: string[];
  whatYouLearn: string[];
  sources: Source[];
  faqs: FAQ[];
  relatedSlugs: string[];
  relatedLinks?: RelatedLink[];
};

export type OfficialLink = {
  label: string;
  url: string;
  type: "website" | "map" | "instagram" | "x" | "facebook" | "other";
};

export type Item = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  area: string;
  address: string;
  phone?: string;
  imageUrl?: string;
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

/** 栄養成分表示（食品商品・汎用）。basis=表示基準、数値は g/kcal。 */
export type NutritionFacts = {
  basis?: "per_serving" | "per_100g";
  serving_size?: number;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  sugar?: number;
  fiber?: number;
  salt?: number;
};
export type HistoryEntry = { date: string; description: string };
export type ServiceModelEntry = { service: string; url?: string; note?: string };
export type ItemRelatedLink = { label: string; url: string };
export type ImageCredit = { name: string; url: string };

export type GenericItem = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  /** 詳細記事本文（Markdown）。description が短いリード文なのに対し、事実ベースの長文解説 */
  bodyMd: string;
  majorCategory: string;
  sectionSlug: string;
  itemKind: string;
  /** 粗い型（place/work/product/app/service/event/person/concept）。表示・SEO・検索の出し分け軸 */
  itemClass: string;
  canonicalPath?: string;
  region?: string;
  area: string;
  address: string;
  addressRegion?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  priceRange: string;
  officialUrl: string;
  mapUrl: string;
  editorComment: string;
  lastVerifiedAt: string;
  metadata: Record<string, unknown>;
  sources: Source[];
  faqs: FAQ[];
  genres: string[];
  imageAlt?: string;
  imageCredit?: ImageCredit;
  seoKeywords?: string[];
  seoOgImage?: string;
  history: HistoryEntry[];
  serviceModel: ServiceModelEntry[];
  relatedLink: ItemRelatedLink[];
  nutrition?: NutritionFacts;
};

export type RankingItem = {
  rank: number;
  entryKind?: "item" | "manual";
  itemSlug: string;
  displayName?: string;
  description?: string;
  externalUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  priceRange?: string;
  area?: string;
  tags?: string[];
  score: number;
  reason: string;
  isPr: boolean;
};

export type CategoryImage = {
  key: string;
  url: string;
  alt: string;
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

export type HotelStyle =
  | "温泉旅館"
  | "古民家宿"
  | "ゲストハウス"
  | "民宿"
  | "ロッジ"
  | "オーベルジュ"
  | "湯治宿";

export type MealPlan = "両食" | "朝食のみ" | "素泊まり" | "選択可";

export type Hotel = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  area: string;
  address: string;
  phone?: string;
  style: HotelStyle;
  tags: string[];
  highlight: string;
  pricePerPerson: string;
  checkIn: string;
  checkOut: string;
  meals: MealPlan;
  onsen: boolean;
  onsenNote?: string;
  parking: boolean;
  parkingNote?: string;
  officialUrl: string;
  mapUrl: string;
  officialLinks: OfficialLink[];
  editorComment: string;
  imageUrl: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
  relatedRankingSlugs: string[];
};

export type TravelRegion = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  status: "live" | "planned";
  headline: string;
  subtext: string;
  heroBadge: string;
  heroCtaSlug: string;
  heroCtaLabel: string;
  statsNote: string;
  onsenAreas: Array<{ name: string; feature: string }>;
  areas: string[];
  images: CategoryImage[];
};

export type TravelServiceRegion = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  status: "live" | "planned";
  headline: string;
  subtext: string;
  heroBadge: string;
  heroCtaSlug: string;
  heroCtaLabel: string;
  statsNote: string;
  areas: string[];
  featuredSlugs: string[];
  images?: CategoryImage[];
};

export type TravelAgencyService =
  | "国内旅行"
  | "海外旅行"
  | "バスツアー"
  | "団体旅行"
  | "貸切バス"
  | "宿泊手配"
  | "航空券"
  | "JR券"
  | "着地型ツアー"
  | "佐渡旅行";

export type TravelAgency = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  area: string;
  address: string;
  phone?: string;
  services: TravelAgencyService[];
  bestFor: string[];
  tags: string[];
  priceRange: string;
  consultationStyle: string;
  businessHours: string;
  closedDays: string;
  registeredTravelAgency: string;
  officialUrl: string;
  mapUrl: string;
  officialLinks: OfficialLink[];
  editorComment: string;
  highlight: string;
  imageUrl: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
  relatedRankingSlugs: string[];
};

export type TravelApp = {
  slug: string;
  name: string;
  brand: string;
  description: string;
  useCase: string;
  platforms: string[];
  priceRange: string;
  features: string[];
  bestFor: string[];
  officialUrl: string;
  imageUrl: string;
  editorComment: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
};

export type RamenRegion = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  status: "live" | "planned";
  headline: string;
  subtext: string;
  heroBadge: string;
  heroCtaSlug: string;
  heroCtaLabel: string;
  statsNote: string;
  styles: Array<{ name: string; area: string; text: string }>;
  areas: string[];
  featuredSlugs: string[];
  articleTag: string;
  images?: CategoryImage[];
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
  imageUrl?: string;
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
  id?: string;
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
  majorCategory?: string;
  sectionSlug?: string;
  canonicalPath?: string;
  imageUrl?: string;
  region?: string;
  target?: string;
  criteria: string[];
  conclusion: string;
  quickTableLabel: string;
  lastUpdatedAt: string;
  items: RankingItem[];
  sources: Source[];
  faqs: FAQ[];
};

export type CafeStyle =
  | "スペシャルティコーヒー"
  | "自家焙煎"
  | "古民家カフェ"
  | "ブックカフェ"
  | "コーヒースタンド"
  | "パティスリーカフェ"
  | "ガーデンカフェ"
  | "ロースタリー";

export type CafeItem = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  area: string;
  address: string;
  phone?: string;
  imageUrl?: string;
  style: CafeStyle;
  tags: string[];
  signatureMenu: string;
  priceRange: string;
  wifi: boolean;
  power: boolean;
  parking: boolean;
  parkingNote?: string;
  petFriendly?: boolean;
  reservation: "required" | "recommended" | "not-needed";
  businessHours: string;
  closedDays: string;
  officialUrl: string;
  mapUrl: string;
  instagramUrl?: string;
  officialLinks: OfficialLink[];
  editorComment: string;
  highlight: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
  relatedRankingSlugs: string[];
};

export type CafeRankingItem = {
  rank: number;
  cafeSlug: string;
  score: number;
  reason: string;
  isPr: boolean;
};

export type CafeRanking = {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  criteria: string[];
  conclusion: string;
  quickTableLabel: string;
  lastUpdatedAt: string;
  items: CafeRankingItem[];
  sources: Source[];
  faqs: FAQ[];
};

export type CafeRegion = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  status: "live" | "planned";
  headline: string;
  subtext: string;
  heroBadge: string;
  heroCtaSlug: string;
  heroCtaLabel: string;
  statsNote: string;
  areas: string[];
  featuredSlugs: string[];
  images?: CategoryImage[];
};

export type LeisureKind = "outdoor" | "indoor" | "hybrid";

export type LeisureSpot = {
  id?: string;
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
  imageUrl?: string;
  lastVerifiedAt: string;
  sources: Source[];
  faqs: FAQ[];
  relatedRankingSlugs: string[];
};

export type LeisureRanking = Omit<Ranking, "items"> & {
  items: RankingItem[];
};
