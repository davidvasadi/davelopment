# structured-data-generator — Strapi v5 Plugin

Automatikusan generál **schema.org JSON-LD** structured data-t a következő collection type-okhoz:

| Collection | Schema típus |
|---|---|
| Pages | `WebPage` |
| Articles | `Article` / `BlogPosting` |
| Products | `Product` + `Offer` |

---

## Telepítés

### 1. Másold be a plugin mappát

```
src/
  plugins/
    structured-data-generator/   ← ide
      index.js
      strapi-server.js
      generators/
        index.js
      package.json
```

### 2. Regisztráld a plugint (`config/plugins.js` vagy `config/plugins.ts`)

```js
// config/plugins.js
module.exports = ({ env }) => ({
  // ... többi plugin
  'structured-data-generator': {
    enabled: true,
    resolve: './src/plugins/structured-data-generator',
  },
});
```

### 3. Állítsd be a frontend URL-t

`.env` fájlban:

```
FRONTEND_URL=https://davelopment.hu
```

Ha nincs `.env` bejegyzés, a plugin a `server.url` config értéket használja, végső fallback: `https://example.com`.

### 4. Indítsd újra a Strapi-t

```bash
npm run develop
# vagy
yarn develop
```

---

## Hogyan működik?

A plugin **`beforeCreate`** és **`beforeUpdate`** lifecycle hook-okat használ.

- Ha a `structuredData` mező **üres / null** → automatikusan generálja
- Ha a `structuredData` mező **már ki van töltve** → nem írja felül (manuális kontroll megmarad)
- Az Organization adatokat a **Global singleton**-ból olvassa (`siteName`, `logo`)

---

## Collection type UID testreszabás

Ha a te collection type UID-jaid eltérnek az alapértelmezettektől, módosítsd a `strapi-server.js` elején a `contentTypes` tömböt:

```js
const contentTypes = [
  { uid: 'api::page.page',       generator: generators.webPage },
  { uid: 'api::article.article', generator: generators.article },
  { uid: 'api::product.product', generator: generators.product },
];
```

Az UID-okat a Strapi admin **Content-Type Builder** → adott típus → jobb felső sarok mutatja.

---

## Mezők amikre a generátor támaszkodik

### Pages → WebPage
`metaTitle`, `title`, `metaDescription`, `description`, `slug`, `locale`

### Articles → Article
`title`, `metaTitle`, `metaDescription`, `description`, `slug`, `locale`, `publishedAt`, `cover.url`, `image.url`

### Products → Product + Offer
`title`, `name`, `metaTitle`, `metaDescription`, `description`, `slug`, `price`, `currency`, `stock`, `sku`, `cover.url`, `image.url`

---

## Meglévő null értékű rekordok frissítése (opcionális migration script)

Ha már vannak meglévő rekordok `null` structured data-val, futtasd ezt a Strapi bootstrap-ben **egyszer**:

```js
// config/functions/bootstrap.js  (csak egyszer fusson!)
const generators = require('../src/plugins/structured-data-generator/generators');

module.exports = async ({ strapi }) => {
  const pages = await strapi.db.query('api::page.page').findMany({
    where: { structuredData: null },
  });

  const org = await strapi.db.query('api::global.global').findOne({ populate: ['*'] });

  for (const page of pages) {
    const schema = await generators.webPage(page, org, strapi);
    await strapi.db.query('api::page.page').update({
      where: { id: page.id },
      data: { structuredData: JSON.stringify(schema, null, 2) },
    });
  }

  strapi.log.info('[structured-data-generator] Migration complete.');
};
```
