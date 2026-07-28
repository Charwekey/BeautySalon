'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { 
  sendAppointmentRequestReceived, 
  sendPaymentReceived,
  sendAppointmentRescheduled
} from "@/lib/email"
import { 
  sendBookingReceivedSMS, 
  sendPaymentReceivedSMS,
  sendBookingRescheduledSMS
} from "@/lib/sms"
import { createNotification } from "@/actions/notificationActions"
import { createAuditLog } from "@/actions/dashboardActions"
import { revalidatePath } from "next/cache"
import { FALLBACK_SERVICES } from "@/lib/constants"

export interface AppointmentActionState {
  success: boolean;
  error?: string;
  bookingCode?: string;
}

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { category: 'asc' }
    })
    if (services && services.length > 0) return services;
  } catch (e) {
    console.warn('Database query fallback:', e);
  }
  return FALLBACK_SERVICES;
}

export async function getStaff() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { name: 'asc' }
    })
    if (staff && staff.length > 0) return staff;
  } catch (e) {
    console.warn('Staff query fallback:', e);
  }
  return [];
}

export async function createAppointment(prevState: AppointmentActionState, formData: FormData): Promise<AppointmentActionState> {
  const serviceIdInput = (formData.get('serviceId') as string) || ''
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const userNotes = (formData.get('notes') as string) || ''
  const paymentOption = (formData.get('paymentOption') as string) || 'PAY_AT_SALON'
  const paymentProvider = (formData.get('paymentProvider') as string) || ''

  if (!serviceIdInput || !date || !time) {
    return { success: false, error: 'Missing required booking fields. Please select at least one treatment.' }
  }

  try {
    const session = await getSession()
    
    // Strict Admin Boundary Protection: Admins cannot create appointment bookings
    if (session && session.role !== 'CUSTOMER') {
      return { 
        success: false, 
        error: 'Admin and staff accounts cannot book appointments. Admin access is restricted to salon operations.' 
      };
    }

    // 1. Resolve or Auto-Create Customer Record matching session
    let customer = null;
    if (session?.userId) {
      customer = await prisma.user.findUnique({ where: { id: session.userId } });
    }

    if (!customer && session?.email) {
      customer = await prisma.user.findUnique({ where: { email: session.email } });
    }

    if (!customer) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      customer = await prisma.user.create({
        data: {
          id: session?.userId,
          name: session?.name || "Valued Client",
          email: session?.email || `client_${Date.now()}@beautytechnicians.com`,
          password: hashedPassword,
          role: "CUSTOMER",
        }
      });
    }

    const customerId = customer.id;

    // 2. Parse Multiple Service IDs
    const serviceIds = serviceIdInput.split(',').map(s => s.trim()).filter(Boolean);
    let primaryServiceRecord = null;
    let totalPrice = 0;
    const selectedServiceNames: string[] = [];

    for (const sid of serviceIds) {
      let currentService = null;
      if (!sid.startsWith('s')) {
        currentService = await prisma.service.findUnique({ where: { id: sid } });
      }

      if (!currentService) {
        const fallbackObj = FALLBACK_SERVICES.find(s => s.id === sid) || FALLBACK_SERVICES[0];
        currentService = await prisma.service.findFirst({ where: { name: fallbackObj.name } });
        
        if (!currentService) {
          currentService = await prisma.service.create({
            data: {
              name: fallbackObj.name,
              description: fallbackObj.description,
              price: fallbackObj.price,
              duration: fallbackObj.duration,
              category: fallbackObj.category,
            }
          });
        }
      }

      if (!primaryServiceRecord) {
        primaryServiceRecord = currentService;
      }
      totalPrice += currentService.price;
      selectedServiceNames.push(currentService.name);
    }

    const combinedServiceName = selectedServiceNames.join(' + ');

    // 3. Generate Booking Code & Receipt Number
    const count = await prisma.appointment.count();
    const bookingCode = `BK-${String(count + 1).padStart(3, '0')}`;

    const isPayNow = paymentOption === 'PAY_NOW';
    const paymentStatus = isPayNow ? 'PAID' : 'PENDING';
    const paymentMethod = isPayNow ? (paymentProvider || 'PAY_NOW_CARD') : 'PAY_AT_SALON';
    const receiptNumber = isPayNow ? `PAY-2026${String(Math.floor(1000 + Math.random() * 9000))}` : undefined;

    const formattedNotes = selectedServiceNames.length > 1 
      ? `[Multi-Treatment Package: ${combinedServiceName}]\n${userNotes}`
      : userNotes;

    // 4. Create Appointment Record in Database
    await prisma.appointment.create({
      data: {
        bookingCode,
        date: new Date(date),
        time,
        notes: formattedNotes,
        totalPrice,
        status: 'PENDING',
        paymentStatus,
        paymentMethod,
        receiptNumber,
        customerId,
        serviceId: primaryServiceRecord?.id || serviceIds[0],
      }
    });

    const dateStr = new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    // 5. Send Nodemailer Email Notifications
    if (customer.email) {
      await sendAppointmentRequestReceived({
        toEmail: customer.email,
        customerName: customer.name,
        serviceName: combinedServiceName,
        date: dateStr,
        time,
        bookingCode,
      });

      if (isPayNow) {
        await sendPaymentReceived({
          toEmail: customer.email,
          customerName: customer.name,
          serviceName: combinedServiceName,
          date: dateStr,
          time,
          bookingCode,
          receiptNumber,
        });
      }
    }

    // 6. Send Instant SMS Notifications via SMS Gateway API
    if (customer.phone || session?.email) {
      await sendBookingReceivedSMS(
        customer.phone || "+233240000000",
        customer.name,
        combinedServiceName,
        dateStr,
        time,
        bookingCode
      );

      if (isPayNow && receiptNumber) {
        await sendPaymentReceivedSMS(
          customer.phone || "+233240000000",
          customer.name,
          combinedServiceName,
          receiptNumber,
          totalPrice
        );
      }
    }

    // 7. Create In-App Notifications
    await createNotification(
      customerId,
      "Booking Request Received",
      `Your appointment (${bookingCode}) for ${combinedServiceName} has been received and is pending review.`,
      "INFO"
    );

    if (isPayNow) {
      await createNotification(
        customerId,
        "Payment Received",
        `Your payment for ${combinedServiceName} (${receiptNumber}) has been received successfully.`,
        "PAYMENT"
      );
    }

    revalidatePath('/dashboard');
    return { success: true, bookingCode };
  } catch (error) {
    console.error('Appointment creation error:', error);
    return { success: false, error: 'Failed to create appointment. Please try again.' };
  }
}

