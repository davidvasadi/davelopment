# Hírlevél-kampány Keretrendszer

Az alábbi egységes keretrendszer (framework) összefogja a Strapi-alapú hírlevél-kampány modul összes részét – tartalommodell, controller, service, lifecycle és extension – áttekinthető struktúrába rendezve.

## 1. Fájl- és mappastruktúra

```
src/
├── api/
│   └── newsletter-campaign/
│       ├── content-types/
│       │   └── newsletter-campaign/
│       │       └── schema.json
│       ├── controllers/
│       │   └── newsletter-campaign.ts
│       ├── services/
│       │   └── newsletter-campaign.ts
│       ├── routes/
│       │   └── send.ts
│       └── lifecycles.ts
├── extensions/
│   └── content-manager/
│       └── strapi-server.js
└── plugins.js (plugin.ts)
```

## 2. Modulok szerepe

| Elem                               | Feladat                                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **schema.json**                    | A `newsletter-campaign` tartalommodell mezői: `subject`, `content`, `previewText`, `sentAt`, `isSent`, `targetLocale` stb. |
| **controller (`controllers/`)**    | CRUD+extra: manuális `/send` endpoint és opcionális `publish` override.                                                    |
| **service (`services/`)**          | `sendCampaign(id)` újraküldhető, leválogatja a feliratkozókat, e-mailt küld, frissíti `isSent` és `sentAt`.                |
| **route (`routes/send.ts`)**       | Definiálja a `POST /api/newsletter-campaign/:id/send` útvonalat, amivel manuálisan indítható a küldés.                     |
| **lifecycles (`lifecycles.ts`)**   | `afterUpdate` hook: a Publish esemény után automatikusan meghívja a `sendCampaign`-et, guardokkal.                         |
| **extension (`strapi-server.js`)** | Content Manager UI Publish/unpublish override: a UI gombra kattintáskor is indít, és unpublish-nél resetel.                |
| **plugin config (`plugin.ts`)**    | Globális Strapi plugin-beállítások: i18n, email-provider.                                                                  |

## 3. Futtatási folyamat publish/unpublish

1. **Draft létrehozása** → csak mentés.
2. **Publish**:

   * Lifecycle hook ellenőrzi `params.data.publishedAt` és `!isSent`, hívja `sendCampaign`-et.
   * Extension override (UI) lekéri a friss entitást, guardolja `publishedAt`+`!isSent`, hívja `sendCampaign`.
3. **Unpublish**:

   * Extension reseteli `isSent=false`, így újra küldhető.

## 4. Következő lépések

* **E-mail sablon finomítása**: dinamikus tokenek, stílusok.
* **Biztonság**: manuális `/send` policy-k vagy JWT.
* **Fejlesztési workflow**: tesztkörnyezet, staging, CI/CD pipeline.

---

Ez a váz ad egy áttekinthető keretet, amire építhetünk tovább. Ha részletes kód-sablonokra vagy automata dokumentációra van szükséged, szólj, és kibővítjük!
