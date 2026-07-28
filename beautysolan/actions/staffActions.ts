'use server';

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { createAuditLog } from "@/actions/dashboardActions";
import { revalidatePath } from "next/cache";

export interface StaffActionState {
  success: boolean;
  error?: string;
}

async function requireAdminOrSuperAdmin() {
  const session = await getSession();
  const allowedRoles = ["SUPER_ADMIN", "ADMIN"];
  if (!session || !allowedRoles.includes(session.role as string)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getStaffMembers() {
  await requireAdminOrSuperAdmin();
  try {
    const staffList = await prisma.staff.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            permissions: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const allStaffUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "STYLIST", "ACCOUNTANT"],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { staffList, allStaffUsers };
  } catch (e) {
    console.error("Error fetching staff members:", e);
    return { staffList: [], allStaffUsers: [] };
  }
}

export async function createStaffMember(prevState: StaffActionState, formData: FormData): Promise<StaffActionState> {
  await requireAdminOrSuperAdmin();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const role = (formData.get("role") as string) || "STYLIST";
  const specialization = formData.get("specialization") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Name, Email, and Password are required." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
      },
    });

    await prisma.staff.create({
      data: {
        name,
        specialization: specialization || "Salon Specialist",
        bio: `Professional ${role.toLowerCase().replace("_", " ")} at Beauty Technicians.`,
        userId: newUser.id,
      },
    });

    await createAuditLog(
      "Created Staff Account",
      `Created staff member ${name} (${email}) with role ${role}`
    );

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (e) {
    console.error("Failed to create staff member:", e);
    return { success: false, error: "Failed to create staff member. Please try again." };
  }
}

export async function updateUserRoleAndPermissions(
  userId: string,
  role: string,
  permissionsArray: string[]
) {
  const adminSession = await requireAdminOrSuperAdmin();

  try {
    const userToUpdate = await prisma.user.findUnique({ where: { id: userId } });
    if (!userToUpdate) return { success: false, error: "User not found" };

    if ((userToUpdate.role as any) === "SUPER_ADMIN" && adminSession.role !== "SUPER_ADMIN") {
      return { success: false, error: "Only a Super Admin can modify Super Admin accounts." };
    }

    const permissionsJson = JSON.stringify(permissionsArray);

    await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        permissions: permissionsJson,
      },
    });

    await createAuditLog(
      "Updated Role & Permissions",
      `Updated ${userToUpdate.name} (${userToUpdate.email}) to Role: ${role}`
    );

    revalidatePath("/admin/staff");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Failed to update user role:", e);
    return { success: false, error: "Failed to update role and permissions." };
  }
}

export async function deleteStaffMember(userId: string) {
  const adminSession = await requireAdminOrSuperAdmin();

  try {
    const userToDelete = await prisma.user.findUnique({ where: { id: userId } });
    if (!userToDelete) return { success: false, error: "User not found" };

    if ((userToDelete.role as any) === "SUPER_ADMIN" && adminSession.role !== "SUPER_ADMIN") {
      return { success: false, error: "Only a Super Admin can delete Super Admin accounts." };
    }

    await prisma.staff.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    await createAuditLog(
      "Deleted Staff Account",
      `Removed staff user ${userToDelete.name} (${userToDelete.email})`
    );

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (e) {
    console.error("Failed to delete staff member:", e);
    return { success: false, error: "Failed to delete staff member." };
  }
}
