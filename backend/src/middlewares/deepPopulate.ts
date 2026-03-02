//backend/src/middlewares/deepPopulate.ts
/**
 * `deepPopulate` middleware
 */
import type { Core } from '@strapi/strapi';
import { UID } from '@strapi/types';
import { contentTypes } from '@strapi/utils';
import pluralize from 'pluralize';

interface Options {
  relationalFields?: string[];
}

const { CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE } = contentTypes.constants;

const extractPathSegment = (url: string) =>
  url.match(/\/([^/?]+)(?:\?|$)/)?.[1] || '';

const getDeepPopulate = (uid: UID.Schema, opts: Options = {}) => {
  const model = strapi.getModel(uid);
  const attributes = Object.entries(model.attributes);

  return attributes.reduce((acc: any, [attributeName, attribute]) => {
    switch ((attribute as any).type) {
      case 'relation': {
        const rel = (attribute as any).relation;
        const isMorphRelation =
          typeof rel === 'string' && rel.toLowerCase().startsWith('morph');
        if (isMorphRelation) break;

        // Strapi v5: createdBy és updatedBy nem populate-elhető → kihagyjuk
        const isCreatorField = [CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE].includes(attributeName);
        if (isCreatorField) break;

        const isVisible = contentTypes.isVisibleAttribute(model, attributeName);

        if (isVisible) {
          if (attributeName === 'testimonials') {
            acc[attributeName] = { populate: 'user.image' };
          } else {
            acc[attributeName] = { populate: '*' };
          }
        }

        break;
      }

      case 'media': {
        acc[attributeName] = { populate: '*' };
        break;
      }

      case 'component': {
        const populate = getDeepPopulate((attribute as any).component, opts);
        acc[attributeName] = { populate };
        break;
      }

      case 'dynamiczone': {
        const populatedComponents = (((attribute as any).components || []) as UID.Component[]).reduce(
          (dzAcc: any, componentUID: UID.Component) => {
            dzAcc[componentUID] = { populate: getDeepPopulate(componentUID, opts) };
            return dzAcc;
          },
          {}
        );

        acc[attributeName] = { on: populatedComponents };
        break;
      }

      default:
        break;
    }

    return acc;
  }, {});
};

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: any) => {
    const url: string = ctx.request.url || '';

    // BYPASS: marketing-metrics API
    if (url.startsWith('/api/marketing-metrics/')) {
      return next();
    }

    if (
      url.startsWith('/api/') &&
      ctx.request.method === 'GET' &&
      !ctx.query.populate &&
      !url.includes('/api/users') &&
      !url.includes('/api/seo')
    ) {
      const contentType = extractPathSegment(url);
      const singular = pluralize.singular(contentType);
      const uid = `api::${singular}.${singular}` as UID.Schema;

      if (!(strapi as any).contentTypes?.[uid]) {
        return next();
      }

      try {
        ctx.query.populate = {
          // @ts-ignore
          ...getDeepPopulate(uid),
          ...(!url.includes('products') && { localizations: { populate: {} } }),
        };
      } catch {
        return next();
      }
    }

    await next();
  };
};