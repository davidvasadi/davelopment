import type { Schema, Struct } from '@strapi/strapi';

export interface CardsElementsServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_cards_elements_service_items';
  info: {
    displayName: 'Elements_Service_Item';
  };
  attributes: {
    categories: Schema.Attribute.Component<'shared.chip', true>;
    categories_title: Schema.Attribute.String;
    category_count: Schema.Attribute.String;
    description: Schema.Attribute.String;
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CardsGlobeCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_globe_cards';
  info: {
    description: '';
    displayName: 'Globe_Card';
    icon: 'dashboard';
  };
  attributes: {
    description: Schema.Attribute.String;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
    title: Schema.Attribute.String;
  };
}

export interface CardsGraphCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_graph_cards';
  info: {
    description: '';
    displayName: 'Graph_Card';
    icon: 'dashboard';
  };
  attributes: {
    description: Schema.Attribute.String;
    highlighted_text: Schema.Attribute.String;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
    title: Schema.Attribute.String;
    top_items: Schema.Attribute.Component<'items.graph-card-top-items', true>;
  };
}

export interface CardsProjectCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_project_cards';
  info: {
    displayName: 'Project_Card';
  };
  attributes: {
    badge_label: Schema.Attribute.String;
    is_featured: Schema.Attribute.Boolean;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    result_line: Schema.Attribute.String;
    tags: Schema.Attribute.Component<'shared.chip', true>;
  };
}

export interface CardsRayCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_ray_cards';
  info: {
    description: '';
    displayName: 'Ray_Card';
    icon: 'dashboard';
  };
  attributes: {
    after_ray_items: Schema.Attribute.Component<'items.ray-items', false>;
    before_ray_items: Schema.Attribute.Component<'items.ray-items', false>;
    description: Schema.Attribute.String;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
    title: Schema.Attribute.String;
  };
}

export interface CardsSocialMediaCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_social_media_cards';
  info: {
    description: '';
    displayName: 'Social_Media_Card';
    icon: 'dashboard';
  };
  attributes: {
    Description: Schema.Attribute.String;
    logos: Schema.Attribute.Relation<'oneToMany', 'api::logo.logo'>;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
    Title: Schema.Attribute.String;
  };
}

export interface CardsWhyChooseUsCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_why_choose_us_cards';
  info: {
    displayName: 'Why_Choose_Us_Card';
  };
  attributes: {
    background: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    CTAs: Schema.Attribute.Component<'shared.button', false>;
    title: Schema.Attribute.String;
  };
}

export interface DynamicZoneBlog extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_blogs';
  info: {
    displayName: 'Blog';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    badge_label: Schema.Attribute.String;
    button: Schema.Attribute.Component<'shared.button', false>;
    description: Schema.Attribute.RichText;
    heading_left: Schema.Attribute.String;
    heading_right: Schema.Attribute.String;
    highlight_heading: Schema.Attribute.String;
    highlight_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    highlight_subheading: Schema.Attribute.String;
  };
}

