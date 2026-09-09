"""
Regenerate frontend/public/sitemap.xml from the live database.

Run this after any pricing/device/location change, and as a step in your
deploy pipeline (before `npm run build`) so the sitemap never drifts from
what /api/seo-slugs actually considers valid.

Usage:
    cd backend
    python3 generate_sitemap.py

Requires the same .env as the API (MONGO_URL, DB_NAME) since it queries
pricing directly, the same way GET /api/seo-slugs does — so a page is only
listed here if it will actually render, not just because the device/service
slug combination is theoretically possible.
"""
import asyncio
import os
import sys
from pathlib import Path
from datetime import date

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SITE_URL = os.environ.get('VITE_SITE_URL', 'https://hifone.com.au').rstrip('/')
OUTPUT_PATH = ROOT_DIR.parent / 'frontend' / 'public' / 'sitemap.xml'

# Keep in sync with server.py — duplicated here deliberately so this script
# has no import-time dependency on the FastAPI app (routers, middleware,
# email/JWT config) just to read three dicts.
DEVICE_SLUG_MAP = {
    "iphone-15-pro": "dev-iphone15pro", "iphone-15": "dev-iphone15",
    "iphone-14-pro": "dev-iphone14pro", "iphone-14": "dev-iphone14",
    "iphone-13-pro": "dev-iphone13pro", "iphone-13": "dev-iphone13",
    "iphone-12": "dev-iphone12", "iphone-se": "dev-iphonese",
    "samsung-s24-ultra": "dev-s24ultra", "samsung-s24": "dev-s24",
    "samsung-s23-ultra": "dev-s23ultra", "samsung-s23": "dev-s23",
    "samsung-s22": "dev-s22", "samsung-a54": "dev-a54",
    "samsung-z-flip-5": "dev-zflip5", "samsung-z-fold-5": "dev-zfold5",
    "ipad-pro": "dev-ipadpro", "ipad-air": "dev-ipadair",
    "ipad-10": "dev-ipad10", "ipad-mini": "dev-ipadmini",
    "pixel-8-pro": "dev-pixel8pro", "pixel-8": "dev-pixel8", "pixel-7": "dev-pixel7",
}
SERVICE_SLUG_MAP = {
    "screen-repair": "svc-screen", "battery-replacement": "svc-battery",
    "water-damage-repair": "svc-water", "charging-port-repair": "svc-charging",
    "camera-repair": "svc-camera", "speaker-mic-repair": "svc-speaker",
}
SERVICE_ID_TO_SLUG = {v: k for k, v in SERVICE_SLUG_MAP.items()}

# Must match backend/server.py LOCATION_DATA keys exactly.
LOCATION_SLUGS = ["adelaide", "kurralta-park", "glenelg"]

STATIC_PAGES = [
    ("/", "1.0", "weekly"),
    ("/services", "0.9", "weekly"),
    ("/devices", "0.9", "weekly"),
    ("/about", "0.7", "monthly"),
    ("/contact", "0.8", "monthly"),
    ("/blog", "0.8", "weekly"),
    ("/accessories", "0.7", "monthly"),
    ("/book", "0.8", "monthly"),
    ("/faq", "0.6", "monthly"),
    ("/careers", "0.5", "monthly"),
]


async def main():
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    if not mongo_url or not db_name:
        print("MONGO_URL / DB_NAME not set — check backend/.env", file=sys.stderr)
        sys.exit(1)

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    urls = [(f"{SITE_URL}{path}", priority, freq) for path, priority, freq in STATIC_PAGES]

    seo_url_count = 0
    for device_slug, device_id in DEVICE_SLUG_MAP.items():
        device_pricing = await db.pricing.find(
            {"device_id": device_id, "is_active": True}, {"_id": 0, "service_id": 1}
        ).to_list(100)

        for pp in device_pricing:
            service_slug = SERVICE_ID_TO_SLUG.get(pp["service_id"])
            if not service_slug:
                continue
            for location_slug in LOCATION_SLUGS:
                urls.append((
                    f"{SITE_URL}/{device_slug}-{service_slug}-{location_slug}",
                    "0.6", "monthly",
                ))
                seo_url_count += 1

    lastmod = date.today().isoformat()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, priority, changefreq in urls:
        lines.append('  <url>')
        lines.append(f'    <loc>{loc}</loc>')
        lines.append(f'    <lastmod>{lastmod}</lastmod>')
        lines.append(f'    <priority>{priority}</priority>')
        lines.append(f'    <changefreq>{changefreq}</changefreq>')
        lines.append('  </url>')
    lines.append('</urlset>')

    OUTPUT_PATH.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f"Wrote {len(urls)} URLs ({len(STATIC_PAGES)} static + {seo_url_count} SEO pages) to {OUTPUT_PATH}")

    client.close()


if __name__ == '__main__':
    asyncio.run(main())
