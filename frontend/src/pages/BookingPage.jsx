import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ArrowRight, ArrowLeft, Check, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { deviceApi, serviceApi, pricingApi, bookingApi } from '../lib/api';
import { useBrandsData } from '../hooks/useBrandsData';
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

const steps = [
  { num: 1, title: 'Device', description: 'Select your device' },
  { num: 2, title: 'Issue', description: 'What needs fixing?' },
  { num: 3, title: 'Schedule', description: 'Pick date & time' },
  { num: 4, title: 'Details', description: 'Your information' },
];

export default function BookingPage() {
  const { brands: allBrands } = useBrandsData();
  const location = useLocation();
  const navigate = useNavigate();
  const preselected = location.state || {};

  const [step, setStep] = useState(preselected.device ? 2 : 1);
  const [brands, setBrands] = useState([]);
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState(preselected.pricing || null);
  const [loading, setLoading] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(preselected.device?.brand || null);
  const [selectedDevice, setSelectedDevice] = useState(preselected.device || null);
  const [selectedService, setSelectedService] = useState(preselected.service || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
  });

  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsRes, servicesRes] = await Promise.all([
          deviceApi.getBrands(),
          serviceApi.getAll(),
        ]);
        setBrands(brandsRes.data.brands || []);
        setServices(servicesRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      const fetchDevices = async () => {
        const res = await deviceApi.getByBrand(selectedBrand);
        setDevices(res.data || []);
      };
      fetchDevices();
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedDevice && selectedService) {
      const fetchPricing = async () => {
        try {
          const res = await pricingApi.getPrice(selectedDevice.id, selectedService.id);
          setPricing(res.data);
        } catch (error) {
          setPricing(null);
        }
      };
      fetchPricing();
    }
  }, [selectedDevice, selectedService]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        device_id: selectedDevice.id,
        service_id: selectedService.id,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
      };

      const res = await bookingApi.create(bookingData);
      setBookingId(res.data.id);
      setBookingComplete(true);
      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Booking Complete View
  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-white py-32" data-testid="booking-complete">
        <SEO title="Booking Confirmed" noIndex={true} />
        <div className="max-w-lg mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-[#34C759] rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-h2 mb-4">Booking Confirmed!</h1>
            <p className="text-body-large mb-8">
              Your repair appointment has been scheduled. We've sent a confirmation to your email.
            </p>

            <div className="bg-[#F8F8F8] rounded-2xl p-6 text-left mb-8">
              <h3 className="font-semibold text-[#111111] mb-4 font-display">Booking Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#777777]">Device</span>
                  <span className="font-medium text-[#111111]">{selectedBrand} {selectedDevice?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Service</span>
                  <span className="font-medium text-[#111111]">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Date</span>
                  <span className="font-medium text-[#111111]">{selectedDate && format(selectedDate, 'EEEE, MMM d')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Time</span>
                  <span className="font-medium text-[#111111]">{selectedTime}</span>
                </div>
                <div className="h-px bg-black/5 my-2" />
                <div className="flex justify-between">
                  <span className="font-medium text-[#111111]">Total</span>
                  <span className="font-semibold text-[#111111] text-lg">{pricing && formatPrice(pricing.price)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                disabled
                className="w-full bg-[#CCCCCC] text-white rounded-full h-14 text-base font-medium cursor-not-allowed opacity-70"
                data-testid="pay-now-btn"
              >
                Pay Online — Coming Soon
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full h-14 text-base font-medium press-effect"
              >
                Pay at Store
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="booking-page">
      <SEO title="Book Your Repair" description="Schedule your phone repair appointment online. Same-day service available." />
      
      {/* Header */}
      <section className="pt-32 pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-overline mb-4">Book Online</p>
            <h1 className="text-h2 mb-4">Book Your Repair</h1>
            <p className="text-body-large">Schedule in minutes. Get your device fixed today.</p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.num} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  step > s.num ? 'bg-[#34C759] text-white' :
                  step === s.num ? 'bg-[#E31E24] text-white' : 'bg-[#F8F8F8] text-[#777777]'
                )}>
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <p className={cn(
                  'mt-2 text-xs font-medium hidden md:block',
                  step >= s.num ? 'text-[#111111]' : 'text-[#777777]'
                )}>{s.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'h-0.5 flex-1 mx-2 transition-colors',
                  step > s.num ? 'bg-[#34C759]' : 'bg-[#E5E5E5]'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {/* Step 1: Device */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-h3 mb-6">Select Your Brand</h3>
                <div className="grid grid-cols-2 gap-4">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => { setSelectedBrand(brand); setSelectedDevice(null); }}
                      className={cn(
                        'p-6 rounded-2xl text-left transition-all duration-300 press-effect',
                        selectedBrand === brand
                          ? 'bg-[#E31E24] text-white shadow-[0_4px_24px_rgba(227,30,36,0.3)]'
                          : 'bg-[#F8F8F8] text-[#111111] hover:bg-[#EFEFEF]'
                      )}
                      data-testid={`book-brand-${brand.toLowerCase()}`}
                    >
                      <span className="font-semibold font-display text-lg">{brand}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedBrand && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-h3 mb-6">Select Model</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                    {devices.map((device) => (
                      <button
                        key={device.id}
                        onClick={() => setSelectedDevice(device)}
                        className={cn(
                          'p-4 rounded-xl text-left transition-all duration-300 press-effect flex items-center gap-3',
                          selectedDevice?.id === device.id
                            ? 'bg-[#E31E24] text-white'
                            : 'bg-[#F8F8F8] text-[#111111] hover:bg-[#EFEFEF]'
                        )}
                        data-testid={`book-device-${device.id}`}
                      >
                        <Smartphone className="w-4 h-4 opacity-50" />
                        <span className="font-medium text-sm">{device.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={!selectedDevice}
                className="w-full bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full h-14 text-base font-medium press-effect disabled:opacity-50"
                data-testid="book-next-step-1"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Service */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 p-4 bg-[#F8F8F8] rounded-xl">
                <Smartphone className="w-5 h-5 text-[#777777]" />
                <span className="font-medium text-[#111111]">{selectedBrand} {selectedDevice?.name}</span>
              </div>

              <div>
                <h3 className="text-h3 mb-6">What Needs Fixing?</h3>
                <div className="space-y-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={cn(
                        'w-full p-5 rounded-xl text-left transition-all duration-300 press-effect',
                        selectedService?.id === service.id
                          ? 'bg-[#E31E24] text-white shadow-[0_4px_24px_rgba(227,30,36,0.3)]'
                          : 'bg-[#F8F8F8] text-[#111111] hover:bg-[#EFEFEF]'
                      )}
                      data-testid={`book-service-${service.id}`}
                    >
                      <p className="font-semibold mb-1">{service.name}</p>
                      <p className={cn('text-sm', selectedService?.id === service.id ? 'text-white/70' : 'text-[#777777]')}>
                        {service.short_description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {pricing && (
                <div className="p-4 bg-[#F8F8F8] rounded-xl flex justify-between items-center">
                  <span className="text-[#777777]">Estimated Price</span>
                  <span className="text-2xl font-semibold text-[#111111] font-display">{formatPrice(pricing.price)}</span>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="ghost" className="flex-1 bg-[#F8F8F8] hover:bg-[#EFEFEF] text-[#111111] rounded-full h-14">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedService}
                  className="flex-1 bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full h-14 press-effect disabled:opacity-50"
                  data-testid="book-next-step-2"
                >
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-h3 mb-4">Select Date</h3>
                {/* Trigger button */}
                <button
                  onClick={() => setDatePickerOpen(!datePickerOpen)}
                  data-testid="book-date-picker"
                  className={cn(
                    'w-full flex items-center gap-3 px-5 h-14 rounded-2xl border-2 transition-all text-left',
                    selectedDate ? 'bg-white border-[#E31E24] text-[#111111]' : 'bg-[#F8F8F8] border-transparent text-[#999999] hover:border-[#E31E24]/40'
                  )}
                >
                  <CalendarIcon className={cn('w-5 h-5 shrink-0', selectedDate ? 'text-[#E31E24]' : 'text-[#AAAAAA]')} />
                  <span className="font-medium text-sm flex-1">
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Pick a date'}
                  </span>
                  {selectedDate && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setSelectedDate(null); setDatePickerOpen(false); }}
                      className="text-[#AAAAAA] hover:text-[#E31E24] text-xs font-bold px-2 py-1 rounded-lg hover:bg-[#E31E24]/10 transition-colors"
                    >✕</span>
                  )}
                </button>
                {/* Inline calendar dropdown */}
                {datePickerOpen && (
                  <div className="mt-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => { setSelectedDate(date); setDatePickerOpen(false); }}
                      inline
                      minDate={new Date()}
                      filterDate={(date) => date.getDay() !== 0}
                      calendarClassName="hifone-calendar"
                    />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-h3 mb-6">Select Time</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'py-3 px-4 rounded-xl text-sm font-medium transition-all press-effect',
                        selectedTime === time
                          ? 'bg-[#E31E24] text-white'
                          : 'bg-[#F8F8F8] text-[#111111] hover:bg-[#EFEFEF]'
                      )}
                      data-testid={`book-time-${time.replace(/[: ]/g, '-')}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} variant="ghost" className="flex-1 bg-[#F8F8F8] hover:bg-[#EFEFEF] text-[#111111] rounded-full h-14">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full h-14 press-effect disabled:opacity-50"
                  data-testid="book-next-step-3"
                >
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-5">
                <div>
                  <Label htmlFor="customer_name" className="text-sm font-medium text-[#111111]">Full Name *</Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="mt-2 h-14 rounded-xl bg-[#F8F8F8] border-transparent focus:bg-white focus:ring-2 focus:ring-[#E31E24]"
                    data-testid="book-input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="customer_email" className="text-sm font-medium text-[#111111]">Email *</Label>
                  <Input
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="mt-2 h-14 rounded-xl bg-[#F8F8F8] border-transparent focus:bg-white focus:ring-2 focus:ring-[#E31E24]"
                    data-testid="book-input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="customer_phone" className="text-sm font-medium text-[#111111]">Phone *</Label>
                  <Input
                    id="customer_phone"
                    name="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="0400 000 000"
                    className="mt-2 h-14 rounded-xl bg-[#F8F8F8] border-transparent focus:bg-white focus:ring-2 focus:ring-[#E31E24]"
                    data-testid="book-input-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-[#111111]">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional details..."
                    className="mt-2 rounded-xl bg-[#F8F8F8] border-transparent focus:bg-white focus:ring-2 focus:ring-[#E31E24]"
                    rows={3}
                    data-testid="book-input-notes"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#F8F8F8] rounded-2xl p-6">
                <h4 className="font-semibold text-[#111111] mb-4 font-display">Booking Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[#777777]">Device</span><span className="text-[#111111]">{selectedBrand} {selectedDevice?.name}</span></div>
                  <div className="flex justify-between"><span className="text-[#777777]">Service</span><span className="text-[#111111]">{selectedService?.name}</span></div>
                  <div className="flex justify-between"><span className="text-[#777777]">Date</span><span className="text-[#111111]">{selectedDate && format(selectedDate, 'MMM d, yyyy')}</span></div>
                  <div className="flex justify-between"><span className="text-[#777777]">Time</span><span className="text-[#111111]">{selectedTime}</span></div>
                  <div className="h-px bg-black/5 my-2" />
                  <div className="flex justify-between"><span className="font-medium text-[#111111]">Total</span><span className="text-xl font-semibold text-[#111111] font-display">{pricing ? formatPrice(pricing.price) : 'TBD'}</span></div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(3)} variant="ghost" className="flex-1 bg-[#F8F8F8] hover:bg-[#EFEFEF] text-[#111111] rounded-full h-14">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full h-14 press-effect disabled:opacity-50"
                  data-testid="book-submit"
                >
                  {loading ? 'Creating...' : 'Confirm Booking'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}