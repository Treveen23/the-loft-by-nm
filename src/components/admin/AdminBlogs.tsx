import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, X, Trash2, Edit2, Upload, Loader2, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { fetchBlogs, addBlog, updateBlog, deleteBlog, uploadImage } from '../../api';
import AdminSkeleton from './AdminSkeleton';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'Hair Care',
    image_url: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    read_time: '5 min read'
  });
  
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchBlogs();
      // If no data (or fallback because no Supabase), we still set it to empty array
      setBlogs(data || []);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImageFile(e.target.files[0]);
    }
  };

  const openNewForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      excerpt: '',
      category: 'Hair Care',
      image_url: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read_time: '5 min read'
    });
    setSelectedImageFile(null);
    setIsFormOpen(true);
  };

  const openEditForm = (blog: any) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      category: blog.category || 'Hair Care',
      image_url: blog.image_url || blog.image || '',
      date: blog.date || '',
      read_time: blog.read_time || blog.readTime || ''
    });
    setSelectedImageFile(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = formData.image_url;
      
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

      // Send only the exact columns defined in the Supabase schema
      const finalForm = { 
        title: formData.title,
        excerpt: formData.excerpt,
        category: formData.category,
        image_url: finalImageUrl,
        date: formData.date,
        read_time: formData.read_time
      };

      if (editingId) {
        await updateBlog(editingId, finalForm);
        toast.success('Journal entry updated!');
      } else {
        await addBlog(finalForm);
        toast.success('New journal entry published!');
      }

      setIsFormOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save entry. Make sure Supabase is connected.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await deleteBlog(id);
        toast.success('Entry removed');
        loadData();
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error('Failed to remove entry');
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
            <BookOpen size={12} className="text-gold" /> Editorial
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-charcoal tracking-tight mb-2 leading-tight">
            Journal <span className="text-gold italic font-normal">Entries</span>.
          </h2>
          <p className="text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed">
            Manage your blog posts, articles, and sanctuary notes.
          </p>
        </div>
        <button onClick={openNewForm} className="relative z-10 flex items-center gap-2 bg-gold hover:bg-white text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md">
          <Plus size={16} /> New Entry
        </button>
      </header>

      {isFormOpen ? (
        <div className="mb-10 bg-white border border-charcoal/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-serif text-2xl text-charcoal">{editingId ? 'Edit Journal Entry' : 'Write New Entry'}</h3>
            <button onClick={() => setIsFormOpen(false)} className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/50 hover:bg-charcoal/10 hover:text-charcoal transition-colors"><X size={16} /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner" placeholder="e.g. The Art of Parisian Balayage" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Excerpt / Summary</label>
              <textarea required rows={3} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner" placeholder="A short summary of the article..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all appearance-none shadow-inner">
                  <option value="Hair Care">Hair Care</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Nail Artistry">Nail Artistry</option>
                  <option value="Behind the Scenes">Behind the Scenes</option>
                  <option value="Wellness">Wellness</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Date</label>
                <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner" placeholder="e.g. Sep 12, 2026" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Read Time</label>
                <input required type="text" value={formData.read_time} onChange={e => setFormData({...formData, read_time: e.target.value})} className="w-full text-sm p-4 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner" placeholder="e.g. 5 min read" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-2">Cover Image</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-charcoal/5 border border-charcoal/10 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm text-charcoal/60 truncate pr-4">
                      {selectedImageFile ? selectedImageFile.name : formData.image_url ? 'Existing Image Attached' : 'No image selected'}
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
                  {formData.image_url && !selectedImageFile && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-charcoal/10">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-charcoal/30 uppercase tracking-widest">OR</span>
                  <input 
                    type="url" 
                    value={formData.image_url} 
                    onChange={e => {
                      setFormData({...formData, image_url: e.target.value});
                      setSelectedImageFile(null);
                    }} 
                    className="flex-1 text-sm p-3 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-xl focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all shadow-inner placeholder:text-charcoal/30" 
                    placeholder="Paste a direct external image URL here..." 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t border-charcoal/5">
              <button type="submit" disabled={isUploading} className="bg-gold text-black px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-70 flex items-center gap-2">
                {isUploading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editingId ? 'Update Entry' : 'Publish Entry'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {blogs.length === 0 ? (
            <div className="bg-white border border-charcoal/5 rounded-2xl p-12 text-center shadow-sm">
              <BookOpen className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
              <p className="text-charcoal/40 text-sm mb-4">No journal entries yet.</p>
              <button onClick={openNewForm} className="text-xs font-bold uppercase tracking-widest text-gold hover:text-charcoal transition-colors">
                Write your first entry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <div key={blog.id} className="group bg-white rounded-2xl overflow-hidden border border-charcoal/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={blog.image_url || blog.image} alt={blog.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase text-charcoal">
                      {blog.category}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-[10px] font-sans text-charcoal/50 uppercase tracking-wider mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>{blog.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{blog.read_time || blog.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-xl text-charcoal mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="font-sans text-sm text-charcoal/70 font-light line-clamp-3 mb-6">{blog.excerpt}</p>
                    
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-charcoal/5">
                      <button onClick={() => openEditForm(blog)} className="text-[10px] font-bold uppercase tracking-widest text-charcoal/50 hover:text-gold flex items-center gap-1.5 transition-colors">
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="text-[10px] font-bold uppercase tracking-widest text-charcoal/30 hover:text-red-500 flex items-center gap-1.5 transition-colors">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
