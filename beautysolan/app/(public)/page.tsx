import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, Star, ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { getSession } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getSession();

  // Strict Logged-In User Redirection: Logged-in clients go directly to /dashboard, admins to /admin/dashboard
  if (session) {
    if (session.role === "CUSTOMER") {
      redirect("/dashboard");
    } else {
      redirect("/admin/dashboard");
    }
  }

  const featuredServices = [
    {
      name: "Luxury Hair Styling",
      desc: "Wash, blow-dry, and bespoke styling crafted for your unique hair texture.",
      price: "GHS 150",
      duration: "90 mins",
      img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
      tag: "Popular",
    },
    {
      name: "Knotless & Box Braids",
      desc: "Lightweight, scalp-friendly protective braiding with human or synthetic extensions.",
      price: "GHS 250",
      duration: "180 mins",
      img: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
      tag: "Best Seller",
    },
    {
      name: "Melted Lace Wig Install",
      desc: "HD lace customization, bleaching, pluck, and invisible scalp melt.",
      price: "GHS 300",
      duration: "120 mins",
      img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80",
      tag: "Signature",
    },
    {
      name: "Revitalizing Hair Treatment",
      desc: "Deep steam conditioning, moisture restoration, and scalp treatment.",
      price: "GHS 120",
      duration: "60 mins",
      img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
      tag: "Care",
    },
    {
      name: "Custom Gel & Acrylic Nails",
      desc: "Precision nail shaping, cuticle care, gel color, and artistic nail art.",
      price: "GHS 100",
      duration: "75 mins",
      img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
      tag: "Nails",
    },
    {
      name: "Glow Facial & Grooming",
      desc: "Deep pore cleanse, exfoliation, hydration mask, and brow sculpting.",
      price: "GHS 180",
      duration: "90 mins",
      img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
      tag: "Grooming",
    },
  ];

  const testimonials = [
    {
      name: "Ama Mensah",
      location: "East Legon, Accra",
      text: "The lace melt was completely invisible! Yaa took her time and made sure my scalp was protected. Best salon in Accra hands down.",
      rating: 5,
    },
    {
      name: "Kwame Asante",
      location: "Cantonments, Accra",
      text: "Brought my fiancée here for her birthday bridal treatment. The team made her feel like royalty. Unmatched luxury atmosphere.",
      rating: 5,
    },
    {
      name: "Efua Boateng",
      location: "Airport Residential, Accra",
      text: "My knotless braids were light, tension-free, and lasted over 6 weeks! The nail art is also out of this world.",
      rating: 5,
    },
  ];

  return (
    <div className="pt-28 overflow-hidden bg-[#FDF7F8]">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FDF7F8] via-[#F8ECEE] to-[#FDF7F8]">
        {/* Ambient blush background blur */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#F2DCE0]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#E4B8C0]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2DCE0] text-[#B8737D] text-xs uppercase tracking-widest font-semibold border border-[#E4B8C0]/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Luxury Beauty Experience in Accra</span>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal delay="150ms">
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#3D262B] leading-[1.15] tracking-tight">
                  Where Artistry Meets <br className="hidden sm:inline" />
                  <span className="font-script text-[#B8737D] text-5xl sm:text-7xl lg:text-8xl font-normal block mt-1">
                    Crystal Glow
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay="300ms">
                <p className="text-base sm:text-lg text-[#6B4D54] max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Step into Accra’s premier beauty studio. Specialized in bespoke protective braids, invisible wig installations, luxury nail art, and revitalizing facials.
                </p>
              </ScrollReveal>

              <ScrollReveal delay="450ms">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link
                    href="/auth/register"
                    className="btn-rose-gold px-8 py-4 rounded-full text-xs flex items-center gap-2"
                  >
                    <span>Get Started / Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="btn-outline-rose px-8 py-4 rounded-full text-xs"
                  >
                    Sign In
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Stats Row */}
            <ScrollReveal delay="600ms">
              <div className="pt-8 border-t border-[#E8D5D8] grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="font-display text-2xl font-bold text-[#3D262B]">5,000+</div>
                  <div className="text-xs text-[#6B4D54] uppercase tracking-wider mt-1">Happy Clients</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#3D262B]">8+ Yrs</div>
                  <div className="text-xs text-[#6B4D54] uppercase tracking-wider mt-1">Styling Mastery</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#3D262B]">4.9 ★</div>
                  <div className="text-xs text-[#6B4D54] uppercase tracking-wider mt-1">5-Star Reviews</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Aesthetic Imagery Collage */}
          <div className="lg:col-span-5 relative flex justify-center items-center min-h-[480px]">
            {/* Main Arch Frame */}
            <ScrollReveal className="relative z-10 w-[270px] sm:w-[320px] h-[380px] sm:h-[440px] arch-frame">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
                alt="Salon Luxury Ambience"
                fill
                className="object-cover"
                priority
              />
            </ScrollReveal>

            {/* Floating Tilted Polaroid 1 */}
            <div className="absolute top-4 -left-2 sm:left-2 z-20 w-[170px] sm:w-[200px] polaroid-frame rotate-[-8deg] animate-float-slow">
              <div className="relative h-[160px] sm:h-[190px] rounded overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&q=80"
                  alt="Braids Protective Style"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-2 text-center font-script text-lg text-[#B8737D]">
                Protective Braids
              </div>
            </div>

            {/* Floating Tilted Polaroid 2 */}
            <div className="absolute -bottom-4 -right-2 sm:right-2 z-20 w-[170px] sm:w-[200px] polaroid-frame rotate-[7deg] animate-float-slow" style={{ animationDelay: "2s" }}>
              <div className="relative h-[160px] sm:h-[190px] rounded overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80"
                  alt="Gel Nail Art"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-2 text-center font-script text-lg text-[#B8737D]">
                Custom Nail Art
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter / VIP Club Banner ─── */}
      <section className="bg-[#F2DCE0]/60 border-y border-[#E8D5D8] py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="font-script text-2xl text-[#B8737D]">Join the VIP Beauty List</span>
            <p className="text-xs uppercase tracking-widest text-[#6B4D54]">
              Be the first to hear about luxury offers & seasonal collections in Accra.
            </p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white border border-[#E4B8C0] px-4 py-2.5 rounded-full text-xs text-[#3D262B] placeholder:text-[#9E8288] focus:outline-none focus:ring-2 focus:ring-[#B8737D]"
            />
            <button type="button" className="btn-rose-gold px-6 py-2.5 rounded-full text-xs shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ─── Welcome Section ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Polaroid Stack */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md h-[460px]">
              <div className="absolute top-0 left-4 w-[280px] sm:w-[320px] polaroid-frame rotate-[-4deg]">
                <div className="relative h-[320px] rounded overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80"
                    alt="Salon Aesthetics"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 text-center font-script text-xl text-[#B8737D]">
                  Our Accra Sanctuary
                </div>
              </div>

              <div className="absolute bottom-2 right-4 w-[240px] sm:w-[280px] polaroid-frame rotate-[6deg] border-2 border-[#E4B8C0]">
                <div className="relative h-[260px] rounded overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80"
                    alt="Stylist at work"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 text-center font-script text-xl text-[#B8737D]">
                  Flawless Installations
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <ScrollReveal>
              <span className="font-script text-4xl text-[#B8737D]">Welcome to the Vibe</span>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#3D262B] mt-1">
                An Oasis of Elegance & Pure Indulgence
              </h2>
            </ScrollReveal>

            <ScrollReveal delay="150ms">
              <p className="text-base text-[#6B4D54] leading-relaxed font-light">
                Located in the heart of Accra, Beauty Technicians was created for individuals who appreciate premium quality and relaxing environments. From intricately woven protective braids to customized wig lace melts and pampering spa facials, every treatment is tailored to celebrate your natural beauty.
              </p>
            </ScrollReveal>

            <ScrollReveal delay="300ms">
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#E8D5D8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F8ECEE] flex items-center justify-center text-[#B8737D]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#3D262B]">Certified Stylists</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F8ECEE] flex items-center justify-center text-[#B8737D]">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#3D262B]">Premium Products</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay="450ms">
              <Link href="/services" className="btn-outline-rose px-8 py-3.5 rounded-full inline-block text-xs">
                View Full Menu
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Bestsellers & Featured Services ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FDF7F8] via-[#F8ECEE] to-[#FDF7F8]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-script text-4xl text-[#B8737D]">Bestsellers & Favorites</span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#3D262B] mt-1">
              Signature Treatments
            </h2>
            <p className="text-sm text-[#6B4D54] mt-3 uppercase tracking-widest font-medium">
              Handcrafted beauty services designed to elevate your everyday glow.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <ScrollReveal key={service.name} delay={`${index * 100}ms`}>
                <div className="polaroid-frame h-full flex flex-col group">
                  <div className="relative h-64 rounded overflow-hidden">
                    <Image
                      src={service.img}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 bg-[#FDF7F8]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[#B8737D] border border-[#E4B8C0]">
                      {service.tag}
                    </span>
                  </div>

                  <div className="pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-display text-xl font-semibold text-[#3D262B] group-hover:text-[#B8737D] transition-colors">
                          {service.name}
                        </h3>
                        <span className="font-display text-lg font-bold text-[#B8737D] shrink-0 ml-2">
                          {service.price}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B4D54] font-light leading-relaxed mb-4">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8D5D8] flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#9E8288] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration}
                      </span>
                      <Link
                        href={`/auth/login`}
                        className="text-xs uppercase tracking-widest font-semibold text-[#B8737D] hover:text-[#3D262B] flex items-center gap-1 group-hover:translate-x-1 transition-all"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