export async function rescheduleAppointment(
  appointmentId: string,
  newDate: string,
  newTime: string,
  newServiceIds?: string,
  notes?: string
) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { customer: true, service: true }
    });

    if (!appointment || (appointment.customerId !== session.userId && session.role === 'CUSTOMER')) {
      return { success: false, error: 'Appointment record not found.' };
    }

    // 24-Hour Advance Policy Enforcer
    const appDate = new Date(appointment.date);
    const now = new Date();
    const diffHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24 && session.role === 'CUSTOMER') {
      return {
        success: false,
        error: 'Rescheduling is locked because your appointment is in less than 24 hours. Please call the salon directly at +233 24 000 0000 for urgent adjustments.'
      };
    }

    // Parse updated service treatments if provided
    let primaryServiceId = appointment.serviceId;
    let totalPrice = appointment.totalPrice || appointment.service.price;
    let combinedServiceName = appointment.service.name;

    if (newServiceIds && newServiceIds.trim().length > 0) {
      const sIds = newServiceIds.split(',').map(s => s.trim()).filter(Boolean);
      totalPrice = 0;
      const selectedNames: string[] = [];
      let firstRecord = null;

      for (const sid of sIds) {
        let currentS = null;
        if (!sid.startsWith('s')) {
          currentS = await prisma.service.findUnique({ where: { id: sid } });
        }

        if (!currentS) {
          const fallbackObj = FALLBACK_SERVICES.find(s => s.id === sid) || FALLBACK_SERVICES[0];
          currentS = await prisma.service.findFirst({ where: { name: fallbackObj.name } });
          
          if (!currentS) {
            currentS = await prisma.service.create({
              data: {
                name: fallbackObj.name,
                description: fallbackObj.description,
                price: fallbackObj.price,
                duration: fallbackObj.duration,
                category: fallbackObj.category,
              }
            });
          }
        }

        if (!firstRecord) {
          firstRecord = currentS;
        }
        totalPrice += currentS.price;
        selectedNames.push(currentS.name);
      }

      if (firstRecord) {
        primaryServiceId = firstRecord.id;
      }
      combinedServiceName = selectedNames.join(' + ');
    }

    const updatedDate = new Date(newDate);
    const updatedNotes = notes 
      ? `[Modified Package: ${combinedServiceName}]\n${notes}` 
      : appointment.notes;

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: updatedDate,
        time: newTime,
        serviceId: primaryServiceId,
        totalPrice,
        status: 'PENDING', // Reset status for admin review
        notes: updatedNotes,
      },
      include: { customer: true, service: true }
    });

    const dateStr = updatedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    // 📧 Send Nodemailer HTML Email
    if (updated.customer?.email) {
      await sendAppointmentRescheduled({
        toEmail: updated.customer.email,
        customerName: updated.customer.name,
        serviceName: combinedServiceName,
        date: dateStr,
        time: newTime,
        bookingCode: updated.bookingCode,
      });
    }

    // 📱 Send SMS Gateway Notification
    if (updated.customer?.phone) {
      await sendBookingRescheduledSMS(
        updated.customer.phone,
        updated.customer.name,
        combinedServiceName,
        dateStr,
        newTime,
        updated.bookingCode
      );
    }

    // 🔔 In-App Notification
    await createNotification(
      updated.customerId,
      "Appointment Modified & Rescheduled",
      `Your booking (${updated.bookingCode}) for ${combinedServiceName} has been updated to ${dateStr} at ${newTime}.`,
      "INFO"
    );

    // 📝 Audit Log
    await createAuditLog(
      "Modified Appointment",
      `Client ${updated.customer.name} modified booking ${updated.bookingCode} to ${combinedServiceName} on ${dateStr} at ${newTime}`
    );

    revalidatePath('/dashboard');
    revalidatePath('/admin/appointments');
    return { success: true };
  } catch (e) {
    console.error("Error rescheduling appointment:", e);
    return { success: false, error: 'Failed to update appointment. Please try again.' };
  }
}

