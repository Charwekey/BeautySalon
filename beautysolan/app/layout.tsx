import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Beauty Technicians | Luxury Salon & Spa in Accra",
    template: "%s | Beauty Technicians",
  },
  description:
    "Accra's premier luxury beauty studio. Specialty hair styling, protective braiding, seamless wig installations, luxury nail art, and revitalizing facial care.",
  keywords: [
    "beauty salon",
    "hair styling",
    "braiding",
    "wig installation",
    "nails",
    "facial grooming",
    "Accra",
    "Ghana",
    "beauty technicians",
    "hair treatment",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${playfair.variable} ${greatVibes.variable} antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#FDF8F9] text-[#3D262B] selection:bg-[#EBD0D5] selection:text-[#3D262B]"
      >
        {children}
      </body>
    </html>
  );
}
