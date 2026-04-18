import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Smartphone, MapPin, CheckCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { mailInApi } from '@/lib/api';

const BRAND_MODELS = {
  'iPhone': [
    'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
    'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 Mini', 'iPhone 13',
    'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 Mini', 'iPhone 12',
    'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
    'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
    'iPhone 8 Plus', 'iPhone 8', 'iPhone 7 Plus', 'iPhone 7',
    'iPhone SE (3rd Gen)', 'iPhone SE (2nd Gen)',
    'Other iPhone',
  ],
  'Samsung': [
    'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
    'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
    'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
    'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21',
    'Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20',
    'Galaxy A55', 'Galaxy A54', 'Galaxy A53', 'Galaxy A52',
    'Galaxy A35', 'Galaxy A34', 'Galaxy A33', 'Galaxy A32',
    'Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10+', 'Galaxy Note 10',
    'Galaxy Z Fold 5', 'Galaxy Z Fold 4', 'Galaxy Z Flip 5', 'Galaxy Z Flip 4',
    'Other Samsung',
  ],
  'iPad': [
    'iPad Pro 13" (M4)', 'iPad Pro 11" (M4)',
    'iPad Pro 13" (M2)', 'iPad Pro 11" (M2)',
    'iPad Air 13" (M2)', 'iPad Air 11" (M2)',
    'iPad Air (5th Gen)', 'iPad Air (4th Gen)',
    'iPad (10th Gen)', 'iPad (9th Gen)', 'iPad (8th Gen)',
    'iPad Mini (7th Gen)', 'iPad Mini (6th Gen)',
    'Other iPad',
  ],
  'Google Pixel': [
    'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9',
    'Pixel 8 Pro', 'Pixel 8',
    'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a',
    'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a',
    'Pixel 5', 'Pixel 4a', 'Pixel 4 XL', 'Pixel 4',
    'Other Pixel',
  ],
  'Oppo': [
    'Oppo Find X7 Ultra', 'Oppo Find X6 Pro',
    'Oppo Reno 11', 'Oppo Reno 10', 'Oppo Reno 8',
    'Oppo A98', 'Oppo A78', 'Oppo A58', 'Oppo A38',
    'Other Oppo',
  ],
  'Huawei': [
    'Huawei P60 Pro', 'Huawei P50 Pro', 'Huawei P40 Pro',
    'Huawei Mate 60 Pro', 'Huawei Mate 50 Pro',
    'Huawei Nova 11', 'Huawei Nova 10',
    'Other Huawei',
  ],
  'OnePlus': [
    'OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro',
    'OnePlus Nord 3', 'OnePlus Nord 2',
    'Other OnePlus',
  ],
  'Motorola': [
    'Moto Edge 40 Pro', 'Moto Edge 30',
    'Moto G84', 'Moto G54', 'Moto G34',
    'Other Motorola',
  ],
  'Other': [],
};

const DEVICE_BRANDS = Object.keys(BRAND_MODELS);

const COMMON_ISSUES = [
  'Cracked / Broken Screen',
  'Battery Replacement',
  'Charging Port Not Working',
  'Camera Not Working',
  'Water Damage',
  'Speaker / Microphone Issue',
  'Software / Boot Issue',
  'Back Glass Cracked',
  'Button Not Working',
  'Other Issue',
];

const AUSTRALIAN_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

const STEPS = [
  { id: 1, label: 'Device', icon: Smartphone },
  { id: 2, label: 'Contact', icon: Package },
  { id: 3, label: 'Address', icon: MapPin },
];

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10';

const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5';

