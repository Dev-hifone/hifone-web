"""
Add missing devices to existing HiFone database.
Usage: python add_missing_devices.py --url https://hifone-web.onrender.com
"""
import requests, sys

BASE_URL = sys.argv[2] if len(sys.argv) > 2 else "https://hifone-web.onrender.com"
API = f"{BASE_URL}/api"

NEW_DEVICES = [
    # Apple — missing models
    {"name": "iPhone 17 Pro Max",  "brand": "Apple"},
    {"name": "iPhone 17 Pro",      "brand": "Apple"},
    {"name": "iPhone 17",          "brand": "Apple"},
    {"name": "iPhone 16 Pro Max",  "brand": "Apple"},
    {"name": "iPhone 16 Pro",      "brand": "Apple"},
    {"name": "iPhone 16",          "brand": "Apple"},
    {"name": "iPhone 15 Pro Max",  "brand": "Apple"},
    {"name": "iPhone 14 Pro Max",  "brand": "Apple"},
    {"name": "iPhone 13 Pro Max",  "brand": "Apple"},
    {"name": "iPhone 12 Pro Max",  "brand": "Apple"},
    {"name": "iPhone 12 Pro",      "brand": "Apple"},
    {"name": "iPhone 11 Pro Max",  "brand": "Apple"},
    {"name": "iPhone 11 Pro",      "brand": "Apple"},
    {"name": "iPhone 11",          "brand": "Apple"},
    {"name": "iPhone XS Max",      "brand": "Apple"},
    {"name": "iPhone XS",          "brand": "Apple"},
    {"name": "iPhone XR",          "brand": "Apple"},
    {"name": "iPhone X",           "brand": "Apple"},
    {"name": "iPhone 8 Plus",      "brand": "Apple"},
    {"name": "iPhone 8",           "brand": "Apple"},
    # Samsung — missing models
    {"name": "Galaxy S25 Ultra",   "brand": "Samsung"},
    {"name": "Galaxy S25",         "brand": "Samsung"},
    {"name": "Galaxy S24 Plus",    "brand": "Samsung"},
    {"name": "Galaxy S23 Plus",    "brand": "Samsung"},
    {"name": "Galaxy S21",         "brand": "Samsung"},
    {"name": "Galaxy S20",         "brand": "Samsung"},
    {"name": "Galaxy A55",         "brand": "Samsung"},
    {"name": "Galaxy A35",         "brand": "Samsung"},
    {"name": "Galaxy Z Flip 6",    "brand": "Samsung"},
    {"name": "Galaxy Z Fold 6",    "brand": "Samsung"},
    # Google — missing models
    {"name": "Pixel 9 Pro",        "brand": "Google"},
    {"name": "Pixel 9",            "brand": "Google"},
]

def main():
    print(f"🚀 Adding missing devices to {API}\n")

    # Login
    r = requests.post(f"{API}/auth/login", json={"email": "admin@hifone.com.au", "password": "admin123"})
    if r.status_code != 200:
        print(f"❌ Login failed: {r.text}")
        return
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Logged in\n")

    # Get existing devices
    existing = requests.get(f"{API}/devices").json()
    existing_names = {d["name"] for d in existing}
    print(f"📱 Existing devices: {len(existing_names)}")

    # Add missing
    added = 0
    skipped = 0
    for dev in NEW_DEVICES:
        if dev["name"] in existing_names:
            skipped += 1
            continue
        r = requests.post(f"{API}/devices", json=dev, headers=headers)
        if r.status_code in (200, 201):
            added += 1
            print(f"  ✅ Added: {dev['brand']} {dev['name']}")
        else:
            print(f"  ❌ Failed: {dev['name']} — {r.text}")

    print(f"\n✅ Done! Added: {added} | Skipped (already exist): {skipped}")
    print(f"📱 Total devices now: {len(existing_names) + added}")

if __name__ == "__main__":
    main()