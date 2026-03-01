import type { Core } from '@strapi/strapi';
import { generateWebPage } from './generators/webPage';
import { generateArticle } from './generators/article';
import { generateProduct } from './generators/product';

type Generator = (
  data: Record<string, any>,
  organization: any,
  strapi: Core.Strapi
) => Promise<Record<string, any> | null>;

const contentTypes: Array<{ uid: string; generator: Generator }> = [
  { uid: 'api::page.page',         generator: generateWebPage },
  { uid: 'api::article.article',   generator: generateArticle },
  { uid: 'api::product.product',   generator: generateProduct },
];

function getCmpsTable(uid: string): string {
  const pluralMap: Record<string, string> = {
    page: 'pages_cmps',
    article: 'articles_cmps',
    product: 'products_cmps',
  };
  const singular = uid.split('.')[1];
  return pluralMap[singular] || `${singular}s_cmps`;
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    contentTypes.forEach(({ uid, generator }) => {
      strapi.db.lifecycles.subscribe({
        models: [uid],
        afterCreate(event: any) {
          // Fire and forget — nem blokkolja a mentést
          void updateStructuredData(event.result, uid, generator, strapi);
        },
        afterUpdate(event: any) {
          // Fire and forget — nem blokkolja a mentést
          void updateStructuredData(event.result, uid, generator, strapi);
        },
      });
    });
    strapi.log.info('[structured-data-generator] Lifecycle hooks registered ✓');
  },
  bootstrap() {},
};

async function updateStructuredData(
  result: any,
  uid: string,
  generator: Generator,
  strapi: Core.Strapi
): Promise<void> {
  try {
    const knex = strapi.db.connection;
    const cmpsTable = getCmpsTable(uid);

    const cmps = await knex(cmpsTable)
      .where({ entity_id: result.id, component_type: 'shared.seo' })
      .select('cmp_id');

    if (cmps.length === 0) return;
    const cmpIds = cmps.map((c: any) => c.cmp_id);

    const existing = await knex('components_shared_seos')
      .whereIn('id', cmpIds)
      .whereNotNull('structured_data')
      .count('id as cnt')
      .first();

    if (existing && Number(existing.cnt) > 0) return;

    let organization: any = null;
    try {
      organization = await (strapi.db.query('api::global.global') as any).findOne({ populate: ['seo'] });
    } catch (_) {}

    const enrichedData = {
      ...result,
      metaTitle: result.seo?.metaTitle || result.metaTitle,
      metaDescription: result.seo?.metaDescription || result.metaDescription,
    };

    const schema = await generator(enrichedData, organization, strapi);
    if (!schema) return;

    await knex('components_shared_seos')
      .whereIn('id', cmpIds)
      .update({ structured_data: JSON.stringify(schema, null, 2) });

    strapi.log.info(`[structured-data-generator] ✓ Schema saved for: ${result.slug || result.name || result.id}`);
  } catch (err: any) {
    strapi.log.warn(`[structured-data-generator] Hiba: ${err.message}`);
  }
}