'use client';

import { useState, useActionState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Lock, 
  Scissors, 
  DollarSign, 
  ClipboardList, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Shield, 
  Sparkles 
} from 'lucide-react';
import { createStaffMember, updateUserRoleAndPermissions, deleteStaffMember } from '@/actions/staffActions';
import { DEFAULT_ROLE_PERMISSIONS, Permission, Role } from '@/lib/rbac';

interface StaffClientProps {
  currentSession: any;
  staffList: any[];
  allStaffUsers: any[];
}

const ALL_PERMISSIONS: { key: Permission; label: string; description: string }[] = [
  { key: 'view_bookings', label: 'View Bookings', description: 'Can view all client appointments' },
  { key: 'create_booking', label: 'Create Bookings', description: 'Can schedule new appointments' },
  { key: 'edit_booking', label: 'Edit Bookings', description: 'Can approve, decline, or edit bookings' },
  { key: 'delete_booking', label: 'Delete Bookings', description: 'Can cancel or remove appointments' },
  { key: 'manage_services', label: 'Manage Services', description: 'Can add, edit, or remove salon services & prices' },
  { key: 'manage_staff', label: 'Manage Staff', description: 'Can create and remove staff team members' },
  { key: 'manage_roles', label: 'Manage Roles & RBAC', description: 'Can assign access categories & permissions' },
  { key: 'manage_users', label: 'Manage Customers', description: 'Can view customer directory & profiles' },
  { key: 'view_reports', label: 'Financial Reports', description: 'Can view revenue charts & business analytics' },
  { key: 'manage_payments', label: 'Manage Payments', description: 'Can mark payments received & issue receipts' },
  { key: 'manage_settings', label: 'System Settings', description: 'Can modify salon configurations' },
  { key: 'mark_completed', label: 'Mark Completed', description: 'Can mark client service treatments finished' },
  { key: 'check_in', label: 'Client Check-In', description: 'Can check in clients upon arrival' },
];

