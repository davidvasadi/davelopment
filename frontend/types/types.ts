import { text } from "stream/consumers";

export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export type StrapiButton ={
  id?: number;
  text?: string | null;
  URL?: string | null;
  target?: '_self' | '_blank' | string | null;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | null;
}


export interface Article {
  title: string;
  description: string;
  slug: string;
  content: string;
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
}


export interface Product {
  dynamic_zone: any[];
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
  badge_label?: string;
  badge_label_center?: string;
  heading_center?: string;
  description_center?: string;
  badge_label_bottom?: string;
  heading_bottom?: string;
  description_bottom?: string;
  // button_center?: StrapiButton | StrapiButton [] | null;
  // button_bottom?: StrapiButton | StrapiButton [] | null;
  strapi_buttons?: StrapiButton[] | null;
}
