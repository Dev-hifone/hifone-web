"""
fix_pricing_device_ids.py
─────────────────────────
Fixes the mismatch between pricing device_ids (short IDs like dev-iphone17promax)
and actual device UUIDs in the database.

Usage:
    python fix_pricing_device_ids.py --url https://hifone-web.onrender.com --password YOUR_ADMIN_PASSWORD

What it does:
  1. Logs in as admin to get a token
  2. Fetches all pricing records
  3. For each pricing record whose device_id is a known broken short ID,
     updates it to the correct UUID via PUT /api/pricing/{id}
"""

import requests
import sys
import time

# ── Config ─────────────────────────────────────────────────────────────────
BASE_URL = "https://hifone-web.onrender.com"
ADMIN_EMAIL = "admin@hifone.com.au"

for i, arg in enumerate(sys.argv):
    if arg == "--url" and i + 1 < len(sys.argv):
        BASE_URL = sys.argv[i + 1].rstrip("/")
    if arg == "--password" and i + 1 < len(sys.argv):
        ADMIN_PASSWORD = sys.argv[i + 1]

if "ADMIN_PASSWORD" not in dir():
    ADMIN_PASSWORD = input("Enter admin password: ")

API = f"{BASE_URL}/api"

# ── Mapping: broken short ID → correct device UUID ─────────────────────────
SHORT_ID_TO_UUID = {
    "dev-iphone17promax":  "fe0de558-f288-45ff-b7c3-f9a0ed23ab24",
    "dev-iphone17pro":     "b518b99a-566b-4d00-a18d-91722a443191",
    "dev-iphone17":        "91c90127-027f-4d52-a148-e2d16ba91048",
    "dev-iphone16promax":  "99038b82-0d18-476b-8ad9-b1ac5d7921cb",
    "dev-iphone16pro":     "4e3a37cf-f708-4810-ac6c-ea8fd20550b6",
    "dev-iphone16":        "83bd20c0-68d2-4be6-95aa-700868362e07",
    "dev-iphone15promax":  "33d53050-3b84-4057-9c39-df16e7bb631e",
    "dev-iphone14promax":  "90a69df5-29ae-4a30-9853-800e24fefbb2",
    "dev-iphone13promax":  "de054c48-ca1e-45f0-acc2-335f00bff070",
    "dev-iphone12promax":  "ee583fdb-f470-4ddd-a69e-05917583757b",
    "dev-iphone12pro":     "16593fd3-65cb-4772-8356-cb9909e0422d",
    "dev-iphone11promax":  "5f8bfd49-73f9-4bde-92a9-0b54b17366f6",
    "dev-iphone11pro":     "9b4b86f4-dec4-492b-b25e-b3bf0b1800a4",
    "dev-iphone11":        "0d6cdcb1-d65a-4f6f-a467-d60c6ee56929",
    "dev-iphonexsmax":     "34c67b88-805d-4e0a-86eb-0b69059da280",
    "dev-iphonexs":        "cbf03506-46c9-4209-8b64-145f67acd689",
    "dev-iphonexr":        "db5f510d-e064-4ca5-8222-7c06de7f01b2",
    "dev-iphonex":         "8e73d2ba-3b11-4ec0-909e-e349f06609ad",
    "dev-iphone8plus":     "0504727c-a6cf-40bc-b378-739c829d7add",
    "dev-iphone8":         "e95db531-ef0a-480e-8a6e-7ca711fc5e56",
    "dev-iphone7plus":     "0c7baa25-3e4e-4160-8a53-d61df6a77f3c",
    "dev-iphone7":         "8a3e58cb-1381-44eb-9b3f-655a7e0bbb77",
    "dev-iphone6splus":    "5153dc15-3766-477f-9d8d-f52a2adf0fee",
    "dev-iphone6s":        "29d97342-a765-4523-932f-e50782b2a770",
    "dev-iphone6plus":     "4efe1f9d-b21e-4351-a140-18567d6efd4a",
    "dev-iphone6":         "4a8ed30a-e912-475e-ae82-59a4f9bdacac",
    "dev-s25ultra":        "6007bd31-26c7-47b7-9af5-dfba387341a8",
    "dev-s25":             "444e9b3b-8ac8-4320-9d82-fad95f498584",
    "dev-s22ultra":        "48a56127-e8b7-426e-a6e6-1bb8cdf52ad0",
    "dev-s21":             "3a45f8d3-6796-4d01-b0a1-514c56027ebe",
    "dev-s20":             "f9bc3ce1-3af2-45b4-94aa-eb52313d1562",
    "dev-a55":             "edd3bca8-68bc-4c80-8d25-cda1df229432",
    "dev-a53":             "f393e3bd-fd8d-48fe-9078-bacb755fb1c9",
    "dev-a52":             "a96403b8-8737-4364-b988-17953916a66a",
    "dev-a35":             "bc7a8cfb-66ac-48d4-987e-7894ebd8a230",
    "dev-a34":             "65cee20f-8c9d-4509-9618-1cf96bea032e",
    "dev-zflip6":          "2e7766d6-57f8-48fd-ae0c-5ca462736207",
    "dev-zfold6":          "2890ad32-59ff-4b69-9aa4-8f7cc25766f2",
    "dev-note20ultra":     "d8c3455f-6037-41c3-ab67-76058fc4f402",
    "dev-note20":          "a68efce9-a832-4982-ab38-a3b490d62237",
    "dev-ipadpro13":       "adbe19aa-8f6a-4068-b2ab-0cea27a33e99",
    "dev-ipadpro11":       "4df47461-474d-4fc7-8453-1e5e931bbd5f",
    "dev-ipadair6":        "da913c1c-547f-43fe-978e-bf1e02110a0e",
    "dev-ipadair5":        "a9d30b69-a150-4f32-a771-14b3e26ea945",
    "dev-ipad9":           "78b86861-b9b8-43e5-84d2-41913ad5f67e",
    "dev-ipadmini7":       "22a58649-3dea-413c-857d-2246f9a266aa",
    "dev-ipadmini6":       "3fa5ffe0-9c7c-4534-86b0-99ce7432666f",
    "dev-pixel9pro":       "b8cb5bbd-fa66-45b1-9854-026aae75415c",
    "dev-pixel9":          "67e98a02-c6c7-4dfc-9dd5-4166af5714f9",
    "dev-pixel7pro":       "3c2ced90-1b11-4611-baee-d3044421c31d",
}

