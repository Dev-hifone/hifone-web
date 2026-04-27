"""
Add Laptop and Watch models to HiFone database.
Usage: python add_laptops_watches.py --url https://hifone-web.onrender.com
"""
import requests, sys

BASE_URL = sys.argv[2] if len(sys.argv) > 2 else "https://hifone-web.onrender.com"
API = f"{BASE_URL}/api"

DEVICES = [
    # ── MacBook ───────────────────────────────────────────────────
    {"name": "MacBook Air 15\" (M3)", "brand": "MacBook"},
    {"name": "MacBook Air 13\" (M3)", "brand": "MacBook"},
    {"name": "MacBook Air 13\" (M2)", "brand": "MacBook"},
    {"name": "MacBook Pro 16\" (M4)", "brand": "MacBook"},
    {"name": "MacBook Pro 14\" (M4)", "brand": "MacBook"},
    {"name": "MacBook Pro 16\" (M3)", "brand": "MacBook"},
    {"name": "MacBook Pro 14\" (M3)", "brand": "MacBook"},
    {"name": "MacBook Pro 13\" (M2)", "brand": "MacBook"},
    {"name": "MacBook Pro 13\" (M1)", "brand": "MacBook"},
    {"name": "MacBook Air 13\" (M1)", "brand": "MacBook"},
    # ── Dell ──────────────────────────────────────────────────────
    {"name": "XPS 15",               "brand": "Dell"},
    {"name": "XPS 13",               "brand": "Dell"},
    {"name": "Inspiron 15",          "brand": "Dell"},
    {"name": "Inspiron 14",          "brand": "Dell"},
    {"name": "Latitude 14",          "brand": "Dell"},
    {"name": "Latitude 13",          "brand": "Dell"},
    {"name": "Vostro 15",            "brand": "Dell"},
    # ── HP ────────────────────────────────────────────────────────
    {"name": "Spectre x360 14",      "brand": "HP"},
    {"name": "Spectre x360 13",      "brand": "HP"},
    {"name": "Envy 15",              "brand": "HP"},
    {"name": "Envy 13",              "brand": "HP"},
    {"name": "Pavilion 15",          "brand": "HP"},
    {"name": "Pavilion 14",          "brand": "HP"},
    {"name": "EliteBook 840",        "brand": "HP"},
    {"name": "ProBook 450",          "brand": "HP"},
    # ── Lenovo ────────────────────────────────────────────────────
    {"name": "ThinkPad X1 Carbon",   "brand": "Lenovo"},
    {"name": "ThinkPad E15",         "brand": "Lenovo"},
    {"name": "ThinkPad E14",         "brand": "Lenovo"},
    {"name": "IdeaPad 5 Pro",        "brand": "Lenovo"},
    {"name": "IdeaPad Slim 5",       "brand": "Lenovo"},
    {"name": "Yoga 9i",              "brand": "Lenovo"},
    {"name": "Yoga 7i",              "brand": "Lenovo"},
    {"name": "LOQ 15",               "brand": "Lenovo"},
    # ── Asus ──────────────────────────────────────────────────────
    {"name": "ZenBook 14",           "brand": "Asus"},
    {"name": "ZenBook 13",           "brand": "Asus"},
    {"name": "VivoBook 15",          "brand": "Asus"},
    {"name": "VivoBook 14",          "brand": "Asus"},
    {"name": "ROG Zephyrus G14",     "brand": "Asus"},
    {"name": "ROG Strix G15",        "brand": "Asus"},
    {"name": "ExpertBook B1",        "brand": "Asus"},
    # ── Apple Watch ───────────────────────────────────────────────
    {"name": "Apple Watch Series 10",  "brand": "Apple Watch"},
    {"name": "Apple Watch Series 9",   "brand": "Apple Watch"},
    {"name": "Apple Watch Series 8",   "brand": "Apple Watch"},
    {"name": "Apple Watch Series 7",   "brand": "Apple Watch"},
    {"name": "Apple Watch Ultra 2",    "brand": "Apple Watch"},
    {"name": "Apple Watch Ultra",      "brand": "Apple Watch"},
    {"name": "Apple Watch SE (2024)",  "brand": "Apple Watch"},
    {"name": "Apple Watch SE (2022)",  "brand": "Apple Watch"},
    # ── Samsung Watch ─────────────────────────────────────────────
    {"name": "Galaxy Watch 7",         "brand": "Samsung Watch"},
    {"name": "Galaxy Watch 6",         "brand": "Samsung Watch"},
    {"name": "Galaxy Watch 6 Classic", "brand": "Samsung Watch"},
    {"name": "Galaxy Watch 5 Pro",     "brand": "Samsung Watch"},
    {"name": "Galaxy Watch 5",         "brand": "Samsung Watch"},
    {"name": "Galaxy Watch 4",         "brand": "Samsung Watch"},
    {"name": "Galaxy Watch Ultra",     "brand": "Samsung Watch"},
    # ── Fitbit ────────────────────────────────────────────────────
    {"name": "Sense 2",               "brand": "Fitbit"},
    {"name": "Versa 4",               "brand": "Fitbit"},
    {"name": "Charge 6",              "brand": "Fitbit"},
    {"name": "Inspire 3",             "brand": "Fitbit"},
    # ── Garmin ────────────────────────────────────────────────────
    {"name": "Forerunner 265",        "brand": "Garmin"},
    {"name": "Forerunner 165",        "brand": "Garmin"},
    {"name": "Venu 3",                "brand": "Garmin"},
    {"name": "Venu 2 Plus",           "brand": "Garmin"},
    {"name": "Vivoactive 5",          "brand": "Garmin"},
]

def main():
    print(f"\n🚀 Adding Laptops & Watches to {API}\n")

    r = requests.post(f"{API}/auth/login",
                      json={"email": "admin@hifone.com.au", "password": "admin123"},
                      timeout=30)
    if r.status_code != 200:
        print(f"❌ Login failed: {r.text}"); return

    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Logged in\n")

    existing_names = {d["name"] for d in requests.get(f"{API}/devices", timeout=30).json()}
    print(f"📱 Existing: {len(existing_names)} devices\n")

    from collections import defaultdict
    by_brand = defaultdict(list)
    for d in DEVICES:
        by_brand[d["brand"]].append(d)

    total_added = 0
    for brand, devs in by_brand.items():
        added = 0
        for dev in devs:
            if dev["name"] in existing_names:
                continue
            r = requests.post(f"{API}/devices", json=dev, headers=headers, timeout=30)
            if r.status_code in (200, 201):
                added += 1
        print(f"  {brand}: +{added} added")
        total_added += added

    print(f"\n✅ Total added: {total_added}")
    print(f"   Total in DB: {len(existing_names) + total_added}")

if __name__ == "__main__":
    main()