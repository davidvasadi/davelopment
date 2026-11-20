"""
IndexNow: azonnal szól a Bing-nek (→ a ChatGPT keresője is ebből dolgozik), a Yandexnek és a többi IndexNow-keresőnek,
hogy az oldal URL-jei változtak. A Google NEM használja — oda a google-search-console/submit_sitemap.py kell.

A kulcs nem titok: nyilvánosan elérhető a webhely gyökerében (/<KEY>.txt) — így igazolja a kereső, hogy a domain a miénk.
  - davelopment.hu:          frontend/public/<KEY>.txt
  - booking.davelopment.hu:  a Booking repó public/<KEY>.txt

Használat:
    python3 submit.py                         # mindkét webhely teljes sitemapja
    python3 submit.py davelopment.hu          # csak az egyik
    python3 submit.py booking.davelopment.hu https://booking.davelopment.hu/arak   # csak a megadott URL-ek
"""
import json
import re
import sys
import urllib.request

KEY = "00c10dfcb3b24f5a34d879d8746054e1"
HOSTS = ["davelopment.hu", "booking.davelopment.hu"]
UA = {"User-Agent": "davelopment-indexnow/1.0"}


def sitemap_urls(host: str) -> list[str]:
    xml = urllib.request.urlopen(urllib.request.Request(f"https://{host}/sitemap.xml", headers=UA), timeout=30).read().decode()
    return sorted(set(re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml)))


def submit(host: str, urls: list[str]) -> None:
    key_url = f"https://{host}/{KEY}.txt"
    got = urllib.request.urlopen(urllib.request.Request(key_url, headers=UA), timeout=15).read().decode().strip()
    if got != KEY:
        sys.exit(f"{host}: a kulcsfájl ({key_url}) nem egyezik — előbb élesíteni kell")
    body = json.dumps({"host": host, "key": KEY, "keyLocation": key_url, "urlList": urls[:10000]}).encode()
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body, method="POST",
                                 headers={**UA, "Content-Type": "application/json; charset=utf-8"})
    with urllib.request.urlopen(req, timeout=30) as r:
        print(f"{host}: {len(urls)} URL beküldve — HTTP {r.status} (200/202 = rendben)")


if __name__ == "__main__":
    args = sys.argv[1:]
    hosts = [args[0]] if args else HOSTS
    for h in hosts:
        submit(h, args[1:] if len(args) > 1 else sitemap_urls(h))
