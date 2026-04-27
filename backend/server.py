from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re   
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
import jwt
import bcrypt
import asyncio
import resend
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]

# Google Places API configuration
GOOGLE_PLACES_API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY', 'DUMMY_KEY_REPLACE_ME')
GOOGLE_PLACE_ID = os.environ.get('GOOGLE_PLACE_ID', 'ChIJxxxxxxxxxxxxxxx')

# Resend Email configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', 're_SW9cdohm_88ZoVPEcB5G4MXnKq4yZ4aWG')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'bookings@hifone.com.au')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'info@hifone.com.au')
resend.api_key = RESEND_API_KEY

# JWT configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'hifone-admin-secret-key-2026')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

security = HTTPBearer()

# Create the main app
app = FastAPI(title="HiFone Repairs API")

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

# Device Models
class DeviceModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    image_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DeviceCreate(BaseModel):
    name: str
    brand: str
    image_url: Optional[str] = None

# Service Models
class ServiceModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    short_description: str
    icon: str
    image_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServiceCreate(BaseModel):
    name: str
    slug: str
    description: str
    short_description: str
    icon: str
    image_url: Optional[str] = None

# Pricing Models
class PricingModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    service_id: str
    price: float
    original_price: Optional[float] = None
    repair_time: str
    warranty: str
    is_active: bool = True

class PricingCreate(BaseModel):
    device_id: str
    service_id: str
    price: float
    original_price: Optional[float] = None
    repair_time: str
    warranty: str

# Booking Models
class BookingModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: str
    customer_phone: str
    device_id: str
    device_name: Optional[str] = None
    service_id: str
    service_name: Optional[str] = None
    price: float
    booking_date: str
    booking_time: str
    notes: Optional[str] = None
    status: str = "pending"  # pending, confirmed, in_progress, completed, cancelled
    payment_status: str = "unpaid"  # unpaid, paid, refunded
    payment_session_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    device_id: str
    service_id: str
    booking_date: str
    booking_time: str
    notes: Optional[str] = None

# Contact Models
class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

# Testimonial Models
class TestimonialModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    rating: int
    review: str
    device_repaired: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestimonialCreate(BaseModel):
    name: str
    rating: int
    review: str
    device_repaired: Optional[str] = None

# Blog Models
class BlogModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    author: str = "HiFone Team"
    is_published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    author: Optional[str] = "HiFone Team"

# Location Models
class LocationModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    address: str
    is_active: bool = True

# Mail In models
 
class MailInRequest(BaseModel):
    """Customer mail-in repair submission"""
    full_name: str
    phone: str
    email: EmailStr
    device_brand: str          # iPhone, Samsung, iPad, etc.
    device_model: str          # iPhone 14 Pro, Galaxy S23, etc.
    issue_description: str     # What's wrong
    street_address: str
    suburb: str
    state: str
    postcode: str
    tracking_number: Optional[str] = None  # Customer fills after posting
    additional_notes: Optional[str] = None
 
class MailInStatusUpdate(BaseModel):
    """Admin updates status of a mail-in request"""
    status: str  # received | diagnosing | repairing | ready_to_ship | shipped | completed
 
# Payment Transaction Models
# ==================== HELPER FUNCTIONS ====================

def serialize_datetime(obj):
    """Convert datetime to ISO string for MongoDB storage"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def prepare_doc_for_insert(model_obj):
    """Prepare a Pydantic model for MongoDB insertion"""
    doc = model_obj.model_dump()
    for key, value in doc.items():
        doc[key] = serialize_datetime(value)
    return doc

# ==================== AUTH HELPERS ====================

class AdminLoginRequest(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(admin_id: str, email: str) -> str:
    payload = {
        "sub": admin_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        admin = await db.admins.find_one({"id": payload["sub"]}, {"_id": 0})
        if not admin:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== EMAIL HELPERS ====================

async def send_email(to: str, subject: str, html: str):
    """Send email via Resend (non-blocking). Silently fails if key is dummy."""
    if RESEND_API_KEY == 'DUMMY_KEY_REPLACE_ME' or RESEND_API_KEY.startswith('re_DUMMY'):
        logger.info(f"[EMAIL SKIP] Dummy key - would send to {to}: {subject}")
        return None
    try:
        params = {"from": SENDER_EMAIL, "to": [to], "subject": subject, "html": html}
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"[EMAIL SENT] to={to} subject={subject} id={result.get('id','')}")
        return result
    except Exception as e:
        logger.error(f"[EMAIL FAIL] to={to} error={e}")
        return None


def build_customer_booking_email(booking: dict, device_name: str, service_name: str, price: float) -> str:
    return f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:#0066CC;padding:32px;text-align:center;">
        <h1 style="color:#ffffff;font-size:24px;margin:0;">Booking Confirmed</h1>
        <p style="color:#ffffffcc;margin:8px 0 0;font-size:14px;">Thank you for choosing HiFone Repairs</p>
      </div>
      <div style="padding:32px;">
        <p style="color:#1D1D1F;font-size:16px;margin:0 0 24px;">Hi {booking.get('customer_name', 'there')},</p>
        <p style="color:#86868B;font-size:14px;line-height:1.6;margin:0 0 24px;">
          Your repair booking has been received. Here are the details:
        </p>
        <div style="background:#F5F5F7;border-radius:12px;padding:24px;margin:0 0 24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Device</td><td style="color:#1D1D1F;font-size:14px;font-weight:600;text-align:right;padding:6px 0;">{device_name}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Service</td><td style="color:#1D1D1F;font-size:14px;font-weight:600;text-align:right;padding:6px 0;">{service_name}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Date</td><td style="color:#1D1D1F;font-size:14px;font-weight:600;text-align:right;padding:6px 0;">{booking.get('booking_date', 'ASAP')}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Time</td><td style="color:#1D1D1F;font-size:14px;font-weight:600;text-align:right;padding:6px 0;">{booking.get('booking_time', 'Any')}</td></tr>
            <tr style="border-top:1px solid #D1D1D6;"><td style="color:#86868B;font-size:13px;padding:12px 0 6px;">Price</td><td style="color:#0066CC;font-size:18px;font-weight:700;text-align:right;padding:12px 0 6px;">${price:.2f} AUD</td></tr>
          </table>
        </div>
        <div style="background:#34C75910;border-radius:12px;padding:16px;margin:0 0 24px;">
          <p style="color:#34C759;font-size:13px;font-weight:600;margin:0 0 4px;">What's next?</p>
          <p style="color:#86868B;font-size:13px;line-height:1.5;margin:0;">
            Visit our store at <strong>Kurralta Park, Adelaide SA 5037</strong>. 
            Most repairs are completed same-day within 30-60 minutes.
          </p>
        </div>
        <p style="color:#86868B;font-size:13px;line-height:1.5;margin:0 0 24px;">
          If you have questions, call us at <strong>0432 977 092</strong> or reply to this email.
        </p>
        <div style="text-align:center;">
          <a href="https://www.hifone.com.au" style="display:inline-block;background:#0066CC;color:#ffffff;padding:12px 32px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">Visit Our Website</a>
        </div>
      </div>
      <div style="background:#F5F5F7;padding:20px;text-align:center;">
        <p style="color:#86868B;font-size:12px;margin:0;">HiFone Repairs • Kurralta Park, Adelaide SA 5037 • 0432 977 092</p>
      </div>
    </div>
    """


