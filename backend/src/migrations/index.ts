import * as migration_20260328_085238 from './20260328_085238';
import * as migration_20261017_164241_add_key_points_and_faq_articles from './20261017_164241_add_key_points_and_faq_articles';
import * as migration_20261017_171437_add_articles_rels_faqs_column from './20261017_171437_add_articles_rels_faqs_column';

export const migrations = [
  {
    up: migration_20260328_085238.up,
    down: migration_20260328_085238.down,
    name: '20260328_085238'
  },
  {
    up: migration_20261017_164241_add_key_points_and_faq_articles.up,
    down: migration_20261017_164241_add_key_points_and_faq_articles.down,
    name: '20261017_164241_add_key_points_and_faq_articles'
  },
  {
    up: migration_20261017_171437_add_articles_rels_faqs_column.up,
    down: migration_20261017_171437_add_articles_rels_faqs_column.down,
    name: '20261017_171437_add_articles_rels_faqs_column'
  },
];
