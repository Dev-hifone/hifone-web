"""
Admin Panel CRUD Tests for HiFone Repairs
Tests: Auth endpoints, Services CRUD, Devices CRUD, Pricing CRUD
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_EMAIL = "admin@hifone.com.au"
ADMIN_PASSWORD = "admin123"

class TestAdminAuth:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "token" in data, "Response should contain token"
        assert "admin" in data, "Response should contain admin info"
        assert data["admin"]["email"] == ADMIN_EMAIL
        assert len(data["token"]) > 0
        print(f"✓ Login success - token received, admin email: {data['admin']['email']}")
    
    def test_login_wrong_password(self):
        """Test login with wrong password returns 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword123"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        print(f"✓ Wrong password returns 401 with message: {data['detail']}")
    
    def test_login_wrong_email(self):
        """Test login with non-existent email returns 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Non-existent email returns 401")
    
    def test_get_me_with_valid_token(self):
        """Test /auth/me with valid token"""
        # First login
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_res.json()["token"]
        
        # Get me
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        print(f"✓ /auth/me returns admin info: {data['email']}")
    
    def test_get_me_without_token(self):
        """Test /auth/me without token returns 403"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ /auth/me without token returns 403")


class TestServicesAuth:
    """Test services endpoints require auth for write operations"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_services_no_auth(self):
        """GET /services should work without auth"""
        response = requests.get(f"{BASE_URL}/api/services")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /services returns {len(data)} services without auth")
    
    def test_create_service_without_auth(self):
        """POST /services without auth should return 403"""
        response = requests.post(f"{BASE_URL}/api/services", json={
            "name": "Test Service",
            "slug": "test-service",
            "description": "Test description",
            "short_description": "Test short",
            "icon": "Wrench"
        })
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ POST /services without auth returns 403")
    
    def test_update_service_without_auth(self):
        """PUT /services/{id} without auth should return 403"""
        # Get a service ID first
        services = requests.get(f"{BASE_URL}/api/services").json()
        if services:
            service_id = services[0]["id"]
            response = requests.put(f"{BASE_URL}/api/services/{service_id}", json={
                "name": "Updated Name",
                "slug": "updated-slug",
                "description": "Updated desc",
                "short_description": "Updated short",
                "icon": "Wrench"
            })
            assert response.status_code == 403, f"Expected 403, got {response.status_code}"
            print(f"✓ PUT /services/{service_id} without auth returns 403")
    
    def test_create_service_with_auth(self, auth_token):
        """POST /services with auth should work"""
        response = requests.post(f"{BASE_URL}/api/services", 
            json={
                "name": "TEST_New Service",
                "slug": "test-new-service",
                "description": "Test description for new service",
                "short_description": "Test short desc",
                "icon": "Wrench"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["name"] == "TEST_New Service"
        print(f"✓ POST /services with auth creates service: {data['id']}")
        return data["id"]
    
    def test_update_service_with_auth(self, auth_token):
        """PUT /services/{id} with auth should work"""
        # First create a service
        create_res = requests.post(f"{BASE_URL}/api/services",
            json={
                "name": "TEST_Service To Update",
                "slug": "test-service-to-update",
                "description": "Original description",
                "short_description": "Original short",
                "icon": "Smartphone"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        service_id = create_res.json()["id"]
        
        # Update it
        response = requests.put(f"{BASE_URL}/api/services/{service_id}",
            json={
                "name": "TEST_Updated Service Name",
                "slug": "test-updated-service",
                "description": "Updated description",
                "short_description": "Updated short",
                "icon": "Battery"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["name"] == "TEST_Updated Service Name"
        
        # Verify with GET
        get_res = requests.get(f"{BASE_URL}/api/services/{service_id}")
        assert get_res.status_code == 200
        assert get_res.json()["name"] == "TEST_Updated Service Name"
        print(f"✓ PUT /services/{service_id} with auth updates service")


class TestDevicesAuth:
    """Test devices endpoints require auth for write operations"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_devices_no_auth(self):
        """GET /devices should work without auth"""
        response = requests.get(f"{BASE_URL}/api/devices")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /devices returns {len(data)} devices without auth")
    
    def test_create_device_without_auth(self):
        """POST /devices without auth should return 403"""
        response = requests.post(f"{BASE_URL}/api/devices", json={
            "name": "Test Device",
            "brand": "Apple"
        })
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ POST /devices without auth returns 403")
    
    def test_update_device_without_auth(self):
        """PUT /devices/{id} without auth should return 403"""
        devices = requests.get(f"{BASE_URL}/api/devices").json()
        if devices:
            device_id = devices[0]["id"]
            response = requests.put(f"{BASE_URL}/api/devices/{device_id}", json={
                "name": "Updated Device",
                "brand": "Samsung"
            })
            assert response.status_code == 403, f"Expected 403, got {response.status_code}"
            print(f"✓ PUT /devices/{device_id} without auth returns 403")
    
    def test_create_device_with_auth(self, auth_token):
        """POST /devices with auth should work"""
        response = requests.post(f"{BASE_URL}/api/devices",
            json={
                "name": "TEST_iPhone 16 Pro Max",
                "brand": "Apple"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["name"] == "TEST_iPhone 16 Pro Max"
        assert data["brand"] == "Apple"
        print(f"✓ POST /devices with auth creates device: {data['id']}")
    
    def test_update_device_with_auth(self, auth_token):
        """PUT /devices/{id} with auth should work"""
        # Create a device
        create_res = requests.post(f"{BASE_URL}/api/devices",
            json={
                "name": "TEST_Device To Update",
                "brand": "Samsung"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        device_id = create_res.json()["id"]
        
        # Update it
        response = requests.put(f"{BASE_URL}/api/devices/{device_id}",
            json={
                "name": "TEST_Updated Device Name",
                "brand": "Google"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["name"] == "TEST_Updated Device Name"
        assert data["brand"] == "Google"
        
        # Verify with GET
        get_res = requests.get(f"{BASE_URL}/api/devices/{device_id}")
        assert get_res.status_code == 200
        assert get_res.json()["name"] == "TEST_Updated Device Name"
        print(f"✓ PUT /devices/{device_id} with auth updates device")


class TestPricingAuth:
    """Test pricing endpoints require auth for write operations"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_pricing_no_auth(self):
        """GET /pricing should work without auth"""
        response = requests.get(f"{BASE_URL}/api/pricing")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /pricing returns {len(data)} pricing entries without auth")
    
    def test_create_pricing_without_auth(self):
        """POST /pricing without auth should return 403"""
        response = requests.post(f"{BASE_URL}/api/pricing", json={
            "device_id": "dev-iphone15pro",
            "service_id": "svc-screen",
            "price": 299.00,
            "repair_time": "30-60 min",
            "warranty": "90 days"
        })
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ POST /pricing without auth returns 403")
    
    def test_update_pricing_without_auth(self):
        """PUT /pricing/{id} without auth should return 403"""
        pricing = requests.get(f"{BASE_URL}/api/pricing").json()
        if pricing:
            pricing_id = pricing[0]["id"]
            response = requests.put(f"{BASE_URL}/api/pricing/{pricing_id}", json={
                "device_id": pricing[0]["device_id"],
                "service_id": pricing[0]["service_id"],
                "price": 999.00,
                "repair_time": "30-60 min",
                "warranty": "90 days"
            })
            assert response.status_code == 403, f"Expected 403, got {response.status_code}"
            print(f"✓ PUT /pricing/{pricing_id} without auth returns 403")
    
    def test_create_pricing_with_auth(self, auth_token):
        """POST /pricing with auth should work"""
        # First create a test device
        device_res = requests.post(f"{BASE_URL}/api/devices",
            json={"name": "TEST_Pricing Device", "brand": "Apple"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        device_id = device_res.json()["id"]
        
        # Create pricing
        response = requests.post(f"{BASE_URL}/api/pricing",
            json={
                "device_id": device_id,
                "service_id": "svc-screen",
                "price": 299.00,
                "original_price": 349.00,
                "repair_time": "45-60 min",
                "warranty": "90 days"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["price"] == 299.00
        assert data["device_id"] == device_id
        print(f"✓ POST /pricing with auth creates pricing: {data['id']}")
    
    def test_update_pricing_with_auth(self, auth_token):
        """PUT /pricing/{id} with auth should work"""
        # Get existing pricing
        pricing = requests.get(f"{BASE_URL}/api/pricing").json()
        if pricing:
            pricing_item = pricing[0]
            original_price = pricing_item["price"]
            
            # Update it
            response = requests.put(f"{BASE_URL}/api/pricing/{pricing_item['id']}",
                json={
                    "device_id": pricing_item["device_id"],
                    "service_id": pricing_item["service_id"],
                    "price": original_price + 10,  # Increase by $10
                    "repair_time": pricing_item.get("repair_time", "30-60 min"),
                    "warranty": pricing_item.get("warranty", "90 days")
                },
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
            data = response.json()
            assert data["price"] == original_price + 10
            
            # Revert the change
            requests.put(f"{BASE_URL}/api/pricing/{pricing_item['id']}",
                json={
                    "device_id": pricing_item["device_id"],
                    "service_id": pricing_item["service_id"],
                    "price": original_price,
                    "repair_time": pricing_item.get("repair_time", "30-60 min"),
                    "warranty": pricing_item.get("warranty", "90 days")
                },
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            print(f"✓ PUT /pricing/{pricing_item['id']} with auth updates pricing")


class TestBrandsFilter:
    """Test brands filter endpoint"""
    
    def test_get_brands(self):
        """GET /devices/brands should return list of brands"""
        response = requests.get(f"{BASE_URL}/api/devices/brands")
        assert response.status_code == 200
        data = response.json()
        assert "brands" in data
        assert isinstance(data["brands"], list)
        assert len(data["brands"]) > 0
        print(f"✓ GET /devices/brands returns {len(data['brands'])} brands: {data['brands']}")
    
    def test_get_devices_by_brand(self):
        """GET /devices/brand/{brand} should filter devices"""
        # Get brands first
        brands_res = requests.get(f"{BASE_URL}/api/devices/brands")
        brands = brands_res.json()["brands"]
        
        if brands:
            brand = brands[0]
            response = requests.get(f"{BASE_URL}/api/devices/brand/{brand}")
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            # All devices should be of the specified brand
            for device in data:
                assert device["brand"] == brand
            print(f"✓ GET /devices/brand/{brand} returns {len(data)} devices")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
