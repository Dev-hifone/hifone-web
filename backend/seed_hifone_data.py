"""
HiFone Complete Data Seed Script
Scraped from hifone.com.au — run this once to populate your MongoDB.

Usage:
  pip install requests
  python seed_hifone_data.py --url https://hifone-web.onrender.com
"""

import requests
import sys
import json

BASE_URL = sys.argv[2] if len(sys.argv) > 2 else "https://hifone-web.onrender.com"
API = f"{BASE_URL}/api"

def post(endpoint, data):
    try:
        r = requests.post(f"{API}{endpoint}", json=data, timeout=30)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"  ⚠️  {endpoint} failed: {e}")
        return None

def check_health():
    try:
        r = requests.get(f"{API}/health", timeout=30)
        return r.status_code == 200
    except:
        return False

# ─── SERVICES ────────────────────────────────────────────────────────────────
SERVICES = [
    {
        "id": "svc-screen",
        "name": "Screen Repair",
        "slug": "screen-repair",
        "description": "Professional screen replacement for cracked, shattered, or unresponsive displays. We use premium quality OLED/LCD screens with precise colour calibration and touch sensitivity restoration.",
        "short_description": "Fix cracked or damaged screens",
        "icon": "Smartphone",
        "is_active": True
    },
    {
        "id": "svc-battery",
        "name": "Battery Replacement",
        "slug": "battery-replacement",
        "description": "Restore your device's battery life with genuine replacement batteries. Say goodbye to frequent charging and unexpected shutdowns. All batteries come with 6-month warranty.",
        "short_description": "Restore your battery life",
        "icon": "Battery",
        "is_active": True
    },
    {
        "id": "svc-water",
        "name": "Water Damage Repair",
        "slug": "water-damage-repair",
        "description": "Expert water damage recovery using advanced ultrasonic cleaning technology. Quick response is critical — bring your device in immediately for the best chance of full recovery.",
        "short_description": "Recover from water accidents",
        "icon": "Droplets",
        "is_active": True
    },
    {
        "id": "svc-charging",
        "name": "Charging Port Repair",
        "slug": "charging-port-repair",
        "description": "Fix charging issues with precision port repair or replacement. Solve slow charging, loose connections, and debris buildup. Fast turnaround — usually done in under 45 minutes.",
        "short_description": "Fix charging issues",
        "icon": "PlugZap",
        "is_active": True
    },
    {
        "id": "svc-camera",
        "name": "Camera Repair",
        "slug": "camera-repair",
        "description": "Restore your camera quality with professional lens and sensor replacement. Fix blurry photos, cracked camera glass, focus issues, and front or rear camera failures.",
        "short_description": "Restore camera quality",
        "icon": "Camera",
        "is_active": True
    },
    {
        "id": "svc-speaker",
        "name": "Speaker & Mic Repair",
        "slug": "speaker-mic-repair",
        "description": "Fix audio issues including muffled sound, no audio output, or microphone problems. Crystal clear calls and media playback restored. Works on all major phone brands.",
        "short_description": "Fix audio issues",
        "icon": "Volume2",
        "is_active": True
    },
    {
        "id": "svc-backglass",
        "name": "Back Glass Replacement",
        "slug": "back-glass-replacement",
        "description": "Replace cracked or shattered back glass on iPhone, Samsung and other devices. We use premium quality glass that matches your device colour perfectly.",
        "short_description": "Replace cracked back glass",
        "icon": "Smartphone",
        "is_active": True
    },
]