export async function getMyAppointments() {
  const session = await getSession()
  if (!session) return []

  try {
    return await prisma.appointment.findMany({
      where: {
        OR: [
          { customerId: session.userId },
          { customer: { email: session.email } }
        ]
      },
      include: { service: true, staff: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (e) {
    console.error('Error fetching customer appointments:', e);
    return [];
  }
}

export async function cancelAppointment(id: string) {
  const session = await getSession()
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const appointment = await prisma.appointment.findUnique({ 
      where: { id },
      include: { service: true }
    })
    if (!appointment || appointment.customerId !== session.userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // 24-Hour Policy Check for Cancellation
    const appDate = new Date(appointment.date);
    const now = new Date();
    const diffHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24 && session.role === 'CUSTOMER') {
      return {
        success: false,
        error: 'Cancellation is locked because your appointment is in less than 24 hours. Please call the salon directly at +233 24 000 0000.'
      };
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })

    await createNotification(
      session.userId,
      "Booking Cancelled",
      `Your ${appointment.service.name} appointment (${appointment.bookingCode}) was cancelled.`,
      "INFO"
    );

    await createAuditLog(
      "Cancelled Appointment",
      `Client cancelled booking ${appointment.bookingCode}`
    );

    revalidatePath('/dashboard');
    return { success: true }
  } catch (e) {
    return { success: false, error: 'Failed to cancel appointment' }
  }
}
