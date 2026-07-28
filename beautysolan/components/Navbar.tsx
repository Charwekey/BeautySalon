"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, UserCheck, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { logout } from "@/actions/authActions";
import type { SessionPayload } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar({ session }: { session: SessionPayload | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isAdminOrStaff = session && session.role !== "CUSTOMER";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#F2DCE0] text-[#3D262B] py-1.5 px-4 text-center text-xs tracking-widest uppercase font-medium border-b border-[#E8D5D8]/50 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#B8737D]" />
        <span>
          {session
            ? isAdminOrStaff
              ? `Logged in as Salon Administrator (${session.name})`
              : `Welcome Back, ${session.name}! Enjoy Exclusive Member Privileges`
            : "Luxury Hair Styling, Braiding & Facials in Accra, Ghana"}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#B8737D]" />
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-400 ${
          isScrolled
            ? "bg-[#FDF7F8]/90 backdrop-blur-md shadow-[0_4px_25px_rgba(184,115,125,0.08)] border-b border-[#E8D5D8]"
            : "bg-[#FDF7F8]/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left Nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-widest transition-all duration-300 relative py-1 ${
                    isActive(link.href)
                      ? "text-[#B8737D]"
                      : "text-[#3D262B] hover:text-[#B8737D]"
                  } after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-[#B8737D] after:transition-all after:duration-300 ${
                    isActive(link.href) ? "after:w-full" : "after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logo Center */}
            <Link href="/" className="flex flex-col items-center group">
              <span className="font-script text-3xl sm:text-4xl text-[#B8737D] leading-none group-hover:scale-105 transition-transform duration-300">
                Beauty Technicians
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-[#6B4D54] mt-0.5">
                Accra Beauty Studio
              </span>
            </Link>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                isAdminOrStaff ? (
                  <>
                    {/* Admin Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3D262B] text-white text-xs font-semibold shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E4B8C0]" />
                      <span>Admin: {session.name.split(" ")[0]}</span>
                    </div>

                    {/* Direct link to Admin Command Center (NO booking link for Admin) */}
                    <Link
                      href="/admin/dashboard"
                      className="btn-rose-gold px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Admin Dashboard</span>
                    </Link>

                    {/* Sign Out Button */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="p-2 text-[#9E8288] hover:text-[#B8737D] transition-colors cursor-pointer disabled:opacity-50"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Customer Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8ECEE] text-[#3D262B] text-xs font-semibold border border-[#E8D5D8]">
                      <UserCheck className="w-3.5 h-3.5 text-[#B8737D]" />
                      <span>Hi, {session.name.split(" ")[0]}</span>
                    </div>

                    <Link
                      href="/booking"
                      className="btn-rose-gold px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all"
                    >
                      Book Treatment
                    </Link>

                    {/* Sign Out Button */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="p-2 text-[#9E8288] hover:text-[#B8737D] transition-colors cursor-pointer disabled:opacity-50"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                )
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-xs font-semibold uppercase tracking-widest text-[#3D262B] hover:text-[#B8737D] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/booking"
                    className="btn-rose-gold px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all"
                  >
                    Book Appointment
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#3D262B] hover:bg-[#F8ECEE] transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileOpen ? "max-h-[380px] border-b border-[#E8D5D8] bg-[#FDF7F8]" : "max-h-0"
          }`}
        >
          <div className="px-6 py-6 space-y-4 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm uppercase tracking-widest font-semibold text-[#3D262B] hover:text-[#B8737D]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#E8D5D8] flex flex-col gap-3 items-center">
              {session ? (
                isAdminOrStaff ? (
                  <>
                    <span className="text-xs font-bold text-[#3D262B]">
                      Logged in as Admin: {session.name}
                    </span>
                    <Link
                      href="/admin/dashboard"
                      className="btn-rose-gold w-full max-w-xs py-3 rounded-full text-xs font-semibold"
                    >
                      Go to Admin Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-xs uppercase tracking-widest text-[#9E8288] hover:text-[#B8737D] font-semibold py-1 cursor-pointer"
                    >
                      {isLoggingOut ? "Signing Out..." : "Sign Out"}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-[#B8737D]">
                      Logged in as {session.name}
                    </span>
                    <Link
                      href="/booking"
                      className="btn-rose-gold w-full max-w-xs py-3 rounded-full text-xs"
                    >
                      Book Treatment
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-xs uppercase tracking-widest text-[#9E8288] hover:text-[#B8737D] font-semibold py-1 cursor-pointer"
                    >
                      {isLoggingOut ? "Signing Out..." : "Sign Out"}
                    </button>
                  </>
                )
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-xs uppercase tracking-widest font-semibold text-[#3D262B]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/booking"
                    className="btn-rose-gold w-full max-w-xs py-3 rounded-full text-xs"
                  >
                    Book Appointment
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
