import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Plus, X, Edit, Trash2, Check, Upload, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchServices, createService, updateService, deleteService, uploadImage } from '../../api';
import AdminSkeleton from './AdminSkeleton';

export default function AdminMenu() {
  const [services, setServices] = useState<any[]>([]);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '', price: '', subtext: '', is_popular: false, category_id: 'nails', image: ''
  });
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setServices(await fetchServices());
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (service: any) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      price: service.price,
      subtext: service.subtext || '',
      is_popular: service.is_popular || false,
      category_id: service.category_id,
      image: service.image || ''
    });
    setIsServiceFormOpen(true);
  };

  const handleCreateNewClick = () => {
    setEditingServiceId(null);
    setSelectedImageFile(null);
    setServiceForm({
      name: '', price: '', subtext: '', is_popular: false, category_id: 'nails', image: ''
    });
    setIsServiceFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImageFile(e.target.files[0]);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = serviceForm.image;
      
      if (selectedImageFile) {
        toast.info("Uploading image...");
        const uploadedUrl = await uploadImage(selectedImageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const finalForm = { ...serviceForm, image: finalImageUrl };

      if (editingServiceId) {
        await updateService(editingServiceId, finalForm);
      } else {
        await createService(finalForm);
      }
      setIsServiceFormOpen(false);
      setSelectedImageFile(null);
      toast.success('Service saved successfully!');
      loadData();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down', displayList: any[]) => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= displayList.length) return;

    const currentItem = displayList[index];
    const swapItem = displayList[swapIndex];

    try {
      await Promise.all([
        updateService(currentItem.id, { created_at: swapItem.created_at }),
        updateService(swapItem.id, { created_at: currentItem.created_at })
      ]);
      loadData();
    } catch (error) {
      toast.error("Failed to reorder services");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
        toast.success("Service deleted");
        loadData();
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete service");
      }
    }
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="animate-fadeIn">
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 p-8 sm:p-10 rounded-[2rem] shadow-sm mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-4">
            <Sparkles size={12} className="text-gold" /> Catalog
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-charcoal tracking-tight mb-2 leading-tight">
            Menu <span className="text-gold italic font-normal">Services</span>.
          </h2>
          <p className="text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed">
            Manage your treatment offerings, categories, and pricing.
          </p>
        </div>
        <button onClick={handleCreateNewClick} className="relative z-10 flex items-center gap-2 bg-gold hover:bg-white text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md">
          <Plus size={16} /> Add Therapy
        </button>
      </header>

      {isServiceFormOpen ? (
        <div className="mb-10 bg-white border border-charcoal/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-serif text-2xl text-charcoal">{editingServiceId ? 'Edit Therapy Offering' : 'New Therapy Offering'}</h3>
            <button onClick={() => setIsServiceFormOpen(false)} className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/50 hover:bg-charcoal/10 hover:text-charcoal transition-colors"><X size={16} /></button>
          </div>
          
          <form onSubmit={handleSaveService} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Service Name</label>
                <input type="text" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Price (LKR)</label>
                <input type="text" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner" required placeholder="e.g. 4,500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Subtext Description (Optional)</label>
                <input type="text" value={serviceForm.subtext} onChange={e => setServiceForm({...serviceForm, subtext: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/50 mb-2">Service Image</label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-charcoal/5 border border-charcoal/10 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-sm text-charcoal/60 truncate pr-4">
                        {selectedImageFile ? selectedImageFile.name : serviceForm.image ? 'Existing Image Attached' : 'No image selected'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] bg-white border border-charcoal/10 text-charcoal px-4 py-2 rounded-lg font-bold uppercase tracking-widest hover:bg-charcoal/5 transition-colors flex items-center gap-2 shrink-0"
                      >
                        <Upload size={14} /> Upload File
                      </button>
                    </div>
                    {serviceForm.image && !selectedImageFile && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-charcoal/10">
                        <img src={serviceForm.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-charcoal/30 uppercase tracking-widest">OR</span>
                    <input 
                      type="text" 
                      value={serviceForm.image} 
                      onChange={e => {
                        setServiceForm({...serviceForm, image: e.target.value});
                        setSelectedImageFile(null); // Clear file if URL is typed
                      }} 
                      className="flex-1 text-sm p-3 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all placeholder:text-charcoal/30" 
                      placeholder="Paste an external image URL here..." 
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/50 mb-2">Category</label>
                <select value={serviceForm.category_id} onChange={e => setServiceForm({...serviceForm, category_id: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all appearance-none">
                  <option value="nails">Nails</option>
                  <option value="body">Body</option>
                  <option value="face">Face</option>
                  <option value="hair">Hair</option>
                  <option value="lashes">Lashes</option>
                  <option value="massage">Massage</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer group mt-6">
                  <div className="relative flex items-center justify-center w-6 h-6 rounded-md bg-charcoal/5 border border-white/20 group-hover:border-gold transition-colors">
                    <input type="checkbox" checked={serviceForm.is_popular} onChange={e => setServiceForm({...serviceForm, is_popular: e.target.checked})} className="absolute opacity-0 w-full h-full cursor-pointer" />
                    {serviceForm.is_popular && <Check size={14} className="text-gold" />}
                  </div>
                  <span className="text-sm font-medium text-charcoal/80 group-hover:text-charcoal">Mark as Popular Signature Service</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t border-charcoal/5">
              <button type="submit" disabled={isUploading} className="bg-gold text-black px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-70 flex items-center gap-2">
                {isUploading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {services.length === 0 ? (
            <div className="bg-white border border-charcoal/5 rounded-2xl p-12 text-center">
              <Sparkles className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
              <p className="text-charcoal/40 text-sm">No services configured yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-charcoal/5">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="flex-1 bg-transparent border border-charcoal/10 rounded-xl px-4 py-2 text-charcoal focus:outline-none focus:border-gold/50 transition-colors"
                />
                <select
                  value={serviceCategoryFilter}
                  onChange={(e) => setServiceCategoryFilter(e.target.value)}
                  className="bg-transparent border border-charcoal/10 rounded-xl px-4 py-2 text-charcoal focus:outline-none focus:border-gold/50 transition-colors"
                >
                  <option value="all">All Categories</option>
                  <option value="nails">Nails</option>
                  <option value="body">Body</option>
                  <option value="lashes">Lashes & Brows</option>
                  <option value="face">Face</option>
                  <option value="hair">Hair</option>
                </select>
              </div>

              {/* List View */}
              <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-charcoal/70">
                    <thead className="bg-charcoal/5 text-charcoal/40 uppercase tracking-widest text-[10px]">
                      <tr>
                        <th className="px-6 py-4 font-medium">Service Name</th>
                        <th className="px-6 py-4 font-medium">Category</th>
                        <th className="px-6 py-4 font-medium">Price</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {(() => {
                        const filteredServices = services.filter((s) => {
                          const matchesSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase());
                          const matchesCategory = serviceCategoryFilter === 'all' || s.category_id === serviceCategoryFilter;
                          return matchesSearch && matchesCategory;
                        });

                        return filteredServices.map((s, idx) => (
                          <tr key={s.id} className="hover:bg-charcoal/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-serif text-base text-charcoal">{s.name}</span>
                                {s.is_popular && (
                                  <span className="bg-gold/10 text-gold border border-gold/20 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                                    Signature
                                  </span>
                                )}
                              </div>
                              {s.subtext && <p className="text-xs text-charcoal/40 mt-1 truncate max-w-xs">{s.subtext}</p>}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] uppercase tracking-widest bg-charcoal/5 border border-charcoal/5 px-2 py-1 rounded-md text-charcoal/60">
                                {s.category_id}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-gold whitespace-nowrap">Rs. {s.price}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 justify-end items-center">
                                <div className="flex flex-col mr-2">
                                  <button onClick={() => handleMoveOrder(idx, 'up', filteredServices)} disabled={idx === 0} className="text-charcoal/30 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ArrowUp size={14} />
                                  </button>
                                  <button onClick={() => handleMoveOrder(idx, 'down', filteredServices)} disabled={idx === filteredServices.length - 1} className="text-charcoal/30 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <ArrowDown size={14} />
                                  </button>
                                </div>
                                <button onClick={() => handleEditClick(s)} className="w-8 h-8 rounded-lg bg-charcoal/5 flex items-center justify-center text-charcoal/50 hover:bg-gold/20 hover:text-gold transition-colors" title="Edit">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => handleDeleteService(s.id)} className="w-8 h-8 rounded-lg bg-charcoal/5 flex items-center justify-center text-charcoal/50 hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