export default function MailInForm({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  const [form, setForm] = useState({
    // Step 1 — Device
    device_brand: '',
    device_model: '',
    custom_model: '',
    issue_description: '',
    selected_issue: '',
    // Step 2 — Contact
    full_name: '',
    phone: '',
    email: '',
    additional_notes: '',
    // Step 3 — Address
    street_address: '',
    suburb: '',
    state: '',
    postcode: '',
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // ── Validation per step ──
  const canProceed = () => {
    if (step === 1) { const mOk = form.device_model && (isCustom(form.device_model) ? form.custom_model.trim().length > 0 : true); return Boolean(form.device_brand && mOk && (form.selected_issue || form.issue_description.trim())); }
    if (step === 2) return form.full_name.trim() && form.phone.trim() && form.email.trim();
    if (step === 3) return form.street_address.trim() && form.suburb.trim() && form.state && form.postcode.trim();
    return false;
  };

  const handleBrandSelect = (brand) => {
    setForm(f => ({ ...f, device_brand: brand, device_model: '', custom_model: '' }));
  };
  const isCustom = (m) => Boolean(m && m.startsWith('Other'));
  const handleIssueSelect = (issue) => {
    set('selected_issue', issue);
    if (issue !== 'Other Issue') set('issue_description', issue);
    else set('issue_description', '');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        device_brand: form.device_brand,
        device_model: isCustom(form.device_model) ? form.custom_model.trim() : form.device_model,
        issue_description: form.issue_description.trim() || form.selected_issue,
        street_address: form.street_address.trim(),
        suburb: form.suburb.trim(),
        state: form.state,
        postcode: form.postcode.trim(),
        additional_notes: form.additional_notes.trim() || undefined,
      };
      const res = await mailInApi.create(payload);
      setSubmittedId(res.data.id);
      if (onSuccess) onSuccess(res.data.id);
    } catch (err) {
      toast.error('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCESS STATE ──
  if (submittedId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Check your email for packing instructions and our postal address. Once you've posted your device, WhatsApp us your tracking number.
        </p>

        {/* 3-step mini guide */}
        <div className="text-left space-y-3 mb-6">
          {[
            { n: 1, text: 'Pack device securely in a box with bubble wrap' },
            { n: 2, text: 'Post to HiFone Repairs, Shop 153 Anzac Hwy, Kurralta Park SA 5037' },
            { n: 3, text: 'WhatsApp your tracking number to 0432 977 092' },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#E31E24] text-white text-xs font-bold flex items-center justify-center">
                {n}
              </span>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>

        <a
          href="https://wa.me/61432977092"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full px-6 py-3 text-sm font-semibold transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp 0432 977 092
        </a>

        <p className="mt-4 text-xs text-gray-400">Request ID: {submittedId}</p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Step indicator ── */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done ? 'bg-green-500 text-white' :
                    active ? 'bg-[#E31E24] text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {done ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-all ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Form body ── */}
      <div className="p-6">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Device ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tell us about your device</h3>
                <p className="text-sm text-gray-500 mt-1">We'll send you a quote before starting any work</p>
              </div>

              {/* Brand select */}
              <div>
                <label className={labelClass}>Device Brand *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DEVICE_BRANDS.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleBrandSelect(brand)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all text-left ${
                        form.device_brand === brand
                          ? 'border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model — dynamic per brand */}
              {form.device_brand && (
                <div>
                  <label className={labelClass}>Device Model *</label>
                  {form.device_brand === 'Other' ? (
                    <input
                      className={inputClass}
                      placeholder="Enter your device model"
                      value={form.custom_model}
                      onChange={(e) => { set('custom_model', e.target.value); set('device_model', 'Other'); }}
                    />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 pb-1">
                        {BRAND_MODELS[form.device_brand].map((model) => (
                          <button
                            key={model}
                            type="button"
                            onClick={() => { set('device_model', model); set('custom_model', ''); }}
                            className={`rounded-lg border px-3 py-2 text-sm text-left transition-all ${
                              form.device_model === model
                                ? 'border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24] font-medium'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {model}
                          </button>
                        ))}
                      </div>
                      {isCustom(form.device_model) && (
                        <input
                          className={inputClass + ' mt-3'}
                          placeholder="Enter exact model name"
                          value={form.custom_model}
                          onChange={(e) => set('custom_model', e.target.value)}
                          autoFocus
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Issue quick select */}
              <div>
                <label className={labelClass}>What's the issue? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {COMMON_ISSUES.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => handleIssueSelect(issue)}
                      className={`rounded-lg border px-3 py-2 text-sm text-left transition-all ${
                        form.selected_issue === issue
                          ? 'border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24] font-medium'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
                {form.selected_issue === 'Other Issue' && (
                  <textarea
                    className={inputClass + ' resize-none'}
                    rows={3}
                    placeholder="Describe the issue in detail..."
                    value={form.issue_description}
                    onChange={(e) => set('issue_description', e.target.value)}
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Contact ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your contact details</h3>
                <p className="text-sm text-gray-500 mt-1">We'll email you a confirmation and quote</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    className={inputClass}
                    placeholder="John Smith"
                    value={form.full_name}
                    onChange={(e) => set('full_name', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    className={inputClass}
                    placeholder="0400 000 000"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  className={inputClass}
                  placeholder="john@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Additional Notes <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                <textarea
                  className={inputClass + ' resize-none'}
                  rows={3}
                  placeholder="Anything else we should know? e.g. passcode, specific symptoms..."
                  value={form.additional_notes}
                  onChange={(e) => set('additional_notes', e.target.value)}
                />
              </div>

              {/* Reassurance note */}
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-800 leading-relaxed">
                We'll send you a quote via email or WhatsApp before starting any repair. No surprise charges.
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Return Address ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">Return address</h3>
                <p className="text-sm text-gray-500 mt-1">We'll ship your repaired device back here via tracked Australia Post</p>
              </div>

              <div>
                <label className={labelClass}>Street Address *</label>
                <input
                  className={inputClass}
                  placeholder="12 Example Street"
                  value={form.street_address}
                  onChange={(e) => set('street_address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className={labelClass}>Suburb *</label>
                  <input
                    className={inputClass}
                    placeholder="Melbourne"
                    value={form.suburb}
                    onChange={(e) => set('suburb', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <select
                    className={inputClass}
                    value={form.state}
                    onChange={(e) => set('state', e.target.value)}
                  >
                    <option value="">Select</option>
                    {AUSTRALIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Postcode *</label>
                  <input
                    className={inputClass}
                    placeholder="3000"
                    maxLength={4}
                    value={form.postcode}
                    onChange={(e) => set('postcode', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              {/* Summary card */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Order Summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Device</span>
                  <span className="font-medium text-gray-900">{form.device_brand} — {form.device_model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Issue</span>
                  <span className="font-medium text-gray-900">{form.selected_issue || form.issue_description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{form.full_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{form.email}</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── Navigation buttons ── */}
        <div className={`flex mt-6 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#E31E24] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c91920] transition-colors ml-auto"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!canProceed() || loading}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#E31E24] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c91920] transition-colors ml-auto"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <>Submit Request <ChevronRight className="h-4 w-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}