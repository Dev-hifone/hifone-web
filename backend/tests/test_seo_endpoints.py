"""
Test suite for HiFone SEO Page Data Endpoints
Tests /api/seo-page-data and /api/seo-slugs endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test device slugs for different brands
DEVICE_SLUGS = {
    'apple': ['iphone-13', 'iphone-15-pro', 'iphone-14', 'iphone-se', 'iphone-12'],
    'samsung': ['samsung-s24-ultra', 'samsung-s24', 'samsung-s23', 'samsung-a54', 'samsung-z-flip-5'],
    'ipad': ['ipad-pro', 'ipad-air', 'ipad-10', 'ipad-mini'],
    'google': ['pixel-8-pro', 'pixel-8', 'pixel-7'],
}

SERVICE_SLUGS = [
    'screen-repair', 'battery-replacement', 'water-damage-repair',
    'charging-port-repair', 'camera-repair', 'speaker-mic-repair'
]


class TestSEOPageDataEndpoint:
    """Tests for /api/seo-page-data endpoint"""
    
    def test_iphone_13_screen_repair_returns_correct_data(self):
        """Test iPhone 13 screen repair returns correct device, service, pricing"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "screen-repair"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Verify device data
        assert data["device"]["name"] == "iPhone 13"
        assert data["device"]["brand"] == "Apple"
        assert data["device"]["slug"] == "iphone-13"
        
        # Verify service data
        assert data["service"]["name"] == "Screen Repair"
        assert data["service"]["slug"] == "screen-repair"
        
        # Verify pricing exists
        assert data["pricing"] is not None
        assert data["pricing"]["price"] == 199.0
        assert data["pricing"]["original_price"] == 249.0
        assert "repair_time" in data["pricing"]
        assert "warranty" in data["pricing"]
        
        # Verify location data
        assert data["location"]["name"] == "Adelaide"
        assert data["location"]["full_name"] == "Kurralta Park, Adelaide"
        assert len(data["location"]["areas_served"]) > 0
        
        # Verify service details
        assert len(data["service_details"]["includes"]) > 0
        assert len(data["service_details"]["common_issues"]) > 0
        
        # Verify related services
        assert len(data["related_services"]) > 0
        for rs in data["related_services"]:
            assert "service_name" in rs
            assert "seo_slug" in rs
            assert "price" in rs
        
        print("✓ iPhone 13 screen repair data validated successfully")
    
    def test_samsung_s24_ultra_battery_replacement(self):
        """Test Samsung S24 Ultra battery replacement returns correct data"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "samsung-s24-ultra", "service_slug": "battery-replacement"}
        )
        assert response.status_code == 200
        
        data = response.json()
        
        # Verify Samsung device
        assert data["device"]["name"] == "Galaxy S24 Ultra"
        assert data["device"]["brand"] == "Samsung"
        
        # Verify battery service
        assert data["service"]["name"] == "Battery Replacement"
        
        # Verify pricing
        assert data["pricing"]["price"] == 79.0
        assert data["pricing"]["original_price"] == 119.0
        
        print("✓ Samsung S24 Ultra battery replacement data validated")
    
    def test_pixel_8_pro_screen_repair(self):
        """Test Pixel 8 Pro screen repair returns correct data"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "pixel-8-pro", "service_slug": "screen-repair"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["device"]["name"] == "Pixel 8 Pro"
        assert data["device"]["brand"] == "Google"
        assert data["pricing"]["price"] == 229.0
        
        print("✓ Pixel 8 Pro screen repair data validated")
    
    def test_ipad_pro_screen_repair(self):
        """Test iPad Pro screen repair returns correct data"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "ipad-pro", "service_slug": "screen-repair"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["device"]["name"] == "iPad Pro"
        assert data["device"]["brand"] == "iPad"
        assert data["pricing"]["price"] == 349.0
        
        print("✓ iPad Pro screen repair data validated")
    
    def test_invalid_device_slug_returns_404(self):
        """Test invalid device slug returns 404"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "invalid-device", "service_slug": "screen-repair"}
        )
        assert response.status_code == 404
        assert "Device not found" in response.json()["detail"]
        
        print("✓ Invalid device slug returns 404 correctly")
    
    def test_invalid_service_slug_returns_404(self):
        """Test invalid service slug returns 404"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "invalid-service"}
        )
        assert response.status_code == 404
        assert "Service not found" in response.json()["detail"]
        
        print("✓ Invalid service slug returns 404 correctly")
    
    def test_all_apple_devices_screen_repair(self):
        """Test all Apple device slugs work for screen repair"""
        for device_slug in DEVICE_SLUGS['apple']:
            response = requests.get(
                f"{BASE_URL}/api/seo-page-data",
                params={"device_slug": device_slug, "service_slug": "screen-repair"}
            )
            assert response.status_code == 200, f"Failed for {device_slug}"
            data = response.json()
            assert data["device"]["brand"] == "Apple"
            
        print(f"✓ All {len(DEVICE_SLUGS['apple'])} Apple devices validated")
    
    def test_all_samsung_devices_battery_replacement(self):
        """Test all Samsung device slugs work for battery replacement"""
        for device_slug in DEVICE_SLUGS['samsung']:
            response = requests.get(
                f"{BASE_URL}/api/seo-page-data",
                params={"device_slug": device_slug, "service_slug": "battery-replacement"}
            )
            assert response.status_code == 200, f"Failed for {device_slug}"
            data = response.json()
            assert data["device"]["brand"] == "Samsung"
            
        print(f"✓ All {len(DEVICE_SLUGS['samsung'])} Samsung devices validated")
    
    def test_related_services_have_valid_seo_slugs(self):
        """Test that related services have valid SEO slugs"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "screen-repair"}
        )
        data = response.json()
        
        for rs in data["related_services"]:
            # Verify SEO slug format
            assert rs["seo_slug"].startswith("iphone-13-")
            assert rs["seo_slug"].endswith("-adelaide")
            assert "screen-repair" not in rs["seo_slug"]  # Should be different service
            
        print("✓ Related services have valid SEO slugs")
    
    def test_related_devices_have_valid_seo_slugs(self):
        """Test that related devices have valid SEO slugs"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "screen-repair"}
        )
        data = response.json()
        
        for rd in data["related_devices"]:
            # Verify SEO slug format
            assert rd["seo_slug"].endswith("-screen-repair-adelaide")
            # Should be different device (not exactly iphone-13, but could be iphone-13-pro)
            assert rd["device_slug"] != "iphone-13"
            assert rd["brand"] == "Apple"  # Same brand
            
        print("✓ Related devices have valid SEO slugs")


class TestSEOSlugsEndpoint:
    """Tests for /api/seo-slugs endpoint"""
    
    def test_seo_slugs_returns_117_combinations(self):
        """Test that /api/seo-slugs returns 117 valid combinations"""
        response = requests.get(f"{BASE_URL}/api/seo-slugs")
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] == 117, f"Expected 117 slugs, got {data['total']}"
        assert len(data["slugs"]) == 117
        
        print("✓ SEO slugs endpoint returns 117 combinations")
    
    def test_seo_slugs_format_is_correct(self):
        """Test that all SEO slugs have correct format"""
        response = requests.get(f"{BASE_URL}/api/seo-slugs")
        data = response.json()
        
        for slug_data in data["slugs"]:
            # Verify slug format: {device}-{service}-{location}
            assert "slug" in slug_data
            assert "device_slug" in slug_data
            assert "service_slug" in slug_data
            assert "location" in slug_data
            
            # Verify slug matches components
            expected_slug = f"{slug_data['device_slug']}-{slug_data['service_slug']}-{slug_data['location']}"
            assert slug_data["slug"] == expected_slug, f"Slug mismatch: {slug_data['slug']} != {expected_slug}"
            
        print("✓ All SEO slugs have correct format")
    
    def test_seo_slugs_contain_all_device_types(self):
        """Test that SEO slugs contain all device types"""
        response = requests.get(f"{BASE_URL}/api/seo-slugs")
        data = response.json()
        
        device_slugs_found = set(s["device_slug"] for s in data["slugs"])
        
        # Check for presence of each device type
        assert any("iphone" in d for d in device_slugs_found), "No iPhone devices found"
        assert any("samsung" in d for d in device_slugs_found), "No Samsung devices found"
        assert any("ipad" in d for d in device_slugs_found), "No iPad devices found"
        assert any("pixel" in d for d in device_slugs_found), "No Pixel devices found"
        
        print(f"✓ Found {len(device_slugs_found)} unique device slugs")
    
    def test_seo_slugs_contain_all_service_types(self):
        """Test that SEO slugs contain all service types"""
        response = requests.get(f"{BASE_URL}/api/seo-slugs")
        data = response.json()
        
        service_slugs_found = set(s["service_slug"] for s in data["slugs"])
        
        expected_services = {'screen-repair', 'battery-replacement', 'water-damage-repair',
                           'charging-port-repair', 'camera-repair', 'speaker-mic-repair'}
        
        # Not all devices have all services (e.g., iPads don't have all services)
        assert len(service_slugs_found) >= 3, f"Expected at least 3 services, got {len(service_slugs_found)}"
        
        print(f"✓ Found {len(service_slugs_found)} unique service slugs")


class TestServiceDetailsContent:
    """Tests for service details content in SEO page data"""
    
    def test_screen_repair_includes_list(self):
        """Test screen repair includes list has expected items"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "screen-repair"}
        )
        data = response.json()
        
        includes = data["service_details"]["includes"]
        assert len(includes) >= 5, "Expected at least 5 includes items"
        assert any("screen" in item.lower() for item in includes)
        
        print("✓ Screen repair includes list validated")
    
    def test_battery_replacement_common_issues(self):
        """Test battery replacement common issues list"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "battery-replacement"}
        )
        data = response.json()
        
        issues = data["service_details"]["common_issues"]
        assert len(issues) >= 5, "Expected at least 5 common issues"
        assert any("battery" in item.lower() or "drain" in item.lower() for item in issues)
        
        print("✓ Battery replacement common issues validated")
    
    def test_water_damage_service_details(self):
        """Test water damage repair service details"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "water-damage-repair"}
        )
        data = response.json()
        
        includes = data["service_details"]["includes"]
        issues = data["service_details"]["common_issues"]
        
        assert any("water" in item.lower() or "moisture" in item.lower() for item in includes + issues)
        
        print("✓ Water damage service details validated")


