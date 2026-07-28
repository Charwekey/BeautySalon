'use client';

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  Sparkles, 
  X, 
  ChevronRight, 
  User, 
  Scissors, 
  Plus,
  Info,
  Check,
  Edit3,
  Lock,
  PhoneCall,
  Trash2
} from "lucide-react";
import { markNotificationAsRead } from "@/actions/notificationActions";
import { cancelAppointment, rescheduleAppointment, getServices } from "@/actions/appointmentActions";
import { FALLBACK_SERVICES } from "@/lib/constants";
import type { SessionPayload } from "@/lib/auth";

interface CustomerDashboardClientProps {
  session: SessionPayload;
  appointments: any[];
  notifications: any[];
}

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  description?: string;
};

export default function CustomerDashboardClient({
  session,
  appointments,
  notifications: initialNotifications,
}: CustomerDashboardClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [reschedulingBooking, setReschedulingBooking] = useState<any | null>(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  // Available Services
  const [allServices, setAllServices] = useState<Service[]>([]);

  // Reschedule & Edit Form State
  const [activeTab, setActiveTab] = useState<'schedule' | 'services'>('schedule');
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('10:30 AM');
  const [rescheduleServiceIds, setRescheduleServiceIds] = useState<string[]>([]);
  const [rescheduleNotes, setRescheduleNotes] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  useEffect(() => {
    getServices().then((data) => {
      setAllServices((data && data.length > 0 ? data : FALLBACK_SERVICES) as unknown as Service[]);
    });
  }, []);

  const upcomingAppointment = appointments.find(
    (a) => a.status === "CONFIRMED" || a.status === "PENDING"
  );
  const totalBookings = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

  const isEligible24Hours = (dateInput: string | Date) => {
    const appDate = new Date(dateInput);
    const now = new Date();
    const diffHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment booking?")) return;
    startTransition(async () => {
      const res = await cancelAppointment(id);
      if (res.success) {
        setSelectedBooking(null);
        window.location.reload();
      } else {
        alert(res.error || 'Failed to cancel appointment');
      }
    });
  };

  const openRescheduleModal = (app: any) => {
    setReschedulingBooking(app);
    setNewDate(new Date(app.date).toISOString().split('T')[0]);
    setNewTime(app.time);
    setRescheduleServiceIds([app.serviceId]);
    setRescheduleNotes(app.notes || '');
    setActiveTab('schedule');
    setRescheduleError(null);
  };

  const toggleRescheduleService = (serviceId: string) => {
    setRescheduleServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev; // Keep at least 1 service
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const selectedServicesObjects = allServices.filter((s) => rescheduleServiceIds.includes(s.id));
  const recalculatedTotalPrice = selectedServicesObjects.reduce((sum, s) => sum + Number(s.price), 0);

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking || !newDate || !newTime || rescheduleServiceIds.length === 0) {
      setRescheduleError('Please select a date, time slot, and at least one treatment.');
      return;
    }

    setRescheduleError(null);
    startTransition(async () => {
      const res = await rescheduleAppointment(
        reschedulingBooking.id,
        newDate,
        newTime,
        rescheduleServiceIds.join(','),
        rescheduleNotes
      );

      if (res.success) {
        setReschedulingBooking(null);
        window.location.reload();
      } else {
        setRescheduleError(res.error || 'Failed to update appointment.');
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            🟡 Pending Review
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            🟢 Confirmed
          </span>
        );
      case "DECLINED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            🔴 Declined
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            🔵 Completed
          </span>
        );
      case "CANCELLED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
            <span className="w-2 h-2 rounded-full bg-gray-800"></span>
            ⚫ Cancelled
          </span>
        );
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8D5D8] pb-6">
        <div>
          <span className="font-script text-3xl text-[#B8737D]">Welcome Back</span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#3D262B]">
            {session.name}
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-1">
            Manage your protective braid sessions, wig installs & facial appointments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 rounded-full bg-white border border-[#E8D5D8] text-[#3D262B] hover:bg-[#F8ECEE] relative transition-all shadow-sm"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#B8737D] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#E8D5D8] p-5 z-40 animate-scale-in">
                <div className="flex items-center justify-between border-b border-[#E8D5D8] pb-3 mb-3">
                  <h3 className="font-display font-bold text-sm text-[#3D262B]">Notifications</h3>
                  <span className="text-[10px] uppercase font-semibold text-[#B8737D] bg-[#F8ECEE] px-2 py-0.5 rounded-full">
                    {unreadNotificationsCount} Unread
                  </span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[#6B4D54] text-center py-4">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.read
                            ? "bg-white border-[#E8D5D8] text-[#6B4D54]"
                            : "bg-[#F8ECEE] border-[#E4B8C0] text-[#3D262B] font-medium"
                        }`}
                      >
                        <div className="font-semibold text-[#3D262B] mb-0.5">{n.title}</div>
                        <div className="text-[11px] leading-relaxed">{n.message}</div>
                        <div className="text-[9px] text-[#9E8288] mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/booking"
            className="btn-rose-gold px-6 py-3 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Treatment</span>
          </Link>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="polaroid-frame p-6 bg-white flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#6B4D54]">Total Bookings</span>
          <div className="font-display text-4xl font-bold text-[#3D262B] my-2">{totalBookings}</div>
          <span className="text-[10px] text-[#9E8288]">Lifetime treatment history</span>
        </div>

        <div className="polaroid-frame p-6 bg-white flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-700">Pending Review</span>
          <div className="font-display text-4xl font-bold text-amber-600 my-2">{pendingCount}</div>
          <span className="text-[10px] text-[#9E8288]">Awaiting admin confirmation</span>
        </div>

        <div className="polaroid-frame p-6 bg-white flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700">Confirmed</span>
          <div className="font-display text-4xl font-bold text-emerald-600 my-2">{confirmedCount}</div>
          <span className="text-[10px] text-[#9E8288]">Reserved appointment slots</span>
        </div>

        <div className="polaroid-frame p-6 bg-white flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#B8737D]">24-Hour Policy</span>
          <div className="text-xs font-semibold text-[#3D262B] my-2 leading-snug">
            Edit & Cancel available up to 24 hours prior
          </div>
          <span className="text-[10px] text-[#9E8288]">Call salon if &lt;24 hrs</span>
        </div>
      </div>

      {/* Upcoming Appointment Spotlight */}
      {upcomingAppointment && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#3D262B] to-[#52353C] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E4B8C0] text-[10px] font-bold uppercase tracking-widest border border-white/20">
                <Sparkles className="w-3.5 h-3.5" /> Upcoming Session Spotlight
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
                {upcomingAppointment.service?.name || "Beauty Session"}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-gray-200 font-light">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#E4B8C0]" />
                  {new Date(upcomingAppointment.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E4B8C0]" />
                  {upcomingAppointment.time}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-[#E4B8C0]">
                  GHS {Number(upcomingAppointment.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 sm:items-end">
              {getStatusBadge(upcomingAppointment.status)}
              
              {isEligible24Hours(upcomingAppointment.date) ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openRescheduleModal(upcomingAppointment)}
                    className="btn-rose-gold px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Booking</span>
                  </button>
                  <button
                    onClick={() => handleCancelBooking(upcomingAppointment.id)}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-red-500/20 hover:bg-red-500 text-white border border-red-400/40 transition-all flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <div className="text-[10px] text-amber-200 bg-white/10 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Locked (&lt;24 hrs). Call +233 24 000 0000</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bookings History Table */}
      <div className="bg-white rounded-3xl border border-[#E8D5D8] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-display font-bold text-[#3D262B]">My Appointment Bookings</h2>
            <p className="text-xs text-[#6B4D54]">Manage all your active and past beauty treatment appointments.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8D5D8] text-[10px] font-bold text-[#9E8288] uppercase tracking-widest bg-[#FDF7F8]">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Service Treatment</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D5D8] text-xs">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#6B4D54]">
                    You haven't booked any appointments yet. Click "Book New Treatment" to start!
                  </td>
                </tr>
              ) : (
                appointments.map((app) => {
                  const eligible = isEligible24Hours(app.date);
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-[#FDF7F8] transition-colors cursor-pointer"
                      onClick={() => setSelectedBooking(app)}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-[#3D262B]">
                        {app.bookingCode}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#3D262B]">
                        {app.service?.name || "Service"}
                      </td>
                      <td className="py-4 px-4 text-[#6B4D54]">
                        {new Date(app.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {app.time}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.paymentStatus === 'PAID' ? 'Paid Online' : 'Pay at Salon'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                          <div className="flex items-center justify-end gap-2">
                            {eligible ? (
                              <>
                                <button
                                  onClick={() => openRescheduleModal(app)}
                                  className="px-3 py-1.5 rounded-full text-[10px] font-semibold bg-[#F8ECEE] text-[#B8737D] border border-[#E4B8C0] hover:bg-[#B8737D] hover:text-white transition-all"
                                >
                                  Edit / Reschedule
                                </button>
                                <button
                                  onClick={() => handleCancelBooking(app.id)}
                                  className="px-3 py-1.5 rounded-full text-[10px] font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 transition-all flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Cancel</span>
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1" title="Changes locked within 24 hrs">
                                <Lock className="w-3 h-3" /> Locked (&lt;24h)
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── FULL BOOKING DETAILS MODAL ─── */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8D5D8] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#E8D5D8] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#B8737D]">Booking Details</span>
                <h2 className="text-2xl font-display font-bold text-[#3D262B]">{selectedBooking.bookingCode}</h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-[#9E8288] hover:text-[#3D262B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#E8D5D8] pb-2">
                <span className="text-[#9E8288] uppercase">Service Treatment</span>
                <span className="font-bold text-[#3D262B]">{selectedBooking.service?.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8D5D8] pb-2">
                <span className="text-[#9E8288] uppercase">Date & Time</span>
                <span className="font-semibold text-[#3D262B]">
                  {new Date(selectedBooking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {selectedBooking.time}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E8D5D8] pb-2">
                <span className="text-[#9E8288] uppercase">Total Package Price</span>
                <span className="font-bold text-[#B8737D]">GHS {Number(selectedBooking.totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8D5D8] pb-2">
                <span className="text-[#9E8288] uppercase">Status</span>
                {getStatusBadge(selectedBooking.status)}
              </div>
              <div className="flex justify-between border-b border-[#E8D5D8] pb-2">
                <span className="text-[#9E8288] uppercase">Payment Method</span>
                <span className="font-medium text-[#3D262B]">{selectedBooking.paymentMethod}</span>
              </div>
              {selectedBooking.receiptNumber && (
                <div className="flex justify-between border-b border-[#E8D5D8] pb-2">
                  <span className="text-[#9E8288] uppercase">Receipt No</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedBooking.receiptNumber}</span>
                </div>
              )}
              {selectedBooking.notes && (
                <div className="pt-2">
                  <span className="text-[#9E8288] uppercase block mb-1">Client / Package Notes</span>
                  <div className="p-3 bg-[#FDF7F8] rounded-xl border border-[#E8D5D8] font-light text-[#6B4D54] whitespace-pre-wrap">
                    {selectedBooking.notes}
                  </div>
                </div>
              )}
            </div>

            {/* 24-Hour Policy Notice */}
            <div className="p-4 rounded-2xl bg-[#FDF7F8] border border-[#E8D5D8] text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#3D262B]">
                <Info className="w-4 h-4 text-[#B8737D]" /> 24-Hour Advance Policy
              </div>
              <p className="text-[11px] text-[#6B4D54] leading-relaxed">
                Rescheduling date, time, or selected treatments is available up to 24 hours prior to session start. For urgent changes under 24 hours, call salon directly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {selectedBooking.status !== 'CANCELLED' && selectedBooking.status !== 'COMPLETED' && (
                <>
                  {isEligible24Hours(selectedBooking.date) ? (
                    <>
                      <button
                        onClick={() => {
                          const appToEdit = selectedBooking;
                          setSelectedBooking(null);
                          openRescheduleModal(appToEdit);
                        }}
                        className="btn-rose-gold py-3 px-5 rounded-full text-xs font-semibold flex-1 flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-4 h-4" /> Edit Date, Time & Services
                      </button>

                      <button
                        onClick={() => handleCancelBooking(selectedBooking.id)}
                        className="px-5 py-3 rounded-full text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
                      >
                        Cancel Booking
                      </button>
                    </>
                  ) : (
                    <a
                      href="tel:+233240000000"
                      className="btn-rose-gold py-3 px-5 rounded-full text-xs font-semibold flex-1 flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" /> Call Salon (+233 24 000 0000)
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── COMPREHENSIVE RESCHEDULE & TREATMENT EDIT MODAL ─── */}
      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8D5D8] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#E8D5D8] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#B8737D]">Edit / Reschedule Booking</span>
                <h2 className="text-xl font-display font-bold text-[#3D262B]">{reschedulingBooking.bookingCode}</h2>
              </div>
              <button
                onClick={() => setReschedulingBooking(null)}
                className="p-2 text-[#9E8288] hover:text-[#3D262B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-[#E8D5D8]">
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`py-2 px-4 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'schedule'
                    ? 'border-[#B8737D] text-[#B8737D]'
                    : 'border-transparent text-[#9E8288] hover:text-[#3D262B]'
                }`}
              >
                1. Date & Time
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`py-2 px-4 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'services'
                    ? 'border-[#B8737D] text-[#B8737D]'
                    : 'border-transparent text-[#9E8288] hover:text-[#3D262B]'
                }`}
              >
                2. Select / Change Treatments ({rescheduleServiceIds.length})
              </button>
            </div>

            {rescheduleError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{rescheduleError}</span>
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="space-y-5">
              {/* TAB 1: Date & Time */}
              {activeTab === 'schedule' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">New Appointment Date *</label>
                    <input
                      type="date"
                      value={newDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-2">New Start Time Slot *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setNewTime(slot)}
                          className={`py-2 rounded-xl text-[11px] font-semibold transition-all ${
                            newTime === slot
                              ? 'bg-[#B8737D] text-white shadow'
                              : 'bg-[#FDF7F8] text-[#3D262B] border border-[#E8D5D8] hover:bg-[#F8ECEE]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('services')}
                      className="btn-outline-rose w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <span>Next: Modify Treatments / Services &rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Change Treatments */}
              {activeTab === 'services' && (
                <div className="space-y-4 animate-fade-in max-h-64 overflow-y-auto pr-1">
                  <p className="text-xs text-[#6B4D54]">Tap treatments to add or switch for your booking session:</p>
                  
                  <div className="space-y-2">
                    {allServices.map((service) => {
                      const isSelected = rescheduleServiceIds.includes(service.id);
                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleRescheduleService(service.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#B8737D] bg-[#F8ECEE] ring-1 ring-[#B8737D]'
                              : 'border-[#E8D5D8] bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs text-[#3D262B]">{service.name}</div>
                            <div className="text-[10px] text-[#9E8288]">{service.category} • {service.duration} mins</div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-xs text-[#B8737D]">GHS {Number(service.price).toFixed(2)}</span>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              isSelected ? 'bg-[#B8737D] border-[#B8737D] text-white' : 'border-[#E8D5D8]'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Package Summary */}
              <div className="p-4 bg-[#FDF7F8] rounded-2xl border border-[#E8D5D8] space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-[#3D262B]">
                  <span>Updated Package Total:</span>
                  <span className="text-[#B8737D] text-sm">GHS {recalculatedTotalPrice.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-[#6B4D54] truncate">
                  <strong>Selected:</strong> {selectedServicesObjects.map(s => s.name).join(', ') || 'None'}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Notes / Reason for Stylist</label>
                <textarea
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Switched treatment to full lace install..."
                  className="w-full px-4 py-2 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8D5D8]">
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="btn-outline-rose px-5 py-2.5 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-rose-gold px-7 py-2.5 rounded-full text-xs font-semibold disabled:opacity-50"
                >
                  {isPending ? 'Updating...' : 'Save & Confirm Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
