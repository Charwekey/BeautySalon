export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "RECEPTIONIST"
  | "STYLIST"
  | "ACCOUNTANT"
  | "CUSTOMER";

export type Permission =
  | "view_bookings"
  | "create_booking"
  | "edit_booking"
  | "delete_booking"
  | "manage_services"
  | "manage_staff"
  | "manage_roles"
  | "manage_users"
  | "view_reports"
  | "manage_payments"
  | "manage_settings"
  | "mark_completed"
  | "check_in";

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "view_bookings",
    "create_booking",
    "edit_booking",
    "delete_booking",
    "manage_services",
    "manage_staff",
    "manage_roles",
    "manage_users",
    "view_reports",
    "manage_payments",
    "manage_settings",
    "mark_completed",
    "check_in",
  ],
  ADMIN: [
    "view_bookings",
    "create_booking",
    "edit_booking",
    "manage_services",
    "manage_staff",
    "view_reports",
    "manage_payments",
    "mark_completed",
    "check_in",
  ],
  RECEPTIONIST: [
    "view_bookings",
    "create_booking",
    "edit_booking",
    "check_in",
  ],
  STYLIST: [
    "view_bookings",
    "mark_completed",
  ],
  ACCOUNTANT: [
    "view_bookings",
    "view_reports",
    "manage_payments",
  ],
  CUSTOMER: [
    "view_bookings",
    "create_booking",
  ],
};

export function getRolePermissions(role: string, customPermissionsJson?: string | null): Permission[] {
  const roleKey = (role as Role) || "CUSTOMER";
  let basePermissions = DEFAULT_ROLE_PERMISSIONS[roleKey] || [];

  if (customPermissionsJson) {
    try {
      const parsed = JSON.parse(customPermissionsJson);
      if (Array.isArray(parsed)) {
        return parsed as Permission[];
      }
    } catch {
      // Fallback to base role permissions
    }
  }

  return basePermissions;
}

export function hasPermission(
  role: string,
  requiredPermission: Permission,
  customPermissionsJson?: string | null
): boolean {
  if (role === "SUPER_ADMIN") return true;
  const permissions = getRolePermissions(role, customPermissionsJson);
  return permissions.includes(requiredPermission);
}
