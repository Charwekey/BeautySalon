import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyAppointments } from "@/actions/appointmentActions";
import { getCustomerNotifications } from "@/actions/notificationActions";
import CustomerDashboardClient from "./CustomerDashboardClient";

export default async function CustomerDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const appointments = await getMyAppointments();
  const notifications = await getCustomerNotifications();

  return (
    <CustomerDashboardClient
      session={session}
      appointments={appointments}
      notifications={notifications}
    />
  );
}