export default function StaffClient({ currentSession, staffList, allStaffUsers }: StaffClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>('STYLIST');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const [createState, createAction, isCreatePending] = useActionState(createStaffMember, { success: false });

  const handleOpenEditModal = (user: any) => {
    setEditingUser(user);
    const roleKey = (user.role as Role) || 'STYLIST';
    setSelectedRole(roleKey);

    if (user.permissions) {
      try {
        const parsed = JSON.parse(user.permissions);
        if (Array.isArray(parsed)) {
          setSelectedPermissions(parsed);
          return;
        }
      } catch {}
    }
    setSelectedPermissions(DEFAULT_ROLE_PERMISSIONS[roleKey] || []);
  };

  const handleRoleChange = (newRole: Role) => {
    setSelectedRole(newRole);
    setSelectedPermissions(DEFAULT_ROLE_PERMISSIONS[newRole] || []);
  };

  const handleTogglePermission = (perm: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSavePermissions = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    const res = await updateUserRoleAndPermissions(editingUser.id, selectedRole, selectedPermissions);
    setIsUpdating(false);
    if (res?.success) {
      setEditingUser(null);
      window.location.reload();
    } else {
      alert(res?.error || 'Failed to update user access.');
    }
  };

  const handleDeleteStaff = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from system access?`)) return;
    const res = await deleteStaffMember(userId);
    if (res?.success) {
      window.location.reload();
    } else {
      alert(res?.error || 'Failed to delete staff member.');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#3D262B] text-[#E4B8C0] border border-[#52353C]">
            👑 Super Admin
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            🛡️ Salon Admin
          </span>
        );
      case 'RECEPTIONIST':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            📋 Receptionist
          </span>
        );
      case 'STYLIST':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            ✂️ Stylist
          </span>
        );
      case 'ACCOUNTANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            💰 Accountant
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
            👤 {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8D5D8] pb-6">
        <div>
          <span className="font-script text-2xl text-[#B8737D]">Role & Staff Governance</span>
          <h1 className="text-3xl font-display font-bold text-[#3D262B]">Staff & Access Control (RBAC)</h1>
          <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-1">
            Assign categories of access, grant custom permissions, and manage salon personnel.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-rose-gold px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add New Staff Member
        </button>
      </div>

      {/* Access Categories Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8D5D8] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-[#3D262B]" />
            <h3 className="font-display font-bold text-xs text-[#3D262B]">Super Admin</h3>
          </div>
          <p className="text-[11px] text-[#6B4D54] leading-relaxed">
            Full unrestricted control over all system settings, staff roles, and audit logs.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8D5D8] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <h3 className="font-display font-bold text-xs text-[#3D262B]">Admin</h3>
          </div>
          <p className="text-[11px] text-[#6B4D54] leading-relaxed">
            Manages appointments, services, customers, staff listings, and financials.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8D5D8] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-amber-600" />
            <h3 className="font-display font-bold text-xs text-[#3D262B]">Receptionist</h3>
          </div>
          <p className="text-[11px] text-[#6B4D54] leading-relaxed">
            Manages appointment bookings, checks in clients, and views service schedules.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8D5D8] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="w-4 h-4 text-purple-600" />
            <h3 className="font-display font-bold text-xs text-[#3D262B]">Stylist</h3>
          </div>
          <p className="text-[11px] text-[#6B4D54] leading-relaxed">
            Views assigned client treatments, hair notes, and marks services completed.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8D5D8] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="font-display font-bold text-xs text-[#3D262B]">Accountant</h3>
          </div>
          <p className="text-[11px] text-[#6B4D54] leading-relaxed">
            Access to financial reports, revenue charts, and payment transaction logs.
          </p>
        </div>
      </div>

      {/* Staff & Roles Table */}
      <div className="bg-white rounded-3xl border border-[#E8D5D8] shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-[#3D262B]">System Staff Directory</h2>
            <p className="text-xs text-[#6B4D54] mt-0.5">
              Click "Manage Access" to update role categories or grant specific permissions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8D5D8] text-[11px] uppercase tracking-wider font-semibold text-[#6B4D54]">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role Category</th>
                <th className="py-3.5 px-4">Custom Access</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D5D8]/60 text-xs text-[#3D262B]">
              {allStaffUsers.map((user) => {
                const customCount = user.permissions ? JSON.parse(user.permissions || '[]').length : 0;
                return (
                  <tr key={user.id} className="hover:bg-[#FDF7F8] transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#3D262B]">
                      {user.name}
                      {user.phone && <span className="text-[10px] text-[#9E8288] block font-normal">{user.phone}</span>}
                    </td>
                    <td className="py-4 px-4 text-[#6B4D54]">{user.email}</td>
                    <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-4 px-4">
                      {customCount > 0 ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {customCount} Custom Permissions
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#9E8288]">Default Role Access</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#B8737D] bg-[#F8ECEE] hover:bg-[#f2dbdf] transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Manage Access
                        </button>
                        {user.id !== currentSession?.userId && user.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleDeleteStaff(user.id, user.name)}
                            className="p-1.5 rounded-full text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove Staff Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D262B]/60 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-[#E8D5D8] shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#9E8288] hover:bg-[#F8ECEE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-2xl font-bold text-[#3D262B] mb-1">Add New Staff Member</h2>
            <p className="text-xs text-[#6B4D54] mb-6">Create credentials and select their initial access role category.</p>

            {createState?.error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                {createState.error}
              </div>
            )}

            <form action={createAction} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Ama Mensah"
                  className="w-full rounded-xl border border-[#E8D5D8] p-3 text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ama@beautytechnicians.com"
                  className="w-full rounded-xl border border-[#E8D5D8] p-3 text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Temporary Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E8D5D8] p-3 text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+233240000000"
                    className="w-full rounded-xl border border-[#E8D5D8] p-3 text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Role Category</label>
                <select
                  name="role"
                  className="w-full rounded-xl border border-[#E8D5D8] p-3 text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none bg-white font-semibold"
                >
                  <option value="STYLIST">✂️ Stylist</option>
                  <option value="RECEPTIONIST">📋 Receptionist</option>
                  <option value="ACCOUNTANT">💰 Accountant</option>
                  <option value="ADMIN">🛡️ Admin</option>
                  {currentSession?.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">👑 Super Admin</option>}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Specialization / Title</label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="e.g. Master Braider & Wig Installer"
                  className="w-full rounded-xl border border-[#E8D5D8] p-3 text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatePending}
                className="btn-rose-gold w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider mt-4"
              >
                {isCreatePending ? 'Creating Staff Account...' : 'Create Staff Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role & Granular Permissions Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D262B]/60 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full rounded-3xl border border-[#E8D5D8] shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#9E8288] hover:bg-[#F8ECEE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-2xl font-bold text-[#3D262B] mb-1">Manage Permissions & Access</h2>
            <p className="text-xs text-[#6B4D54] mb-6">
              User: <span className="font-semibold text-[#3D262B]">{editingUser.name}</span> ({editingUser.email})
            </p>

            <div className="space-y-6">
              {/* Role Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-2">
                  Select System Role Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'STYLIST', 'ACCOUNTANT'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col gap-1 ${
                        selectedRole === r
                          ? 'border-[#B8737D] bg-[#F8ECEE] text-[#3D262B] ring-2 ring-[#B8737D]'
                          : 'border-[#E8D5D8] bg-white text-[#6B4D54] hover:bg-gray-50'
                      }`}
                    >
                      <span>{r.replace('_', ' ')}</span>
                      <span className="text-[10px] font-normal text-[#9E8288]">Default Preset</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Permission Checkboxes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-3">
                  Granular Permission Controls
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                  {ALL_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key);
                    return (
                      <div
                        key={perm.key}
                        onClick={() => handleTogglePermission(perm.key)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'border-[#B8737D] bg-[#FDF7F8]'
                            : 'border-[#E8D5D8] bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? 'bg-[#B8737D] border-[#B8737D] text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#3D262B] block">{perm.label}</span>
                          <span className="text-[10px] text-[#6B4D54] block leading-tight">{perm.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save Controls */}
              <div className="pt-4 border-t border-[#E8D5D8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn-outline-rose px-6 py-2.5 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={isUpdating}
                  className="btn-rose-gold px-8 py-2.5 rounded-full text-xs font-semibold"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Role & Permissions'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
