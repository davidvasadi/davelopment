# Davelopment – Szerver & Deploy dokumentáció

_Utoljára frissítve: 2026-04-18_

---

## Szerver

| | |
|---|---|
| **IP** | 46.29.142.31 |
| **OS** | Debian |
| **RAM** | 3.8 GB |
| **Hoszting** | Rackforest |
| **Deploy user** | `deploy@davelopment` |
| **Web root** | `/var/www/davelopment/` |

---

## Stack

| Réteg | Technológia |
|---|---|
| **Backend** | Payload v3 (Next.js alapú CMS) |
| **Adatbázis** | PostgreSQL 18 |
| **Frontend** | Next.js |
| **Process manager** | PM2 |
| **Reverse proxy** | nginx |
| **Package manager** | pnpm v10 |
| **Node** | v20 |

---

## Könyvtárstruktúra

```
/var/www/davelopment/
├── backend/                  # LIVE Payload CMS (PM2 id:0, port 1337)
├── frontend/                 # LIVE Next.js (PM2 id:1, port 3000)
├── storage/
│   └── uploads/              # Feltöltött fájlok (persistent)
└── .pnpm-store/              # pnpm shared store
```

### Szimlink struktúra
- `backend/public/uploads` → `/var/www/davelopment/storage/uploads`

A `storage/` mappa deploy-független – sosem törlődik, sosem cserélődik.

---

## Adatbázis

- **Motor:** PostgreSQL 18
- **Adatbázis:** `davelopment`
- **User:** `davelopment`
- **Connection:** `postgresql://davelopment@localhost:5432/davelopment`
- A `DATABASE_URI` GitHub secret-ként van tárolva
- **Tulajdonos:** Minden tábla `davelopment` owned (2026-04-18-án lokális dumpból visszatöltve)

### DB szinkronizálás (ha szükséges)

Ha lokálisan szinkronizált a DB és production-ra kell tolni:

```bash
# Lokálisan:
pg_dump "postgresql://davelopment:PASS@localhost:5432/davelopment" \
  --no-owner --no-acl -f /tmp/davelopment_dump.sql

rsync -avz -e "ssh -i ~/.ssh/davelopment_dave" \
  /tmp/davelopment_dump.sql deploy@46.29.142.31:/tmp/

# Szerveren:
pm2 stop backend
PGPASSWORD='PASS' psql -U davelopment -h localhost -d davelopment -c \
  "DO \$\$ DECLARE r RECORD; BEGIN FOR r IN SELECT tablename FROM pg_tables WHERE schemaname='public' LOOP EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END \$\$;"
PGPASSWORD='PASS' psql -U davelopment -h localhost -d davelopment -f /tmp/davelopment_dump.sql
pm2 restart backend --update-env
```

---

## PM2 processzek

```bash
pm2 list                          # összes process
pm2 logs backend --nostream       # backend log
pm2 logs frontend --nostream      # frontend log
pm2 restart backend --update-env  # backend újraindítás (env frissítéssel)
pm2 restart frontend --update-env # frontend újraindítás
```

---

## Repo struktúra

```
(monorepo)
├── frontend/
├── backend/
│   └── src/
│       ├── app/api/marketing-metrics/   # GSC integráció
│       ├── collections/
│       └── globals/
└── .github/workflows/
    └── ship-it.yml
```

---

## GitHub Actions – ship-it.yml

### Triggerek
- **Push** `main` branchre – automatikus deploy ha `frontend/**` vagy `backend/**` változott
- **Workflow dispatch** – manuális trigger, pontos checkbox kiválasztással (csak a bejelölt job fut)

### Jobok

```
changes → secrets-check → frontend-build → deploy-frontend
                        → backend-build  → deploy-backend
```

1. **changes** – detektálja mi változott (dorny/paths-filter); workflow_dispatch esetén az input értékek felülírják a filtert
2. **secrets-check** – ellenőrzi hogy SSH secrets megvannak-e
3. **frontend-build** – Next.js build + bundle feltöltése artifact-ként
4. **backend-build** – `next build --webpack` + bundle feltöltése
5. **deploy-frontend** – rsync + pnpm install + PM2 restart
6. **deploy-backend** – Atomikus deploy rollback támogatással

### Backend deploy folyamata (atomikus)

```
1.  Bundle kicsomagolása /tmp-be
2.  Új release mappa előkészítése (backend.new_<SHA>)
3.  .env írása GitHub secrets-ből
4.  .npmrc írása (allow-build: sharp, esbuild, @parcel/watcher)
5.  Szimlink: uploads → storage/
6.  pnpm install --prod
7.  sharp native binary újraépítése (npm run install)
8.  Schema bootstrap:
    a) sudo -u postgres tábla ownership fix (ha elérhető)
    b) yes | PAYLOAD_DB_PUSH=true pnpm payload migrate (auto-accept, non-blocking)
9.  pm2 stop backend
10. backend → backend.prev_<TS> (rename)
11. backend.new_<SHA> → backend (rename)
12. pm2 restart backend
13. Smoke test: HTTP 2xx a /api/health endpointon (24 próba, 5mp közönként)
14. Ha smoke FAIL → rollback (prev visszanevezés + pm2 restart)
15. Régi prev mappák törlése (max 2 marad)
```

