'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

type Category = 'All' | 'Hair' | 'Nails' | 'Grooming';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  img: string;
}

const services: Service[] = [
  {
    id: 's1',
    name: 'Signature Silk Press & Styling',
    category: 'Hair',
    description: 'Bespoke heat-styling technique leaving natural hair silky smooth and radiant without chemical damage.',
    duration: '120 mins',
    price: 'GHS 250',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  },
  {
    id: 's2',
    name: 'Painless Knotless Box Braids',
    category: 'Hair',
    description: 'Scalp-friendly, tension-free protective braids promoting long-term growth and effortless style.',
    duration: '240 mins',
    price: 'GHS 350',
    img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80',
  },
  {
    id: 's3',
    name: 'HD Frontal Lace Wig Install',
    category: 'Hair',
    description: 'Flawless customized frontal lace bleaching, plucking, and invisible melted hairline application.',
    duration: '180 mins',
    price: 'GHS 400',
    img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80',
  },
  {
    id: 's4',
    name: 'Deep Steam Hair Treatment',
    category: 'Hair',
    description: 'Intense moisture and protein steam infusion restoring healthy scalp vitality and high shine.',
    duration: '60 mins',
    price: 'GHS 150',
    img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80',
  },
  {
    id: 's5',
    name: 'Luxury Gel Art Manicure',
    category: 'Nails',
    description: 'Nail shaping, cuticle exfoliation, and custom gel nail art with long-lasting durability.',
    duration: '60 mins',
    price: 'GHS 120',
    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
  },
  {
    id: 's6',
    name: 'Sculpted Acrylic Extension Set',
    category: 'Nails',
    description: 'Full set acrylic extensions in your choice of length, shape, and hand-painted art designs.',
    duration: '120 mins',
    price: 'GHS 200',
    img: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=600&q=80',
  },
  {
    id: 's7',
    name: 'Crystal Radiance Facial',
    category: 'Grooming',
    description: 'Hydrating facial treatment featuring deep pore cleansing, botanical mask, and facial massage.',
    duration: '90 mins',
    price: 'GHS 250',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
  },
  {
    id: 's8',
    name: 'Precision Brow Sculpt & Tint',
    category: 'Grooming',
    description: 'Eyebrow wax, thread sculpting, and semi-permanent tinting for a bold, natural arch.',
    duration: '45 mins',
    price: 'GHS 80',
    img: 'https://images.unsplash.com/photo-1599733594230-6b823276abce?w=600&q=80',
  },
];

export default function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const categories: Category[] = ['All', 'Hair', 'Nails', 'Grooming'];

  const filteredServices = services.filter(
    (service) => activeCategory === 'All' || service.category === activeCategory
  );

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FDF7F8] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-script text-4xl text-[#B8737D]">Luxurious Offerings</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#3D262B] mt-1">Our Service Menu</h1>
          <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-3 font-medium">
            Handcrafted beauty & pampering treatments tailored for you in Accra.
          </p>
        </ScrollReveal>

        {/* Filter Buttons */}
        <ScrollReveal className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat
                  ? 'btn-rose-gold'
                  : 'bg-white text-[#3D262B] border border-[#E8D5D8] hover:bg-[#F8ECEE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </ScrollReveal>

        {/* Services Grid (Polaroid Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map((service, index) => (
            <ScrollReveal key={service.id} delay={`${(index % 4) * 100}ms`}>
              <div className="polaroid-frame h-full flex flex-col group">
                <div className="relative h-60 rounded overflow-hidden">
                  <Image
                    src={service.img}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-[#FDF7F8]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[#B8737D] border border-[#E4B8C0]">
                    {service.category}
                  </div>
                </div>
                
                <div className="pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#3D262B] group-hover:text-[#B8737D] transition-colors mb-2">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#6B4D54] font-light leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#E8D5D8] mb-4">
                      <span className="text-[11px] uppercase tracking-wider text-[#9E8288] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration}
                      </span>
                      <span className="font-display text-lg font-bold text-[#B8737D]">{service.price}</span>
                    </div>
                    
                    <Link
                      href={`/booking?service=${encodeURIComponent(service.name)}`}
                      className="btn-rose-gold block w-full text-center py-3 rounded-full text-xs"
                    >
                      Book Treatment
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-20 text-[#6B4D54] font-script text-3xl">
            No services found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
