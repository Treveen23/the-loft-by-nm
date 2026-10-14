import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, Plus, X, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchGallery, addGalleryImage, deleteGalleryImage, uploadImage } from '../../api';
import AdminSkeleton from './AdminSkeleton';

export default function AdminGallery() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [isGalleryFormOpen, setIsGalleryFormOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    image_url: '', category: 'all', description: '', subtext: ''
  });
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setGallery(await fetchGallery());
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImageFile(e.target.files[0]);
    }
  };

  const handleSaveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = galleryForm.image_url;
      
      if (selectedImageFile) {
        toast.info("Uploading image...");
        const uploadedUrl = await uploadImage(selectedImageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      if (!finalImageUrl) {
        toast.error("Please provide an image");
        setIsUploading(false);
        return;
      }

      const finalForm = { ...galleryForm, image_url: finalImageUrl };

      await addGalleryImage(finalForm);
      setIsGalleryFormOpen(false);
      setGalleryForm({ image_url: '', category: 'all', description: '', subtext: '' });
      setSelectedImageFile(null);
      toast.success('Image published to gallery!');
      loadData();
    } catch (error) {
      console.error("Error saving gallery image:", error);
      toast.error("Failed to save image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteGalleryImage(id);
        toast.success('Image removed');
        loadData();
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error('Failed to remove image');
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
            <ImageIcon size={12} className="text-gold" /> Curation
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-charcoal tracking-tight mb-2 leading-tight">
            Gallery <span className="text-gold italic font-normal">Visuals</span>.
          </h2>
          <p className="text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed">
            Curate the visual experience and portfolio for your guests.
          </p>
        </div>
        <button onClick={() => setIsGalleryFormOpen(true)} className="relative z-10 flex items-center gap-2 bg-gold hover:bg-white text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md">
          <Plus size={16} /> Add Image
        </button>
      </header>

      {isGalleryFormOpen ? (
        <div className="mb-10 bg-white border border-charcoal/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-serif text-2xl text-charcoal">Add Visual Asset</h3>
            <button onClick={() => { setIsGalleryFormOpen(false); setSelectedImageFile(null); }} className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/50 hover:bg-charcoal/10 hover:text-charcoal transition-colors"><X size={16} /></button>
          </div>
          
          <form onSubmit={handleSaveGalleryImage} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Visual Asset</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-charcoal/5 border border-charcoal/10 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm text-charcoal/60 truncate pr-4">
                      {selectedImageFile ? selectedImageFile.name : galleryForm.image_url ? 'Existing Image Attached' : 'No image selected'}
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
                  {galleryForm.image_url && !selectedImageFile && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-charcoal/10">
                      <img src={galleryForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-charcoal/30 uppercase tracking-widest">OR</span>
                  <input 
                    type="url" 
                    value={galleryForm.image_url} 
                    onChange={e => {
                      setGalleryForm({...galleryForm, image_url: e.target.value});
                      setSelectedImageFile(null);
                    }} 
                    className="flex-1 text-sm p-3 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner placeholder:text-charcoal/30" 
                    placeholder="Paste a direct external image URL here..." 
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Category Filter</label>
                <select value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all appearance-none shadow-inner">
                  <option value="suite">Suite & Space</option>
                  <option value="nails">Nails</option>
                  <option value="body">Body</option>
                  <option value="face">Face</option>
                  <option value="hair">Hair</option>
                  <option value="lashes">Lashes</option>
                  <option value="all">Other / Uncategorized</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Caption / Title</label>
                <input type="text" value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner" placeholder="e.g. Minimalist Gel Manicure" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Sub Description / Subtext (Optional)</label>
              <input type="text" value={galleryForm.subtext} onChange={e => setGalleryForm({...galleryForm, subtext: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner" placeholder="e.g. Bespoke entry crafted for complete discretion..." />
            </div>
            
            <div className="flex justify-end pt-6 border-t border-charcoal/5">
              <button type="submit" disabled={isUploading} className="bg-gold text-black px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-70 flex items-center gap-2">
                {isUploading ? <><Loader2 size={16} className="animate-spin" /> Publishing...</> : 'Publish Image'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {gallery.length === 0 ? (
            <div className="bg-white border border-charcoal/5 rounded-2xl p-12 text-center">
              <ImageIcon className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
              <p className="text-charcoal/40 text-sm">No images in the gallery yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {gallery.map(img => (
                <div key={img.id} className="group relative rounded-2xl overflow-hidden border border-charcoal/10 bg-white aspect-[4/5] hover:border-gold/40 transition-all">
                  <img src={img.image_url} alt={img.description} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                  
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <span className="text-[9px] uppercase tracking-widest bg-gold text-black font-bold px-2 py-1 rounded-md mb-2 inline-block">
                      {img.category}
                    </span>
                    <p className="text-charcoal text-sm font-bold line-clamp-1">{img.description}</p>
                    {img.subtext && <p className="text-charcoal/70 text-xs font-medium line-clamp-1 mt-1">{img.subtext}</p>}
                  </div>
                  
                  <button onClick={() => handleDeleteGalleryImage(img.id)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-charcoal/10 flex items-center justify-center text-charcoal/70 hover:bg-red-500 hover:text-charcoal hover:border-red-500 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
