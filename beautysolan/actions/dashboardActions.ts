'use server'

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { 
  sendAppointmentConfirmed, 
  sendAppointmentDeclined, 
  sendThankYouReviewRequest 
} from "@/lib/email";
import { sendBookingConfirmedSMS } from "@/lib/sms";
import { createNotification } from "@/actions/notificationActions";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'];
  if (!session || !allowedRoles.includes(session.role as string)) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function createAuditLog(action: string, details?: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.auditLog.create({
        data: {
          userName: session.name,
          userRole: session.role,
          action,
          details,
        },
      });
    }
  } catch (e) {
    console.error("Audit log creation error:", e);
  }
}

export async function getDashboardStats() {
  await requireAdmin();
  try {
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalAppointments = await prisma.appointment.count();
    const pendingBookings = await prisma.appointment.count({ where: { status: 'PENDING' } });
    const completedBookings = await prisma.appointment.count({ where: { status: 'COMPLETED' } });
    const cancelledBookings = await prisma.appointment.count({ where: { status: 'CANCELLED' } });

    const completedApps = await prisma.appointment.findMany({
      where: { status: 'COMPLETED' },
      select: { totalPrice: true }
    });
    
    const totalRevenue = completedApps.reduce((sum, app) => sum + (app.totalPrice || 0), 0);

    const appointmentsWithServices = await prisma.appointment.findMany({
      select: { serviceId: true, service: { select: { name: true } } }
    });

    const serviceCounts: Record<string, { name: string, count: number }> = {};
    appointmentsWithServices.forEach((app) => {
      if (app.service) {
        if (!serviceCounts[app.serviceId]) {
          serviceCounts[app.serviceId] = { name: app.service.name, count: 0 };
        }
        serviceCounts[app.serviceId].count += 1;
      }
    });

    const popularServices = Object.values(serviceCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalCustomers,
      totalAppointments,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      popularServices
    };
  } catch (e) {
    console.error('Error fetching dashboard stats:', e);
    return {
      totalCustomers: 0,
      totalAppointments: 0,
      pendingBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      popularServices: []
    };
  }
}

export async function getMonthlyRevenue() {
  await requireAdmin();
  try {
    const apps = await prisma.appointment.findMany({
      where: { status: 'COMPLETED' },
      select: { date: true, totalPrice: true }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const last6Months: { name: string; revenue: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      last6Months.push({ name: months[idx], revenue: 0 });
    }

    apps.forEach((app) => {
      if (app.date && app.totalPrice) {
        const monthName = months[new Date(app.date).getMonth()];
        const item = last6Months.find(m => m.name === monthName);
        if (item) {
          item.revenue += app.totalPrice;
        }
      }
    });

    return last6Months;
  } catch (e) {
    return [
      { name: 'Jan', revenue: 0 },
      { name: 'Feb', revenue: 0 },
      { name: 'Mar', revenue: 0 },
      { name: 'Apr', revenue: 0 },
      { name: 'May', revenue: 0 },
      { name: 'Jun', revenue: 0 }
    ];
  }
}

export async function getRecentAppointments() {
  await requireAdmin();
  try {
    return await prisma.appointment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, email: true } },
        service: { select: { name: true } },
        staff: { select: { name: true } }
      }
    });
  } catch (e) {
    console.error('Error fetching recent appointments:', e);
    return [];
  }
}

export async function getAllAppointments(status?: string) {
  await requireAdmin();
  try {
    const where = status && status !== 'ALL' ? { status } : undefined;
    return await prisma.appointment.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        service: { select: { name: true, price: true } },
        staff: { select: { name: true } }
      }
    });
  } catch (e) {
    console.error('Error fetching all appointments:', e);
    return [];
  }
}