# ── Step 1: Login ───────────────────────────────────────────────────────────
print(f"🔐 Logging in as {ADMIN_EMAIL}...")
r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
if r.status_code != 200:
    print(f"❌ Login failed: {r.status_code} {r.text}")
    sys.exit(1)
token = r.json()["token"]
headers = {"Authorization": f"Bearer {token}"}
print("   ✅ Logged in\n")

# ── Step 2: Fetch all pricing ───────────────────────────────────────────────
print("📦 Fetching all pricing records...")
r = requests.get(f"{API}/pricing", timeout=30)
all_pricing = r.json()
print(f"   Found {len(all_pricing)} pricing records\n")

# ── Step 3: Fix mismatched records ─────────────────────────────────────────
to_fix = [p for p in all_pricing if p["device_id"] in SHORT_ID_TO_UUID]
print(f"🔧 Found {len(to_fix)} pricing records with broken device_ids\n")

fixed = 0
errors = 0

for p in to_fix:
    old_id = p["device_id"]
    new_id = SHORT_ID_TO_UUID[old_id]
    payload = {
        "device_id": new_id,
        "service_id": p["service_id"],
        "price": p["price"],
        "original_price": p.get("original_price"),
        "repair_time": p["repair_time"],
        "warranty": p["warranty"],
    }
    r = requests.put(f"{API}/pricing/{p['id']}", json=payload, headers=headers, timeout=15)
    if r.status_code == 200:
        fixed += 1
        print(f"   ✅ {old_id}/{p['service_id']}  →  {new_id[:8]}...")
    else:
        errors += 1
        print(f"   ❌ FAILED {p['id']}: {r.status_code} {r.text}")
    time.sleep(0.05)  # be gentle with Render free tier

print(f"\n{'='*50}")
print(f"✅ Fixed:  {fixed}")
print(f"❌ Errors: {errors}")
print(f"{'='*50}")
print("\nBookings should now work. Test at:")
print(f"  {BASE_URL}/api/pricing/99038b82-0d18-476b-8ad9-b1ac5d7921cb/svc-screen")
print("  (Should return iPhone 16 Pro Max screen price: $379)")