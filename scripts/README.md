# scripts/

Eseti segédscriptek. A weboldalon egyik sem fut automatikusan, kivéve a `google-reviews/fetch_rating.py`-t (a szerveren rendszeresen fut, a deploy hivatkozik rá).
A `scripts/` mappa változása **nem indít deployt**.

Minden Google-mappában: `.env.example` (minta) és `.env` (valódi kulcsok, gitignore-olt). A Google-hozzáférés a `hello@davelopment.hu` fiókhoz tartozik, egy közös OAuth klienssel (`davelopment-ads-desktop`); szolgáltatásonként külön refresh token.

| Script | Mit csinál | Mikor |
|---|---|---|
| `google-ads/report.py` | Kampányok, költés, kattintás, konverzió, kulcsszavak (utolsó 30 nap). Csak olvas. Ügyfél-fiókra is: `python3 report.py <ügyfél-azonosító>` | hirdetések átnézése |
| `google-ads/conversions.py` | A beállított konverziós műveletek listája. Csak olvas. | „kattintás van, konverzió nincs” vizsgálat |
| `google-analytics/report.py` | GA4: forrás/csatorna, landing oldalak, események. Csak olvas. | forgalomelemzés |
| `google-search-console/report.py` | Keresések: megjelenés, kattintás, CTR, pozíció kulcsszavanként és oldalanként. Csak olvas. | SEO-állapot |
| `google-search-console/submit_sitemap.py` | Újraküldi a sitemapot a Google-nek (`OK (204)`). | élesített új oldal/cikk, URL-változás, fontos tartalmi változás után |
| `google-reviews/fetch_rating.py` | Google Cégprofil csillag + vélemények → fájl, amit az oldal megjelenít. | a szerveren rendszeresen fut |
| `_export_new_content_for_prod.py` | Új cikkek/oldalak exportja a lokális DB-ből SQL-be (`ON CONFLICT DO NOTHING`), élesbe vitelhez. | tartalmi kör élesítése előtt |
| `*/get_refresh_token.py` | Egyszeri: böngészős Google-engedélyezéssel új refresh tokent ad. | ha egy token lejár vagy új jog kell |

Futtatás: `cd scripts/<mappa> && python3 <script>.py`
