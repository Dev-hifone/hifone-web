"""
add_drone_and_other.py
─────────────────────
Run once to add:
1. Drone brand with common drone models
2. "Other" brand with "Any Other Device" for truly unknown devices

Usage:
    python add_drone_and_other.py --url https://hifone-web.onrender.com
"""
import requests
import sys

BASE_URL = "https://hifone-web.onrender.com"
for i, arg in enumerate(sys.argv):
    if arg == "--url" and i + 1 < len(sys.argv):
        BASE_URL = sys.argv[i + 1].rstrip("/")

API = f"{BASE_URL}/api"

# Login
ADMIN_EMAIL = "admin@hifone.com.au"
ADMIN_PASSWORD = input("Enter admin password: ")

r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
if r.status_code != 200:
    print(f"❌ Login failed: {r.text}")
    sys.exit(1)
token = r.json()["token"]
headers = {"Authorization": f"Bearer {token}"}
print("✅ Logged in\n")

# Devices to add
new_devices = [
    # Drone brand
    {"name": "DJI Mini 4 Pro",        "brand": "Drone"},
    {"name": "DJI Mini 3 Pro",        "brand": "Drone"},
    {"name": "DJI Mini 3",            "brand": "Drone"},
    {"name": "DJI Mini 2 SE",         "brand": "Drone"},
    {"name": "DJI Air 3",             "brand": "Drone"},
    {"name": "DJI Air 2S",            "brand": "Drone"},
    {"name": "DJI Mavic 3 Pro",       "brand": "Drone"},
    {"name": "DJI Neo",               "brand": "Drone"},
    {"name": "DJI Avata 2",           "brand": "Drone"},
    {"name": "Autel EVO Lite+",       "brand": "Drone"},
    {"name": "Parrot Anafi",          "brand": "Drone"},
    {"name": "Any Other Drone Model", "brand": "Drone"},

    # Other brand — catch-all for Chinese brands, old models, niche devices
    {"name": "Chinese Brand Phone",   "brand": "Other"},
    {"name": "Old / Discontinued Model", "brand": "Other"},
    {"name": "Any Other Device",      "brand": "Other"},
]

added = 0
skipped = 0

# Get existing devices to avoid duplicates
existing = requests.get(f"{API}/devices").json()
existing_names = {(d["name"].lower(), d["brand"].lower()) for d in existing}

for dev in new_devices:
    key = (dev["name"].lower(), dev["brand"].lower())
    if key in existing_names:
        print(f"  ⏭  Already exists: {dev['brand']} — {dev['name']}")
        skipped += 1
        continue

    payload = {"name": dev["name"], "brand": dev["brand"], "is_active": True}
    r = requests.post(f"{API}/devices", json=payload, headers=headers)
    if r.status_code == 200:
        print(f"  ✅ Added: {dev['brand']} — {dev['name']}")
        added += 1
    else:
        print(f"  ❌ Failed: {dev['name']} — {r.status_code} {r.text}")

print(f"\n{'='*40}")
print(f"✅ Added:   {added}")
print(f"⏭  Skipped: {skipped}")
print(f"{'='*40}")
print("\nDone! Drone and Other brands now visible in booking form.")