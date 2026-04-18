"""
Test suite for new features:
- Google Reviews API (/api/reviews)
- Business Settings API (/api/settings)
- Stripe removal verification (payment endpoints should 404)
- Admin authentication for settings
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestGoogleReviewsAPI:
    """Tests for /api/reviews endpoint - fetches reviews from Google Places API or static fallback"""
    
    def test_reviews_endpoint_returns_200(self):
        """GET /api/reviews should return 200"""
        response = requests.get(f"{BASE_URL}/api/reviews")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ GET /api/reviews returns 200")
    
    def test_reviews_response_structure(self):
        """Response should have reviews array, rating, and total_reviews"""
        response = requests.get(f"{BASE_URL}/api/reviews")
        data = response.json()
        
        assert "reviews" in data, "Response missing 'reviews' field"
        assert "rating" in data, "Response missing 'rating' field"
        assert "total_reviews" in data, "Response missing 'total_reviews' field"
        
        assert isinstance(data["reviews"], list), "reviews should be a list"
        assert isinstance(data["rating"], (int, float)), "rating should be numeric"
        assert isinstance(data["total_reviews"], int), "total_reviews should be int"
        print(f"✓ Reviews response has correct structure: {len(data['reviews'])} reviews, rating={data['rating']}, total={data['total_reviews']}")
    
    def test_reviews_have_required_fields(self):
        """Each review should have author_name, rating, text"""
        response = requests.get(f"{BASE_URL}/api/reviews")
        data = response.json()
        
        assert len(data["reviews"]) > 0, "Should have at least one review"
        
        for i, review in enumerate(data["reviews"]):
            assert "author_name" in review, f"Review {i} missing author_name"
            assert "rating" in review, f"Review {i} missing rating"
            assert "text" in review, f"Review {i} missing text"
        
        print(f"✓ All {len(data['reviews'])} reviews have required fields")
    
    def test_reviews_source_field(self):
        """Response should indicate source (google_api or static)"""
        response = requests.get(f"{BASE_URL}/api/reviews")
        data = response.json()
        
        # With dummy API key, should return static
        assert "source" in data, "Response missing 'source' field"
        assert data["source"] in ["google_api", "static"], f"Invalid source: {data['source']}"
        print(f"✓ Reviews source: {data['source']}")


class TestBusinessSettingsAPI:
    """Tests for /api/settings endpoint - business settings CRUD"""
    
    def test_get_settings_public(self):
        """GET /api/settings should be public (no auth required)"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ GET /api/settings is public (200)")
    
    def test_settings_response_structure(self):
        """Settings should have all required fields"""
        response = requests.get(f"{BASE_URL}/api/settings")
        data = response.json()
        
        required_fields = ["phone", "email", "address", "hours_weekday", "hours_weekend", "google_maps_embed"]
        for field in required_fields:
            assert field in data, f"Settings missing '{field}' field"
        
        print(f"✓ Settings has all required fields: {list(data.keys())}")
    
    def test_settings_values_not_empty(self):
        """Settings values should not be empty"""
        response = requests.get(f"{BASE_URL}/api/settings")
        data = response.json()
        
        assert data["phone"], "Phone should not be empty"
        assert data["email"], "Email should not be empty"
        assert data["address"], "Address should not be empty"
        
        print(f"✓ Settings values: phone={data['phone']}, email={data['email']}")
    
    def test_put_settings_requires_auth(self):
        """PUT /api/settings should require authentication"""
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json={"phone": "test"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✓ PUT /api/settings requires auth (403)")
    
    def test_put_settings_with_valid_auth(self):
        """PUT /api/settings with valid token should succeed"""
        # Login first
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@hifone.com.au", "password": "admin123"}
        )
        assert login_response.status_code == 200, "Login failed"
        token = login_response.json()["token"]
        
        # Get current settings
        current = requests.get(f"{BASE_URL}/api/settings").json()
        
        # Update settings
        update_response = requests.put(
            f"{BASE_URL}/api/settings",
            json=current,  # Send same data back
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }
        )
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}"
        
        # Verify response
        updated = update_response.json()
        assert updated["phone"] == current["phone"], "Phone should match"
        
        print("✓ PUT /api/settings with auth succeeds")


class TestStripeRemoval:
    """Tests to verify Stripe payment endpoints have been removed"""
    
    def test_payments_checkout_returns_404(self):
        """GET /api/payments/checkout should return 404 (removed)"""
        response = requests.get(f"{BASE_URL}/api/payments/checkout")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ GET /api/payments/checkout returns 404 (Stripe removed)")
    
    def test_payments_checkout_post_returns_404(self):
        """POST /api/payments/checkout should return 404 or 405 (removed)"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={"booking_id": "test"}
        )
        assert response.status_code in [404, 405], f"Expected 404/405, got {response.status_code}"
        print(f"✓ POST /api/payments/checkout returns {response.status_code} (Stripe removed)")


class TestAdminAuth:
    """Tests for admin authentication"""
    
    def test_admin_login_success(self):
        """Admin login with correct credentials should succeed"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@hifone.com.au", "password": "admin123"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "token" in data, "Response missing token"
        assert "admin" in data, "Response missing admin"
        assert data["admin"]["email"] == "admin@hifone.com.au"
        
        print("✓ Admin login succeeds with correct credentials")
    
    def test_admin_login_wrong_password(self):
        """Admin login with wrong password should fail"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@hifone.com.au", "password": "wrongpassword"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Admin login fails with wrong password (401)")
    
    def test_auth_me_with_valid_token(self):
        """GET /api/auth/me with valid token should return admin info"""
        # Login first
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@hifone.com.au", "password": "admin123"}
        )
        token = login_response.json()["token"]
        
        # Get me
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data["email"] == "admin@hifone.com.au"
        
        print("✓ GET /api/auth/me returns admin info with valid token")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
