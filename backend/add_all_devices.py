"""
Add ALL missing devices to HiFone database.
Usage: python add_all_devices.py --url https://hifone-web.onrender.com
"""
import requests, sys

BASE_URL = sys.argv[2] if len(sys.argv) > 2 else "https://hifone-web.onrender.com"
API = f"{BASE_URL}/api"

ALL_DEVICES = [
    # ── Apple iPhone ──────────────────────────────────────────────
    {"name": "iPhone 17 Pro Max",    "brand": "Apple"},
    {"name": "iPhone 17 Pro",        "brand": "Apple"},
    {"name": "iPhone 17",            "brand": "Apple"},
    {"name": "iPhone 16 Pro Max",    "brand": "Apple"},
    {"name": "iPhone 16 Pro",        "brand": "Apple"},
    {"name": "iPhone 16 Plus",       "brand": "Apple"},
    {"name": "iPhone 16",            "brand": "Apple"},
    {"name": "iPhone 16e",           "brand": "Apple"},
    {"name": "iPhone 15 Pro Max",    "brand": "Apple"},
    {"name": "iPhone 15 Pro",        "brand": "Apple"},
    {"name": "iPhone 15 Plus",       "brand": "Apple"},
    {"name": "iPhone 15",            "brand": "Apple"},
    {"name": "iPhone 14 Pro Max",    "brand": "Apple"},
    {"name": "iPhone 14 Pro",        "brand": "Apple"},
    {"name": "iPhone 14 Plus",       "brand": "Apple"},
    {"name": "iPhone 14",            "brand": "Apple"},
    {"name": "iPhone 13 Pro Max",    "brand": "Apple"},
    {"name": "iPhone 13 Pro",        "brand": "Apple"},
    {"name": "iPhone 13",            "brand": "Apple"},
    {"name": "iPhone 13 Mini",       "brand": "Apple"},
    {"name": "iPhone 12 Pro Max",    "brand": "Apple"},
    {"name": "iPhone 12 Pro",        "brand": "Apple"},
    {"name": "iPhone 12",            "brand": "Apple"},
    {"name": "iPhone 12 Mini",       "brand": "Apple"},
    {"name": "iPhone 11 Pro Max",    "brand": "Apple"},
    {"name": "iPhone 11 Pro",        "brand": "Apple"},
    {"name": "iPhone 11",            "brand": "Apple"},
    {"name": "iPhone XS Max",        "brand": "Apple"},
    {"name": "iPhone XS",            "brand": "Apple"},
    {"name": "iPhone XR",            "brand": "Apple"},
    {"name": "iPhone X",             "brand": "Apple"},
    {"name": "iPhone SE (2022)",     "brand": "Apple"},
    {"name": "iPhone SE (2020)",     "brand": "Apple"},
    {"name": "iPhone SE",            "brand": "Apple"},
    {"name": "iPhone 8 Plus",        "brand": "Apple"},
    {"name": "iPhone 8",             "brand": "Apple"},
    {"name": "iPhone 7 Plus",        "brand": "Apple"},
    {"name": "iPhone 7",             "brand": "Apple"},
    {"name": "iPhone 6s Plus",       "brand": "Apple"},
    {"name": "iPhone 6s",            "brand": "Apple"},
    {"name": "iPhone 6 Plus",        "brand": "Apple"},
    {"name": "iPhone 6",             "brand": "Apple"},

    # ── Apple iPad ────────────────────────────────────────────────
    {"name": "iPad Pro 13\" (M4)",   "brand": "iPad"},
    {"name": "iPad Pro 11\" (M4)",   "brand": "iPad"},
    {"name": "iPad Air 13\" (M2)",   "brand": "iPad"},
    {"name": "iPad Air 11\" (M2)",   "brand": "iPad"},
    {"name": "iPad 10th Gen",        "brand": "iPad"},
    {"name": "iPad 9th Gen",         "brand": "iPad"},
    {"name": "iPad Mini 7th Gen",    "brand": "iPad"},
    {"name": "iPad Mini 6th Gen",    "brand": "iPad"},
    {"name": "iPad Pro 12.9\" (2022)","brand": "iPad"},
    {"name": "iPad Pro 11\" (2022)", "brand": "iPad"},

    # ── Samsung Galaxy S Series ───────────────────────────────────
    {"name": "Galaxy S25 Ultra",     "brand": "Samsung"},
    {"name": "Galaxy S25 Plus",      "brand": "Samsung"},
    {"name": "Galaxy S25",           "brand": "Samsung"},
    {"name": "Galaxy S24 Ultra",     "brand": "Samsung"},
    {"name": "Galaxy S24 Plus",      "brand": "Samsung"},
    {"name": "Galaxy S24",           "brand": "Samsung"},
    {"name": "Galaxy S23 Ultra",     "brand": "Samsung"},
    {"name": "Galaxy S23 Plus",      "brand": "Samsung"},
    {"name": "Galaxy S23",           "brand": "Samsung"},
    {"name": "Galaxy S22 Ultra",     "brand": "Samsung"},
    {"name": "Galaxy S22 Plus",      "brand": "Samsung"},
    {"name": "Galaxy S22",           "brand": "Samsung"},
    {"name": "Galaxy S21 Ultra",     "brand": "Samsung"},
    {"name": "Galaxy S21 Plus",      "brand": "Samsung"},
    {"name": "Galaxy S21",           "brand": "Samsung"},
    {"name": "Galaxy S20 Ultra",     "brand": "Samsung"},
    {"name": "Galaxy S20 Plus",      "brand": "Samsung"},
    {"name": "Galaxy S20",           "brand": "Samsung"},
    # Samsung A Series
    {"name": "Galaxy A56",           "brand": "Samsung"},
    {"name": "Galaxy A55",           "brand": "Samsung"},
    {"name": "Galaxy A54",           "brand": "Samsung"},
    {"name": "Galaxy A53",           "brand": "Samsung"},
    {"name": "Galaxy A52",           "brand": "Samsung"},
    {"name": "Galaxy A36",           "brand": "Samsung"},
    {"name": "Galaxy A35",           "brand": "Samsung"},
    {"name": "Galaxy A34",           "brand": "Samsung"},
    {"name": "Galaxy A33",           "brand": "Samsung"},
    {"name": "Galaxy A25",           "brand": "Samsung"},
    {"name": "Galaxy A15",           "brand": "Samsung"},
    # Samsung Z Fold/Flip
    {"name": "Galaxy Z Fold 6",      "brand": "Samsung"},
    {"name": "Galaxy Z Fold 5",      "brand": "Samsung"},
    {"name": "Galaxy Z Fold 4",      "brand": "Samsung"},
    {"name": "Galaxy Z Flip 6",      "brand": "Samsung"},
    {"name": "Galaxy Z Flip 5",      "brand": "Samsung"},
    {"name": "Galaxy Z Flip 4",      "brand": "Samsung"},
    # Samsung Note
    {"name": "Galaxy Note 20 Ultra", "brand": "Samsung"},
    {"name": "Galaxy Note 20",       "brand": "Samsung"},
    {"name": "Galaxy Note 10 Plus",  "brand": "Samsung"},
    {"name": "Galaxy Note 10",       "brand": "Samsung"},
    # Samsung Tab
    {"name": "Galaxy Tab S10 Ultra", "brand": "Samsung"},
    {"name": "Galaxy Tab S10 Plus",  "brand": "Samsung"},
    {"name": "Galaxy Tab S10",       "brand": "Samsung"},
    {"name": "Galaxy Tab S9 Ultra",  "brand": "Samsung"},
    {"name": "Galaxy Tab S9 Plus",   "brand": "Samsung"},
    {"name": "Galaxy Tab S9",        "brand": "Samsung"},
    {"name": "Galaxy Tab S8 Ultra",  "brand": "Samsung"},
    {"name": "Galaxy Tab S8 Plus",   "brand": "Samsung"},
    {"name": "Galaxy Tab S8",        "brand": "Samsung"},
    {"name": "Galaxy Tab A9 Plus",   "brand": "Samsung"},
    {"name": "Galaxy Tab A9",        "brand": "Samsung"},
    {"name": "Galaxy Tab A8",        "brand": "Samsung"},
    {"name": "Galaxy Tab A7",        "brand": "Samsung"},

    # ── Google Pixel ──────────────────────────────────────────────
    {"name": "Pixel 9 Pro XL",       "brand": "Google"},
    {"name": "Pixel 9 Pro",          "brand": "Google"},
    {"name": "Pixel 9",              "brand": "Google"},
    {"name": "Pixel 8 Pro",          "brand": "Google"},
    {"name": "Pixel 8",              "brand": "Google"},
    {"name": "Pixel 7 Pro",          "brand": "Google"},
    {"name": "Pixel 7",              "brand": "Google"},
    {"name": "Pixel 7a",             "brand": "Google"},
    {"name": "Pixel 6 Pro",          "brand": "Google"},
    {"name": "Pixel 6",              "brand": "Google"},
    {"name": "Pixel 6a",             "brand": "Google"},

    # ── Huawei ────────────────────────────────────────────────────
    {"name": "P60 Pro",              "brand": "Huawei"},
    {"name": "P50 Pro",              "brand": "Huawei"},
    {"name": "P40 Pro",              "brand": "Huawei"},
    {"name": "P40",                  "brand": "Huawei"},
    {"name": "P30 Pro",              "brand": "Huawei"},
    {"name": "P30",                  "brand": "Huawei"},
    {"name": "Mate 60 Pro",          "brand": "Huawei"},
    {"name": "Mate 50 Pro",          "brand": "Huawei"},
    {"name": "Mate 40 Pro",          "brand": "Huawei"},
    {"name": "Nova 12 Pro",          "brand": "Huawei"},
    {"name": "Nova 11 Pro",          "brand": "Huawei"},
    {"name": "Nova 10 Pro",          "brand": "Huawei"},

    # ── Oppo ──────────────────────────────────────────────────────
    {"name": "Find X8 Pro",          "brand": "Oppo"},
    {"name": "Find X7 Pro",          "brand": "Oppo"},
    {"name": "Find X6 Pro",          "brand": "Oppo"},
    {"name": "Reno 12 Pro",          "brand": "Oppo"},
    {"name": "Reno 11 Pro",          "brand": "Oppo"},
    {"name": "Reno 10 Pro",          "brand": "Oppo"},
    {"name": "Reno 8 Pro",           "brand": "Oppo"},
    {"name": "A98",                  "brand": "Oppo"},
    {"name": "A78",                  "brand": "Oppo"},
    {"name": "A58",                  "brand": "Oppo"},

    # ── Motorola ──────────────────────────────────────────────────
    {"name": "Edge 50 Pro",          "brand": "Motorola"},
    {"name": "Edge 50",              "brand": "Motorola"},
    {"name": "Edge 40 Pro",          "brand": "Motorola"},
    {"name": "Edge 40",              "brand": "Motorola"},
    {"name": "Razr 50 Ultra",        "brand": "Motorola"},
    {"name": "Razr 50",              "brand": "Motorola"},
    {"name": "Razr 40 Ultra",        "brand": "Motorola"},
    {"name": "Moto G85",             "brand": "Motorola"},
    {"name": "Moto G84",             "brand": "Motorola"},
    {"name": "Moto G73",             "brand": "Motorola"},
    {"name": "Moto G54",             "brand": "Motorola"},

    # ── Xiaomi / Redmi ────────────────────────────────────────────
    {"name": "14 Ultra",             "brand": "Xiaomi"},
    {"name": "14 Pro",               "brand": "Xiaomi"},
    {"name": "14",                   "brand": "Xiaomi"},
    {"name": "13 Ultra",             "brand": "Xiaomi"},
    {"name": "13 Pro",               "brand": "Xiaomi"},
    {"name": "13",                   "brand": "Xiaomi"},
    {"name": "Redmi Note 13 Pro+",   "brand": "Xiaomi"},
    {"name": "Redmi Note 13 Pro",    "brand": "Xiaomi"},
    {"name": "Redmi Note 13",        "brand": "Xiaomi"},
    {"name": "Redmi Note 12 Pro",    "brand": "Xiaomi"},
    {"name": "Redmi Note 12",        "brand": "Xiaomi"},
    {"name": "Redmi 13C",            "brand": "Xiaomi"},
    {"name": "Redmi 12",             "brand": "Xiaomi"},

    # ── OnePlus ───────────────────────────────────────────────────
    {"name": "12 Pro",               "brand": "OnePlus"},
    {"name": "12",                   "brand": "OnePlus"},
    {"name": "11 Pro",               "brand": "OnePlus"},
    {"name": "11",                   "brand": "OnePlus"},
    {"name": "Nord 4",               "brand": "OnePlus"},
    {"name": "Nord 3",               "brand": "OnePlus"},
    {"name": "Nord CE 4",            "brand": "OnePlus"},
    {"name": "Nord CE 3",            "brand": "OnePlus"},

    # ── Vivo ──────────────────────────────────────────────────────
    {"name": "X100 Pro",             "brand": "Vivo"},
    {"name": "X100",                 "brand": "Vivo"},
    {"name": "X90 Pro",              "brand": "Vivo"},
    {"name": "V30 Pro",              "brand": "Vivo"},
    {"name": "V30",                  "brand": "Vivo"},
    {"name": "V29 Pro",              "brand": "Vivo"},
    {"name": "Y100",                 "brand": "Vivo"},
    {"name": "Y78",                  "brand": "Vivo"},

    # ── Nokia ─────────────────────────────────────────────────────
    {"name": "G60",                  "brand": "Nokia"},
    {"name": "G42",                  "brand": "Nokia"},
    {"name": "G22",                  "brand": "Nokia"},
    {"name": "C32",                  "brand": "Nokia"},
    {"name": "C22",                  "brand": "Nokia"},
    {"name": "XR21",                 "brand": "Nokia"},
    {"name": "X30",                  "brand": "Nokia"},

    # ── Nothing ───────────────────────────────────────────────────
    {"name": "Phone (2a) Plus",      "brand": "Nothing"},
    {"name": "Phone (2a)",           "brand": "Nothing"},
    {"name": "Phone (2)",            "brand": "Nothing"},
    {"name": "Phone (1)",            "brand": "Nothing"},

    # ── Sony Xperia ───────────────────────────────────────────────
    {"name": "Xperia 1 VI",          "brand": "Sony"},
    {"name": "Xperia 1 V",           "brand": "Sony"},
    {"name": "Xperia 5 V",           "brand": "Sony"},
    {"name": "Xperia 10 VI",         "brand": "Sony"},
    {"name": "Xperia 10 V",          "brand": "Sony"},
]