# ─── DEVICES ─────────────────────────────────────────────────────────────────
DEVICES = [
    # ── Apple iPhones ──────────────────────────────────────────────
    {"id": "dev-iphone17promax", "name": "iPhone 17 Pro Max", "brand": "Apple", "is_active": True},
    {"id": "dev-iphone17pro",    "name": "iPhone 17 Pro",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone17",       "name": "iPhone 17",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphone16promax", "name": "iPhone 16 Pro Max", "brand": "Apple", "is_active": True},
    {"id": "dev-iphone16pro",    "name": "iPhone 16 Pro",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone16",       "name": "iPhone 16",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphone15promax", "name": "iPhone 15 Pro Max", "brand": "Apple", "is_active": True},
    {"id": "dev-iphone15pro",    "name": "iPhone 15 Pro",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone15",       "name": "iPhone 15",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphone14promax", "name": "iPhone 14 Pro Max", "brand": "Apple", "is_active": True},
    {"id": "dev-iphone14pro",    "name": "iPhone 14 Pro",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone14",       "name": "iPhone 14",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphone13promax", "name": "iPhone 13 Pro Max", "brand": "Apple", "is_active": True},
    {"id": "dev-iphone13pro",    "name": "iPhone 13 Pro",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone13",       "name": "iPhone 13",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphone12promax", "name": "iPhone 12 Pro Max", "brand": "Apple", "is_active": True},
    {"id": "dev-iphone12pro",    "name": "iPhone 12 Pro",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone12",       "name": "iPhone 12",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphone11promax", "name": "iPhone 11 Pro Max", "brand": "Apple", "is_active": True},
    {"id": "dev-iphone11pro",    "name": "iPhone 11 Pro",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone11",       "name": "iPhone 11",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphonexsmax",    "name": "iPhone XS Max",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphonexs",       "name": "iPhone XS",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphonexr",       "name": "iPhone XR",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphonex",        "name": "iPhone X",           "brand": "Apple", "is_active": True},
    {"id": "dev-iphone8plus",    "name": "iPhone 8 Plus",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone8",        "name": "iPhone 8",           "brand": "Apple", "is_active": True},
    {"id": "dev-iphone7plus",    "name": "iPhone 7 Plus",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone7",        "name": "iPhone 7",           "brand": "Apple", "is_active": True},
    {"id": "dev-iphone6splus",   "name": "iPhone 6s Plus",    "brand": "Apple", "is_active": True},
    {"id": "dev-iphone6s",       "name": "iPhone 6s",          "brand": "Apple", "is_active": True},
    {"id": "dev-iphone6plus",    "name": "iPhone 6 Plus",     "brand": "Apple", "is_active": True},
    {"id": "dev-iphone6",        "name": "iPhone 6",           "brand": "Apple", "is_active": True},
    {"id": "dev-iphonese",       "name": "iPhone SE",          "brand": "Apple", "is_active": True},
    # ── Samsung ───────────────────────────────────────────────────
    {"id": "dev-s25ultra",  "name": "Galaxy S25 Ultra",  "brand": "Samsung", "is_active": True},
    {"id": "dev-s25",       "name": "Galaxy S25",         "brand": "Samsung", "is_active": True},
    {"id": "dev-s24ultra",  "name": "Galaxy S24 Ultra",  "brand": "Samsung", "is_active": True},
    {"id": "dev-s24",       "name": "Galaxy S24",         "brand": "Samsung", "is_active": True},
    {"id": "dev-s23ultra",  "name": "Galaxy S23 Ultra",  "brand": "Samsung", "is_active": True},
    {"id": "dev-s23",       "name": "Galaxy S23",         "brand": "Samsung", "is_active": True},
    {"id": "dev-s22ultra",  "name": "Galaxy S22 Ultra",  "brand": "Samsung", "is_active": True},
    {"id": "dev-s22",       "name": "Galaxy S22",         "brand": "Samsung", "is_active": True},
    {"id": "dev-s21",       "name": "Galaxy S21",         "brand": "Samsung", "is_active": True},
    {"id": "dev-s20",       "name": "Galaxy S20",         "brand": "Samsung", "is_active": True},
    {"id": "dev-a55",       "name": "Galaxy A55",         "brand": "Samsung", "is_active": True},
    {"id": "dev-a54",       "name": "Galaxy A54",         "brand": "Samsung", "is_active": True},
    {"id": "dev-a53",       "name": "Galaxy A53",         "brand": "Samsung", "is_active": True},
    {"id": "dev-a52",       "name": "Galaxy A52",         "brand": "Samsung", "is_active": True},
    {"id": "dev-a35",       "name": "Galaxy A35",         "brand": "Samsung", "is_active": True},
    {"id": "dev-a34",       "name": "Galaxy A34",         "brand": "Samsung", "is_active": True},
    {"id": "dev-zflip6",    "name": "Galaxy Z Flip 6",   "brand": "Samsung", "is_active": True},
    {"id": "dev-zflip5",    "name": "Galaxy Z Flip 5",   "brand": "Samsung", "is_active": True},
    {"id": "dev-zfold6",    "name": "Galaxy Z Fold 6",   "brand": "Samsung", "is_active": True},
    {"id": "dev-zfold5",    "name": "Galaxy Z Fold 5",   "brand": "Samsung", "is_active": True},
    {"id": "dev-note20ultra","name": "Galaxy Note 20 Ultra","brand": "Samsung", "is_active": True},
    {"id": "dev-note20",    "name": "Galaxy Note 20",    "brand": "Samsung", "is_active": True},
    # ── iPad ─────────────────────────────────────────────────────
    {"id": "dev-ipadpro13",  "name": "iPad Pro 13\"",    "brand": "iPad", "is_active": True},
    {"id": "dev-ipadpro11",  "name": "iPad Pro 11\"",    "brand": "iPad", "is_active": True},
    {"id": "dev-ipadair6",   "name": "iPad Air 6th Gen", "brand": "iPad", "is_active": True},
    {"id": "dev-ipadair5",   "name": "iPad Air 5th Gen", "brand": "iPad", "is_active": True},
    {"id": "dev-ipad10",     "name": "iPad 10th Gen",    "brand": "iPad", "is_active": True},
    {"id": "dev-ipad9",      "name": "iPad 9th Gen",     "brand": "iPad", "is_active": True},
    {"id": "dev-ipadmini7",  "name": "iPad Mini 7th Gen","brand": "iPad", "is_active": True},
    {"id": "dev-ipadmini6",  "name": "iPad Mini 6th Gen","brand": "iPad", "is_active": True},
    # ── Google Pixel ─────────────────────────────────────────────
    {"id": "dev-pixel9pro",  "name": "Pixel 9 Pro",   "brand": "Google", "is_active": True},
    {"id": "dev-pixel9",     "name": "Pixel 9",        "brand": "Google", "is_active": True},
    {"id": "dev-pixel8pro",  "name": "Pixel 8 Pro",   "brand": "Google", "is_active": True},
    {"id": "dev-pixel8",     "name": "Pixel 8",        "brand": "Google", "is_active": True},
    {"id": "dev-pixel7pro",  "name": "Pixel 7 Pro",   "brand": "Google", "is_active": True},
    {"id": "dev-pixel7",     "name": "Pixel 7",        "brand": "Google", "is_active": True},
]

# ─── PRICING BUILDER ─────────────────────────────────────────────────────────
def build_pricing():
    pricing = []

    def p(device_id, svc_id, price, orig=None, time="30-60 min", warranty="6 months"):
        return {
            "id": f"price-{device_id}-{svc_id}",
            "device_id": device_id,
            "service_id": svc_id,
            "price": price,
            "original_price": orig,
            "repair_time": time,
            "warranty": warranty,
            "is_active": True
        }

    # ── Apple pricing ──────────────────────────────────────────────
    apple_pricing = {
        # id prefix: [screen, battery, charging, camera, speaker, backglass, water]
        "dev-iphone17promax": [449,  99,  89, 159,  79, 149, 199],
        "dev-iphone17pro":    [429,  99,  89, 149,  79, 139, 189],
        "dev-iphone17":       [359,  89,  79, 129,  69, 119, 169],
        "dev-iphone16promax": [399,  99,  89, 149,  79, 139, 189],
        "dev-iphone16pro":    [379,  99,  89, 139,  79, 129, 179],
        "dev-iphone16":       [319,  89,  79, 119,  69, 109, 159],
        "dev-iphone15promax": [349,  89,  79, 139,  69, 129, 169],
        "dev-iphone15pro":    [329,  89,  79, 129,  69, 119, 159],
        "dev-iphone15":       [299,  79,  69, 109,  59,  99, 149],
        "dev-iphone14promax": [319,  89,  79, 129,  69, 119, 159],
        "dev-iphone14pro":    [299,  89,  79, 119,  69, 109, 149],
        "dev-iphone14":       [269,  79,  69,  99,  59,  89, 139],
        "dev-iphone13promax": [279,  79,  69, 119,  59, 109, 139],
        "dev-iphone13pro":    [259,  79,  69, 109,  59,  99, 129],
        "dev-iphone13":       [239,  69,  59,  89,  49,  79, 119],
        "dev-iphone12promax": [249,  79,  69, 109,  59,  99, 129],
        "dev-iphone12pro":    [229,  79,  69,  99,  59,  89, 119],
        "dev-iphone12":       [209,  69,  59,  79,  49,  69, 109],
        "dev-iphone11promax": [219,  69,  59,  99,  49,  89, 109],
        "dev-iphone11pro":    [199,  69,  59,  89,  49,  79,  99],
        "dev-iphone11":       [179,  59,  55,  79,  45,  None, 89],
        "dev-iphonexsmax":    [189,  69,  59,  89,  49,  None, 99],
        "dev-iphonexs":       [179,  69,  59,  79,  49,  None, 89],
        "dev-iphonexr":       [169,  59,  55,  79,  45,  None, 89],
        "dev-iphonex":        [159,  59,  55,  79,  45,  None, 79],
        "dev-iphone8plus":    [129,  59,  49,  69,  39,  None, 69],
        "dev-iphone8":        [109,  59,  49,  59,  39,  None, 69],
        "dev-iphone7plus":    [109,  55,  45,  59,  35,  None, 59],
        "dev-iphone7":        [ 89,  55,  45,  55,  35,  None, 59],
        "dev-iphone6splus":   [ 89,  49,  45,  None, 35, None, 59],
        "dev-iphone6s":       [ 79,  49,  45,  None, 35, None, 59],
        "dev-iphone6plus":    [ 79,  49,  45,  None, 35, None, 59],
        "dev-iphone6":        [ 69,  49,  45,  None, 35, None, 59],
        "dev-iphonese":       [ 79,  49,  45,  None, 35, None, 59],
    }
    svc_ids = ["svc-screen","svc-battery","svc-charging","svc-camera","svc-speaker","svc-backglass","svc-water"]
    times   = ["30-45 min","20-30 min","30-45 min","45-60 min","30-45 min","45-60 min","24-48 hrs"]

    for dev_id, prices in apple_pricing.items():
        for i, svc_id in enumerate(svc_ids):
            if prices[i] is not None:
                pricing.append(p(dev_id, svc_id, float(prices[i]), time=times[i]))

    # ── Samsung pricing ────────────────────────────────────────────
    samsung_pricing = {
        "dev-s25ultra":    [449,  89,  79, 149,  69, 139, 169],
        "dev-s25":         [349,  79,  69, 119,  59, 109, 149],
        "dev-s24ultra":    [399,  89,  79, 139,  69, 129, 159],
        "dev-s24":         [299,  79,  69, 109,  59,  99, 139],
        "dev-s23ultra":    [369,  89,  79, 129,  69, 119, 149],
        "dev-s23":         [279,  79,  69,  99,  59,  89, 129],
        "dev-s22ultra":    [349,  79,  69, 119,  59, 109, 139],
        "dev-s22":         [249,  69,  59,  89,  49,  79, 119],
        "dev-s21":         [219,  69,  59,  79,  49,  None, 99],
        "dev-s20":         [199,  69,  59,  79,  49,  None, 89],
        "dev-a55":         [199,  69,  59,  79,  49,  None, 99],
        "dev-a54":         [179,  65,  55,  79,  45,  None, 89],
        "dev-a53":         [159,  65,  55,  69,  45,  None, 89],
        "dev-a52":         [149,  59,  49,  69,  45,  None, 79],
        "dev-a35":         [149,  59,  49,  69,  45,  None, 79],
        "dev-a34":         [139,  59,  49,  69,  45,  None, 79],
        "dev-zflip6":      [399,  89,  79, 129,  69,  None, 149],
        "dev-zflip5":      [349,  89,  79, 119,  69,  None, 139],
        "dev-zfold6":      [499,  99,  89, 159,  79,  None, 179],
        "dev-zfold5":      [449,  99,  89, 149,  79,  None, 169],
        "dev-note20ultra": [329,  79,  69, 119,  59,  None, 139],
        "dev-note20":      [279,  79,  69,  99,  59,  None, 119],
    }
    for dev_id, prices in samsung_pricing.items():
        for i, svc_id in enumerate(svc_ids):
            if prices[i] is not None:
                pricing.append(p(dev_id, svc_id, float(prices[i]), time=times[i]))

    # ── iPad pricing ───────────────────────────────────────────────
    ipad_pricing = {
        "dev-ipadpro13":  [499, 149, 119, None, None, None, 179],
        "dev-ipadpro11":  [399, 129, 109, None, None, None, 159],
        "dev-ipadair6":   [329, 119,  99, None, None, None, 139],
        "dev-ipadair5":   [299, 109,  99, None, None, None, 129],
        "dev-ipad10":     [249,  99,  89, None, None, None, 119],
        "dev-ipad9":      [199,  89,  79, None, None, None,  99],
        "dev-ipadmini7":  [279,  99,  89, None, None, None, 119],
        "dev-ipadmini6":  [249,  89,  79, None, None, None, 109],
    }
    ipad_svc = ["svc-screen","svc-battery","svc-charging","svc-camera","svc-speaker","svc-backglass","svc-water"]
    for dev_id, prices in ipad_pricing.items():
        for i, svc_id in enumerate(ipad_svc):
            if prices[i] is not None:
                pricing.append(p(dev_id, svc_id, float(prices[i]), time="45-90 min" if svc_id == "svc-screen" else "30-45 min"))

    # ── Google Pixel pricing ───────────────────────────────────────
    pixel_pricing = {
        "dev-pixel9pro": [329, 89, 79, 119, 59, None, 139],
        "dev-pixel9":    [279, 79, 69,  99, 59, None, 119],
        "dev-pixel8pro": [299, 89, 79, 109, 59, None, 129],
        "dev-pixel8":    [249, 79, 69,  89, 49, None, 109],
        "dev-pixel7pro": [269, 79, 69,  99, 49, None, 119],
        "dev-pixel7":    [229, 69, 59,  79, 45, None,  99],
    }
    for dev_id, prices in pixel_pricing.items():
        for i, svc_id in enumerate(svc_ids):
            if prices[i] is not None:
                pricing.append(p(dev_id, svc_id, float(prices[i]), time=times[i]))

    return pricing

# ─── TESTIMONIALS ────────────────────────────────────────────────────────────
TESTIMONIALS = [
    {
        "name": "Gurveer Singh",
        "rating": 5,
        "review": "Absolutely great service! Phone charger front part was broken and stuck in the charging hole. Fixed in 30mins and the price was very affordable. Thanks for the free screen protector too!",
        "device_repaired": "iPhone",
        "is_active": True
    },
    {
        "name": "Noah Becker Tyquin",
        "rating": 5,
        "review": "Broke my phone while on holidays on a public holiday. He cut his break and had my phone fixed within 40 minutes and at a great price! Highly recommend for quick and professional repairs.",
        "device_repaired": "iPhone",
        "is_active": True
    },
    {
        "name": "Allen Jackson",
        "rating": 5,
        "review": "Friendly, efficient, fast, great pricing. Incredible service replacing screen for older iPhone. Super friendly and knew exactly what they were doing. Highly recommend!",
        "device_repaired": "iPhone",
        "is_active": True
    },
    {
        "name": "Jennifer Lyne",
        "rating": 5,
        "review": "Quick, efficient, experienced. Fixed my Samsung S9 Galaxy screen in under an hour, like new, and cheaper than just about everywhere else. No issues since. 100% sticking with these guys!",
        "device_repaired": "Samsung Galaxy S9",
        "is_active": True
    },
    {
        "name": "Gundeep Singh",
        "rating": 5,
        "review": "Fantastic service replacing the screen on my iPhone 10. They really went out of their way to assist me on getting it in the post for my Dad. Would definitely use them again.",
        "device_repaired": "iPhone X",
        "is_active": True
    },
    {
        "name": "Sarah M.",
        "rating": 5,
        "review": "Fixed my iPhone 14 Pro screen in under an hour. Looks brand new! The quality is indistinguishable from the original. Very professional service.",
        "device_repaired": "iPhone 14 Pro",
        "is_active": True
    },
    {
        "name": "James L.",
        "rating": 5,
        "review": "My Samsung had water damage and I thought it was gone forever. These guys worked magic! Everything is working perfectly now. Highly recommend HiFone!",
        "device_repaired": "Samsung Galaxy S23",
        "is_active": True
    },
]

# ─── SETTINGS ────────────────────────────────────────────────────────────────
SETTINGS = {
    "id": "business-settings",
    "phone": "0432 977 092",
    "email": "Info.hifone@gmail.com",
    "whatsapp": "61432977092",
    "address": "Shop 153 Anzac Hwy, Kurralta Park SA 5037",
    "hours_weekday": "Monday – Saturday: 9am – 6pm",
    "hours_weekend": "Sunday: Closed",
    "google_maps_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.2!2d138.5722!3d-34.9456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0ced13e4a6d25%3A0xef07141d011d544c!2sHiFone!5e0!3m2!1sen!2sau!4v1",
    "google_place_id": "ChIJxxxxxxxxxxxxxxx",
}

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    print(f"\n🚀 HiFone Data Migration")
    print(f"   Target: {API}\n")

    # Health check
    print("⏳ Checking backend...")
    if not check_health():
        print("❌ Backend not responding. Is it running?")
        print(f"   Check: {API}/health")
        return

    print("✅ Backend is online\n")

    # 1. Seed via existing endpoint first (handles admin user etc)
    print("📦 Step 1 — Running /api/seed (creates admin + base structure)...")
    r = requests.post(f"{API}/seed", timeout=30)
    print(f"   {r.json().get('message', r.text)}\n")

    # Need admin token for protected endpoints
    print("🔐 Step 2 — Getting admin token...")
    login_r = requests.post(f"{API}/auth/login", json={"email": "admin@hifone.com.au", "password": "admin123"}, timeout=30)
    if login_r.status_code != 200:
        print(f"❌ Login failed: {login_r.text}")
        return
    token = login_r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   ✅ Logged in\n")

    # 2. Add extra services
    print("🔧 Step 3 — Adding services...")
    existing_svc_r = requests.get(f"{API}/services", timeout=30)
    existing_svc_ids = {s["id"] for s in existing_svc_r.json()}
    added = 0
    for svc in SERVICES:
        if svc["id"] not in existing_svc_ids:
            r = requests.post(f"{API}/services", json=svc, headers=headers, timeout=30)
            if r.status_code in (200, 201):
                added += 1
    print(f"   ✅ {added} new services added\n")

    # 3. Add all devices
    print("📱 Step 4 — Adding devices ({} total)...".format(len(DEVICES)))
    existing_dev_r = requests.get(f"{API}/devices", timeout=30)
    existing_dev_ids = {d["id"] for d in existing_dev_r.json()}
    added = 0
    for dev in DEVICES:
        if dev["id"] not in existing_dev_ids:
            r = requests.post(f"{API}/devices", json=dev, headers=headers, timeout=30)
            if r.status_code in (200, 201):
                added += 1
    print(f"   ✅ {added} new devices added\n")

    # 4. Add pricing
    print("💰 Step 5 — Adding pricing...")
    pricing_data = build_pricing()
    existing_price_r = requests.get(f"{API}/pricing", timeout=30)
    existing_price_ids = {p["id"] for p in existing_price_r.json()}
    added = 0
    for price in pricing_data:
        if price["id"] not in existing_price_ids:
            r = requests.post(f"{API}/pricing", json=price, headers=headers, timeout=30)
            if r.status_code in (200, 201):
                added += 1
    print(f"   ✅ {added} new prices added (out of {len(pricing_data)} total)\n")

    # 5. Add testimonials
    print("⭐ Step 6 — Adding testimonials...")
    existing_test_r = requests.get(f"{API}/testimonials", timeout=30)
    existing_test_names = {t["name"] for t in existing_test_r.json()}
    added = 0
    for t in TESTIMONIALS:
        if t["name"] not in existing_test_names:
            r = requests.post(f"{API}/testimonials", json=t, timeout=30)
            if r.status_code in (200, 201):
                added += 1
    print(f"   ✅ {added} testimonials added\n")

    # 6. Update settings
    print("⚙️  Step 7 — Updating business settings...")
    r = requests.put(f"{API}/settings", json=SETTINGS, headers=headers, timeout=30)
    if r.status_code == 200:
        print("   ✅ Settings updated\n")
    else:
        print(f"   ⚠️  Settings update failed: {r.text}\n")

    print("=" * 50)
    print("✅ Migration complete!")
    print(f"\n📊 Summary:")
    print(f"   Devices:      {len(DEVICES)}")
    print(f"   Services:     {len(SERVICES)}")
    print(f"   Pricing rows: {len(build_pricing())}")
    print(f"   Testimonials: {len(TESTIMONIALS)}")
    print(f"\n🌐 Check your site: https://hi-fhone-demo.vercel.app")
    print(f"🔑 Admin panel:    https://hi-fhone-demo.vercel.app/admin")
    print(f"   Email: admin@hifone.com.au | Password: admin123")
    print("\n⚠️  IMPORTANT: Change your admin password after login!\n")

if __name__ == "__main__":
    main()
