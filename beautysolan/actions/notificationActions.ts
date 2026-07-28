'use server';

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createNotification(userId: string, title: string, message: string, type = "INFO") {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  } catch (e) {
    console.error("Failed to create notification:", e);
    return null;
  }
}

export async function getCustomerNotifications() {
  const session = await getSession();
  if (!session) return [];

  try {
    return await prisma.notification.findMany({
      where: {
        OR: [
          { userId: session.userId },
          { user: { email: session.email } }
        ]
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Failed to get notifications:", e);
    return [];
  }
}

export async function markNotificationAsRead(id: string) {
  const session = await getSession();
  if (!session) return;

  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    revalidatePath("/dashboard");
  } catch (e) {
    console.error("Failed to mark notification read:", e);
  }
}
