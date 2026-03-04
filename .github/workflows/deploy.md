# Davelopment – Szerver & Deploy dokumentáció

_Utoljára frissítve: 2026-03-03_

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
| **Backend** | Strapi v5 (SQLite / better-sqlite3) |
| **Frontend** | Next.js |
| **Process manager** | PM2 |
| **Reverse proxy** | nginx |
| **Package manager** | pnpm v10 |
| **Node** | v20 |

---

## Könyvtárstruktúra

```
/var/www/davelopment/
├── backend/                  # LIVE Strapi (PM2 id:15)
├── frontend/                 # LIVE Next.js (PM2 id:20)
├── storage/
│   ├── db/data.db            # SQLite adatbázis (persistent)
│   └── uploads/              # Feltöltött fájlok (persistent)
├── davelopment.conf          # nginx config
└── davelopment.hu/
```

### Szimlink struktúra
- `backend/.tmp/data.db` → `/var/www/davelopment/storage/db/data.db`
- `backend/public/uploads` → `/var/www/davelopment/storage/uploads`

A `storage/` mappa deploy-független – sosem törlődik, sosem cserélődik.

---

## PM2 processzek

```bash
pm2 list              # összes process
pm2 logs backend      # backend élő log
pm2 logs frontend     # frontend élő log
pm2 restart backend   # backend újraindítás
pm2 restart frontend  # frontend újraindítás
```

---

## Repo struktúra

```
(monorepo)
├── pnpm-workspace.yaml
├── frontend/
├── backend/
│   └── src/plugins/
│       ├── marketing-metrics/        # GSC integráció
│       └── structured-data-generator/
└── .github/workflows/
    └── ship-it.yml
```

---

## GitHub Actions – ship-it.yml

### Triggerek
- **Push** `main` branchre – automatikus deploy ha `frontend/**` vagy `backend/**` változott
- **Workflow dispatch** – manuális trigger, külön kapcsoló frontend/backend deploy-hoz

### Jobok

```
changes → secrets-check → frontend-build → deploy-frontend
                        → backend-build  → deploy-backend
```

1. **changes** – detektálja mi változott (dorny/paths-filter)
2. **secrets-check** – ellenőrzi hogy SSH secrets megvannak-e
3. **frontend-build** – Next.js build + bundle feltöltése artifact-ként
4. **backend-build** – Plugin build + Strapi build + bundle feltöltése
5. **deploy-frontend** – rsync + pnpm install + PM2 restart
6. **deploy-backend** – Atomikus deploy rollback támogatással (lásd lent)

### Backend deploy folyamata (atomikus)

```
1. Bundle kicsomagolása /tmp-be
2. Új release mappa előkészítése (backend.new_<SHA>)
3. .env másolása a live mappából
4. Szimlink: uploads + data.db → storage/
5. pnpm install --prod (az új mappában)
6. better-sqlite3 native addon build (npm run install)
7. better_sqlite3.node verify
8. pm2 stop backend
9. backend → backend.prev_<TS> (rename)
10. backend.new_<SHA> → backend (rename)
11. pm2 restart backend
12. Smoke test: HTTP 2xx a /_health endpointon
13. Ha smoke FAIL → rollback (prev visszanevezés + pm2 restart)
14. Régi prev mappák törlése (max 2 marad)
```

### Rollback
Automatikus: ha a smoke test 20 próba alatt sem ad 2xx választ, a deploy script visszaállítja az előző verziót és kilép 1-gyel.

Manuális rollback:
```bash
cd ~
pm2 stop backend
ls /var/www/davelopment/backend.prev_*   # elérhető verziók
mv /var/www/davelopment/backend /var/www/davelopment/backend.broken
mv /var/www/davelopment/backend.prev_<TS> /var/www/davelopment/backend
pm2 restart backend
```

---

## Ismert quirk-ök

### pnpm v10 – better-sqlite3 native build
A pnpm v10 biztonsági okokból alapból blokkolja a native build scripteket.
A `pnpm rebuild better-sqlite3` emiatt csendben sikertelen.

**Megoldás a deploy scriptben:**
```bash
cd "$NEW_DIR/node_modules/.pnpm/better-sqlite3@11.7.0/node_modules/better-sqlite3"
npm run install
```

Ha a `better-sqlite3` verziója változik, ezt a path-t frissíteni kell a workflow-ban.

### Google OAuth – redirect URI
A Google Cloud Console-ban **mindkét** URI-t fel kell venni:
```
http://localhost:1337/api/marketing-metrics/gsc-callback   (fejlesztés)
https://davelopment.hu/api/marketing-metrics/gsc-callback  (production)
```
Csak `https` működik production-ben.

---

## Backend .env kulcsok

| Kulcs | Leírás |
|---|---|
| `DATABASE_CLIENT` | sqlite |
| `DATABASE_FILENAME` | .tmp/data.db (szimlink → storage/db/data.db) |
| `GOOGLE_CLIENT_ID` | Google OAuth (marketing-metrics plugin) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `STRAPI_ADMIN_PSI_API_KEY` | PageSpeed Insights API |
| `APP_KEYS`, `JWT_SECRET`, stb. | Strapi belső titkosítás |

---

## Korábbi incidens – 2026-03-03

**Kriptobányász malware** volt a szerveren december óta:
- `/var/tmp/docker-daemon` – 106% CPU, 2GB RAM
- `/var/tmp/dockerd` – szülő process (újraindítás)
- `/var/tmp/bot*` (16 fájl), `/var/tmp/1.sh`
- `~/.config/procps/` – persistence
- `~/.rsyslo/rsyslo` – UPX-packed ELF bináris

**Cleanup elvégezve:** összes malware process leállítva és törölve, SSH `authorized_keys` tisztítva (csak 2 legitim kulcs maradt: `dave@mac`, `ci@davelopment`).

**TODO:**
- [ ] GitHub deploy key csere (`ci@davelopment` kulcs potenciálisan kompromittált)
- [ ] Rackforest értesítése a malware-ről
