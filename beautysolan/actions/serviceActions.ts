'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { createAuditLog } from "@/actions/dashboardActions"
import { revalidatePath } from "next/cache"
import { FALLBACK_SERVICES } from "@/lib/constants"

export interface ServiceActionState {
  success: boolean;
  error?: string;
}

async function requireAdmin() {
  const session = await getSession();
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'];
  if (!session || !allowedRoles.includes(session.role as string)) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getAdminServices() {
  await requireAdmin();
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Seed initial fallback services if database is empty
    if (services.length === 0) {
      const createdServices = [];
      for (const item of FALLBACK_SERVICES) {
        const s = await prisma.service.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            duration: item.duration,
            category: item.category,
          }
        });
        createdServices.push(s);
      }
      return createdServices;
    }
    
    return services;
  } catch (e) {
    console.error("Error fetching admin services:", e);
    return [];
  }
}

export async function createService(prevState: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireAdmin();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceInput = formData.get('price') as string;
  const durationInput = formData.get('duration') as string;
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const featured = formData.get('featured') === 'true';

  if (!name || !priceInput || !durationInput || !category) {
    return { success: false, error: 'Name, price, duration, and category are required.' };
  }

  try {
    const price = parseFloat(priceInput);
    const duration = parseInt(durationInput);

    const newService = await prisma.service.create({
      data: {
        name,
        description: description || '',
        price,
        duration,
        category,
        imageUrl: imageUrl || null,
        featured,
      }
    });

    await createAuditLog("Created Service", `Added new treatment "${newService.name}" (GHS ${price.toFixed(2)})`);

    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/booking');
    return { success: true };
  } catch (e) {
    console.error("Error creating service:", e);
    return { success: false, error: 'Failed to create service. Please try again.' };
  }
}

export async function updateService(id: string, prevState: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireAdmin();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceInput = formData.get('price') as string;
  const durationInput = formData.get('duration') as string;
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const featured = formData.get('featured') === 'true';

  if (!id || !name || !priceInput || !durationInput || !category) {
    return { success: false, error: 'Name, price, duration, and category are required.' };
  }

  try {
    const price = parseFloat(priceInput);
    const duration = parseInt(durationInput);

    const updated = await prisma.service.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price,
        duration,
        category,
        imageUrl: imageUrl || null,
        featured,
      }
    });

    await createAuditLog("Updated Service", `Updated treatment "${updated.name}"`);

    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/booking');
    return { success: true };
  } catch (e) {
    console.error("Error updating service:", e);
    return { success: false, error: 'Failed to update service.' };
  }
}

export async function deleteService(id: string): Promise<ServiceActionState> {
  await requireAdmin();
  try {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Service not found.' };
    }

    await prisma.service.delete({ where: { id } });

    await createAuditLog("Deleted Service", `Deleted treatment "${existing.name}"`);

    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/booking');
    return { success: true };
  } catch (e) {
    console.error("Error deleting service:", e);
    return { success: false, error: 'Cannot delete service as it may have existing appointment records.' };
  }
}
