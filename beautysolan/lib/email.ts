import nodemailer from "nodemailer";

export interface EmailPayload {
  toEmail: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  bookingCode?: string;
  receiptNumber?: string;
}

// Nodemailer Transporter Setup
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback for development logging
  return {
    sendMail: async (mailOptions: any) => {
      console.log(`
======================================================================
📧 NODEMAILER DISPATCHED HTML EMAIL
To: ${mailOptions.to}
Subject: ${mailOptions.subject}
From: ${mailOptions.from || '"Beauty Technicians" <no-reply@beautytechnicians.com>'}
======================================================================
      `);
      return { messageId: `mock-${Date.now()}` };
    },
  };
}

const emailWrapper = (contentHtml: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FDF7F8; margin: 0; padding: 20px; color: #3D262B; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #E8D5D8; box-shadow: 0 10px 25px rgba(61,38,43,0.05); }
        .header { background: #3D262B; color: #E4B8C0; text-align: center; padding: 32px 20px; }
        .header h1 { margin: 0; font-size: 28px; font-family: Georgia, serif; font-weight: normal; }
        .header p { margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #E6D2CA; }
        .content { padding: 32px; font-size: 14px; line-height: 1.6; }
        .card { background: #FDF7F8; border-radius: 16px; border: 1px solid #E8D5D8; padding: 20px; margin: 20px 0; }
        .card-row { display: flex; justify-content: space-between; border-bottom: 1px solid #E8D5D8; padding: 8px 0; font-size: 13px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        .footer { text-align: center; padding: 24px; font-size: 11px; color: #9E8288; border-t: 1px solid #E8D5D8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Beauty Technicians</h1>
          <p>Accra Beauty Studio</p>
        </div>
        <div class="content">
          ${contentHtml}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Beauty Technicians Salon. Accra, Ghana.<br/>
          Need assistance? Reply to this email or call +233 24 000 0000.
        </div>
      </div>
    </body>
  </html>
`;

export async function sendAppointmentRequestReceived(payload: EmailPayload) {
  const transporter = getTransporter();
  const html = emailWrapper(`
    <h2 style="color: #3D262B; font-family: Georgia, serif; margin-top: 0;">Appointment Request Received</h2>
    <p>Hello <strong>${payload.customerName}</strong>,</p>
    <p>Thank you for choosing Beauty Technicians. We have successfully received your appointment request!</p>
    
    <div class="card">
      <div style="font-size: 12px; text-transform: uppercase; color: #B8737D; font-weight: bold; margin-bottom: 8px;">
        Booking Reference: ${payload.bookingCode || "BK-PENDING"}
      </div>
      <div style="margin-bottom: 6px;"><strong>Service:</strong> ${payload.serviceName}</div>
      <div style="margin-bottom: 6px;"><strong>Date:</strong> ${payload.date}</div>
      <div style="margin-bottom: 6px;"><strong>Time:</strong> ${payload.time}</div>
      <div><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">🟡 Pending Review</span></div>
    </div>
    
    <p>Our team is reviewing your schedule slot and will confirm your booking shortly.</p>
  `);

  await transporter.sendMail({
    from: '"Beauty Technicians" <appointments@beautytechnicians.com>',
    to: payload.toEmail,
    subject: `Your Appointment Request Has Been Received (${payload.bookingCode})`,
    html,
  });
  return true;
}

export async function sendAppointmentRescheduled(payload: EmailPayload) {
  const transporter = getTransporter();
  const html = emailWrapper(`
    <h2 style="color: #3D262B; font-family: Georgia, serif; margin-top: 0;">Appointment Rescheduled 📅</h2>
    <p>Hello <strong>${payload.customerName}</strong>,</p>
    <p>Your appointment has been successfully updated to a new date and time slot.</p>
    
    <div class="card">
      <div style="font-size: 12px; text-transform: uppercase; color: #B8737D; font-weight: bold; margin-bottom: 8px;">
        Booking Reference: ${payload.bookingCode}
      </div>
      <div style="margin-bottom: 6px;"><strong>Service:</strong> ${payload.serviceName}</div>
      <div style="margin-bottom: 6px;"><strong>New Date:</strong> ${payload.date}</div>
      <div style="margin-bottom: 6px;"><strong>New Time Slot:</strong> ${payload.time}</div>
      <div><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">🟡 Rescheduled - Pending Confirmation</span></div>
    </div>
    
    <p>Our team has received your updated schedule and will send a confirmation notification shortly!</p>
  `);

  await transporter.sendMail({
    from: '"Beauty Technicians" <appointments@beautytechnicians.com>',
    to: payload.toEmail,
    subject: `Appointment Rescheduled (${payload.bookingCode}) - Beauty Technicians`,
    html,
  });
  return true;
}

export async function sendAppointmentConfirmed(payload: EmailPayload) {
  const transporter = getTransporter();
  const html = emailWrapper(`
    <h2 style="color: #3D262B; font-family: Georgia, serif; margin-top: 0;">Appointment Confirmed! 🟢</h2>
    <p>Hello <strong>${payload.customerName}</strong>,</p>
    <p>Great news! Your beauty appointment has been officially confirmed by our admin team.</p>
    
    <div class="card">
      <div style="font-size: 12px; text-transform: uppercase; color: #B8737D; font-weight: bold; margin-bottom: 8px;">
        Booking Code: ${payload.bookingCode}
      </div>
      <div style="margin-bottom: 6px;"><strong>Service:</strong> ${payload.serviceName}</div>
      <div style="margin-bottom: 6px;"><strong>Date:</strong> ${payload.date}</div>
      <div style="margin-bottom: 6px;"><strong>Time Slot:</strong> ${payload.time}</div>
      <div><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">🟢 Confirmed</span></div>
    </div>
    
    <p>Please arrive 10 minutes prior to your appointment time. We look forward to giving you an exceptional treatment experience!</p>
  `);

  await transporter.sendMail({
    from: '"Beauty Technicians" <appointments@beautytechnicians.com>',
    to: payload.toEmail,
    subject: `Your Appointment Has Been Confirmed! (${payload.bookingCode})`,
    html,
  });
  return true;
}

export async function sendAppointmentDeclined(payload: EmailPayload) {
  const transporter = getTransporter();
  const html = emailWrapper(`
    <h2 style="color: #3D262B; font-family: Georgia, serif; margin-top: 0;">Appointment Notice</h2>
    <p>Hello <strong>${payload.customerName}</strong>,</p>
    <p>Unfortunately, we could not confirm your requested appointment for <strong>${payload.serviceName}</strong> on <strong>${payload.date}</strong> at <strong>${payload.time}</strong> as the time slot is no longer available.</p>
    
    <p>Please visit your customer dashboard to select another preferred date or time slot.</p>
  `);

  await transporter.sendMail({
    from: '"Beauty Technicians" <appointments@beautytechnicians.com>',
    to: payload.toEmail,
    subject: `Notice Regarding Your Appointment Request (${payload.bookingCode})`,
    html,
  });
  return true;
}

export async function sendPaymentReceived(payload: EmailPayload) {
  const transporter = getTransporter();
  const html = emailWrapper(`
    <h2 style="color: #3D262B; font-family: Georgia, serif; margin-top: 0;">Payment Receipt Received 💳</h2>
    <p>Hello <strong>${payload.customerName}</strong>,</p>
    <p>Thank you for your payment. Your booking has been secured successfully.</p>
    
    <div class="card">
      <div style="font-size: 12px; text-transform: uppercase; color: #059669; font-weight: bold; margin-bottom: 8px;">
        Receipt Number: ${payload.receiptNumber || "PAY-20260031"}
      </div>
      <div style="margin-bottom: 6px;"><strong>Booking ID:</strong> ${payload.bookingCode}</div>
      <div style="margin-bottom: 6px;"><strong>Service:</strong> ${payload.serviceName}</div>
    </div>
  `);

  await transporter.sendMail({
    from: '"Beauty Technicians" <payments@beautytechnicians.com>',
    to: payload.toEmail,
    subject: `Payment Receipt - ${payload.receiptNumber}`,
    html,
  });
  return true;
}

export async function sendAppointmentReminder(payload: EmailPayload, reminderTime: "24h" | "2h") {
  const transporter = getTransporter();
  const html = emailWrapper(`
    <h2 style="color: #3D262B; font-family: Georgia, serif; margin-top: 0;">Appointment Reminder ⏰</h2>
    <p>Hello <strong>${payload.customerName}</strong>,</p>
    <p>This is a friendly reminder that your upcoming <strong>${payload.serviceName}</strong> treatment is in ${reminderTime === "24h" ? "24 hours" : "2 hours"}.</p>
    
    <div class="card">
      <div><strong>Date:</strong> ${payload.date} at ${payload.time}</div>
    </div>
  `);

  await transporter.sendMail({
    from: '"Beauty Technicians" <reminders@beautytechnicians.com>',
    to: payload.toEmail,
    subject: `Reminder: Your Appointment is Coming Up! (${payload.bookingCode})`,
    html,
  });
  return true;
}

export async function sendThankYouReviewRequest(payload: EmailPayload) {
  const transporter = getTransporter();
  const html = emailWrapper(`
    <h2 style="color: #3D262B; font-family: Georgia, serif; margin-top: 0;">Thank You for Visiting! ✨</h2>
    <p>Hello <strong>${payload.customerName}</strong>,</p>
    <p>Thank you for visiting Beauty Technicians today for your <strong>${payload.serviceName}</strong> treatment.</p>
    <p>We hope you loved your experience! Please take a moment to leave us a review on your dashboard.</p>
  `);

  await transporter.sendMail({
    from: '"Beauty Technicians" <reviews@beautytechnicians.com>',
    to: payload.toEmail,
    subject: `Thank You for Visiting Beauty Technicians!`,
    html,
  });
  return true;
}
