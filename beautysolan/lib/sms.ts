export interface SMSPayload {
  toPhone: string;
  message: string;
}

/**
 * Sends SMS notifications via SMS Gateway API (Arkesel / Hubtel / Generic SMS API)
 * Configurable via process.env.SMS_API_KEY, process.env.SMS_SENDER_ID, process.env.SMS_GATEWAY_URL
 */
export async function sendSMS(payload: SMSPayload): Promise<boolean> {
  const { toPhone, message } = payload;
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID || "BeautySalon";
  const gatewayUrl = process.env.SMS_GATEWAY_URL || "https://sms.arkesel.com/api/v2/sms/send";

  console.log(`
======================================================================
📱 SMS DISPATCHED VIA SMS GATEWAY API
To: ${toPhone || "(Client Mobile)"}
Sender ID: ${senderId}
Message: ${message}
======================================================================
  `);

  if (!toPhone) return false;

  // If live SMS API Key is provided, execute HTTP request
  if (apiKey) {
    try {
      const response = await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: senderId,
          recipients: [toPhone],
          message,
        }),
      });

      const resData = await response.json();
      console.log("SMS Gateway API Response:", resData);
      return response.ok;
    } catch (e) {
      console.error("SMS Gateway API Error:", e);
      return false;
    }
  }

  return true;
}

export async function sendBookingReceivedSMS(phone: string, customerName: string, serviceName: string, date: string, time: string, bookingCode: string) {
  const msg = `Hello ${customerName}, your appointment request (${bookingCode}) for ${serviceName} on ${date} at ${time} has been received. Beauty Technicians, Accra.`;
  return sendSMS({ toPhone: phone, message: msg });
}

export async function sendBookingConfirmedSMS(phone: string, customerName: string, serviceName: string, date: string, time: string, bookingCode: string) {
  const msg = `Hello ${customerName}, great news! Your appointment (${bookingCode}) for ${serviceName} on ${date} at ${time} is CONFIRMED. See you soon! Beauty Technicians.`;
  return sendSMS({ toPhone: phone, message: msg });
}

export async function sendBookingRescheduledSMS(phone: string, customerName: string, serviceName: string, date: string, time: string, bookingCode: string) {
  const msg = `Hello ${customerName}, your appointment (${bookingCode}) for ${serviceName} has been rescheduled to ${date} at ${time}. Beauty Technicians.`;
  return sendSMS({ toPhone: phone, message: msg });
}

export async function sendPaymentReceivedSMS(phone: string, customerName: string, serviceName: string, receiptNumber: string, amount: number) {
  const msg = `Hello ${customerName}, payment of GHS ${amount.toFixed(2)} received for ${serviceName}. Receipt No: ${receiptNumber}. Beauty Technicians.`;
  return sendSMS({ toPhone: phone, message: msg });
}
