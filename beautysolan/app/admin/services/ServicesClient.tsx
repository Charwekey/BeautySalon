'use client';

import { useState, useTransition } from 'react';
import { Plus, Edit2, Trash2, Search, Clock, Tag, Sparkles, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { createService, updateService, deleteService } from '@/actions/serviceActions';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl?: string | null;
  featured?: boolean;
};

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  // Form states
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const categories = ['All', 'Hair', 'Braids', 'Wigs', 'Nails', 'Skincare', 'Brows & Lashes'];

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = searchQuery === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createService({ success: false }, formData);
      if (res.success) {
        setIsAddModalOpen(false);
        window.location.reload();
      } else {
        setFormError(res.error || 'Failed to create service.');
      }
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService) return;
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateService(editingService.id, { success: false }, formData);
      if (res.success) {
        setEditingService(null);
        window.location.reload();
      } else {
        setFormError(res.error || 'Failed to update service.');
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingService) return;

    startTransition(async () => {
      const res = await deleteService(deletingService.id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
        setDeletingService(null);
      } else {
        alert(res.error || 'Failed to delete service.');
        setDeletingService(null);
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#3D262B]">Salon Treatment Menu</h1>
          <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-1">
            Add, update, or remove beauty services rendered at Beauty Technicians.
          </p>
        </div>
        <button
          onClick={() => {
            setFormError(null);
            setIsAddModalOpen(true);
          }}
          className="btn-rose-gold px-6 py-3 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8D5D8] shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9E8288] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search salon services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] outline-none focus:ring-2 focus:ring-[#B8737D] bg-[#FDF7F8]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#B8737D] text-white shadow-md'
                  : 'bg-[#F8ECEE] text-[#3D262B] hover:bg-[#ebd3d7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl border border-[#E8D5D8] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            {/* Image / Header */}
            <div className="relative h-48 w-full bg-[#FDF7F8]">
              {service.imageUrl ? (
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#9E8288] gap-1">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">No Image Uploaded</span>
                </div>
              )}

              {/* Action Overlay */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button
                  onClick={() => {
                    setFormError(null);
                    setEditingService(service);
                  }}
                  className="p-2.5 bg-white/90 backdrop-blur-md text-[#3D262B] rounded-full hover:bg-[#B8737D] hover:text-white transition-all shadow-md"
                  title="Edit Service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingService(service)}
                  className="p-2.5 bg-white/90 backdrop-blur-md text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-md"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#3D262B]/80 backdrop-blur-md text-white text-[10px] uppercase font-bold rounded-full border border-white/20">
                {service.category}
              </div>
            </div>

            {/* Service Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-display font-bold text-lg text-[#3D262B] leading-snug">
                    {service.name}
                  </h3>
                  <span className="font-display font-bold text-lg text-[#B8737D] shrink-0">
                    GHS {Number(service.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#6B4D54] font-light leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8D5D8] flex items-center justify-between">
                <span className="text-[11px] text-[#9E8288] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#B8737D]" /> {service.duration} mins duration
                </span>
                {service.featured && (
                  <span className="text-[10px] uppercase font-bold text-[#B8737D] bg-[#F8ECEE] px-2.5 py-0.5 rounded-full border border-[#E4B8C0]">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#E8D5D8]">
            <p className="text-sm text-[#6B4D54]">No salon services found matching your search or category filter.</p>
          </div>
        )}
      </div>

      {/* ─── ADD SERVICE MODAL ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8D5D8] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-display font-bold text-[#3D262B] mb-1">Add New Treatment</h2>
            <p className="text-xs text-[#6B4D54] mb-6">Fill out the details to offer a new service to clients.</p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Service Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Organic Detox Hair Steam"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Price (GHS) *</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    placeholder="e.g. 180"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Duration (mins) *</label>
                  <input
                    type="number"
                    name="duration"
                    required
                    placeholder="e.g. 60"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Category *</label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none bg-white"
                >
                  <option value="Hair">Hair</option>
                  <option value="Braids">Braids</option>
                  <option value="Wigs">Wigs</option>
                  <option value="Nails">Nails</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Brows & Lashes">Brows & Lashes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe the treatment benefits and technique..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8D5D8]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-outline-rose px-6 py-2.5 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-rose-gold px-8 py-2.5 rounded-full text-xs font-semibold disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT SERVICE MODAL ─── */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8D5D8] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-display font-bold text-[#3D262B] mb-1">Edit Treatment</h2>
            <p className="text-xs text-[#6B4D54] mb-6">Modify treatment pricing, description, or duration.</p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Service Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingService.name}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Price (GHS) *</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    defaultValue={editingService.price}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Duration (mins) *</label>
                  <input
                    type="number"
                    name="duration"
                    defaultValue={editingService.duration}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Category *</label>
                <select
                  name="category"
                  defaultValue={editingService.category}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none bg-white"
                >
                  <option value="Hair">Hair</option>
                  <option value="Braids">Braids</option>
                  <option value="Wigs">Wigs</option>
                  <option value="Nails">Nails</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Brows & Lashes">Brows & Lashes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={editingService.imageUrl || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D262B] mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingService.description}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5D8] text-xs text-[#3D262B] focus:ring-2 focus:ring-[#B8737D] outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8D5D8]">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="btn-outline-rose px-6 py-2.5 rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-rose-gold px-8 py-2.5 rounded-full text-xs font-semibold disabled:opacity-50"
                >
                  {isPending ? 'Updating...' : 'Update Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {deletingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8D5D8] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#3D262B]">Delete Treatment?</h2>
            <p className="text-xs text-[#6B4D54] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#3D262B]">{deletingService.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 pt-4 border-t border-[#E8D5D8]">
              <button
                type="button"
                onClick={() => setDeletingService(null)}
                className="btn-outline-rose px-6 py-2.5 rounded-full text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold shadow transition-all disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