export interface DynamicZoneBrands extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_brands';
  info: {
    description: '';
    displayName: 'Brands';
    icon: 'bulletList';
  };
  attributes: {
    badge_label: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    logos: Schema.Attribute.Relation<'oneToMany', 'api::logo.logo'>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneCta extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_ctas';
  info: {
    description: '';
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    CTAs: Schema.Attribute.Component<'shared.button', true>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneFaq extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_faqs';
  info: {
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneFeatures extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_features';
  info: {
    description: '';
    displayName: 'Features';
    icon: 'bulletList';
  };
  attributes: {
    globe_card: Schema.Attribute.Component<'cards.globe-card', false>;
    graph_card: Schema.Attribute.Component<'cards.graph-card', false>;
    heading: Schema.Attribute.String;
    ray_card: Schema.Attribute.Component<'cards.ray-card', false>;
    social_media_card: Schema.Attribute.Component<
      'cards.social-media-card',
      false
    >;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneFormNextToSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_form_next_to_sections';
  info: {
    description: '';
    displayName: 'Form_Next_To_Section';
    icon: 'book';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'shared.benefit', true>;
    copyright: Schema.Attribute.String;
    form: Schema.Attribute.Component<'shared.form', false>;
    heading: Schema.Attribute.String;
    person_card: Schema.Attribute.Component<'hero.hero-person-card', false>;
    policy_and_word: Schema.Attribute.String;
    policy_links: Schema.Attribute.Component<'shared.link', true>;
    policy_prefix: Schema.Attribute.String;
    section: Schema.Attribute.Component<'shared.section', false>;
    social_media_icon_links: Schema.Attribute.Component<
      'shared.social-media-icon-links',
      true
    >;
    sub_heading: Schema.Attribute.String;
    video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface DynamicZoneHero extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    contact_anchor_id: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'kapcsolat'>;
    copyright: Schema.Attribute.String;
    CTAs: Schema.Attribute.Component<'shared.button', true>;
    description_body: Schema.Attribute.String;
    description_lead: Schema.Attribute.String;
    description_text: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    person: Schema.Attribute.Component<'hero.hero-person-card', false>;
    services: Schema.Attribute.Component<'hero.hero-service-item', true>;
    sub_heading: Schema.Attribute.String;
    video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    video_poster: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface DynamicZoneHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_how_it_works';
  info: {
    description: '';
    displayName: 'How_It_Works';
    icon: 'question';
  };
  attributes: {
    badge_label: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'shared.steps', true>;
    sub_heading: Schema.Attribute.String;
    Video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface DynamicZoneLaunches extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_launches';
  info: {
    description: '';
    displayName: 'Launches';
    icon: 'rocket';
  };
  attributes: {
    heading: Schema.Attribute.String;
    launches: Schema.Attribute.Component<'shared.launches', true>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_newsletters';
  info: {
    displayName: 'Newsletter';
  };
  attributes: {
    description: Schema.Attribute.Text;
    form: Schema.Attribute.Component<'shared.form', false>;
    heading_left: Schema.Attribute.String;
    heading_right: Schema.Attribute.String;
    profile_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    profile_name: Schema.Attribute.String;
    profile_role: Schema.Attribute.String;
    source: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface DynamicZonePricing extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_pricings';
  info: {
    description: '';
    displayName: 'Pricing';
    icon: 'shoppingCart';
  };
  attributes: {
    addon_description: Schema.Attribute.Text;
    addon_price: Schema.Attribute.Decimal;
    addon_title: Schema.Attribute.String;
    background: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    badge_label: Schema.Attribute.String;
    currency: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    monthly_label: Schema.Attribute.String;
    plans: Schema.Attribute.Relation<'oneToMany', 'api::plan.plan'>;
    profile_description: Schema.Attribute.String;
    profile_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    profile_job: Schema.Attribute.String;
    profile_label: Schema.Attribute.String;
    project_label: Schema.Attribute.String;
    question: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    time_label: Schema.Attribute.String;
    time_value: Schema.Attribute.String;
  };
}

export interface DynamicZoneProducts extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_products';
  info: {
    displayName: 'Projects';
  };
  attributes: {
    badge_label: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    projects: Schema.Attribute.Component<'cards.project-card', true>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneRelatedArticles extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_related_articles';
  info: {
    description: '';
    displayName: 'related_articles';
    icon: 'bulletList';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneRelatedProducts extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_related_products';
  info: {
    displayName: 'Related_Products';
    icon: 'stack';
  };
  attributes: {
    heading: Schema.Attribute.String;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneServices extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_services';
  info: {
    displayName: 'Services';
  };
  attributes: {
    background: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    badge_label: Schema.Attribute.String;
    cta_anchor: Schema.Attribute.String;
    cta_title: Schema.Attribute.String;
    elements_service_item: Schema.Attribute.Component<
      'cards.elements-service-item',
      true
    >;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_testimonials';
  info: {
    description: '';
    displayName: 'Testimonials';
    icon: 'emotionHappy';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
  };
}

export interface DynamicZoneWhyChooseUs extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_why_choose_uses';
  info: {
    displayName: 'Why_Choose_Us';
  };
  attributes: {
    badge_label: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    why_choose_us: Schema.Attribute.Component<
      'cards.why-choose-us-card',
      false
    >;
    why_choose_us_item: Schema.Attribute.Component<
      'items.why-choose-us-item',
      true
    >;
  };
}

export interface GlobalFooter extends Struct.ComponentSchema {
  collectionName: 'components_global_footers';
  info: {
    description: '';
    displayName: 'Footer';
    icon: 'apps';
  };
  attributes: {
    built_with: Schema.Attribute.String;
    copyright: Schema.Attribute.String;
    description: Schema.Attribute.String;
    designed_developed_by: Schema.Attribute.String;
    form: Schema.Attribute.Component<'shared.form', false>;
    internal_links: Schema.Attribute.Component<'shared.link', true>;
    logo: Schema.Attribute.Relation<'oneToOne', 'api::logo.logo'>;
    navigation_title: Schema.Attribute.String;
    policy_links: Schema.Attribute.Component<'shared.link', true>;
    profile: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    social_media_links: Schema.Attribute.Component<'shared.link', true>;
    social_title: Schema.Attribute.String;
  };
}

export interface GlobalNavbar extends Struct.ComponentSchema {
  collectionName: 'components_global_navbars';
  info: {
    displayName: 'Navbar';
    icon: 'bold';
  };
  attributes: {
    copyright: Schema.Attribute.String;
    copyright_enabled: Schema.Attribute.Boolean;
    Form: Schema.Attribute.Component<'shared.form', true>;
    left_navbar_items: Schema.Attribute.Component<'shared.link', true>;
    logo: Schema.Attribute.Relation<'oneToOne', 'api::logo.logo'>;
    policy: Schema.Attribute.Component<'shared.link', true>;
    right_navbar_items: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface HeroHeroPersonCard extends Struct.ComponentSchema {
  collectionName: 'components_hero_hero_person_cards';
  info: {
    displayName: 'hero.person_card';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    org: Schema.Attribute.String;
    role: Schema.Attribute.String;
  };
}

export interface HeroHeroServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_hero_hero_service_items';
  info: {
    displayName: 'hero.service_item';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

export interface ItemsGraphCardTopItems extends Struct.ComponentSchema {
  collectionName: 'components_items_graph_card_top_items';
  info: {
    displayName: 'Graph_Card_Top_Items';
    icon: 'bulletList';
  };
  attributes: {
    number: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface ItemsInput extends Struct.ComponentSchema {
  collectionName: 'components_items_inputs';
  info: {
    description: '';
    displayName: 'Input';
    icon: 'apps';
  };
  attributes: {
    name: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      [
        'text',
        'email',
        'password',
        'submit',
        'textarea',
        'button',
        'checkbox',
        'color',
        'date',
        'datetime-local',
        'file',
        'hidden',
        'image',
        'month',
        'number',
        'radio',
        'range',
        'reset',
        'search',
        'tel',
        'time',
        'url',
        'week',
      ]
    > &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface ItemsLeftNavbarItems extends Struct.ComponentSchema {
  collectionName: 'components_items_left_navbar_items';
  info: {
    displayName: 'Left_Navbar_Items';
    icon: 'bulletList';
  };
  attributes: {
    name: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface ItemsRayItems extends Struct.ComponentSchema {
  collectionName: 'components_items_ray_items';
  info: {
    description: '';
    displayName: 'Ray_Card_Items';
    icon: 'bulletList';
  };
  attributes: {
    item_1: Schema.Attribute.String;
    item_2: Schema.Attribute.String;
    item_3: Schema.Attribute.String;
  };
}

export interface ItemsWhyChooseUsItem extends Struct.ComponentSchema {
  collectionName: 'components_items_why_choose_us_items';
  info: {
    displayName: 'Why_Choose_Us_item';
  };
  attributes: {
    description: Schema.Attribute.String;
    number: Schema.Attribute.String;
    social_media_links: Schema.Attribute.Component<
      'shared.social-media-icon-links',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface SharedBenefit extends Struct.ComponentSchema {
  collectionName: 'components_shared_benefits';
  info: {
    displayName: 'Benefit';
  };
  attributes: {
    description: Schema.Attribute.String;
    icon: Schema.Attribute.Enumeration<['rotate', 'step', 'check', 'clock']>;
    title: Schema.Attribute.String;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: '';
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['simple', 'outline', 'primary', 'muted']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedChip extends Struct.ComponentSchema {
  collectionName: 'components_shared_chips';
  info: {
    displayName: 'Chip';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

export interface SharedForm extends Struct.ComponentSchema {
  collectionName: 'components_shared_forms';
  info: {
    description: '';
    displayName: 'Form';
    icon: 'paperPlane';
  };
  attributes: {
    inputs: Schema.Attribute.Component<'items.input', true>;
  };
}

export interface SharedLaunches extends Struct.ComponentSchema {
  collectionName: 'components_shared_launches';
  info: {
    description: '';
    displayName: 'Launches';
    icon: 'rocket';
  };
  attributes: {
    description: Schema.Attribute.String;
    mission_number: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SharedPerks extends Struct.ComponentSchema {
  collectionName: 'components_shared_perks';
  info: {
    description: '';
    displayName: 'Perks';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'Section';
    icon: 'cursor';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    users: Schema.Attribute.Component<'shared.user', true>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SharedSocialMediaIconLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_media_icon_links';
  info: {
    description: '';
    displayName: 'Social_Media_Icon_Links';
    icon: 'expand';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.Component<'shared.link', true>;
    social_media_links: Schema.Attribute.Component<
      'cards.social-media-card',
      false
    >;
  };
}

export interface SharedSteps extends Struct.ComponentSchema {
  collectionName: 'components_shared_steps';
  info: {
    description: '';
    displayName: 'Steps';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedUser extends Struct.ComponentSchema {
  collectionName: 'components_shared_users';
  info: {
    description: '';
    displayName: 'User';
    icon: 'user';
  };
  attributes: {
    firstname: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    job: Schema.Attribute.String;
    lastname: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'cards.elements-service-item': CardsElementsServiceItem;
      'cards.globe-card': CardsGlobeCard;
      'cards.graph-card': CardsGraphCard;
      'cards.project-card': CardsProjectCard;
      'cards.ray-card': CardsRayCard;
      'cards.social-media-card': CardsSocialMediaCard;
      'cards.why-choose-us-card': CardsWhyChooseUsCard;
      'dynamic-zone.blog': DynamicZoneBlog;
      'dynamic-zone.brands': DynamicZoneBrands;
      'dynamic-zone.cta': DynamicZoneCta;
      'dynamic-zone.faq': DynamicZoneFaq;
      'dynamic-zone.features': DynamicZoneFeatures;
      'dynamic-zone.form-next-to-section': DynamicZoneFormNextToSection;
      'dynamic-zone.hero': DynamicZoneHero;
      'dynamic-zone.how-it-works': DynamicZoneHowItWorks;
      'dynamic-zone.launches': DynamicZoneLaunches;
      'dynamic-zone.newsletter': DynamicZoneNewsletter;
      'dynamic-zone.pricing': DynamicZonePricing;
      'dynamic-zone.products': DynamicZoneProducts;
      'dynamic-zone.related-articles': DynamicZoneRelatedArticles;
      'dynamic-zone.related-products': DynamicZoneRelatedProducts;
      'dynamic-zone.services': DynamicZoneServices;
      'dynamic-zone.testimonials': DynamicZoneTestimonials;
      'dynamic-zone.why-choose-us': DynamicZoneWhyChooseUs;
      'global.footer': GlobalFooter;
      'global.navbar': GlobalNavbar;
      'hero.hero-person-card': HeroHeroPersonCard;
      'hero.hero-service-item': HeroHeroServiceItem;
      'items.graph-card-top-items': ItemsGraphCardTopItems;
      'items.input': ItemsInput;
      'items.left-navbar-items': ItemsLeftNavbarItems;
      'items.ray-items': ItemsRayItems;
      'items.why-choose-us-item': ItemsWhyChooseUsItem;
      'shared.benefit': SharedBenefit;
      'shared.button': SharedButton;
      'shared.chip': SharedChip;
      'shared.form': SharedForm;
      'shared.launches': SharedLaunches;
      'shared.link': SharedLink;
      'shared.perks': SharedPerks;
      'shared.section': SharedSection;
      'shared.seo': SharedSeo;
      'shared.social-media-icon-links': SharedSocialMediaIconLinks;
      'shared.steps': SharedSteps;
      'shared.user': SharedUser;
    }
  }
}