export async function approveAppointment(id: string) {
  const adminSession = await requireAdmin();
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: 'CONFIRMED' },
    include: { customer: true, service: true }
  });

  const dateStr = new Date(appointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // 📧 Send Nodemailer HTML Email 2: Confirmed
  if (appointment.customer?.email) {
    await sendAppointmentConfirmed({
      toEmail: appointment.customer.email,
      customerName: appointment.customer.name,
      serviceName: appointment.service.name,
      date: dateStr,
      time: appointment.time,
      bookingCode: appointment.bookingCode,
    });
  }

  // 📱 Send SMS Confirmation via SMS Gateway
  if (appointment.customer?.phone) {
    await sendBookingConfirmedSMS(
      appointment.customer.phone,
      appointment.customer.name,
      appointment.service.name,
      dateStr,
      appointment.time,
      appointment.bookingCode
    );
  }

  // 🔔 In-App Notification
  await createNotification(
    appointment.customerId,
    "Booking Confirmed",
    `Your ${appointment.service.name} appointment (${appointment.bookingCode}) has been confirmed for ${appointment.time}.`,
    "CONFIRMED"
  );

  // 📝 Audit Log
  await createAuditLog("Confirmed Booking", `Confirmed ${appointment.bookingCode} for ${appointment.customer.name}`);

  revalidatePath('/admin/appointments');
  revalidatePath('/admin/dashboard');
  revalidatePath('/dashboard');
}

export async function rejectAppointment(id: string) {
  const adminSession = await requireAdmin();
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: 'DECLINED' },
    include: { customer: true, service: true }
  });

  const dateStr = new Date(appointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // 📧 Send Nodemailer HTML Email 3: Declined
  if (appointment.customer?.email) {
    await sendAppointmentDeclined({
      toEmail: appointment.customer.email,
      customerName: appointment.customer.name,
      serviceName: appointment.service.name,
      date: dateStr,
      time: appointment.time,
      bookingCode: appointment.bookingCode,
    });
  }

  // 🔔 In-App Notification
  await createNotification(
    appointment.customerId,
    "Booking Declined",
    `Unfortunately, your appointment request (${appointment.bookingCode}) could not be confirmed. Please select another time.`,
    "DECLINED"
  );

  // 📝 Audit Log
  await createAuditLog("Declined Booking", `Declined ${appointment.bookingCode} for ${appointment.customer.name}`);

  revalidatePath('/admin/appointments');
  revalidatePath('/admin/dashboard');
  revalidatePath('/dashboard');
}

export async function completeAppointment(id: string) {
  const adminSession = await requireAdmin();
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: 'COMPLETED', paymentStatus: 'PAID' },
    include: { customer: true, service: true }
  });

  const dateStr = new Date(appointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // 📧 Send Nodemailer HTML Email 6: Thank You
  if (appointment.customer?.email) {
    await sendThankYouReviewRequest({
      toEmail: appointment.customer.email,
      customerName: appointment.customer.name,
      serviceName: appointment.service.name,
      date: dateStr,
      time: appointment.time,
      bookingCode: appointment.bookingCode,
    });
  }

  // 🔔 In-App Notification
  await createNotification(
    appointment.customerId,
    "Appointment Completed",
    `Thank you for visiting Beauty Salon! Your ${appointment.service.name} treatment is complete. Please leave a review!`,
    "INFO"
  );

  // 📝 Audit Log
  await createAuditLog("Completed Appointment", `Marked ${appointment.bookingCode} completed`);

  revalidatePath('/admin/appointments');
  revalidatePath('/admin/dashboard');
  revalidatePath('/dashboard');
}

export async function getAuditLogs() {
  await requireAdmin();
  try {
    return await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch (e) {
    console.error("Error fetching audit logs:", e);
    return [];
  }
}

export async function getAllCustomers() {
  await requireAdmin();
  try {
    return await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        _count: {
          select: { appointments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.error('Error fetching customers:', e);
    return [];
  }
}

export async function getAllServices() {
  await requireAdmin();
  try {
    return await prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.error('Error fetching services:', e);
    return [];
  }
}
