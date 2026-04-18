import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wrench, Smartphone, DollarSign, Calendar, 
  FileText, Users, Settings, LogOut, Menu, X, Plus, Pencil, Trash2,
  ChevronRight, Search, Filter, Lock, Mail, Eye, EyeOff,
  Package
} from 'lucide-react';
import api, { deviceApi, serviceApi, pricingApi, bookingApi, blogApi, testimonialApi, authApi, settingsApi ,mailInApi } from '../lib/api';
import { formatPrice, formatDate, cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { SEO } from '../components/SEO';

const LOGO_URL = 'https://www.hifone.com.au/assets/frontend/images/logo.png';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Bookings', icon: Calendar, href: '/admin/bookings' },
  { name: 'Services', icon: Wrench, href: '/admin/services' },
  { name: 'Devices', icon: Smartphone, href: '/admin/devices' },
  { name: 'Pricing', icon: DollarSign, href: '/admin/pricing' },
  { name: 'Mail-in Requests', icon: Package, href: '/admin/mail-in' },
  { name: 'Blogs', icon: FileText, href: '/admin/blogs' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },

];

// Admin Layout Component
const AdminLayout = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <SEO title="Admin Panel" noIndex={true} />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
          <img src={LOGO_URL} alt="HiFone" className="h-8" />
          <div className="w-10" />
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-[#1D1D1F] transform transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <img src={LOGO_URL} alt="HiFone" className="h-8 brightness-0 invert" />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-[#E31E24] text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                  data-testid={`admin-nav-${item.name.toLowerCase()}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Back to Site & Logout */}
          <div className="p-4 border-t border-white/10 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              Back to Website
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-red-400 text-sm font-medium transition-colors w-full"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

// Dashboard Page
const DashboardPage = () => {
  const [stats, setStats] = useState({
    bookings: 0,
    services: 0,
    devices: 0,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, servicesRes, devicesRes] = await Promise.all([
          bookingApi.getAll(),
          serviceApi.getAll(),
          deviceApi.getAll(),
        ]);
        
        const bookings = bookingsRes.data || [];
        setStats({
          bookings: bookings.length,
          services: (servicesRes.data || []).length,
          devices: (devicesRes.data || []).length,
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
        });
        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#1D1D1F] mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'bg-[#E31E24]' },
          { label: 'Pending', value: stats.pendingBookings, icon: Calendar, color: 'bg-[#FF9500]' },
          { label: 'Services', value: stats.services, icon: Wrench, color: 'bg-[#34C759]' },
          { label: 'Devices', value: stats.devices, icon: Smartphone, color: 'bg-[#AF52DE]' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1D1D1F]">{stat.value}</p>
            <p className="text-sm text-[#86868B]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-semibold text-[#1D1D1F]">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-[#E31E24] text-sm font-medium">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-[#F5F5F7] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="text-[#86868B] text-center py-8">No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                <div>
                  <p className="font-medium text-[#1D1D1F]">{booking.customer_name}</p>
                  <p className="text-sm text-[#86868B]">{booking.device_name} - {booking.service_name}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    booking.status === 'pending' ? 'bg-[#FF9500]/10 text-[#FF9500]' :
                    booking.status === 'confirmed' ? 'bg-[#34C759]/10 text-[#34C759]' :
                    'bg-[#86868B]/10 text-[#86868B]'
                  )}>
                    {booking.status}
                  </span>
                  <p className="text-sm text-[#86868B] mt-1">{booking.booking_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Bookings Management Page
const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingApi.getAll();
        setBookings(res.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await bookingApi.updateStatus(bookingId, newStatus);
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
      toast.success('Booking status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1D1D1F]">Bookings</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#86868B]">Loading...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-[#86868B]">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F7]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Device</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Date/Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} data-testid={`booking-row-${booking.id}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1D1D1F]">{booking.customer_name}</p>
                      <p className="text-sm text-[#86868B]">{booking.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-[#1D1D1F]">{booking.device_name}</td>
                    <td className="px-6 py-4 text-[#1D1D1F]">{booking.service_name}</td>
                    <td className="px-6 py-4">
                      <p className="text-[#1D1D1F]">{booking.booking_date}</p>
                      <p className="text-sm text-[#86868B]">{booking.booking_time}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1D1D1F]">{formatPrice(booking.price)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        booking.status === 'pending' ? 'bg-[#FF9500]/10 text-[#FF9500]' :
                        booking.status === 'confirmed' ? 'bg-[#E31E24]/10 text-[#E31E24]' :
                        booking.status === 'completed' ? 'bg-[#34C759]/10 text-[#34C759]' :
                        'bg-[#FF3B30]/10 text-[#FF3B30]'
                      )}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Select 
                        value={booking.status} 
                        onValueChange={(value) => updateStatus(booking.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Services Management Page
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', short_description: '', icon: 'Smartphone' });
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await serviceApi.getAll();
      setServices(res.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', short_description: '', icon: 'Smartphone' });
    setDialogOpen(true);
  };

  const openEdit = (svc) => {
    setEditing(svc);
    setForm({ name: svc.name, slug: svc.slug, description: svc.description, short_description: svc.short_description, icon: svc.icon || 'Smartphone' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.description || !form.short_description) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await serviceApi.update(editing.id, form);
        toast.success('Service updated');
      } else {
        await serviceApi.create(form);
        toast.success('Service added');
      }
      setDialogOpen(false);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1D1D1F]">Services</h1>
        <Button onClick={openAdd} className="bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-xl" data-testid="add-service-btn">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between" data-testid={`service-row-${service.id}`}>
              <div>
                <h3 className="font-semibold text-[#1D1D1F]">{service.name}</h3>
                <p className="text-sm text-[#86868B]">{service.short_description}</p>
                <p className="text-xs text-[#86868B] mt-1">Slug: {service.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  service.is_active ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                )}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
                <Button variant="outline" size="sm" onClick={() => openEdit(service)} className="rounded-lg" data-testid={`edit-service-${service.id}`}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
            <DialogDescription>{editing ? 'Update service details below.' : 'Fill in the details for the new service.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => { setForm({...form, name: e.target.value, slug: editing ? form.slug : autoSlug(e.target.value)}); }} placeholder="Screen Repair" data-testid="service-name-input" />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="screen-repair" data-testid="service-slug-input" />
            </div>
            <div>
              <Label>Short Description *</Label>
              <Input value={form.short_description} onChange={(e) => setForm({...form, short_description: e.target.value})} placeholder="Fix cracked or damaged screens" data-testid="service-short-desc-input" />
            </div>
            <div>
              <Label>Full Description *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Professional screen replacement..." rows={3} data-testid="service-desc-input" />
            </div>
            <div>
              <Label>Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({...form, icon: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Smartphone', 'Battery', 'Droplets', 'PlugZap', 'Camera', 'Volume2', 'Monitor', 'Tablet', 'Wifi', 'Wrench'].map(i => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#E31E24] hover:bg-[#E31E24] text-white" data-testid="save-service-btn">
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Devices Management Page
const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', brand: 'Apple' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [devicesRes, brandsRes] = await Promise.all([
        deviceApi.getAll(),
        deviceApi.getBrands(),
      ]);
      setDevices(devicesRes.data || []);
      setBrands(brandsRes.data.brands || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', brand: 'Apple' });
    setDialogOpen(true);
  };

  const openEdit = (dev) => {
    setEditing(dev);
    setForm({ name: dev.name, brand: dev.brand });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await deviceApi.update(editing.id, form);
        toast.success('Device updated');
      } else {
        await deviceApi.create(form);
        toast.success('Device added');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save device');
    } finally {
      setSaving(false);
    }
  };

  const filteredDevices = selectedBrand === 'all'
    ? devices
    : devices.filter(d => d.brand === selectedBrand);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1D1D1F]">Devices</h1>
        <div className="flex items-center gap-3">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openAdd} className="bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-xl" data-testid="add-device-btn">
            <Plus className="w-4 h-4 mr-2" /> Add Device
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(8)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)
        ) : (
          filteredDevices.map((device) => (
            <div key={device.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-start justify-between" data-testid={`device-card-${device.id}`}>
              <div>
                <p className="font-medium text-[#1D1D1F]">{device.name}</p>
                <p className="text-sm text-[#86868B]">{device.brand}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openEdit(device)} className="p-1.5 h-auto" data-testid={`edit-device-${device.id}`}>
                <Pencil className="w-3.5 h-3.5 text-[#86868B]" />
              </Button>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Device' : 'Add Device'}</DialogTitle>
            <DialogDescription>{editing ? 'Update device details below.' : 'Fill in the details for the new device.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Device Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="iPhone 16 Pro" data-testid="device-name-input" />
            </div>
            <div>
              <Label>Brand *</Label>
              <Select value={form.brand} onValueChange={(v) => setForm({...form, brand: v})}>
                <SelectTrigger data-testid="device-brand-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Apple', 'Samsung', 'Google', 'iPad', 'OnePlus', 'Huawei', 'Other'].map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#E31E24] hover:bg-[#E31E24] text-white" data-testid="save-device-btn">
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Device'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Pricing Management Page
const PricingPage = () => {
  const [pricing, setPricing] = useState([]);
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ device_id: '', service_id: '', price: '', original_price: '', repair_time: '30-60 min', warranty: '90 days' });
  const [saving, setSaving] = useState(false);
  const [filterDevice, setFilterDevice] = useState('all');

  const fetchData = async () => {
    try {
      const [pricingRes, devicesRes, servicesRes] = await Promise.all([
        pricingApi.getAll(),
        deviceApi.getAll(),
        serviceApi.getAll(),
      ]);
      setPricing(pricingRes.data || []);
      setDevices(devicesRes.data || []);
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getDeviceName = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    return device ? `${device.brand} ${device.name}` : deviceId;
  };

  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ device_id: devices[0]?.id || '', service_id: services[0]?.id || '', price: '', original_price: '', repair_time: '30-60 min', warranty: '90 days' });
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      device_id: item.device_id,
      service_id: item.service_id,
      price: String(item.price),
      original_price: item.original_price ? String(item.original_price) : '',
      repair_time: item.repair_time,
      warranty: item.warranty,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.device_id || !form.service_id || !form.price) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    const payload = {
      device_id: form.device_id,
      service_id: form.service_id,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      repair_time: form.repair_time,
      warranty: form.warranty,
    };
    try {
      if (editing) {
        await pricingApi.update(editing.id, payload);
        toast.success('Pricing updated');
      } else {
        await pricingApi.create(payload);
        toast.success('Pricing added');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save pricing');
    } finally {
      setSaving(false);
    }
  };

  const filteredPricing = filterDevice === 'all' ? pricing : pricing.filter(p => p.device_id === filterDevice);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1D1D1F]">Pricing</h1>
        <div className="flex items-center gap-3">
          <Select value={filterDevice} onValueChange={setFilterDevice}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              {devices.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.brand} {d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openAdd} className="bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-xl" data-testid="add-pricing-btn">
            <Plus className="w-4 h-4 mr-2" /> Add Pricing
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#86868B]">Loading...</div>
        ) : filteredPricing.length === 0 ? (
          <div className="p-8 text-center text-[#86868B]">No pricing entries found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F7]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Device</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Original</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Warranty</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#86868B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredPricing.map((item) => (
                  <tr key={item.id} data-testid={`pricing-row-${item.id}`}>
                    <td className="px-6 py-4 text-[#1D1D1F] text-sm">{getDeviceName(item.device_id)}</td>
                    <td className="px-6 py-4 text-[#1D1D1F] text-sm">{getServiceName(item.service_id)}</td>
                    <td className="px-6 py-4 font-medium text-[#E31E24]">{formatPrice(item.price)}</td>
                    <td className="px-6 py-4 text-[#86868B] text-sm">{item.original_price ? formatPrice(item.original_price) : '-'}</td>
                    <td className="px-6 py-4 text-[#1D1D1F] text-sm">{item.repair_time}</td>
                    <td className="px-6 py-4 text-[#1D1D1F] text-sm">{item.warranty}</td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="rounded-lg" data-testid={`edit-pricing-${item.id}`}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-sm text-[#86868B] mt-4">{filteredPricing.length} pricing entries</p>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Pricing' : 'Add Pricing'}</DialogTitle>
            <DialogDescription>{editing ? 'Update pricing details below.' : 'Set pricing for a device + service combination.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Device *</Label>
              <Select value={form.device_id} onValueChange={(v) => setForm({...form, device_id: v})} disabled={!!editing}>
                <SelectTrigger data-testid="pricing-device-select"><SelectValue placeholder="Select device" /></SelectTrigger>
                <SelectContent>
                  {devices.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.brand} {d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Service *</Label>
              <Select value={form.service_id} onValueChange={(v) => setForm({...form, service_id: v})} disabled={!!editing}>
                <SelectTrigger data-testid="pricing-service-select"><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>
                  {services.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (AUD) *</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="199.00" data-testid="pricing-price-input" />
              </div>
              <div>
                <Label>Original Price</Label>
                <Input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm({...form, original_price: e.target.value})} placeholder="249.00" data-testid="pricing-original-price-input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Repair Time *</Label>
                <Select value={form.repair_time} onValueChange={(v) => setForm({...form, repair_time: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['15-30 min', '20-30 min', '30-45 min', '30-60 min', '45-60 min', '45-90 min', '60-90 min', '1-2 hrs', '24-48 hrs'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Warranty *</Label>
                <Select value={form.warranty} onValueChange={(v) => setForm({...form, warranty: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['30 days', '60 days', '90 days', '6 months', '12 months'].map(w => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#E31E24] hover:bg-[#E31E24] text-white" data-testid="save-pricing-btn">
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Pricing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main Admin Page Component
// ==================== SETTINGS PAGE ====================

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    hours_weekday: '',
    hours_weekend: '',
    google_maps_embed: '',
    google_place_id: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsApi.get();
        const data = res.data;
        setSettings(data);
        setForm({
          phone: data.phone || '',
          email: data.email || '',
          whatsapp: data.whatsapp || '',
          address: data.address || '',
          hours_weekday: data.hours_weekday || '',
          hours_weekend: data.hours_weekend || '',
          google_maps_embed: data.google_maps_embed || '',
          google_place_id: data.google_place_id || '',
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(form);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    try {
      const res = await settingsApi.testEmail();
      if (res.data.status === 'skipped') {
        toast.info(res.data.message);
      } else {
        toast.success('Test email sent to admin');
      }
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-[#86868B]">Loading settings...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1D1D1F]">Business Settings</h1>
        <Button onClick={handleSave} disabled={saving} className="bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-xl" data-testid="save-settings-btn">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Email Notification Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" data-testid="settings-email-notifications">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#1D1D1F]">Email Notifications</h2>
              <p className="text-sm text-[#86868B] mt-1">Booking confirmation sent to customer + admin notification on every new booking</p>
            </div>
            <Button variant="outline" onClick={handleTestEmail} disabled={testingEmail} className="rounded-xl" data-testid="test-email-btn">
              {testingEmail ? 'Sending...' : 'Send Test Email'}
            </Button>
          </div>
        </div>
        {/* Contact Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" data-testid="settings-contact">
          <h2 className="font-display text-lg font-semibold text-[#1D1D1F] mb-4">Contact Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-[#1D1D1F]">Phone Number</Label>
              <Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="mt-1.5 rounded-xl" data-testid="settings-phone" />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#1D1D1F]">Email</Label>
              <Input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="mt-1.5 rounded-xl" data-testid="settings-email" />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#1D1D1F]">WhatsApp Number</Label>
              <Input value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} placeholder="61432977092" className="mt-1.5 rounded-xl" data-testid="settings-whatsapp" />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#1D1D1F]">Store Address</Label>
              <Input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="mt-1.5 rounded-xl" data-testid="settings-address" />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" data-testid="settings-hours">
          <h2 className="font-display text-lg font-semibold text-[#1D1D1F] mb-4">Business Hours</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-[#1D1D1F]">Weekday Hours</Label>
              <Input value={form.hours_weekday} onChange={(e) => setForm({...form, hours_weekday: e.target.value})} placeholder="Monday - Saturday: 9am - 6pm" className="mt-1.5 rounded-xl" data-testid="settings-hours-weekday" />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#1D1D1F]">Weekend Hours</Label>
              <Input value={form.hours_weekend} onChange={(e) => setForm({...form, hours_weekend: e.target.value})} placeholder="Sunday: Closed" className="mt-1.5 rounded-xl" data-testid="settings-hours-weekend" />
            </div>
          </div>
        </div>

        {/* Google Integration */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" data-testid="settings-google">
          <h2 className="font-display text-lg font-semibold text-[#1D1D1F] mb-4">Google Integration</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-[#1D1D1F]">Google Maps Embed URL</Label>
              <Input value={form.google_maps_embed} onChange={(e) => setForm({...form, google_maps_embed: e.target.value})} placeholder="https://www.google.com/maps/embed?pb=..." className="mt-1.5 rounded-xl font-mono text-xs" data-testid="settings-maps-embed" />
              <p className="text-xs text-[#86868B] mt-1">Go to Google Maps → Share → Embed → Copy the src URL</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-[#1D1D1F]">Google Place ID</Label>
              <Input value={form.google_place_id} onChange={(e) => setForm({...form, google_place_id: e.target.value})} placeholder="ChIJxxxxxxxxxxxxxxx" className="mt-1.5 rounded-xl font-mono text-xs" data-testid="settings-place-id" />
              <p className="text-xs text-[#86868B] mt-1">Used to fetch live Google Reviews (requires valid Places API key in backend)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== LOGIN PAGE ====================

const AdminLoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      onLogin(res.data.token, res.data.admin);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4" data-testid="admin-login-page">
      <SEO title="Admin Login" noIndex={true} />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="HiFone" className="h-10 mx-auto mb-6" />
          <h1 className="font-display text-2xl font-semibold text-[#1D1D1F] tracking-tight">Admin Login</h1>
          <p className="text-sm text-[#86868B] mt-1">Sign in to manage your business</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-black/[0.04]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600" data-testid="login-error">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[#1D1D1F]">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hifone.com.au"
                  className="pl-10 rounded-xl"
                  required
                  data-testid="login-email-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-[#1D1D1F]">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 pr-10 rounded-xl"
                  required
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F]"
                  data-testid="login-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-xl py-5 font-medium"
            data-testid="login-submit-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-[#86868B] mt-6">
          <Link to="/" className="hover:text-[#E31E24] transition-colors">Back to website</Link>
        </p>
      </div>
    </div>
  );
};

// ==================== MAIN ADMIN COMPONENT ====================


// ==================== ADMIN BLOGS PAGE ====================

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('hifone_admin_token');
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', author: 'HiFone Team', image_url: '' });

  const fetchBlogs = async () => {
    try {
      const res = await blogApi.getAll();
      setBlogs(res.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', author: 'HiFone Team', image_url: '' });
    setDialogOpen(true);
  };

  const openEdit = (blog) => {
    setEditItem(blog);
    setForm({ title: blog.title, slug: blog.slug, excerpt: blog.excerpt, content: blog.content, author: blog.author || 'HiFone Team', image_url: blog.image_url || '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error('Title and content are required'); return; }
    if (!form.slug) form.slug = slugify(form.title);
    setSaving(true);
    try {
      await api.post('/blogs', form, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(editItem ? 'Blog updated!' : 'Blog published!');
      setDialogOpen(false);
      fetchBlogs();
    } catch { toast.error('Failed to save blog'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#111111]">Blog Posts</h1>
          <p className="text-[#777777] text-sm mt-1">Manage your blog content</p>
        </div>
        <Button onClick={openAdd} className="bg-[#E31E24] hover:bg-[#C01017] text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#777777]">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#777777] mb-4">No blog posts yet</p>
            <Button onClick={openAdd} className="bg-[#E31E24] hover:bg-[#C01017] text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Write First Post
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F8F8F8] border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#777777] uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#777777] uppercase hidden md:table-cell">Author</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#777777] uppercase hidden md:table-cell">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[#777777] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-[#F8F8F8]">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#111111] text-sm">{blog.title}</p>
                    <p className="text-[#777777] text-xs mt-0.5 line-clamp-1">{blog.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#777777] hidden md:table-cell">{blog.author}</td>
                  <td className="px-6 py-4 text-sm text-[#777777] hidden md:table-cell">{formatDate(blog.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(blog)} className="h-8 w-8 p-0 hover:bg-[#E31E24]/10">
                        <Pencil className="w-4 h-4 text-[#E31E24]" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Post' : 'New Blog Post'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} placeholder="Post title" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label className="text-sm font-medium">Slug (URL)</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-url-slug" className="mt-1.5 rounded-xl font-mono text-sm" />
            </div>
            <div>
              <Label className="text-sm font-medium">Excerpt (Short Description)</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief description shown in blog listing..." className="mt-1.5 rounded-xl" rows={2} />
            </div>
            <div>
              <Label className="text-sm font-medium">Content *</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full blog post content..." className="mt-1.5 rounded-xl" rows={10} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Author</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Featured Image URL</Label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="mt-1.5 rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#E31E24] hover:bg-[#C01017] text-white">
              {saving ? 'Saving...' : editItem ? 'Update Post' : 'Publish Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const STATUS_LABELS = {
  pending:       { label: 'Pending',        color: 'bg-yellow-100 text-yellow-800' },
  received:      { label: 'Received',       color: 'bg-blue-100 text-blue-800' },
  diagnosing:    { label: 'Diagnosing',     color: 'bg-purple-100 text-purple-800' },
  repairing:     { label: 'Repairing',      color: 'bg-orange-100 text-orange-800' },
  ready_to_ship: { label: 'Ready to Ship',  color: 'bg-teal-100 text-teal-800' },
  shipped:       { label: 'Shipped',        color: 'bg-green-100 text-green-800' },
  completed:     { label: 'Completed',      color: 'bg-gray-100 text-gray-600' },
};
 
const STATUS_ORDER = ['pending', 'received', 'diagnosing', 'repairing', 'ready_to_ship', 'shipped', 'completed'];
 
const AdminMailInPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null); // detail view
 
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await mailInApi.getAll(filterStatus || null);
      setRequests(res.data.requests || []);
    } catch (err) {
      toast.error('Failed to load mail-in requests');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchRequests(); }, [filterStatus]);
 
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await mailInApi.updateStatus(id, newStatus);
      toast.success(`Status updated to "${STATUS_LABELS[newStatus].label}"`);
      // Update locally without full refetch
      setRequests(prev =>
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
      if (selected?.id === id) setSelected(s => ({ ...s, status: newStatus }));
    } catch {
      toast.error('Failed to update status');
    }
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mail-in request?')) return;
    try {
      await mailInApi.delete(id);
      toast.success('Deleted');
      setRequests(prev => prev.filter(r => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      toast.error('Failed to delete');
    }
  };
 
  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };
 
  // Status badge component
  const StatusBadge = ({ status }) => {
    const s = STATUS_LABELS[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
    return (
      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>
        {s.label}
      </span>
    );
  };
 
  return (
    <div className="p-6 max-w-7xl mx-auto">
 
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mail-in Requests</h1>
          <p className="text-sm text-gray-500 mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={fetchRequests}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          Refresh
        </button>
      </div>
 
      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            filterStatus === '' ? 'bg-[#E31E24] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {STATUS_ORDER.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filterStatus === s ? 'bg-[#E31E24] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {STATUS_LABELS[s].label}
          </button>
        ))}
      </div>
 
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No mail-in requests yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
          {/* ── Left: list ── */}
          <div className="lg:col-span-1 space-y-3">
            {requests.map(req => (
              <div
                key={req.id}
                onClick={() => setSelected(req)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  selected?.id === req.id
                    ? 'border-[#E31E24] bg-[#E31E24]/5'
                    : 'border-gray-100 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{req.full_name}</p>
                    <p className="text-xs text-gray-500">{req.device_brand} — {req.device_model}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-gray-400">{formatDate(req.created_at)}</p>
              </div>
            ))}
          </div>
 
          {/* ── Right: detail panel ── */}
          <div className="lg:col-span-2">
            {!selected ? (
              <div className="rounded-xl border border-dashed border-gray-200 h-64 flex items-center justify-center text-gray-400 text-sm">
                Select a request to view details
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
 
                {/* Detail header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{selected.full_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Submitted {formatDate(selected.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selected.status} />
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 rounded-lg px-2.5 py-1 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
 
                <div className="p-6 space-y-6">
 
                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Phone', value: selected.phone },
                      { label: 'Email', value: selected.email },
                      { label: 'Device', value: `${selected.device_brand} ${selected.device_model}` },
                      { label: 'Issue', value: selected.issue_description },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
                        <p className="text-sm text-gray-900">{value || '—'}</p>
                      </div>
                    ))}
                  </div>
 
                  {/* Return address */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Return Address</p>
                    <p className="text-sm text-gray-900">
                      {selected.street_address}, {selected.suburb} {selected.state} {selected.postcode}
                    </p>
                  </div>
 
                  {/* Tracking number */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tracking Number</p>
                    <p className="text-sm text-gray-900">{selected.tracking_number || <span className="text-gray-400 italic">Not provided yet</span>}</p>
                  </div>
 
                  {/* Notes */}
                  {selected.additional_notes && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Notes</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.additional_notes}</p>
                    </div>
                  )}
 
                  {/* Status update */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_ORDER.map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(selected.id, s)}
                          disabled={selected.status === s}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            selected.status === s
                              ? 'bg-[#E31E24] text-white cursor-default'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {STATUS_LABELS[s].label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      * "Shipped" status automatically emails the customer
                    </p>
                  </div>
 
                </div>
              </div>
            )}
          </div>
 
        </div>
      )}
    </div>
  );
};
 
export default function AdminPage() {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem('hifone_admin_token'));
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('hifone_admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [authChecked, setAuthChecked] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthChecked(true);
        return;
      }
      try {
        const res = await authApi.getMe(token);
        setAdmin(res.data);
        setAuthChecked(true);
      } catch {
        // Token expired/invalid
        localStorage.removeItem('hifone_admin_token');
        localStorage.removeItem('hifone_admin_user');
        setToken(null);
        setAdmin(null);
        setAuthChecked(true);
      }
    };
    verifyToken();
  }, [token]);

  const handleLogin = (newToken, adminData) => {
    localStorage.setItem('hifone_admin_token', newToken);
    localStorage.setItem('hifone_admin_user', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('hifone_admin_token');
    localStorage.removeItem('hifone_admin_user');
    setToken(null);
    setAdmin(null);
  };

  // Show nothing while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → show login
  if (!token || !admin) {
    return <AdminLoginPage onLogin={handleLogin} />;
  }

  // Logged in → show admin panel
  const path = location.pathname;

  let content;
  if (path === '/admin' || path === '/admin/') {
    content = <DashboardPage />;
  } else if (path.startsWith('/admin/bookings')) {
    content = <BookingsPage />;
  } else if (path.startsWith('/admin/services')) {
    content = <ServicesPage />;
  } else if (path.startsWith('/admin/devices')) {
    content = <DevicesPage />;
  } else if (path.startsWith('/admin/pricing')) {
    content = <PricingPage />;
  } else if (path.startsWith('/admin/settings')) {
    content = <SettingsPage />;
  } else if (path.startsWith('/admin/blogs')) {
    content = <AdminBlogsPage />;
  }
   else if (path.startsWith('/admin/mail-in')) {
  content = <AdminMailInPage />;} else {
    content = <DashboardPage />;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      {content}
    </AdminLayout>
  );
}