### Schema változások kezelése

A workflow automatikusan kezeli a schema változásokat:
- **Új tábla / mező:** `PAYLOAD_DB_PUSH=true` létrehozza deploy során
- **Meglévő mező módosítás:** szintén automatikus (minden tábla davelopment owned)
- **Kézi beavatkozás NEM szükséges** normál fejlesztési változásoknál

### Rollback

Automatikus: ha a smoke test 24 próba alatt sem ad 2xx választ.

Manuális rollback:
```bash
cd ~
pm2 stop backend
ls /var/www/davelopment/backend.prev_*
mv /var/www/davelopment/backend /var/www/davelopment/backend.broken
mv /var/www/davelopment/backend.prev_<TS> /var/www/davelopment/backend
pm2 restart backend --update-env
```

---

## Nginx konfig

A konfig helye: `/etc/nginx/sites-enabled/davelopment.hu`

- `/admin`, `/api/*` → backend (port 1337)
- `/uploads/*` → backend (port 1337)
- `/_next/static/*` → frontend statikus fájlok (gyors alias), ha nincs meg: fallback backend proxy
- minden más → frontend (port 3000)

---

## Ismert quirk-ök

### pnpm v10 – native build scriptek

A pnpm v10 alapból blokkolja a native build scripteket. A `sharp` csomag natív binárisát explicit újra kell telepíteni minden deploy után.

**Deploy scriptben:**
```bash
npm --cache /tmp/npm-sharp-cache \
  --prefix "${NEW_DIR}/node_modules/.pnpm/sharp@0.32.6/node_modules/sharp" \
  run install
```

Ha a `sharp` verziója változik, a path-t frissíteni kell a workflow-ban.

### Next.js 16 – Turbopack alapértelmezett

A `next@16.2.1`-ben Turbopack az alapértelmezett builder. A `withPayload` wrapper mindig injektál `turbopack: {}` configot. A Turbopack a `pino` modult hash névvel externalizálja (`pino-HASH`), amit runtime nem talál meg.

**Megoldás:** `next build --webpack` a build scriptben, ami webpacket kényszerít.

### sharp – manuális telepítés szükség esetén

Ha a deploy után a backend sharp hibával indul:
```bash
cd /var/www/davelopment/backend/node_modules/.pnpm/sharp@0.32.6/node_modules/sharp
npm --cache /tmp/npm-sharp-cache run install
pm2 restart backend --update-env
```

### Google OAuth – redirect URI

A Google Cloud Console-ban mindkét URI szükséges:
```
http://localhost:1337/api/marketing-metrics/gsc-callback   (fejlesztés)
https://davelopment.hu/api/marketing-metrics/gsc-callback  (production)
```

A callback után az admin panelre irányít vissza – ehhez a `NEXT_PUBLIC_SERVER_URL` env var kell.

### ProductPage – dbName: 'pp'

A `backend/src/globals/ProductPage.ts` fájlban `dbName: 'pp'` van beállítva, ezért a tábla neve az adatbázisban `pp` (és nem `product_page`). Ez szándékos.

---

## Backend .env kulcsok

| Kulcs | Leírás |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `1337` |
| `NEXT_PUBLIC_SERVER_URL` | `https://davelopment.hu` |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://davelopment.hu` |
| `FRONTEND_URL` | `https://davelopment.hu` |
| `PAYLOAD_SECRET` | Payload titkosítási kulcs (GitHub secret) |
| `DATABASE_URI` | PostgreSQL connection string (GitHub secret) |
| `PREVIEW_SECRET` | Draft mode preview kulcs |
| `GOOGLE_CLIENT_ID` | Google OAuth (GSC integráció) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `RESEND_API_KEY` | Email küldés (Resend) |
| `RESEND_FROM_EMAIL` | `hello@davelopment.hu` |
| `NOTIFY_EMAIL` | Értesítési email cím |

---

## Korábbi incidens – 2026-03-03

**Kriptobányász malware** volt a szerveren december óta:
- `/var/tmp/docker-daemon` – 106% CPU, 2GB RAM
- `/var/tmp/dockerd` – szülő process
- `/var/tmp/bot*` (16 fájl), `/var/tmp/1.sh`
- `~/.config/procps/` – persistence
- `~/.rsyslo/rsyslo` – UPX-packed ELF bináris

**Cleanup elvégezve:** összes malware process leállítva és törölve, SSH `authorized_keys` tisztítva.

**TODO:**
- [ ] GitHub deploy key csere (`ci@davelopment` kulcs potenciálisan kompromittált)
- [ ] Rackforest értesítése a malware-ről
