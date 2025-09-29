# Köszönő Hírlevél és Leiratkozás Keretrendszer

Ez a dokumentáció bemutatja a **köszönő hírlevél** és a **leiratkozás** funkció moduláris felépítését Strapi alatt.

## 1. Fájl- és mappastruktúra

```
src/
├── api/
│   ├── newsletter/            # Feliratkozó entitás
│   │   ├── content-types/
│   │   │   └── newsletter/
│   │   │       └── schema.json
│   │   ├── controllers/
│   │   │   └── newsletter.ts
│   │   ├── services/
│   │   │   └── newsletter.ts
│   │   ├── routes/
│   │   │   └── newsletter.ts
│   │   └── lifecycles.ts      # afterCreate hook: köszönő email
│   └── unsubscribe/           # Leiratkozás webhook ion
│       ├── content-types/
│       │   └── unsubscribe/
│       │       └── schema.json
│       ├── controllers/
│       │   └── unsubscribe.ts
│       ├── services/
│       │   └── unsubscribe.ts
│       └── routes/
│           └── unsubscribe.ts
└── extensions/
    └── content-manager/
        └── strapi-server.js  # opcionális UI override
```

## 2. Köszönő hírlevél (Thank You)

### 2.1 schema.json

```json
{
  "kind": "collectionType",
  "collectionName": "newsletters",
  "info": {"singularName":"newsletter","pluralName":"newsletters"},
  "attributes": {
    "email": {"type":"string", "required":true},
    "name": {"type":"string"},
    "confirmed": {"type":"boolean", "default":false},
    "unsubscribeToken": {"type":"string"},
    "subscribedAt": {"type":"datetime"},
    "unsubscribed": {"type":"boolean","default":false}
  }
}
```

### 2.2 lifecycles.ts (afterCreate)

```ts
export default {
  async afterCreate(event) {
    const { result } = event;
    if (!result.confirmed) {
      // 1) generálunk token, frissítjük
      // 2) nodemailer-rel köszönő email
    }
  }
};
```

### 2.3 controllers/newsletter.ts

```ts
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async confirm(ctx) {
    // lekér token, update confirmed=true
    // visszaüzenet JSON
  }
}));
```

### 2.4 routes/newsletter.ts

```ts
export default [
  {
    method: 'GET', path: '/newsletter/confirm/:token',
    handler: 'api::newsletter.newsletter.confirm',
    config: { auth: false }
  }
];
```

## 3. Leiratkozás (Unsubscribe)

### 3.1 schema.json

```json
{
  "kind":"singleType",
  "collectionName":"unsubscribe_settings",
  "info":{"singularName":"unsubscribe","displayName":"Unsubscribe"},
  "attributes": {
    // opcionális beállítások
  }
}
```

### 3.2 controllers/unsubscribe.ts

```ts
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::unsubscribe.unsubscribe', ({ strapi }) => ({
  async index(ctx) {
    const { token } = ctx.query;
    // find newsletter by token
    // update unsubscribed=true
    // vissza render egy egyszerű HTML oldalt: "Sikeres leiratkozás"
  }
}));
```

### 3.3 routes/unsubscribe.ts

```ts
export default [
  { method: 'GET', path: '/unsubscribe', handler: 'api::unsubscribe.unsubscribe.index', config: { auth: false } }
];
```

### 3.4 services/unsubscribe.ts

```ts
import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::unsubscribe.unsubscribe', ({ strapi }) => ({
  async process(token: string) {
    // logika token->newsletter updatelés
  }
}));
```

## 4. Összefoglaló folyamatok

* **Feliratkozás**: űrlap `POST /api/newsletters` → `afterCreate` köszönő email → link a `/unsubscribe?token=xxx`
* **Megerősítés (opcionális)**: katt a `/newsletter/confirm/:token` endpointra → confirmed=true → visszaköszönő oldal
* **Leiratkozás**: katt a `/unsubscribe?token=xxx` → `unsubscribe` controller → `unsubscribed=true` → visszaigazoló oldal

Ez a vázlat adja a köszönő és leiratkozás alappilléreit. A részletes HTML sablonokat, policy-kat és UI override-okat ebben a keretben lehet tovább finomítani.


