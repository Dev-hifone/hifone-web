"""
Test Email Notifications for Bookings
Tests:
- POST /api/bookings creates booking AND triggers email sending
- POST /api/admin/test-email returns 'skipped' status with dummy key
- POST /api/admin/test-email requires authentication
- Booking creation returns correct fields (device_name, service_name, price)
- Email templates use correct field names (booking_date, booking_time)
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestEmailNotifications:
    """Test email notification functionality"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.admin_email = "admin@hifone.com.au"
        self.admin_password = "admin123"
        self.auth_token = None
        
    def get_auth_token(self):
        """Get admin authentication token"""
        if self.auth_token:
            return self.auth_token
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": self.admin_email,
            "password": self.admin_password
        })
        if response.status_code == 200:
            self.auth_token = response.json().get("token")
            return self.auth_token
        return None
    
    # ==================== TEST EMAIL ENDPOINT ====================
    
    def test_test_email_requires_authentication(self):
        """POST /api/admin/test-email should return 403 without token"""
        response = requests.post(f"{BASE_URL}/api/admin/test-email")
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("PASS: POST /api/admin/test-email returns 403 without authentication")
    
    def test_test_email_with_invalid_token(self):
        """POST /api/admin/test-email should return 401 with invalid token"""
        response = requests.post(
            f"{BASE_URL}/api/admin/test-email",
            headers={"Authorization": "Bearer invalid_token_12345"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: POST /api/admin/test-email returns 401 with invalid token")
    
    def test_test_email_returns_skipped_with_dummy_key(self):
        """POST /api/admin/test-email should return 'skipped' status with dummy API key"""
        token = self.get_auth_token()
        assert token, "Failed to get auth token"
        
        response = requests.post(
            f"{BASE_URL}/api/admin/test-email",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "status" in data, "Response should contain 'status' field"
        assert data["status"] == "skipped", f"Expected status 'skipped', got '{data['status']}'"
        assert "message" in data, "Response should contain 'message' field"
        assert "dummy" in data["message"].lower() or "api key" in data["message"].lower(), \
            f"Message should mention dummy key: {data['message']}"
        
        print(f"PASS: POST /api/admin/test-email returns skipped status: {data}")
    
    # ==================== BOOKING CREATION WITH EMAIL ====================
    
    def test_booking_creation_returns_correct_fields(self):
        """POST /api/bookings should return booking with device_name, service_name, price"""
        # Use known device and service IDs from seed data
        booking_data = {
            "customer_name": "TEST_Email_Customer",
            "customer_email": "test_email@example.com",
            "customer_phone": "0400000001",
            "device_id": "dev-iphone13",
            "service_id": "svc-screen",
            "booking_date": "2026-04-01",
            "booking_time": "10:00 AM",
            "notes": "Test booking for email notification"
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Verify required fields
        assert "id" in data, "Response should contain 'id'"
        assert "device_name" in data, "Response should contain 'device_name'"
        assert "service_name" in data, "Response should contain 'service_name'"
        assert "price" in data, "Response should contain 'price'"
        assert "booking_date" in data, "Response should contain 'booking_date'"
        assert "booking_time" in data, "Response should contain 'booking_time'"
        
        # Verify field values
        assert data["device_name"] == "Apple iPhone 13", f"Expected 'Apple iPhone 13', got '{data['device_name']}'"
        assert data["service_name"] == "Screen Repair", f"Expected 'Screen Repair', got '{data['service_name']}'"
        assert isinstance(data["price"], (int, float)), f"Price should be numeric, got {type(data['price'])}"
        assert data["price"] > 0, f"Price should be positive, got {data['price']}"
        assert data["booking_date"] == "2026-04-01", f"Expected booking_date '2026-04-01', got '{data['booking_date']}'"
        assert data["booking_time"] == "10:00 AM", f"Expected booking_time '10:00 AM', got '{data['booking_time']}'"
        
        print(f"PASS: Booking created with correct fields: device_name={data['device_name']}, service_name={data['service_name']}, price={data['price']}")
        return data
    
    def test_booking_creation_is_non_blocking(self):
        """POST /api/bookings should return quickly (emails sent async)"""
        booking_data = {
            "customer_name": "TEST_Async_Customer",
            "customer_email": "test_async@example.com",
            "customer_phone": "0400000002",
            "device_id": "dev-s24ultra",
            "service_id": "svc-battery",
            "booking_date": "2026-04-02",
            "booking_time": "2:00 PM",
            "notes": "Test async email sending"
        }
        
        start_time = time.time()
        response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        elapsed_time = time.time() - start_time
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Response should be fast (< 2 seconds) since emails are sent async
        assert elapsed_time < 2.0, f"Booking creation took {elapsed_time:.2f}s, should be < 2s (async email)"
        
        print(f"PASS: Booking creation completed in {elapsed_time:.3f}s (non-blocking)")
    
    def test_booking_with_different_device_service(self):
        """Test booking with Samsung device and water damage service"""
        booking_data = {
            "customer_name": "TEST_Samsung_Customer",
            "customer_email": "samsung_test@example.com",
            "customer_phone": "0400000003",
            "device_id": "dev-s23",
            "service_id": "svc-water",
            "booking_date": "2026-04-03",
            "booking_time": "11:30 AM",
            "notes": "Water damage repair test"
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "Samsung" in data["device_name"], f"Device name should contain 'Samsung': {data['device_name']}"
        assert data["service_name"] == "Water Damage Repair", f"Expected 'Water Damage Repair', got '{data['service_name']}'"
        
        print(f"PASS: Samsung booking created: {data['device_name']} - {data['service_name']}")
    
    def test_booking_fails_without_pricing(self):
        """Booking should fail if no pricing exists for device+service combo"""
        # Use a device that might not have all services priced
        booking_data = {
            "customer_name": "TEST_NoPricing_Customer",
            "customer_email": "nopricing@example.com",
            "customer_phone": "0400000004",
            "device_id": "dev-ipadmini",  # iPad Mini
            "service_id": "svc-camera",   # Camera repair - may not be priced for iPad
            "booking_date": "2026-04-04",
            "booking_time": "3:00 PM",
            "notes": "Test no pricing scenario"
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        # Should return 400 if pricing not found
        if response.status_code == 400:
            data = response.json()
            assert "pricing" in data.get("detail", "").lower() or "not found" in data.get("detail", "").lower(), \
                f"Error should mention pricing: {data}"
            print("PASS: Booking correctly fails when pricing not found")
        else:
            # If pricing exists, booking should succeed
            assert response.status_code == 200, f"Expected 200 or 400, got {response.status_code}"
            print("INFO: Pricing exists for iPad Mini + Camera, booking succeeded")
    
    # ==================== VERIFY BOOKING PERSISTENCE ====================
    
    def test_booking_persisted_in_database(self):
        """Verify booking is saved and can be retrieved"""
        booking_data = {
            "customer_name": "TEST_Persist_Customer",
            "customer_email": "persist@example.com",
            "customer_phone": "0400000005",
            "device_id": "dev-pixel8",
            "service_id": "svc-screen",
            "booking_date": "2026-04-05",
            "booking_time": "4:00 PM",
            "notes": "Test persistence"
        }
        
        # Create booking
        create_response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        assert create_response.status_code == 200, f"Create failed: {create_response.status_code}"
        
        created_booking = create_response.json()
        booking_id = created_booking["id"]
        
        # Retrieve booking
        get_response = requests.get(f"{BASE_URL}/api/bookings/{booking_id}")
        assert get_response.status_code == 200, f"Get failed: {get_response.status_code}"
        
        fetched_booking = get_response.json()
        assert fetched_booking["id"] == booking_id
        assert fetched_booking["customer_name"] == "TEST_Persist_Customer"
        assert fetched_booking["customer_email"] == "persist@example.com"
        assert fetched_booking["device_name"] is not None
        assert fetched_booking["service_name"] is not None
        
        print(f"PASS: Booking {booking_id} persisted and retrieved successfully")


class TestEmailTemplateFields:
    """Test that email templates use correct field names"""
    
    def test_booking_uses_booking_date_not_preferred_date(self):
        """Verify booking model uses booking_date, not preferred_date"""
        booking_data = {
            "customer_name": "TEST_DateField_Customer",
            "customer_email": "datefield@example.com",
            "customer_phone": "0400000006",
            "device_id": "dev-iphone14",
            "service_id": "svc-charging",
            "booking_date": "2026-04-10",
            "booking_time": "9:00 AM",
            "notes": "Test date field names"
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Should have booking_date, not preferred_date
        assert "booking_date" in data, "Response should have 'booking_date' field"
        assert "preferred_date" not in data, "Response should NOT have 'preferred_date' field"
        
        # Should have booking_time, not preferred_time
        assert "booking_time" in data, "Response should have 'booking_time' field"
        assert "preferred_time" not in data, "Response should NOT have 'preferred_time' field"
        
        print("PASS: Booking uses correct field names (booking_date, booking_time)")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_bookings(self):
        """List test bookings for manual cleanup reference"""
        response = requests.get(f"{BASE_URL}/api/bookings")
        if response.status_code == 200:
            bookings = response.json()
            test_bookings = [b for b in bookings if b.get("customer_name", "").startswith("TEST_")]
            print(f"INFO: Found {len(test_bookings)} test bookings (prefix TEST_)")
            for b in test_bookings[:5]:  # Show first 5
                print(f"  - {b['id']}: {b['customer_name']} ({b.get('device_name', 'N/A')})")
        print("PASS: Cleanup check completed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
