import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo'
import {
  TestimonialsBlock,
  RelatedProductsBlock,
  RelatedArticlesBlock,
  PricingBlock,
  LaunchesBlock,
  HowItWorksBlock,
  HeroBlock,
  FormNextToSectionBlock,
  FeaturesBlock,
  FAQBlock,
  CTABlock,
  BrandsBlock,
} from '../blocks/index'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Blog oldal',
  admin: {
    group: 'Weboldal',
    description: 'A blog oldal beállításai (cím, SEO, dinamikus zóna)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Főcím',
      localized: true,
    },
    {
      name: 'sub_heading',
      type: 'text',
      label: 'Alcím',
      localized: true,
    },
    {
      name: 'sub_heading_2',
      type: 'text',
      label: 'Alcím 2',
      localized: true,
    },
    seoField(),
    {
      name: 'dynamic_zone',
      type: 'blocks',
      label: 'Dinamikus zóna',
      localized: true,
      blocks: [
        TestimonialsBlock,
        RelatedProductsBlock,
        RelatedArticlesBlock,
        PricingBlock,
        LaunchesBlock,
        HowItWorksBlock,
        HeroBlock,
        FormNextToSectionBlock,
        FeaturesBlock,
        FAQBlock,
        CTABlock,
        BrandsBlock,
      ],
    },
  ],
}
