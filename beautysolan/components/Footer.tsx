import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#3D262B] text-[#FDF7F8] border-t border-[#52353C]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-script text-4xl text-[#E4B8C0]">
                Beauty Technicians
              </span>
            </Link>
            <p className="text-[#E6D2CA] text-xs font-light leading-relaxed max-w-xs">
              Accra’s premier destination for luxury hair styling, protective braiding, melted wig installations, nail art, and revitalizing skin treatments.
            </p>
            <div className="flex gap-3 pt-2">
              {["instagram", "facebook", "tiktok", "whatsapp"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-8 h-8 rounded-full bg-[#52353C] flex items-center justify-center text-[#E4B8C0] hover:bg-[#E4B8C0] hover:text-[#3D262B] transition-all duration-300 text-xs font-bold uppercase"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-[#E4B8C0] mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Our Services" },
                { href: "/gallery", label: "Gallery Portfolio" },
                { href: "/booking", label: "Book Appointment" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#E6D2CA] text-xs hover:text-[#E4B8C0] transition-colors duration-300 uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-[#E4B8C0] mb-5">
              Menu
            </h3>
            <ul className="space-y-2.5">
              {[
                "Hair Styling & Blowouts",
                "Protective Box Braids",
                "Melted Lace Wig Installs",
                "Hair Steam Treatment",
                "Gel & Acrylic Nail Art",
                "Hydrating Facials",
              ].map((service) => (
                <li key={service}>
                  <span className="text-[#E6D2CA] text-xs font-light">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-[#E4B8C0] mb-5">
              Accra Studio
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-xs text-[#E6D2CA]">
                <MapPin className="h-4 w-4 text-[#E4B8C0] mt-0.5 shrink-0" />
                <span>Accra, Ghana (Near Airport Residential)</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-[#E6D2CA]">
                <Phone className="h-4 w-4 text-[#E4B8C0] shrink-0" />
                <span>+233 24 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-[#E6D2CA]">
                <Mail className="h-4 w-4 text-[#E4B8C0] shrink-0" />
                <span>info@beautytechnicians.com</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-[#E6D2CA]">
                <Clock className="h-4 w-4 text-[#E4B8C0] mt-0.5 shrink-0" />
                <div>
                  <p>Mon – Sat: 8:30 AM – 7:00 PM</p>
                  <p>Sun: By Appointment</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#52353C] bg-[#341F23]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#9E8288] text-[11px] uppercase tracking-wider">
            © {currentYear} Beauty Technicians Beauty Salon. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[#9E8288] text-[11px] uppercase tracking-wider hover:text-[#E4B8C0]">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[#9E8288] text-[11px] uppercase tracking-wider hover:text-[#E4B8C0]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