def main():
    print(f"\n🚀 Adding ALL devices to {API}\n")

    # Login
    r = requests.post(f"{API}/auth/login",
                      json={"email": "admin@hifone.com.au", "password": "admin123"},
                      timeout=30)
    if r.status_code != 200:
        print(f"❌ Login failed: {r.text}")
        return
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Logged in\n")

    # Get existing
    existing = requests.get(f"{API}/devices", timeout=30).json()
    existing_names = {d["name"] for d in existing}
    print(f"📱 Existing devices: {len(existing_names)}\n")

    # Group by brand for display
    from collections import defaultdict
    by_brand = defaultdict(list)
    for d in ALL_DEVICES:
        by_brand[d["brand"]].append(d)

    total_added = 0
    total_skipped = 0

    for brand, devices in by_brand.items():
        added = 0
        skipped = 0
        for dev in devices:
            if dev["name"] in existing_names:
                skipped += 1
                continue
            r = requests.post(f"{API}/devices", json=dev, headers=headers, timeout=30)
            if r.status_code in (200, 201):
                added += 1
            else:
                print(f"  ❌ Failed: {dev['name']} — {r.text}")
        print(f"  {brand}: +{added} added, {skipped} skipped")
        total_added += added
        total_skipped += skipped

    print(f"\n✅ Done!")
    print(f"   Added:   {total_added}")
    print(f"   Skipped: {total_skipped} (already existed)")
    print(f"   Total:   {len(existing_names) + total_added} devices in DB")

if __name__ == "__main__":
    main()