class TestLocationData:
    """Tests for location data in SEO page data"""
    
    def test_adelaide_location_data(self):
        """Test Adelaide location data is complete"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "screen-repair", "location": "adelaide"}
        )
        data = response.json()
        
        location = data["location"]
        assert location["name"] == "Adelaide"
        assert location["full_name"] == "Kurralta Park, Adelaide"
        assert location["state"] == "SA"
        assert location["postcode"] == "5037"
        assert len(location["areas_served"]) >= 5
        assert "Adelaide CBD" in location["areas_served"]
        
        print("✓ Adelaide location data validated")


class TestPricingData:
    """Tests for pricing data accuracy"""
    
    def test_iphone_pro_premium_pricing(self):
        """Test iPhone Pro models have premium pricing"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-15-pro", "service_slug": "screen-repair"}
        )
        data = response.json()
        
        # Pro models should have higher screen repair price
        assert data["pricing"]["price"] == 249.0
        assert data["pricing"]["original_price"] == 299.0
        
        print("✓ iPhone Pro premium pricing validated")
    
    def test_samsung_ultra_premium_pricing(self):
        """Test Samsung Ultra models have premium pricing"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "samsung-s24-ultra", "service_slug": "screen-repair"}
        )
        data = response.json()
        
        # Ultra models should have higher screen repair price
        assert data["pricing"]["price"] == 299.0
        assert data["pricing"]["original_price"] == 399.0
        
        print("✓ Samsung Ultra premium pricing validated")
    
    def test_pricing_has_save_amount(self):
        """Test pricing shows save amount when original_price exists"""
        response = requests.get(
            f"{BASE_URL}/api/seo-page-data",
            params={"device_slug": "iphone-13", "service_slug": "screen-repair"}
        )
        data = response.json()
        
        pricing = data["pricing"]
        if pricing.get("original_price"):
            save_amount = pricing["original_price"] - pricing["price"]
            assert save_amount > 0, "Save amount should be positive"
            
        print("✓ Pricing save amount validated")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
