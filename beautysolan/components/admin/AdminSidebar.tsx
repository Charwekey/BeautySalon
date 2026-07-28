'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  UserCog
} from 'lucide-react';
import { logout } from '@/actions/authActions';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Services Menu', href: '/admin/services', icon: Scissors },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Staff & Roles (RBAC)', href: '/admin/staff', icon: UserCog },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#3D262B] text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-[#3D262B]/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-[#3D262B] text-white border-r border-[#52353C] shadow-2xl
      `}>
        <div className="flex flex-col h-full">
          {/* Header Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-[#52353C]">
            <Sparkles className="text-[#E4B8C0]" size={26} />
            <div>
              <span className="font-script text-2xl text-[#E4B8C0] leading-none block">
                Beauty Technicians
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#E6D2CA] mt-0.5 block">
                Admin Command Center
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-xs uppercase tracking-wider font-semibold ${
                    isActive 
                      ? 'bg-[#E4B8C0] text-[#3D262B] shadow-md font-bold' 
                      : 'text-[#E6D2CA] hover:bg-[#52353C] hover:text-[#E4B8C0]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-[#52353C]">
            <button 
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-4 py-3 text-[#E6D2CA] hover:bg-[#52353C] hover:text-[#E4B8C0] transition-colors rounded-xl w-full text-xs uppercase tracking-wider font-semibold cursor-pointer disabled:opacity-50"
            >
              <LogOut size={18} />
              <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
