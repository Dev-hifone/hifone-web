import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Calendar as CalendarIcon, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { deviceApi, serviceApi, bookingApi } from '../lib/api';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'sonner';
import { SEO } from '../components/SEO';

const WHATSAPP = 'https://wa.me/61432977092';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

function SelectField({ label, value, onChange, options, placeholder, disabled }) {
  return (
    <div className="space-y-1.5">
      <label className={cn('text-sm font-semibold', disabled ? 'text-[#AAAAAA]' : 'text-[#111111]')}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full appearance-none px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none border-2',
            disabled
              ? 'bg-[#F4F4F4] border-[#E8E8E8] text-[#AAAAAA] cursor-not-allowed'
              : value
                ? 'bg-white border-[#E31E24] text-[#111111] cursor-pointer'
                : 'bg-white border-[#DDDDDD] text-[#111111] hover:border-[#BBBBBB] focus:border-[#E31E24] cursor-pointer'
          )}
        >
          <option value="" disabled className="text-[#AAAAAA]">{placeholder}</option>
          {options.map(o => (
            <option key={o.value} value={o.value} className="text-[#111111]">{o.label}</option>
          ))}
        </select>
        <ChevronDown className={cn(
          'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4',
          disabled ? 'text-[#CCCCCC]' : 'text-[#888888]'
        )} />
      </div>
    </div>
  );
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselected = location.state || {};

  // Track whether we came in with a preselected device so we don't wipe it
  const preselectedRef = useRef(preselected.device || null);

  const [brands, setBrands] = useState([]);
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedBrand, setSelectedBrand] = useState(preselected.device?.brand || '');
  const [selectedDevice, setSelectedDevice] = useState(preselected.device || null);
  const [selectedService, setSelectedService] = useState(preselected.service || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  const [formData, setFormData] = useState({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
  const [bookingComplete, setBookingComplete] = useState(false);

  // ── Load brands + services on mount ───────────────────────────────────
  useEffect(() => {
    Promise.all([deviceApi.getBrands(), serviceApi.getAll()])
      .then(([b, s]) => {
        setBrands(b.data.brands || []);
        setServices(s.data || []);
      })
      .finally(() => setDataLoading(false));
  }, []);

  // ── Load devices whenever brand is set ────────────────────────────────
  // KEY FIX: if the current selectedDevice already belongs to this brand, keep it.
  // Only clear it when user actively switches to a different brand.
  useEffect(() => {
    if (!selectedBrand) return;
    deviceApi.getByBrand(selectedBrand).then(r => {
      const list = r.data || [];
      setDevices(list);
      // Only clear device if the currently selected device doesn't belong to this brand
      if (selectedDevice && selectedDevice.brand !== selectedBrand) {
        setSelectedDevice(null);
        setSelectedService(null);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand]);

  // ── When user picks brand manually (not from preselect) ───────────────
  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    // Always clear device + service when user manually changes brand
    setSelectedDevice(null);
    setSelectedService(null);
    preselectedRef.current = null; // no longer preselected
  };

  const canSubmit =
    selectedDevice && selectedService && selectedDate && selectedTime &&
    formData.customer_name && formData.customer_email && formData.customer_phone;

  const handleSubmit = async () => {
    if (!canSubmit) { toast.error('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      await bookingApi.create({
        ...formData,
        device_id: selectedDevice.id,
        service_id: selectedService.id,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
      });
      setBookingComplete(true);
      toast.success('Booking confirmed!');
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Something went wrong. Please call us on 0432 977 092 or try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-white py-32">
        <SEO title="Booking Confirmed" noIndex={true} />
        <div className="max-w-lg mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 bg-[#34C759] rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#111111] font-display mb-4">Booking Confirmed!</h1>
            <p className="text-[#555555] mb-8 text-lg">
              Thanks, <strong>{formData.customer_name}</strong>! We've sent a confirmation to{' '}
              <strong>{formData.customer_email}</strong>.
            </p>
            <div className="bg-[#F8F8F8] rounded-2xl p-6 text-left mb-8 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#777777]">Device</span>
                <span className="font-semibold text-[#111111]">{selectedDevice?.brand} {selectedDevice?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Service</span>
                <span className="font-semibold text-[#111111]">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Date</span>
                <span className="font-semibold text-[#111111]">{selectedDate && format(selectedDate, 'EEEE, MMMM d')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Time</span>
                <span className="font-semibold text-[#111111]">{selectedTime}</span>
              </div>
            </div>
            <div className="space-y-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full h-14 font-bold text-base transition-colors"
              >
                <Phone className="w-4 h-4" /> Questions? WhatsApp Us
              </a>
              <button
                onClick={() => navigate('/')}
                className="w-full border-2 border-[#E5E5E5] hover:border-[#BBBBBB] text-[#111111] rounded-full h-14 font-medium text-base transition-colors"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F8F8]" data-testid="booking-page">
      <SEO title="Book Your Repair" description="Schedule your phone repair appointment online. Same-day service available." />

      {/* Header */}
      <section className="pt-28 pb-8 bg-[#111111]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#E31E24]/20 text-[#E31E24] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
              Book Online
            </span>
            <h1 className="text-3xl font-bold text-white font-display mb-3">Book Your Repair</h1>
            <p className="text-white/60">Fill in all details below — takes about 60 seconds.</p>
          </motion.div>
        </div>
      </section>

      {/* Progress breadcrumb — shows what's preselected */}
      {(selectedDevice || selectedService) && (
        <div className="bg-white border-b border-[#EEEEEE]">
          <div className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-[#777777] flex-wrap">
            {selectedDevice && (
              <span className="flex items-center gap-1.5 bg-[#E31E24]/8 text-[#E31E24] font-semibold px-3 py-1 rounded-full text-xs">
                ✓ {selectedDevice.brand} {selectedDevice.name}
              </span>
            )}
            {selectedService && (
              <span className="flex items-center gap-1.5 bg-[#E31E24]/8 text-[#E31E24] font-semibold px-3 py-1 rounded-full text-xs">
                ✓ {selectedService.name}
              </span>
            )}
            <span className="text-[#AAAAAA] text-xs">— pre-filled from your selection</span>
          </div>
        </div>
      )}

      {/* Single-panel form */}
      <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#E5E5E5]"
        >

          {/* ── Section 1: Device ── */}
          <div className="px-6 pt-7 pb-6 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-4">
              1 — Your Device
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Brand"
                value={selectedBrand}
                onChange={handleBrandChange}
                options={brands.map(b => ({ value: b, label: b }))}
                placeholder={dataLoading ? 'Loading…' : 'Select brand'}
                disabled={dataLoading}
              />
              <SelectField
                label="Model"
                value={selectedDevice?.id || ''}
                onChange={val => {
                  const device = devices.find(d => d.id === val) || null;
                  setSelectedDevice(device);
                  // Reset service only if user is picking a new device
                  if (!preselectedRef.current || preselectedRef.current.id !== val) {
                    setSelectedService(null);
                  }
                  preselectedRef.current = null;
                }}
                options={devices.map(d => ({ value: d.id, label: d.name }))}
                placeholder={selectedBrand ? 'Select model' : 'Select brand first'}
                disabled={!selectedBrand || devices.length === 0}
              />
            </div>
          </div>

          {/* ── Section 2: Service ── */}
          <div className="px-6 py-6 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-4">
              2 — Type of Repair
            </p>
            <SelectField
              label="What needs fixing?"
              value={selectedService?.id || ''}
              onChange={val => setSelectedService(services.find(s => s.id === val) || null)}
              options={services.map(s => ({ value: s.id, label: s.name }))}
              placeholder={selectedDevice ? 'Select repair type' : 'Select device first'}
              disabled={!selectedDevice}
            />
            {selectedDevice && !selectedService && (
              <p className="mt-2 text-xs text-[#AAAAAA]">
                Final price confirmed before we start any work — no surprises.
              </p>
            )}
          </div>

          {/* ── Section 3: Date & Time ── */}
          <div className="px-6 py-6 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-4">
              3 — Date &amp; Time
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date picker */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#111111]">Date</label>
                <button
                  onClick={() => setDatePickerOpen(v => !v)}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 bg-white transition-all text-left cursor-pointer',
                    selectedDate
                      ? 'border-[#E31E24] text-[#111111]'
                      : 'border-[#DDDDDD] text-[#777777] hover:border-[#BBBBBB]'
                  )}
                >
                  <CalendarIcon className="w-4 h-4 shrink-0 text-[#AAAAAA]" />
                  <span className="flex-1">
                    {selectedDate ? format(selectedDate, 'EEE, MMM d yyyy') : 'Pick a date'}
                  </span>
                  {selectedDate && (
                    <span
                      onClick={e => { e.stopPropagation(); setSelectedDate(null); setDatePickerOpen(false); }}
                      className="text-[#AAAAAA] hover:text-[#E31E24] font-bold text-xs px-1"
                    >✕</span>
                  )}
                </button>
                {datePickerOpen && (
                  <div className="mt-1 z-10 relative">
                    <DatePicker
                      selected={selectedDate}
                      onChange={d => { setSelectedDate(d); setDatePickerOpen(false); }}
                      inline
                      minDate={new Date()}
                      filterDate={d => d.getDay() !== 0}
                      calendarClassName="hifone-calendar"
                    />
                  </div>
                )}
              </div>

              {/* Time select */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#111111]">Time</label>
                <div className="relative">
                  <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className={cn(
                      'w-full appearance-none px-4 py-3 rounded-xl text-sm font-medium border-2 outline-none transition-all cursor-pointer',
                      selectedTime
                        ? 'bg-white border-[#E31E24] text-[#111111]'
                        : 'bg-white border-[#DDDDDD] text-[#777777] hover:border-[#BBBBBB] focus:border-[#E31E24]'
                    )}
                  >
                    <option value="" disabled className="text-[#AAAAAA]">Select time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Contact Details ── */}
          <div className="px-6 py-6 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-4">
              4 — Your Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-[#111111]">Full Name *</Label>
                <Input
                  name="customer_name" value={formData.customer_name}
                  onChange={e => setFormData(f => ({ ...f, customer_name: e.target.value }))}
                  placeholder="John Smith"
                  className="h-12 rounded-xl bg-white border-2 border-[#DDDDDD] hover:border-[#BBBBBB] focus:border-[#E31E24] focus:ring-0 transition-colors"
                  data-testid="book-input-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-[#111111]">Phone *</Label>
                <Input
                  name="customer_phone" type="tel" value={formData.customer_phone}
                  onChange={e => setFormData(f => ({ ...f, customer_phone: e.target.value }))}
                  placeholder="0400 000 000"
                  className="h-12 rounded-xl bg-white border-2 border-[#DDDDDD] hover:border-[#BBBBBB] focus:border-[#E31E24] focus:ring-0 transition-colors"
                  data-testid="book-input-phone"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-sm font-semibold text-[#111111]">Email *</Label>
                <Input
                  name="customer_email" type="email" value={formData.customer_email}
                  onChange={e => setFormData(f => ({ ...f, customer_email: e.target.value }))}
                  placeholder="john@example.com"
                  className="h-12 rounded-xl bg-white border-2 border-[#DDDDDD] hover:border-[#BBBBBB] focus:border-[#E31E24] focus:ring-0 transition-colors"
                  data-testid="book-input-email"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-sm font-semibold text-[#111111]">
                  Notes <span className="font-normal text-[#AAAAAA]">(optional)</span>
                </Label>
                <Textarea
                  name="notes" value={formData.notes}
                  onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any extra details about the issue…"
                  rows={2}
                  className="rounded-xl bg-white border-2 border-[#DDDDDD] hover:border-[#BBBBBB] focus:border-[#E31E24] focus:ring-0 transition-colors"
                  data-testid="book-input-notes"
                />
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="px-6 py-6 bg-[#FAFAFA]">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full bg-[#E31E24] hover:bg-[#c91920] text-white rounded-full h-14 text-base font-semibold disabled:opacity-40 press-effect transition-colors"
              data-testid="book-submit"
            >
              {loading ? 'Confirming…' : 'Confirm Booking'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

            {/* Fallback if user prefers WhatsApp */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-px bg-[#EEEEEE]" />
              <span className="text-xs text-[#AAAAAA]">or</span>
              <div className="flex-1 h-px bg-[#EEEEEE]" />
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-full h-12 text-sm font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Book via WhatsApp instead
            </a>
            <p className="text-center text-xs text-[#AAAAAA] mt-3">
              We'll send a confirmation email right away.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
