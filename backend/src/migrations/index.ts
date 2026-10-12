import * as migration_20260328_085238 from './20260328_085238';
import * as migration_20261012_112705_google_review_blocks from './20261012_112705_google_review_blocks';

export const migrations = [
  {
    up: migration_20260328_085238.up,
    down: migration_20260328_085238.down,
    name: '20260328_085238'
  },
  {
    up: migration_20261012_112705_google_review_blocks.up,
    down: migration_20261012_112705_google_review_blocks.down,
    name: '20261012_112705_google_review_blocks'
  },
];