def build_admin_booking_email(booking: dict, device_name: str, service_name: str, price: float) -> str:
    return f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:#1D1D1F;padding:24px;text-align:center;">
        <h1 style="color:#ffffff;font-size:20px;margin:0;">New Booking Received</h1>
      </div>
      <div style="padding:32px;">
        <div style="background:#F5F5F7;border-radius:12px;padding:24px;margin:0 0 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Customer</td><td style="color:#1D1D1F;font-size:14px;font-weight:600;text-align:right;padding:6px 0;">{booking.get('customer_name', 'N/A')}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Email</td><td style="color:#1D1D1F;font-size:14px;text-align:right;padding:6px 0;">{booking.get('customer_email', 'N/A')}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Phone</td><td style="color:#1D1D1F;font-size:14px;text-align:right;padding:6px 0;">{booking.get('customer_phone', 'N/A')}</td></tr>
            <tr style="border-top:1px solid #D1D1D6;"><td style="color:#86868B;font-size:13px;padding:12px 0 6px;">Device</td><td style="color:#1D1D1F;font-size:14px;font-weight:600;text-align:right;padding:12px 0 6px;">{device_name}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Service</td><td style="color:#1D1D1F;font-size:14px;font-weight:600;text-align:right;padding:6px 0;">{service_name}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Date</td><td style="color:#1D1D1F;font-size:14px;text-align:right;padding:6px 0;">{booking.get('booking_date', 'ASAP')}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Time</td><td style="color:#1D1D1F;font-size:14px;text-align:right;padding:6px 0;">{booking.get('booking_time', 'Any')}</td></tr>
            <tr><td style="color:#86868B;font-size:13px;padding:6px 0;">Notes</td><td style="color:#1D1D1F;font-size:14px;text-align:right;padding:6px 0;">{booking.get('notes', 'None')}</td></tr>
            <tr style="border-top:1px solid #D1D1D6;"><td style="color:#86868B;font-size:13px;padding:12px 0 6px;">Price</td><td style="color:#0066CC;font-size:18px;font-weight:700;text-align:right;padding:12px 0 6px;">${price:.2f} AUD</td></tr>
          </table>
        </div>
        <div style="text-align:center;">
          <a href="https://www.hifone.com.au/admin/bookings" style="display:inline-block;background:#0066CC;color:#ffffff;padding:12px 32px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">View in Admin Panel</a>
        </div>
      </div>
    </div>
    """


# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/login")
async def admin_login(req: AdminLoginRequest):
    admin = await db.admins.find_one({"email": req.email}, {"_id": 0})
    if not admin or not verify_password(req.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(admin["id"], admin["email"])
    return {
        "token": token,
        "admin": {"id": admin["id"], "email": admin["email"], "name": admin.get("name", "Admin")},
    }

@api_router.get("/auth/me")
async def get_me(admin=Depends(get_current_admin)):
    return {"id": admin["id"], "email": admin["email"], "name": admin.get("name", "Admin")}

# ==================== DEVICE ENDPOINTS ====================

@api_router.get("/devices", response_model=List[DeviceModel])
async def get_devices():
    devices = await db.devices.find({"is_active": True}, {"_id": 0}).to_list(1000)
    return devices

@api_router.get("/devices/brands")
async def get_brands():
    brands = await db.devices.distinct("brand", {"is_active": True})
    return {"brands": brands}

@api_router.get("/devices/brands-grouped")
async def get_brands_grouped():
    """Return all brands with their devices grouped — used by Navbar, ServicesGrid, DevicesPage"""
    brands = await db.devices.distinct("brand", {"is_active": True})
    result = []
    for brand in brands:
        devices = await db.devices.find(
            {"brand": brand, "is_active": True},
            {"_id": 0, "id": 1, "name": 1, "brand": 1}
        ).sort("name", 1).to_list(200)
        result.append({
            "brand": brand,
            "slug": brand.lower().replace(" ", "-"),
            "count": len(devices),
            "devices": devices
        })
    # Sort: Apple first, then Samsung, iPad, Google, others
    order = {"Apple": 0, "Samsung": 1, "iPad": 2, "Google": 3}
    result.sort(key=lambda x: order.get(x["brand"], 99))
    return {"brands": result}

@api_router.get("/devices/brand/{brand}", response_model=List[DeviceModel])
async def get_devices_by_brand(brand: str):
    devices = await db.devices.find({"brand": brand, "is_active": True}, {"_id": 0}).to_list(1000)
    def sort_key(d):
        name = d.get("name", "")
        # Samsung A-series alag treat karo — S-series se pehle aaye
        if "Galaxy A" in name:
            nums = re.findall(r'\d+', name)
            num = int(nums[0]) if nums else 0
            return (1, -num, 0)   # group 1 = A-series
        if "Galaxy Z" in name:
            nums = re.findall(r'\d+', name)
            num = int(nums[0]) if nums else 0
            sub = 1 if "Fold" in name else 0
            return (2, -num, -sub)  # group 2 = Z-series
        # iPad — Pro > Air > Mini > standard
        if "iPad" in name:
            sub = 3 if "Pro" in name else 2 if "Air" in name else 1 if "Mini" in name else 0
            nums = re.findall(r'\d+', name)
            num = int(nums[0]) if nums else 0
            return (0, -num, -sub)
        # iPhone / Samsung S-series / Pixel — number based
        nums = re.findall(r'\d+', name)
        num = int(nums[0]) if nums else 0
        sub = 3 if "Pro Max" in name or "Ultra" in name else \
              2 if "Pro" in name or "Plus" in name else \
              1 if "Max" in name or "FE" in name else 0
        return (0, -num, -sub)
    devices.sort(key=sort_key)
    return devices

@api_router.get("/devices/{device_id}", response_model=DeviceModel)
async def get_device(device_id: str):
    device = await db.devices.find_one({"id": device_id}, {"_id": 0})
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@api_router.post("/devices", response_model=DeviceModel)
async def create_device(device: DeviceCreate, admin=Depends(get_current_admin)):
    device_obj = DeviceModel(**device.model_dump())
    doc = prepare_doc_for_insert(device_obj)
    await db.devices.insert_one(doc)
    return device_obj

@api_router.put("/devices/{device_id}")
async def update_device(device_id: str, device: DeviceCreate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in device.model_dump().items() if v is not None}
    result = await db.devices.update_one({"id": device_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Device not found")
    updated = await db.devices.find_one({"id": device_id}, {"_id": 0})
    return updated

# ==================== SERVICE ENDPOINTS ====================

@api_router.get("/services", response_model=List[ServiceModel])
async def get_services():
    services = await db.services.find({"is_active": True}, {"_id": 0}).to_list(1000)
    order = {"svc-screen": 0, "svc-battery": 1, "svc-charging": 2}
    services.sort(key=lambda s: order.get(s.get("id", ""), 99))
    return services
@api_router.get("/services/{service_id}", response_model=ServiceModel)
async def get_service(service_id: str):
    service = await db.services.find_one({"id": service_id}, {"_id": 0})
    if not service:
        service = await db.services.find_one({"slug": service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@api_router.post("/services", response_model=ServiceModel)
async def create_service(service: ServiceCreate, admin=Depends(get_current_admin)):
    service_obj = ServiceModel(**service.model_dump())
    doc = prepare_doc_for_insert(service_obj)
    await db.services.insert_one(doc)
    return service_obj

@api_router.put("/services/{service_id}")
async def update_service(service_id: str, service: ServiceCreate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in service.model_dump().items() if v is not None}
    result = await db.services.update_one({"id": service_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    updated = await db.services.find_one({"id": service_id}, {"_id": 0})
    return updated

# ==================== PRICING ENDPOINTS ====================

@api_router.get("/pricing")
async def get_all_pricing():
    pricing = await db.pricing.find({"is_active": True}, {"_id": 0}).to_list(1000)
    return pricing

@api_router.get("/pricing/{device_id}/{service_id}")
async def get_pricing(device_id: str, service_id: str):
    pricing = await db.pricing.find_one(
        {"device_id": device_id, "service_id": service_id, "is_active": True}, 
        {"_id": 0}
    )
    if not pricing:
        raise HTTPException(status_code=404, detail="Pricing not found")
    return pricing

@api_router.post("/pricing", response_model=PricingModel)
async def create_pricing(pricing: PricingCreate, admin=Depends(get_current_admin)):
    pricing_obj = PricingModel(**pricing.model_dump())
    doc = prepare_doc_for_insert(pricing_obj)
    await db.pricing.insert_one(doc)
    return pricing_obj

@api_router.put("/pricing/{pricing_id}")
async def update_pricing(pricing_id: str, pricing: PricingCreate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in pricing.model_dump().items() if v is not None}
    result = await db.pricing.update_one({"id": pricing_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pricing not found")
    updated = await db.pricing.find_one({"id": pricing_id}, {"_id": 0})
    return updated

# ==================== BOOKING ENDPOINTS ====================

@api_router.get("/bookings", response_model=List[BookingModel])
async def get_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.get("/bookings/{booking_id}", response_model=BookingModel)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@api_router.post("/bookings", response_model=BookingModel)
async def create_booking(booking: BookingCreate):
    # Get device and service names
    device = await db.devices.find_one({"id": booking.device_id}, {"_id": 0})
    service = await db.services.find_one({"id": booking.service_id}, {"_id": 0})
    pricing = await db.pricing.find_one(
        {"device_id": booking.device_id, "service_id": booking.service_id}, 
        {"_id": 0}
    )
    
    if not pricing:
        raise HTTPException(status_code=400, detail="Pricing not found for this device and service")
    
    booking_data = booking.model_dump()
    device_name = f"{device['brand']} {device['name']}" if device else "Unknown"
    service_name = service["name"] if service else "Unknown"
    price = pricing["price"]
    
    booking_data["device_name"] = device_name
    booking_data["service_name"] = service_name
    booking_data["price"] = price
    
    booking_obj = BookingModel(**booking_data)
    doc = prepare_doc_for_insert(booking_obj)
    await db.bookings.insert_one(doc)
    
    # Send email notifications (fire-and-forget, don't block the response)
    booking_dict = booking_obj.model_dump()
    asyncio.create_task(_send_booking_emails(booking_dict, device_name, service_name, price))
    
    return booking_obj


async def _send_booking_emails(booking: dict, device_name: str, service_name: str, price: float):
    """Send both customer confirmation and admin notification emails."""
    customer_email = booking.get("customer_email")
    if customer_email:
        customer_html = build_customer_booking_email(booking, device_name, service_name, price)
        await send_email(
            to=customer_email,
            subject=f"Booking Confirmed — {device_name} {service_name} | HiFone",
            html=customer_html,
        )
    
    # Admin notification
    admin_html = build_admin_booking_email(booking, device_name, service_name, price)
    await send_email(
        to=ADMIN_EMAIL,
        subject=f"New Booking: {device_name} {service_name} — {booking.get('customer_name', 'Customer')}",
        html=admin_html,
    )

@api_router.patch("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str):
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Status updated"}

@api_router.post("/admin/test-email")
async def send_test_email(admin=Depends(get_current_admin)):
    """Send a test email to the admin to verify email setup"""
    html = """
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
      <h1 style="color:#1D1D1F;font-size:20px;">Email Setup Working</h1>
      <p style="color:#86868B;font-size:14px;">This confirms your HiFone email notifications are configured correctly.</p>
      <p style="color:#86868B;font-size:14px;">Booking confirmation emails will now be sent to customers and this admin address.</p>
    </div>
    """
    result = await send_email(to=ADMIN_EMAIL, subject="HiFone Test Email — Setup Confirmed", html=html)
    if result is None and RESEND_API_KEY.startswith('re_DUMMY'):
        return {"status": "skipped", "message": "Email skipped — using dummy API key. Add your real Resend API key to enable emails."}
    return {"status": "sent", "message": f"Test email sent to {ADMIN_EMAIL}"}

# ==================== TESTIMONIAL ENDPOINTS ====================

@api_router.get("/testimonials", response_model=List[TestimonialModel])
async def get_testimonials():
    testimonials = await db.testimonials.find({"is_active": True}, {"_id": 0}).to_list(100)
    return testimonials

@api_router.post("/testimonials", response_model=TestimonialModel)
async def create_testimonial(testimonial: TestimonialCreate):
    testimonial_obj = TestimonialModel(**testimonial.model_dump())
    doc = prepare_doc_for_insert(testimonial_obj)
    await db.testimonials.insert_one(doc)
    return testimonial_obj

# ==================== BLOG ENDPOINTS ====================

@api_router.get("/blogs", response_model=List[BlogModel])
async def get_blogs():
    blogs = await db.blogs.find({"is_published": True}, {"_id": 0}).to_list(100)
    return blogs

@api_router.get("/blogs/{slug}", response_model=BlogModel)
async def get_blog(slug: str):
    blog = await db.blogs.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@api_router.post("/blogs", response_model=BlogModel)
async def create_blog(blog: BlogCreate):
    blog_obj = BlogModel(**blog.model_dump())
    doc = prepare_doc_for_insert(blog_obj)
    await db.blogs.insert_one(doc)
    return blog_obj

# ==================== LOCATION ENDPOINTS ====================

@api_router.get("/locations", response_model=List[LocationModel])
async def get_locations():
    locations = await db.locations.find({"is_active": True}, {"_id": 0}).to_list(100)
    return locations

# ==================== CONTACT ENDPOINTS ====================

@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact(contact: ContactCreate):
    contact_obj = ContactSubmission(**contact.model_dump())
    doc = prepare_doc_for_insert(contact_obj)
    await db.contacts.insert_one(doc)
    return contact_obj

# ==================== BUSINESS SETTINGS ENDPOINTS ====================

@api_router.get("/settings")
async def get_settings():
    """Get business settings (public)"""
    settings = await db.settings.find_one({"id": "business-settings"}, {"_id": 0})
    if not settings:
        # Return defaults
        return {
            "id": "business-settings",
            "phone": "0432 977 092",
            "email": "info@hifone.com.au",
            "whatsapp": "61432977092",
            "address": "Kurralta Park, Adelaide SA 5037",
            "hours_weekday": "Monday - Saturday: 9am - 6pm",
            "hours_weekend": "Sunday: Closed",
            "google_maps_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.2!2d138.5722!3d-34.9456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKurralta+Park!5e0!3m2!1sen!2sau!4v1",
            "google_place_id": "ChIJxxxxxxxxxxxxxxx",
        }
    return settings

@api_router.put("/settings")
async def update_settings(request: Request, admin=Depends(get_current_admin)):
    """Update business settings (admin only)"""
    data = await request.json()
    data["id"] = "business-settings"
    await db.settings.update_one(
        {"id": "business-settings"},
        {"$set": data},
        upsert=True
    )
    updated = await db.settings.find_one({"id": "business-settings"}, {"_id": 0})
    return updated

# ==================== GOOGLE REVIEWS ENDPOINTS ====================

# Fallback static reviews when API key is dummy
STATIC_REVIEWS = [
    {"author_name": "Sarah Mitchell", "rating": 5, "relative_time_description": "2 weeks ago",
     "text": "Excellent service! Fixed my iPhone 14 screen in under an hour. The quality is amazing and the price was very reasonable."},
    {"author_name": "James Anderson", "rating": 5, "relative_time_description": "1 month ago",
     "text": "My Samsung had water damage and I thought it was gone forever. These guys worked magic! Everything is working perfectly now."},
    {"author_name": "Emma Thompson", "rating": 5, "relative_time_description": "1 month ago",
     "text": "Best phone repair shop in Adelaide! Quick, affordable, and they really know what they are doing. Highly recommend!"},
    {"author_name": "Michael Chen", "rating": 5, "relative_time_description": "2 months ago",
     "text": "Dropped my Pixel and shattered the screen. HiFone fixed it same day and it looks brand new. Great customer service!"},
    {"author_name": "Lisa Park", "rating": 5, "relative_time_description": "2 months ago",
     "text": "Amazing service. They replaced my iPad screen within an hour and it looks brand new. Very professional team."},
    {"author_name": "David Wilson", "rating": 5, "relative_time_description": "3 months ago",
     "text": "Fantastic experience! Battery replacement for my Samsung was quick and affordable. Will definitely come back."},
]

@api_router.get("/reviews")
async def get_google_reviews():
    """Get Google Reviews - fetches from Google Places API if key available, else returns cached/static"""
    import httpx
    
    # Try to fetch from Google Places API
    if GOOGLE_PLACES_API_KEY and GOOGLE_PLACES_API_KEY != 'DUMMY_KEY_REPLACE_ME':
        try:
            async with httpx.AsyncClient() as client_http:
                url = "https://maps.googleapis.com/maps/api/place/details/json"
                params = {
                    "place_id": GOOGLE_PLACE_ID,
                    "fields": "reviews,rating,user_ratings_total",
                    "key": GOOGLE_PLACES_API_KEY,
                }
                response = await client_http.get(url, params=params)
                data = response.json()
                
                if data.get("status") == "OK" and data.get("result"):
                    result = data["result"]
                    reviews = result.get("reviews", [])
                    return {
                        "reviews": reviews,
                        "rating": result.get("rating", 5.0),
                        "total_reviews": result.get("user_ratings_total", 150),
                        "source": "google_api",
                    }
        except Exception as e:
            logger.error(f"Google Places API error: {e}")
    
    # Fallback to static reviews
    return {
        "reviews": STATIC_REVIEWS,
        "rating": 5.0,
        "total_reviews": 150,
        "source": "static",
    }

# ── PUBLIC ENDPOINT: Customer submits mail-in form ──
@api_router.post("/mail-in-requests")
async def create_mail_in_request(request: MailInRequest):
    """
    Customer submits mail-in repair request.
    Saves to DB + sends emails to admin and customer.
    """
    doc = request.dict()
    doc["id"] = str(uuid.uuid4())
    doc["status"] = "pending"          # pending → received → diagnosing → repairing → shipped → completed
    doc["created_at"] = datetime.utcnow().isoformat()
    doc["updated_at"] = datetime.utcnow().isoformat()
 
    await db.mail_in_requests.insert_one(doc)
 
    # ── Email to ADMIN ──
    admin_html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:0;">
      <div style="background:#E31E24;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;">New Mail-in Repair Request</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">HiFone Repairs — Kurralta Park</p>
      </div>
      <div style="padding:32px;background:#fff;border:1px solid #eee;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;width:160px;">Name</td><td style="padding:10px 0;font-weight:600;color:#1a1a1a;">{doc['full_name']}</td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;">Phone</td><td style="padding:10px 0;font-weight:600;color:#1a1a1a;">{doc['phone']}</td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;">Email</td><td style="padding:10px 0;font-weight:600;color:#1a1a1a;">{doc['email']}</td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;">Device</td><td style="padding:10px 0;font-weight:600;color:#1a1a1a;">{doc['device_brand']} — {doc['device_model']}</td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;">Issue</td><td style="padding:10px 0;color:#1a1a1a;">{doc['issue_description']}</td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;">Return Address</td><td style="padding:10px 0;color:#1a1a1a;">{doc['street_address']}, {doc['suburb']} {doc['state']} {doc['postcode']}</td></tr>
          <tr><td style="padding:10px 0;color:#888;">Request ID</td><td style="padding:10px 0;color:#888;font-size:12px;">{doc['id']}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#fff8f0;border-left:4px solid #E31E24;border-radius:4px;">
          <p style="margin:0;font-size:13px;color:#555;">Device will arrive via Australia Post. Check tracking and update status in admin panel once received.</p>
        </div>
      </div>
      <div style="padding:16px 32px;background:#f9f9f9;text-align:center;">
        <p style="margin:0;font-size:12px;color:#aaa;">HiFone Repairs · Shop 153 Anzac Hwy, Kurralta Park SA 5037</p>
      </div>
    </div>
    """
    await send_email(
        to=ADMIN_EMAIL,
        subject=f"[Mail-in] {doc['device_brand']} {doc['device_model']} — {doc['full_name']}",
        html=admin_html
    )
 
    # ── Email to CUSTOMER ──
    customer_html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:0;">
      <div style="background:#E31E24;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;">Your Mail-in Request is Confirmed!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">HiFone Repairs — Kurralta Park</p>
      </div>
      <div style="padding:32px;background:#fff;border:1px solid #eee;">
        <p style="font-size:15px;color:#1a1a1a;">Hi <strong>{doc['full_name']}</strong>,</p>
        <p style="font-size:14px;color:#555;line-height:1.7;">We've received your mail-in repair request for your <strong>{doc['device_brand']} {doc['device_model']}</strong>. Here's what to do next:</p>
 
        <div style="margin:24px 0;">
          <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
            <div style="background:#E31E24;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">1</div>
            <div style="margin-left:14px;">
              <p style="margin:0;font-weight:600;font-size:14px;color:#1a1a1a;">Pack your device securely</p>
              <p style="margin:4px 0 0;font-size:13px;color:#777;">Wrap it in bubble wrap and place in a sturdy box. Include a note with your name and phone number inside.</p>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
            <div style="background:#E31E24;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">2</div>
            <div style="margin-left:14px;">
              <p style="margin:0;font-weight:600;font-size:14px;color:#1a1a1a;">Post to our address via Australia Post</p>
              <p style="margin:4px 0 0;font-size:13px;color:#777;"><strong>HiFone Repairs<br>Shop 153 Anzac Hwy<br>Kurralta Park SA 5037</strong></p>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
            <div style="background:#E31E24;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">3</div>
            <div style="margin-left:14px;">
              <p style="margin:0;font-weight:600;font-size:14px;color:#1a1a1a;">WhatsApp us your tracking number</p>
              <p style="margin:4px 0 0;font-size:13px;color:#777;">Send the Australia Post tracking number to <strong>0432 977 092</strong> on WhatsApp so we know when to expect it.</p>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;">
            <div style="background:#E31E24;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">4</div>
            <div style="margin-left:14px;">
              <p style="margin:0;font-weight:600;font-size:14px;color:#1a1a1a;">We repair and ship back within 48 hours</p>
              <p style="margin:4px 0 0;font-size:13px;color:#777;">Once received, we'll diagnose, repair, and ship your device back via tracked Australia Post. We'll contact you before starting any work.</p>
            </div>
          </div>
        </div>
 
        <div style="margin-top:24px;padding:16px;background:#f5f5f7;border-radius:8px;">
          <p style="margin:0 0 6px;font-size:12px;color:#888;">YOUR REQUEST ID</p>
          <p style="margin:0;font-size:13px;font-family:monospace;color:#1a1a1a;">{doc['id']}</p>
        </div>
      </div>
      <div style="padding:24px 32px;background:#1a1a1a;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;color:#fff;">Questions? WhatsApp us anytime</p>
        <a href="https://wa.me/61432977092" style="display:inline-block;background:#25D366;color:#fff;padding:10px 24px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:600;">WhatsApp 0432 977 092</a>
        <p style="margin:16px 0 0;font-size:11px;color:#666;">HiFone Repairs · Shop 153 Anzac Hwy, Kurralta Park SA 5037</p>
      </div>
    </div>
    """
    await send_email(
        to=doc['email'],
        subject="Your mail-in repair request is confirmed — HiFone",
        html=customer_html
    )
 
    return {
        "success": True,
        "id": doc["id"],
        "message": "Mail-in request submitted. Check your email for next steps."
    }
 
 
# ── PUBLIC ENDPOINT: Customer adds tracking number after posting ──
@api_router.patch("/mail-in-requests/{request_id}/tracking")
async def update_tracking_number(request_id: str, tracking_number: str):
    """Customer WhatsApps us tracking — or we can let them update via this endpoint too"""
    result = await db.mail_in_requests.update_one(
        {"id": request_id},
        {"$set": {"tracking_number": tracking_number, "updated_at": datetime.utcnow().isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"success": True}
 
 
# ── ADMIN ENDPOINTS ──
@api_router.get("/admin/mail-in-requests")
async def get_mail_in_requests(
    status: Optional[str] = None,
    admin=Depends(get_current_admin)
):
    """Admin: list all mail-in requests, optionally filter by status"""
    query = {}
    if status:
        query["status"] = status
    requests = await db.mail_in_requests.find(
        query, {"_id": 0}
    ).sort("created_at", -1).to_list(200)
    return {"requests": requests, "total": len(requests)}
 
 
@api_router.patch("/admin/mail-in-requests/{request_id}/status")
async def update_mail_in_status(
    request_id: str,
    body: MailInStatusUpdate,
    admin=Depends(get_current_admin)
):
    """Admin: update status of a mail-in request"""
    valid_statuses = ["pending", "received", "diagnosing", "repairing", "ready_to_ship", "shipped", "completed"]
    if body.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
 
    result = await db.mail_in_requests.update_one(
        {"id": request_id},
        {"$set": {"status": body.status, "updated_at": datetime.utcnow().isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
 
    # If status is "shipped", notify customer by email
    if body.status == "shipped":
        req = await db.mail_in_requests.find_one({"id": request_id}, {"_id": 0})
        if req:
            shipped_html = f"""
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#E31E24;padding:24px 32px;">
                <h1 style="color:#fff;margin:0;font-size:20px;">Your device has been shipped!</h1>
              </div>
              <div style="padding:32px;background:#fff;border:1px solid #eee;">
                <p style="font-size:15px;color:#1a1a1a;">Hi <strong>{req['full_name']}</strong>,</p>
                <p style="font-size:14px;color:#555;line-height:1.7;">Great news! Your repaired <strong>{req['device_brand']} {req['device_model']}</strong> has been shipped back to you via tracked Australia Post.</p>
                <p style="font-size:14px;color:#555;line-height:1.7;">It should arrive within 2-4 business days. We'll WhatsApp you the tracking number shortly.</p>
                <div style="margin-top:24px;padding:16px;background:#f0faf4;border-left:4px solid #25D366;border-radius:4px;">
                  <p style="margin:0;font-size:13px;color:#555;">Any questions? WhatsApp us on <strong>0432 977 092</strong></p>
                </div>
              </div>
              <div style="padding:16px 32px;background:#f9f9f9;text-align:center;">
                <p style="margin:0;font-size:12px;color:#aaa;">HiFone Repairs · Shop 153 Anzac Hwy, Kurralta Park SA 5037</p>
              </div>
            </div>
            """
            await send_email(
                to=req['email'],
                subject="Your repaired device has been shipped — HiFone",
                html=shipped_html
            )
 
    return {"success": True, "status": body.status}
 
 
@api_router.delete("/admin/mail-in-requests/{request_id}")
async def delete_mail_in_request(request_id: str, admin=Depends(get_current_admin)):
    """Admin: delete a mail-in request"""
    result = await db.mail_in_requests.delete_one({"id": request_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"success": True}
 

# ==================== SEO PAGE DATA ENDPOINT ====================

# Device slug mapping (URL slug → device ID)
DEVICE_SLUG_MAP = {
    "iphone-15-pro": "dev-iphone15pro",
    "iphone-15": "dev-iphone15",
    "iphone-14-pro": "dev-iphone14pro",
    "iphone-14": "dev-iphone14",
    "iphone-13-pro": "dev-iphone13pro",
    "iphone-13": "dev-iphone13",
    "iphone-12": "dev-iphone12",
    "iphone-se": "dev-iphonese",
    "samsung-s24-ultra": "dev-s24ultra",
    "samsung-s24": "dev-s24",
    "samsung-s23-ultra": "dev-s23ultra",
    "samsung-s23": "dev-s23",
    "samsung-s22": "dev-s22",
    "samsung-a54": "dev-a54",
    "samsung-z-flip-5": "dev-zflip5",
    "samsung-z-fold-5": "dev-zfold5",
    "ipad-pro": "dev-ipadpro",
    "ipad-air": "dev-ipadair",
    "ipad-10": "dev-ipad10",
    "ipad-mini": "dev-ipadmini",
    "pixel-8-pro": "dev-pixel8pro",
    "pixel-8": "dev-pixel8",
    "pixel-7": "dev-pixel7",
}

# Reverse map: device_id → slug
DEVICE_ID_TO_SLUG = {v: k for k, v in DEVICE_SLUG_MAP.items()}

# Service slug → service_id
SERVICE_SLUG_MAP = {
    "screen-repair": "svc-screen",
    "battery-replacement": "svc-battery",
    "water-damage-repair": "svc-water",
    "charging-port-repair": "svc-charging",
    "camera-repair": "svc-camera",
    "speaker-mic-repair": "svc-speaker",
}

SERVICE_ID_TO_SLUG = {v: k for k, v in SERVICE_SLUG_MAP.items()}

# Location data
LOCATION_DATA = {
    "adelaide": {
        "name": "Adelaide",
        "full_name": "Kurralta Park, Adelaide",
        "state": "SA",
        "postcode": "5037",
        "description": "Located in the heart of Kurralta Park, we serve customers across the entire Adelaide metropolitan area including CBD, North Adelaide, Glenelg, and surrounding suburbs.",
        "areas_served": ["Adelaide CBD", "North Adelaide", "Glenelg", "Unley", "Norwood", "Prospect", "Kurralta Park", "Mile End", "Thebarton", "Torrensville"],
    },
}

# Service-specific details for SEO pages
SERVICE_DETAILS = {
    "svc-screen": {
        "includes": [
            "Full screen and digitizer replacement",
            "Premium quality OLED/LCD display",
            "Touch sensitivity calibration",
            "Protective screen cleaning",
            "Post-repair quality testing",
        ],
        "common_issues": [
            "Cracked or shattered screen glass",
            "Unresponsive touch screen areas",
            "Display discoloration or dead pixels",
            "Screen flickering or ghosting",
            "Touchscreen not registering input",
        ],
    },
    "svc-battery": {
        "includes": [
            "Genuine replacement battery installation",
            "Battery health diagnostics",
            "Charging system inspection",
            "Power management calibration",
            "Post-replacement performance test",
        ],
        "common_issues": [
            "Rapid battery drain",
            "Device shutting down unexpectedly",
            "Battery swelling or overheating",
            "Slow charging or not charging",
            "Battery percentage jumping erratically",
        ],
    },
    "svc-water": {
        "includes": [
            "Ultrasonic cleaning treatment",
            "Corrosion removal and prevention",
            "Component-level inspection",
            "Moisture detection and drying",
            "Full functionality testing",
        ],
        "common_issues": [
            "Device dropped in water or liquid",
            "Moisture detected warning",
            "Speakers or microphone muffled after exposure",
            "Screen glitching after water contact",
            "Charging port not working after exposure",
        ],
    },
    "svc-charging": {
        "includes": [
            "Charging port replacement or repair",
            "Connector pin cleaning and alignment",
            "Cable compatibility testing",
            "Fast charging verification",
            "Data transfer functionality check",
        ],
        "common_issues": [
            "Loose or wobbly charging connection",
            "Device not recognizing charger",
            "Slow or intermittent charging",
            "Debris buildup in charging port",
            "Wireless charging not working",
        ],
    },
    "svc-camera": {
        "includes": [
            "Camera lens replacement",
            "Sensor cleaning and calibration",
            "Autofocus mechanism repair",
            "Camera glass replacement",
            "Image quality verification",
        ],
        "common_issues": [
            "Blurry or out-of-focus photos",
            "Cracked camera lens glass",
            "Black screen when opening camera",
            "Camera app crashing",
            "Front or rear camera not working",
        ],
    },
    "svc-speaker": {
        "includes": [
            "Speaker unit replacement",
            "Microphone module repair",
            "Audio IC inspection",
            "Sound quality calibration",
            "Call quality testing",
        ],
        "common_issues": [
            "No sound from speaker",
            "Muffled or distorted audio",
            "Microphone not picking up voice",
            "Crackling during calls",
            "Low volume despite max settings",
        ],
    },
}


@api_router.get("/seo-page-data")
async def get_seo_page_data(device_slug: str, service_slug: str, location: str = "adelaide"):
    """Get all data needed for a dynamic SEO page in a single call"""
    
    # Resolve device
    device_id = DEVICE_SLUG_MAP.get(device_slug)
    if not device_id:
        raise HTTPException(status_code=404, detail="Device not found")
    
    # Resolve service
    service_id = SERVICE_SLUG_MAP.get(service_slug)
    if not service_id:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Fetch device, service, and pricing in parallel-ish
    device = await db.devices.find_one({"id": device_id, "is_active": True}, {"_id": 0})
    service = await db.services.find_one({"id": service_id, "is_active": True}, {"_id": 0})
    pricing = await db.pricing.find_one(
        {"device_id": device_id, "service_id": service_id, "is_active": True}, {"_id": 0}
    )
    
    if not device or not service:
        raise HTTPException(status_code=404, detail="Device or service not found")
    
    # Get related services (other services for same device with pricing)
    related_pricing = await db.pricing.find(
        {"device_id": device_id, "service_id": {"$ne": service_id}, "is_active": True}, {"_id": 0}
    ).to_list(10)
    
    related_services = []
    for rp in related_pricing:
        svc = await db.services.find_one({"id": rp["service_id"], "is_active": True}, {"_id": 0})
        if svc:
            svc_slug = SERVICE_ID_TO_SLUG.get(rp["service_id"], "")
            related_services.append({
                "service_name": svc["name"],
                "service_slug": svc_slug,
                "price": rp["price"],
                "repair_time": rp.get("repair_time", ""),
                "seo_slug": f"{device_slug}-{svc_slug}-{location}",
            })
    
    # Get related devices (same brand, different device, same service)
    same_brand_devices = await db.devices.find(
        {"brand": device["brand"], "id": {"$ne": device_id}, "is_active": True}, {"_id": 0}
    ).to_list(10)
    
    related_devices = []
    for rd in same_brand_devices:
        rd_pricing = await db.pricing.find_one(
            {"device_id": rd["id"], "service_id": service_id, "is_active": True}, {"_id": 0}
        )
        if rd_pricing:
            dev_slug = DEVICE_ID_TO_SLUG.get(rd["id"], "")
            related_devices.append({
                "device_name": rd["name"],
                "device_slug": dev_slug,
                "brand": rd["brand"],
                "price": rd_pricing["price"],
                "seo_slug": f"{dev_slug}-{service_slug}-{location}",
            })
    
    # Get location data
    loc_data = LOCATION_DATA.get(location, LOCATION_DATA["adelaide"])
    
    # Get service details
    svc_details = SERVICE_DETAILS.get(service_id, {})
    
    # Add slug to device for frontend use
    device["slug"] = device_slug
    service["url_slug"] = service_slug
    
    return {
        "device": device,
        "service": service,
        "pricing": pricing,
        "location": loc_data,
        "location_slug": location,
        "service_details": svc_details,
        "related_services": related_services,
        "related_devices": related_devices,
    }


@api_router.get("/seo-slugs")
async def get_all_seo_slugs():
    """Return all valid SEO page slug combinations for sitemap/internal linking"""
    slugs = []
    for device_slug, device_id in DEVICE_SLUG_MAP.items():
        # Check which services have pricing for this device
        device_pricing = await db.pricing.find(
            {"device_id": device_id, "is_active": True}, {"_id": 0, "service_id": 1}
        ).to_list(100)
        
        for pp in device_pricing:
            service_slug = SERVICE_ID_TO_SLUG.get(pp["service_id"])
            if service_slug:
                slugs.append({
                    "slug": f"{device_slug}-{service_slug}-adelaide",
                    "device_slug": device_slug,
                    "service_slug": service_slug,
                    "location": "adelaide",
                })
    
    return {"slugs": slugs, "total": len(slugs)}


# ==================== SEED DATA ENDPOINT ====================

@api_router.post("/seed")
async def seed_database():
    """Seed initial data for the application"""
    
    # Check if already seeded
    existing_services = await db.services.count_documents({})
    if existing_services > 0:
        return {"message": "Database already seeded"}
    
    # Seed Services
    services = [
        {
            "id": "svc-screen", "name": "Screen Repair", "slug": "screen-repair",
            "description": "Professional screen replacement for cracked, shattered, or unresponsive displays. We use premium quality screens with precise color calibration.",
            "short_description": "Fix cracked or damaged screens",
            "icon": "Smartphone", "is_active": True
        },
        {
            "id": "svc-battery", "name": "Battery Replacement", "slug": "battery-replacement",
            "description": "Restore your device's battery life with genuine replacement batteries. Say goodbye to frequent charging and unexpected shutdowns.",
            "short_description": "Restore your battery life",
            "icon": "Battery", "is_active": True
        },
        {
            "id": "svc-water", "name": "Water Damage Repair", "slug": "water-damage-repair",
            "description": "Expert water damage recovery using advanced ultrasonic cleaning technology. Quick response is critical - bring your device in immediately.",
            "short_description": "Recover from water accidents",
            "icon": "Droplets", "is_active": True
        },
        {
            "id": "svc-charging", "name": "Charging Port Repair", "slug": "charging-port-repair",
            "description": "Fix charging issues with precision port repair or replacement. Solve slow charging, loose connections, and debris buildup.",
            "short_description": "Fix charging issues",
            "icon": "PlugZap", "is_active": True
        },
        {
            "id": "svc-camera", "name": "Camera Repair", "slug": "camera-repair",
            "description": "Restore your camera quality with professional lens and sensor replacement. Fix blurry photos, focus issues, and cracked camera glass.",
            "short_description": "Restore camera quality",
            "icon": "Camera", "is_active": True
        },
        {
            "id": "svc-speaker", "name": "Speaker & Mic Repair", "slug": "speaker-mic-repair",
            "description": "Fix audio issues including muffled sound, no audio, or microphone problems. Crystal clear calls and media playback restored.",
            "short_description": "Fix audio issues",
            "icon": "Volume2", "is_active": True
        }
    ]
    
    for svc in services:
        svc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.services.insert_many(services)
    
    # Seed Devices
    devices = [
        # iPhones
        {"id": "dev-iphone15pro", "name": "iPhone 15 Pro", "brand": "Apple", "is_active": True},
        {"id": "dev-iphone15", "name": "iPhone 15", "brand": "Apple", "is_active": True},
        {"id": "dev-iphone14pro", "name": "iPhone 14 Pro", "brand": "Apple", "is_active": True},
        {"id": "dev-iphone14", "name": "iPhone 14", "brand": "Apple", "is_active": True},
        {"id": "dev-iphone13pro", "name": "iPhone 13 Pro", "brand": "Apple", "is_active": True},
        {"id": "dev-iphone13", "name": "iPhone 13", "brand": "Apple", "is_active": True},
        {"id": "dev-iphone12", "name": "iPhone 12", "brand": "Apple", "is_active": True},
        {"id": "dev-iphonese", "name": "iPhone SE", "brand": "Apple", "is_active": True},
        # Samsung
        {"id": "dev-s24ultra", "name": "Galaxy S24 Ultra", "brand": "Samsung", "is_active": True},
        {"id": "dev-s24", "name": "Galaxy S24", "brand": "Samsung", "is_active": True},
        {"id": "dev-s23ultra", "name": "Galaxy S23 Ultra", "brand": "Samsung", "is_active": True},
        {"id": "dev-s23", "name": "Galaxy S23", "brand": "Samsung", "is_active": True},
        {"id": "dev-s22", "name": "Galaxy S22", "brand": "Samsung", "is_active": True},
        {"id": "dev-a54", "name": "Galaxy A54", "brand": "Samsung", "is_active": True},
        {"id": "dev-zflip5", "name": "Galaxy Z Flip 5", "brand": "Samsung", "is_active": True},
        {"id": "dev-zfold5", "name": "Galaxy Z Fold 5", "brand": "Samsung", "is_active": True},
        # iPad
        {"id": "dev-ipadpro", "name": "iPad Pro", "brand": "iPad", "is_active": True},
        {"id": "dev-ipadair", "name": "iPad Air", "brand": "iPad", "is_active": True},
        {"id": "dev-ipad10", "name": "iPad 10th Gen", "brand": "iPad", "is_active": True},
        {"id": "dev-ipadmini", "name": "iPad Mini", "brand": "iPad", "is_active": True},
        # Google
        {"id": "dev-pixel8pro", "name": "Pixel 8 Pro", "brand": "Google", "is_active": True},
        {"id": "dev-pixel8", "name": "Pixel 8", "brand": "Google", "is_active": True},
        {"id": "dev-pixel7", "name": "Pixel 7", "brand": "Google", "is_active": True},
    ]
    
    for dev in devices:
        dev["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.devices.insert_many(devices)
    
    # Seed Pricing
    pricing_data = []
    
    # Apple pricing
    apple_devices = [d for d in devices if d["brand"] == "Apple"]
    for device in apple_devices:
        pricing_data.extend([
            {"id": f"price-{device['id']}-screen", "device_id": device["id"], "service_id": "svc-screen", 
             "price": 249.00 if "Pro" in device["name"] else 199.00, "original_price": 299.00 if "Pro" in device["name"] else 249.00,
             "repair_time": "30-60 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-battery", "device_id": device["id"], "service_id": "svc-battery",
             "price": 89.00, "original_price": 129.00, "repair_time": "20-30 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-water", "device_id": device["id"], "service_id": "svc-water",
             "price": 149.00, "repair_time": "24-48 hrs", "warranty": "30 days", "is_active": True},
            {"id": f"price-{device['id']}-charging", "device_id": device["id"], "service_id": "svc-charging",
             "price": 79.00, "repair_time": "30-45 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-camera", "device_id": device["id"], "service_id": "svc-camera",
             "price": 129.00 if "Pro" in device["name"] else 99.00, "repair_time": "45-60 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-speaker", "device_id": device["id"], "service_id": "svc-speaker",
             "price": 69.00, "repair_time": "30-45 min", "warranty": "90 days", "is_active": True},
        ])
    
    # Samsung pricing
    samsung_devices = [d for d in devices if d["brand"] == "Samsung"]
    for device in samsung_devices:
        is_premium = "Ultra" in device["name"] or "Fold" in device["name"] or "Flip" in device["name"]
        pricing_data.extend([
            {"id": f"price-{device['id']}-screen", "device_id": device["id"], "service_id": "svc-screen",
             "price": 299.00 if is_premium else 179.00, "original_price": 399.00 if is_premium else 229.00,
             "repair_time": "45-90 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-battery", "device_id": device["id"], "service_id": "svc-battery",
             "price": 79.00, "original_price": 119.00, "repair_time": "20-30 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-water", "device_id": device["id"], "service_id": "svc-water",
             "price": 129.00, "repair_time": "24-48 hrs", "warranty": "30 days", "is_active": True},
            {"id": f"price-{device['id']}-charging", "device_id": device["id"], "service_id": "svc-charging",
             "price": 69.00, "repair_time": "30-45 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-camera", "device_id": device["id"], "service_id": "svc-camera",
             "price": 149.00 if is_premium else 89.00, "repair_time": "45-60 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-speaker", "device_id": device["id"], "service_id": "svc-speaker",
             "price": 59.00, "repair_time": "30-45 min", "warranty": "90 days", "is_active": True},
        ])
    
    # iPad pricing
    ipad_devices = [d for d in devices if d["brand"] == "iPad"]
    for device in ipad_devices:
        is_pro = "Pro" in device["name"]
        pricing_data.extend([
            {"id": f"price-{device['id']}-screen", "device_id": device["id"], "service_id": "svc-screen",
             "price": 349.00 if is_pro else 249.00, "original_price": 449.00 if is_pro else 299.00,
             "repair_time": "60-90 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-battery", "device_id": device["id"], "service_id": "svc-battery",
             "price": 129.00, "original_price": 179.00, "repair_time": "45-60 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-charging", "device_id": device["id"], "service_id": "svc-charging",
             "price": 99.00, "repair_time": "45-60 min", "warranty": "90 days", "is_active": True},
        ])
    
    # Google pricing
    google_devices = [d for d in devices if d["brand"] == "Google"]
    for device in google_devices:
        is_pro = "Pro" in device["name"]
        pricing_data.extend([
            {"id": f"price-{device['id']}-screen", "device_id": device["id"], "service_id": "svc-screen",
             "price": 229.00 if is_pro else 189.00, "original_price": 279.00 if is_pro else 239.00,
             "repair_time": "45-60 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-battery", "device_id": device["id"], "service_id": "svc-battery",
             "price": 79.00, "original_price": 109.00, "repair_time": "20-30 min", "warranty": "90 days", "is_active": True},
            {"id": f"price-{device['id']}-charging", "device_id": device["id"], "service_id": "svc-charging",
             "price": 69.00, "repair_time": "30-45 min", "warranty": "90 days", "is_active": True},
        ])
    
    await db.pricing.insert_many(pricing_data)
    
    # Seed Testimonials
    testimonials = [
        {"id": "test-1", "name": "Sarah M.", "rating": 5, 
         "review": "Fixed my iPhone 14 Pro screen in under an hour. Looks brand new! The quality is indistinguishable from the original.",
         "device_repaired": "iPhone 14 Pro", "is_active": True},
        {"id": "test-2", "name": "James L.", "rating": 5,
         "review": "My Samsung was completely water damaged. They recovered everything and now it works perfectly. Miracle workers!",
         "device_repaired": "Samsung S23", "is_active": True},
        {"id": "test-3", "name": "Emma K.", "rating": 5,
         "review": "Best battery replacement service in Adelaide. My old iPhone feels brand new again. Fast, professional, and affordable.",
         "device_repaired": "iPhone 12", "is_active": True},
        {"id": "test-4", "name": "Michael R.", "rating": 5,
         "review": "Dropped my Pixel and thought it was done for. These guys saved it in 45 minutes. Highly recommend!",
         "device_repaired": "Pixel 7", "is_active": True},
        {"id": "test-5", "name": "Lisa T.", "rating": 5,
         "review": "Professional service from start to finish. They kept me informed throughout the repair process. 10/10!",
         "device_repaired": "iPad Pro", "is_active": True},
    ]
    
    for t in testimonials:
        t["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.testimonials.insert_many(testimonials)
    
    # Seed Locations
    locations = [
        {"id": "loc-adelaide-cbd", "name": "Adelaide CBD", "slug": "adelaide-cbd", 
         "address": "123 Rundle Mall, Adelaide SA 5000", "is_active": True},
        {"id": "loc-north-adelaide", "name": "North Adelaide", "slug": "north-adelaide",
         "address": "45 O'Connell Street, North Adelaide SA 5006", "is_active": True},
        {"id": "loc-glenelg", "name": "Glenelg", "slug": "glenelg",
         "address": "78 Jetty Road, Glenelg SA 5045", "is_active": True},
    ]
    await db.locations.insert_many(locations)
    
    # Seed Admin User
    existing_admin = await db.admins.count_documents({})
    if existing_admin == 0:
        admin_doc = {
            "id": "admin-1",
            "email": "admin@hifone.com.au",
            "password_hash": hash_password("admin123"),
            "name": "HiFone Admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.admins.insert_one(admin_doc)
    
    return {"message": "Database seeded successfully", "services": len(services), "devices": len(devices), "pricing": len(pricing_data)}

# ==================== ROOT ENDPOINT ====================

@api_router.get("/")
async def root():
    return {"message": "HiFone Repairs API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def ensure_admin_user():
    """Ensure default admin user and business settings exist"""
    existing = await db.admins.find_one({"email": "admin@hifone.com.au"})
    if not existing:
        admin_doc = {
            "id": "admin-1",
            "email": "admin@hifone.com.au",
            "password_hash": hash_password("admin123"),
            "name": "HiFone Admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.admins.insert_one(admin_doc)
        logger.info("Default admin user created: admin@hifone.com.au")
    
    # Ensure business settings exist
    existing_settings = await db.settings.find_one({"id": "business-settings"})
    if not existing_settings:
        settings_doc = {
            "id": "business-settings",
            "phone": "0432 977 092",
            "email": "info@hifone.com.au",
            "whatsapp": "61432977092",
            "address": "Kurralta Park, Adelaide SA 5037",
            "hours_weekday": "Monday - Saturday: 9am - 6pm",
            "hours_weekend": "Sunday: Closed",
            "google_maps_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.2!2d138.5722!3d-34.9456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKurralta+Park!5e0!3m2!1sen!2sau!4v1",
            "google_place_id": "ChIJxxxxxxxxxxxxxxx",
        }
        await db.settings.insert_one(settings_doc)
        logger.info("Default business settings created")

    # Mail-in requests indexes
    await db.mail_in_requests.create_index("id", unique=True)
    await db.mail_in_requests.create_index("status")
    await db.mail_in_requests.create_index("created_at")
    logger.info("mail_in_requests indexes ensured")
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
