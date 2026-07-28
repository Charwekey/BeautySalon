'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

type Category = 'All' | 'Hairstyles' | 'Braiding' | 'Nails' | 'Salon';

interface GalleryImage {
  id: string;
  src: string;
  category: string;
  title: string;
  tilt: string;
}

const galleryImages: GalleryImage[] = [
  { id: '1', src: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80', category: 'Salon', title: 'Accra Studio Interior', tilt: 'rotate-[-3deg]' },
  { id: '2', src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80', category: 'Braiding', title: 'Painless Knotless Braids', tilt: 'rotate-[4deg]' },
  { id: '3', src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', category: 'Hairstyles', title: 'Luxury Hair Transformation', tilt: 'rotate-[-2deg]' },
  { id: '4', src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80', category: 'Nails', title: 'Hand-Painted Gel Art', tilt: 'rotate-[3deg]' },
  { id: '5', src: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80', category: 'Hairstyles', title: 'Invisible Frontal Lace Melt', tilt: 'rotate-[-4deg]' },
  { id: '6', src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=800&q=80', category: 'Nails', title: 'Acrylic Extension Set', tilt: 'rotate-[2deg]' },
  { id: '7', src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', category: 'Salon', title: 'Spa Facial Treatment', tilt: 'rotate-[-3deg]' },
  { id: '8', src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', category: 'Hairstyles', title: 'Silk Press & Blowout', tilt: 'rotate-[3deg]' },
];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const categories: Category[] = ['All', 'Hairstyles', 'Braiding', 'Nails', 'Salon'];

  const filteredImages = galleryImages.filter(
    (img) => activeCategory === 'All' || img.category === activeCategory
  );

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FDF7F8] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-script text-4xl text-[#B8737D]">Visual Lookbook</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#3D262B] mt-1">Our Style Portfolio</h1>
          <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-3 font-medium">
            Explore recent hair transformations, protective braiding, nail art, and salon vibes.
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

        {/* Polaroid Grid (Chic tilted polaroid photo frames) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredImages.map((img, index) => (
            <ScrollReveal key={img.id} delay={`${(index % 4) * 100}ms`}>
              <div 
                className={`polaroid-frame cursor-pointer group transition-transform ${img.tilt}`}
                onClick={() => setSelectedImage(img)}
              >
                <div className="relative h-72 rounded overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#3D262B]/0 group-hover:bg-[#3D262B]/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-[#FDF7F8]/90 backdrop-blur-md p-3 rounded-full text-[#B8737D] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="pt-3 text-center">
                  <div className="font-script text-2xl text-[#B8737D] leading-tight">
                    {img.title}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#9E8288]">
                    {img.category}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-[#6B4D54] font-script text-3xl">
            No images found in this category.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D262B]/90 backdrop-blur-md animate-fade-in">
          <button 
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full max-w-4xl polaroid-frame bg-white p-4 sm:p-6 animate-scale-in">
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded overflow-hidden">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="pt-4 text-center">
              <h3 className="font-script text-3xl text-[#B8737D]">{selectedImage.title}</h3>
              <span className="text-xs uppercase tracking-widest text-[#6B4D54]">{selectedImage.category} • Beauty Technicians Accra</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
