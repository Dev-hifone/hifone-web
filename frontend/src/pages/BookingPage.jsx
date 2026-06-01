import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Smartphone, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { deviceApi, serviceApi, pricingApi, bookingApi } from '../lib/api';
import { formatPrice, cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'sonner';
import { SEO } from '../components/SEO';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

// Reusable styled select
function SelectField({ label, value, onChange, options, placeholder, disabled }) {
  return (
    <div className="space-y-1.5">
      <label className={cn("text-sm font-semibold", disabled ? "text-[#AAAAAA]" : "text-[#111111]")}>{label}</label>
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
        <ChevronDown className={cn("pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4", disabled ? "text-[#CCCCCC]" : "text-[#888888]")} />
      </div>
    </div>
  );
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselected = location.state || {};

  const [brands, setBrands] = useState([]);
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState(preselected.pricing || null);
  const [loading, setLoading] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(preselected.device?.brand || '');
  const [selectedDevice, setSelectedDevice] = useState(preselected.device || null);
  const [selectedService, setSelectedService] = useState(preselected.service || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  const [formData, setFormData] = useState({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Load brands + services once
  useEffect(() => {
    Promise.all([deviceApi.getBrands(), serviceApi.getAll()]).then(([b, s]) => {
      setBrands(b.data.brands || []);
      setServices(s.data || []);
    });
  }, []);

  // Load devices when brand changes
  useEffect(() => {
    if (selectedBrand) {
      setSelectedDevice(null);
      deviceApi.getByBrand(selectedBrand).then(r => setDevices(r.data || []));
    }
  }, [selectedBrand]);

  // Load pricing when device + service both selected
  useEffect(() => {
    if (selectedDevice && selectedService) {
      pricingApi.getPrice(selectedDevice.id, selectedService.id)
        .then(r => setPricing(r.data))
        .catch(() => setPricing(null));
    }
  }, [selectedDevice, selectedService]);

  const canSubmit =
    selectedDevice && selectedService && selectedDate && selectedTime &&
    formData.customer_name && formData.customer_email && formData.customer_phone;

  const handleSubmit = async () => {
    if (!canSubmit) { toast.error('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      const res = await bookingApi.create({
        ...formData,
        device_id: selectedDevice.id,
        service_id: selectedService.id,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
      });
      setBookingId(res.data.id);
      setBookingComplete(true);
      toast.success('Booking confirmed!');
    } catch {
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-white py-32">
        <SEO title="Booking Confirmed" noIndex={true} />
        <div className="max-w-lg mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 bg-[#34C759] rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-h2 mb-4">Booking Confirmed!</h1>
            <p className="text-body-large mb-8">We've sent a confirmation to your email.</p>
            <div className="bg-[#F8F8F8] rounded-2xl p-6 text-left mb-8 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#777777]">Device</span><span className="font-medium">{selectedBrand} {selectedDevice?.name}</span></div>
              <div className="flex justify-between"><span className="text-[#777777]">Service</span><span className="font-medium">{selectedService?.name}</span></div>
              <div className="flex justify-between"><span className="text-[#777777]">Date</span><span className="font-medium">{selectedDate && format(selectedDate, 'EEEE, MMM d')}</span></div>
              <div className="flex justify-between"><span className="text-[#777777]">Time</span><span className="font-medium">{selectedTime}</span></div>
            </div>
            <Button onClick={() => navigate('/')} className="w-full bg-[#E31E24] text-white rounded-full h-14 text-base font-medium">
              Back to Home <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white" data-testid="booking-page">
      <SEO title="Book Your Repair" description="Schedule your phone repair appointment online. Same-day service available." />

      {/* Header */}
      <section className="pt-32 pb-10 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-overline mb-4">Book Online</p>
            <h1 className="text-h2 mb-3">Book Your Repair</h1>
            <p className="text-body-large">Fill in the details below — takes about 60 seconds.</p>
          </motion.div>
        </div>
      </section>

      {/* Single-panel form */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#E5E5E5] rounded-3xl shadow-sm overflow-hidden"
        >
          {/* ── Section 1: Device ── */}
          <div className="px-6 pt-7 pb-6 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-4">1 — Your Device</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Brand"
                value={selectedBrand}
                onChange={val => { setSelectedBrand(val); setSelectedDevice(null); }}
                options={brands.map(b => ({ value: b, label: b }))}
                placeholder="Select brand"
              />
              <SelectField
                label="Model"
                value={selectedDevice?.id || ''}
                onChange={val => setSelectedDevice(devices.find(d => d.id === val) || null)}
                options={devices.map(d => ({ value: d.id, label: d.name }))}
                placeholder={selectedBrand ? 'Select model' : 'Select brand first'}
                disabled={!selectedBrand}
              />
            </div>
          </div>

          {/* ── Section 2: Service ── */}
          <div className="px-6 py-6 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-4">2 — Type of Repair</p>
            <SelectField
              label="What needs fixing?"
              value={selectedService?.id || ''}
              onChange={val => setSelectedService(services.find(s => s.id === val) || null)}
              options={services.map(s => ({ value: s.id, label: s.name }))}
              placeholder={selectedDevice ? 'Select repair type' : 'Select device first'}
              disabled={!selectedDevice}
            />
            {selectedDevice && selectedService && !pricing && (
              <p className="mt-3 text-xs text-[#999]">Quote will be confirmed at the store.</p>
            )}
          </div>

          {/* ── Section 3: Date & Time ── */}
          <div className="px-6 py-6 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-4">3 — Date &amp; Time</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#111111]">Date</label>
                <button
                  onClick={() => setDatePickerOpen(v => !v)}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 bg-white transition-all cursor-pointer',
                    selectedDate ? 'border-[#E31E24] text-[#111111]' : 'border-[#DDDDDD] text-[#111111] hover:border-[#BBBBBB]'
                  )}
                >
                  <CalendarIcon className="w-4 h-4 shrink-0 text-[#AAAAAA]" />
                  <span className="flex-1 text-left">{selectedDate ? format(selectedDate, 'EEE, MMM d yyyy') : 'Pick a date'}</span>
                  {selectedDate && (
                    <span onClick={e => { e.stopPropagation(); setSelectedDate(null); }} className="text-[#AAAAAA] hover:text-[#E31E24] font-bold text-xs px-1">✕</span>
                  )}
                </button>
                {datePickerOpen && (
                  <div className="mt-1">
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

              {/* Time */}
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
                        : 'bg-white border-[#DDDDDD] text-[#111111] hover:border-[#BBBBBB] focus:border-[#E31E24]'
                    )}
                  >
                    <option value="" disabled className="text-[#AAAAAA]">Select time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA]" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Contact Details ── */}
          <div className="px-6 py-6 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-4">4 — Your Details</p>
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
                <Label className="text-sm font-semibold text-[#111111]">Notes <span className="font-normal text-[#999]">(optional)</span></Label>
                <Textarea
                  name="notes" value={formData.notes}
                  onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any extra details about the issue..."
                  rows={2}
                  className="rounded-xl bg-white border-2 border-[#DDDDDD] hover:border-[#BBBBBB] focus:border-[#E31E24] focus:ring-0 transition-colors"
                  data-testid="book-input-notes"
                />
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="px-6 py-6">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full bg-[#E31E24] hover:bg-[#c91920] text-white rounded-full h-14 text-base font-semibold disabled:opacity-40 press-effect"
              data-testid="book-submit"
            >
              {loading ? 'Confirming…' : 'Confirm Booking'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
            <p className="text-center text-xs text-[#999] mt-3">We'll send a confirmation to your email right away.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
