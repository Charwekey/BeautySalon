'use client';

import { useState, useEffect, useActionState } from 'react';
import { Calendar, Clock, User, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, CreditCard, Smartphone, Building2, Search, Scissors, Heart, Sparkle, Plus, Check, Trash2, ArrowLeft } from 'lucide-react';
import { getServices, createAppointment } from '@/actions/appointmentActions';
import { FALLBACK_SERVICES } from '@/lib/constants';

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  description?: string;
};

export default function BookingClient() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [paymentOption, setPaymentOption] = useState<'PAY_NOW' | 'PAY_AT_SALON'>('PAY_AT_SALON');
  const [paymentProvider, setPaymentProvider] = useState<'PAY_NOW_MOMO' | 'PAY_NOW_CARD' | 'PAY_NOW_BANK'>('PAY_NOW_MOMO');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [formState, formAction, isPending] = useActionState(createAppointment, { success: false });

  useEffect(() => {
    getServices().then((data) => {
      const serviceData = (data && data.length > 0 ? data : FALLBACK_SERVICES) as unknown as Service[];
      setServices(serviceData);
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'Hair', 'Braids', 'Wigs', 'Nails', 'Skincare', 'Brows & Lashes'];

  const filteredServices = services.filter((service) => {
    const sCat = service.category.toLowerCase().trim();
    const aCat = activeCategory.toLowerCase().trim();

    let matchesCategory = false;
    if (activeCategory === 'All') {
      matchesCategory = true;
    } else if (aCat === sCat) {
      matchesCategory = true;
    } else if (aCat === 'hair' && (sCat.includes('hair') || sCat.includes('treatment'))) {
      matchesCategory = true;
    } else if (aCat === 'skincare' && (sCat.includes('skincare') || sCat.includes('facial') || sCat.includes('grooming'))) {
      matchesCategory = true;
    } else if (aCat.includes('brows') && (sCat.includes('brow') || sCat.includes('lash'))) {
      matchesCategory = true;
    }

    const matchesSearch = searchQuery === '' || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const toggleServiceSelection = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + Number(s.duration), 0);

  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  if (formState?.success) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center polaroid-frame animate-scale-in my-16 bg-white border border-[#E8D5D8] rounded-3xl shadow-xl">
        <CheckCircle2 className="w-20 h-20 text-[#B8737D] mx-auto mb-4" />
        <span className="font-script text-4xl text-[#B8737D] block">Appointment Package Received!</span>
        <h1 className="text-3xl font-display text-[#3D262B] mb-2 font-bold">
          {formState.bookingCode || "BK-001"}
        </h1>
        <p className="text-sm text-[#6B4D54] mb-8 font-light max-w-md mx-auto leading-relaxed">
          We’ve received your multi-treatment appointment request! Nodemailer HTML email receipt and SMS notification have been dispatched.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="btn-rose-gold px-8 py-3.5 rounded-full text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back to My Dashboard</span>
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="btn-outline-rose px-8 py-3.5 rounded-full text-xs font-semibold"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Single Clean Redirection Control */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => (window.location.href = '/dashboard')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-[#3D262B] bg-white border border-[#E8D5D8] hover:border-[#B8737D] hover:text-[#B8737D] transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#B8737D]" />
          <span>Go Back to My Dashboard</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <span className="font-script text-4xl text-[#B8737D]">Reserve Your Treatments</span>
        <h1 className="text-3xl sm:text-5xl font-display font-semibold text-[#3D262B] mt-1">
          Select Single or Multiple Treatments
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-2">
          You can select one or multiple beauty services to experience all on the same appointment day!
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-10 relative max-w-2xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#E8D5D8] -z-10"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#B8737D] transition-all duration-300 -z-10"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        ></div>

        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
              step >= num
                ? 'bg-[#B8737D] text-white shadow-md'
                : 'bg-white border-2 border-[#E8D5D8] text-[#9E8288]'
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Step 1: Complete Service Menu with Multi-Select */}
      {step === 1 && (
        <div className="animate-fade-in space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-display text-[#3D262B] mb-1">Step 1: Choose Your Treatments</h2>
            <p className="text-xs text-[#6B4D54]">Tap one or more treatments to add them to your single-day booking package.</p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8D5D8] shadow-sm">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#9E8288] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] outline-none focus:ring-2 focus:ring-[#B8737D] bg-[#FDF7F8]"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    activeCategory === cat
                      ? 'bg-[#B8737D] text-white shadow-md'
                      : 'bg-[#F8ECEE] text-[#3D262B] hover:bg-[#ebd3d7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Services Counter Bar */}
          {selectedServices.length > 0 && (
            <div className="p-4 bg-[#3D262B] text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B8737D] flex items-center justify-center font-bold text-xs text-white">
                  {selectedServices.length}
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#E4B8C0] font-semibold block">Selected Treatments</span>
                  <span className="text-sm font-display font-medium text-white truncate max-w-md block">
                    {selectedServices.map(s => s.name).join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] text-gray-300 block uppercase">Total Price</span>
                  <span className="text-lg font-bold text-[#E4B8C0]">GHS {totalPrice.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-300 block uppercase">Total Time</span>
                  <span className="text-sm font-semibold text-white">{totalDuration} mins</span>
                </div>
              </div>
            </div>
          )}

          {/* Services Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-[#B8737D] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.some((s) => s.id === service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleServiceSelection(service)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#B8737D] bg-[#F8ECEE] ring-2 ring-[#B8737D] shadow-lg scale-[1.02]'
                        : 'border-[#E8D5D8] bg-white hover:border-[#B8737D] hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#B8737D] bg-white px-2.5 py-0.5 rounded-full border border-[#E4B8C0]">
                          {service.category}
                        </span>
                        <span className="text-[11px] text-[#9E8288] flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-[#B8737D]" /> {service.duration} mins
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-[#3D262B] text-lg mb-2 leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-xs text-[#6B4D54] font-light leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E8D5D8]">
                      <span className="font-display font-bold text-lg text-[#B8737D]">
                        GHS {Number(service.price).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#B8737D] text-white shadow'
                            : 'bg-[#FDF7F8] text-[#3D262B] border border-[#E8D5D8] hover:border-[#B8737D]'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" /> Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#B8737D]" /> Add Treatment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredServices.length === 0 && (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-[#E8D5D8]">
                  <p className="text-sm text-[#6B4D54]">No treatments match your selected category or search filter.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="animate-fade-in space-y-8 max-w-2xl mx-auto">
          <div>
            <h2 className="text-xl font-display text-[#3D262B] mb-4 flex items-center gap-2">
              <Calendar className="text-[#B8737D] w-5 h-5" /> Step 2: Select Appointment Date
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x">
              {generateCalendarDays().map((date, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center snap-center transition-all ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? 'btn-rose-gold shadow-lg scale-105'
                      : 'bg-white border border-[#E8D5D8] text-[#3D262B] hover:bg-[#F8ECEE]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-2xl font-display font-bold my-0.5">{date.getDate()}</span>
                  <span className="text-[10px]">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-display text-[#3D262B] mb-4 flex items-center gap-2">
              <Clock className="text-[#B8737D] w-5 h-5" /> Select Preferred Start Time Slot
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedTime === time
                      ? 'btn-rose-gold shadow-md'
                      : 'bg-white border border-[#E8D5D8] text-[#3D262B] hover:bg-[#F8ECEE]'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Special Requests / Notes */}
      {step === 3 && (
        <div className="animate-fade-in max-w-lg mx-auto">
          <h2 className="text-xl font-display text-[#3D262B] mb-4 flex items-center gap-2">
            <User className="text-[#B8737D] w-5 h-5" /> Step 3: Special Requests & Hair Notes
          </h2>
          <div className="glass-blush p-6 rounded-2xl border border-[#E4B8C0]">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-2">
              Notes for your stylists & beauty technicians (Optional)
            </label>
            <textarea
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              className="w-full rounded-xl border border-[#E8D5D8] p-3 text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] bg-white outline-none"
              rows={4}
              placeholder="e.g. Please bring extra hair extension packs, or let us know about any scalp or skin sensitivity..."
            ></textarea>
          </div>
        </div>
      )}

      {/* Step 4: Payment Options */}
      {step === 4 && (
        <div className="animate-fade-in max-w-lg mx-auto space-y-6">
          <h2 className="text-xl font-display text-[#3D262B] mb-2 text-center">Step 4: Payment Options</h2>
          <p className="text-xs text-[#6B4D54] text-center font-medium">How would you like to pay for your appointment package?</p>

          <div className="space-y-4">
            {/* Pay Now Option */}
            <div
              onClick={() => setPaymentOption('PAY_NOW')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                paymentOption === 'PAY_NOW'
                  ? 'border-[#B8737D] bg-[#F8ECEE] ring-2 ring-[#B8737D]'
                  : 'border-[#E8D5D8] bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#B8737D] flex items-center justify-center">
                    {paymentOption === 'PAY_NOW' && <div className="w-2.5 h-2.5 rounded-full bg-[#B8737D]"></div>}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-[#3D262B] uppercase tracking-wider">Pay Now</h3>
                    <p className="text-[11px] text-[#6B4D54]">Secure your booking immediately online</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#B8737D] bg-white px-2.5 py-1 rounded-full border border-[#E4B8C0]">
                  Instant Receipt
                </span>
              </div>

              {/* Payment Methods Sub-selection */}
              {paymentOption === 'PAY_NOW' && (
                <div className="mt-4 pt-4 border-t border-[#E8D5D8] grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('PAY_NOW_MOMO')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentProvider === 'PAY_NOW_MOMO'
                        ? 'border-[#B8737D] bg-white font-bold text-[#B8737D]'
                        : 'border-[#E8D5D8] bg-white text-gray-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[10px]">Mobile Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentProvider('PAY_NOW_CARD')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentProvider === 'PAY_NOW_CARD'
                        ? 'border-[#B8737D] bg-white font-bold text-[#B8737D]'
                        : 'border-[#E8D5D8] bg-white text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px]">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentProvider('PAY_NOW_BANK')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentProvider === 'PAY_NOW_BANK'
                        ? 'border-[#B8737D] bg-white font-bold text-[#B8737D]'
                        : 'border-[#E8D5D8] bg-white text-gray-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-[10px]">Bank Transfer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Pay at Salon Option */}
            <div
              onClick={() => setPaymentOption('PAY_AT_SALON')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                paymentOption === 'PAY_AT_SALON'
                  ? 'border-[#B8737D] bg-[#F8ECEE] ring-2 ring-[#B8737D]'
                  : 'border-[#E8D5D8] bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#B8737D] flex items-center justify-center">
                  {paymentOption === 'PAY_AT_SALON' && <div className="w-2.5 h-2.5 rounded-full bg-[#B8737D]"></div>}
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#3D262B] uppercase tracking-wider">Pay at Salon</h3>
                  <p className="text-[11px] text-[#6B4D54]">Pay with cash or MoMo when you arrive for your appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Final Review & Confirmation */}
      {step === 5 && (
        <div className="animate-fade-in max-w-lg mx-auto">
          <h2 className="text-xl font-display text-[#3D262B] mb-4 text-center">Confirm Reservation Package</h2>
          <div className="polaroid-frame p-6 relative overflow-hidden bg-white">
            <div className="space-y-4">
              <div className="border-b border-[#E8D5D8] pb-3">
                <span className="text-xs uppercase tracking-wider text-[#9E8288] block mb-1">Selected Treatments ({selectedServices.length})</span>
                <div className="space-y-1">
                  {selectedServices.map((s) => (
                    <div key={s.id} className="flex justify-between items-center text-xs font-semibold text-[#3D262B]">
                      <span>• {s.name}</span>
                      <span className="text-[#B8737D]">GHS {Number(s.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between border-b border-[#E8D5D8] pb-3">
                <span className="text-xs uppercase tracking-wider text-[#9E8288]">Date</span>
                <span className="font-semibold text-xs text-[#3D262B]">
                  {selectedDate?.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#E8D5D8] pb-3">
                <span className="text-xs uppercase tracking-wider text-[#9E8288]">Start Time & Total Duration</span>
                <span className="font-semibold text-xs text-[#3D262B]">
                  {selectedTime} ({totalDuration} mins)
                </span>
              </div>

              <div className="flex justify-between border-b border-[#E8D5D8] pb-3">
                <span className="text-xs uppercase tracking-wider text-[#9E8288]">Payment Choice</span>
                <span className="font-semibold text-xs text-[#B8737D]">
                  {paymentOption === 'PAY_NOW' ? `Pay Now (${paymentProvider.replace('PAY_NOW_', '')})` : 'Pay at Salon'}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-sm font-semibold text-[#3D262B]">Combined Package Total</span>
                <span className="font-display text-xl font-bold text-[#B8737D]">
                  GHS {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {formState?.error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs border border-red-200">
                {formState.error}
              </div>
            )}

            <form action={formAction} className="mt-6">
              <input type="hidden" name="serviceId" value={selectedServices.map(s => s.id).join(',')} />
              <input type="hidden" name="date" value={selectedDate?.toISOString()} />
              <input type="hidden" name="time" value={selectedTime || ''} />
              <input type="hidden" name="notes" value={bookingNotes} />
              <input type="hidden" name="paymentOption" value={paymentOption} />
              <input type="hidden" name="paymentProvider" value={paymentProvider} />

              <button
                type="submit"
                disabled={isPending}
                className="btn-rose-gold w-full py-4 rounded-full text-xs font-semibold tracking-widest flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Confirm & Reserve Appointment Package'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      {step < 5 && (
        <div className="mt-12 flex justify-between max-w-2xl mx-auto border-t border-[#E8D5D8] pt-6">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`btn-outline-rose flex items-center gap-2 px-6 py-2.5 rounded-full text-xs ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => setStep((s) => Math.min(5, s + 1))}
            disabled={
              (step === 1 && selectedServices.length === 0) ||
              (step === 2 && (!selectedDate || !selectedTime))
            }
            className="btn-rose-gold flex items-center gap-2 px-8 py-2.5 rounded-full text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
