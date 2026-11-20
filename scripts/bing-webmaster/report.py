"""
Bing Webmaster Tools — csak olvas. Mindkét webhely: davelopment.hu + booking.davelopment.hu
(a Bing keresője adja a ChatGPT keresés és a Copilot találatait is).

Kulcs: .env → BING_WEBMASTER_API_KEY (Bing Webmaster → Settings → API access; gitignore-olt).
Használat:  python3 report.py            # mindkét webhely
            python3 report.py booking    # csak a booking
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
for line in open(os.path.join(HERE, ".env")):
    if "=" in line and not line.startswith("#"):
        k, v = line.strip().split("=", 1)
        os.environ.setdefault(k, v)
KEY = os.environ["BING_WEBMASTER_API_KEY"]
API = "https://ssl.bing.com/webmaster/api.svc/json/"
SITES = {"davelopment": "https://davelopment.hu/", "booking": "https://booking.davelopment.hu/"}


def call(method: str, **params):
    q = urllib.parse.urlencode({**params, "apikey": KEY})
    with urllib.request.urlopen(f"{API}{method}?{q}", timeout=30) as r:
        return json.loads(r.read().decode()).get("d")


def day(ms: str) -> str:  # "/Date(1732060800000)/" → 2026-11-20
    try:
        return datetime.fromtimestamp(int(ms.strip("/Date()").split("+")[0].split("-")[0]) / 1000, timezone.utc).strftime("%Y-%m-%d")
    except Exception:
        return ms


def report(name: str, site: str) -> None:
    print(f"\n==================== {site}")
    traffic = call("GetRankAndTrafficStats", siteUrl=site) or []
    if traffic:
        imp = sum(t.get("Impressions", 0) for t in traffic); clk = sum(t.get("Clicks", 0) for t in traffic)
        print(f"Forgalom ({day(traffic[0]['Date'])} – {day(traffic[-1]['Date'])}): {imp} megjelenés, {clk} kattintás")
    else:
        print("Forgalom: még nincs adat")
    queries = sorted(call("GetQueryStats", siteUrl=site) or [], key=lambda q: -q.get("Impressions", 0))
    print(f"Keresések ({len(queries)}):")
    for q in queries[:25]:
        print(f"  {q.get('Impressions',0):5} megj {q.get('Clicks',0):4} kat  átl. hely {q.get('AvgImpressionPosition',0):5.1f} | {q.get('Query')}")
    pages = sorted(call("GetPageStats", siteUrl=site) or [], key=lambda p: -p.get("Impressions", 0))
    print(f"Oldalak ({len(pages)}):")
    for p in pages[:15]:
        print(f"  {p.get('Impressions',0):5} megj {p.get('Clicks',0):4} kat | {p.get('Query')}")
    crawl = call("GetCrawlStats", siteUrl=site) or []
    if crawl:
        c = crawl[-1]
        print(f"Feltérképezés ({day(c['Date'])}): indexelt {c.get('InIndex')}, letöltött {c.get('CrawledPages')}, "
              f"hibás {c.get('CrawlErrors')}, robots-tiltott {c.get('BlockedByRobotsTxt')}, 5xx {c.get('Code5xx')}, 4xx {c.get('Code4xx')}")
    for s in call("GetFeeds", siteUrl=site) or []:
        print(f"Sitemap: {s.get('Url')} | állapot {s.get('Status')} | URL-ek {s.get('UrlCount')} | utolsó feltérképezés {day(s.get('LastCrawled') or '')}")
    quota = call("GetUrlSubmissionQuota", siteUrl=site) or {}
    print(f"URL-beküldési keret: ma {quota.get('DailyQuota')}, hónapban {quota.get('MonthlyQuota')}")


if __name__ == "__main__":
    pick = sys.argv[1:] or list(SITES)
    for n in pick:
        report(n, SITES[n])
