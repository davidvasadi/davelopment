// 🌐 Nyelvi típusok
export type Language = 'en' | 'hu';

// 🔁 Transition típusok
export interface TransitionContextType {
  isNavigating: boolean;
  direction: number;
  startNavigation: (to: string, dir: number) => void;
  completeNavigation: () => void;
}

//  GYIK (FAQ) típusok
export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// 🛠 Szolgáltatás típus
export interface Service {
  id: number;
  number: string;
  title: string;
  description: string;
  categories: string[];
  categoryCount: string;
  images: string[];
}

// 🚀 Showreel / About szekció lépései
export interface AboutStep {
  id: number;
  number: string;
  title: string;
  image: string;
  progress: number;
}

// 💵 Pricing szekció lokalizációs típusa
export interface PricingTranslation {
  badge: string;
  title: string;
  packages: {
    id: string;
    name: string;
    type: string;
    price: number;
    durationLabel: string;
    duration: string;
    features: string[];
  }[];
  addon: {
    title: string;
    description: string;
    price: number;
  };
  cta: string;
  footer: {
    title: string;
    strong: string;
    text: string;
    name: string;
    role: string;
  };
}



export interface BlogPost {
  slug:string;
  huSlug?: string;
  enSlug?: string;
  url:string;
  image: string;
  date: string;
  title: string;
  description: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  content: BlogContentBlock[];
  nextPost?: {
    title: string;
    slug: string;
    image: string;
  };
}

export type BlogContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: number; text: string }
  | { type: 'list'; items: string[] };

export type BlogPostMap = Record<string, BlogPost>;

