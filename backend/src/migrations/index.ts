import * as migration_20260328_085238 from './20260328_085238';
import * as migration_20261017_164241_add_key_points_and_faq_articles from './20261017_164241_add_key_points_and_faq_articles';

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
];
