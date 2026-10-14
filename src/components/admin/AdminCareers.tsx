import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Eye,
  Check,
  Power,
  Sparkles,
  Database,
  FileText,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchAllCareerPositions,
  createCareerPosition,
  updateCareerPosition,
  deleteCareerPosition,
  fetchCareerApplications,
  updateCareerApplicationStatus,
  deleteCareerApplication
} from '../../api';
import { DEFAULT_CAREER_POSITIONS } from '../../data';
import AdminSkeleton from './AdminSkeleton';

export default function AdminCareers() {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'positions'>('applications');
  const [loading, setLoading] = useState(true);

  // Positions State
  const [positions, setPositions] = useState<any[]>([]);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState<string | null>(null);
  const [positionForm, setPositionForm] = useState({
    id: '',
    title: '',
    department: 'Nails',
    type: 'Full-Time / Part-Time',
    experience: '1+ Years Required',
    summary: '',
    description: '',
    responsibilitiesText: '',
    requirementsText: '',
    benefitsText: '',
    is_active: true
  });

  // Applications State
  const [applications, setApplications] = useState<any[]>([]);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [posData, appData] = await Promise.all([
        fetchAllCareerPositions(),
        fetchCareerApplications()
      ]);

      if (posData && posData.length > 0) {
        setPositions(posData);
      } else {
        // Fallback to default in-memory positions
        setPositions(DEFAULT_CAREER_POSITIONS.map(p => ({
          ...p,
          key_responsibilities: p.keyResponsibilities || [],
          requirements: p.requirements || [],
          benefits: p.benefits || [],
          is_active: p.isActive !== false
        })));
      }

      setApplications(appData || []);
    } catch (err) {
      console.error('Error loading careers data:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- POSITION ACTIONS ---
  const handleOpenNewPosition = () => {
    setEditingPositionId(null);
    setPositionForm({
      id: `pos-${Date.now()}`,
      title: '',
      department: 'Nails',
      type: 'Full-Time',
      experience: '1+ Years Required',
      summary: '',
      description: '',
      responsibilitiesText: '',
      requirementsText: '',
      benefitsText: '',
      is_active: true
    });
    setIsPositionModalOpen(true);
  };

  const handleOpenEditPosition = (pos: any) => {
    setEditingPositionId(pos.id);
    setPositionForm({
      id: pos.id,
      title: pos.title,
      department: pos.department,
      type: pos.type || 'Full-Time',
      experience: pos.experience || '',
      summary: pos.summary || '',
      description: pos.description || '',
      responsibilitiesText: Array.isArray(pos.key_responsibilities) ? pos.key_responsibilities.join('\n') : '',
      requirementsText: Array.isArray(pos.requirements) ? pos.requirements.join('\n') : '',
      benefitsText: Array.isArray(pos.benefits) ? pos.benefits.join('\n') : '',
      is_active: pos.is_active !== false
    });
    setIsPositionModalOpen(true);
  };

  const handleSavePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!positionForm.title.trim()) {
      toast.error('Position title is required');
      return;
    }

    const payload = {
      id: positionForm.id || `pos-${Date.now()}`,
      title: positionForm.title,
      department: positionForm.department,
      type: positionForm.type,
      experience: positionForm.experience,
      summary: positionForm.summary,
      description: positionForm.description,
      key_responsibilities: positionForm.responsibilitiesText
        ? positionForm.responsibilitiesText.split('\n').filter(s => s.trim())
        : [],
      requirements: positionForm.requirementsText
        ? positionForm.requirementsText.split('\n').filter(s => s.trim())
        : [],
      benefits: positionForm.benefitsText
        ? positionForm.benefitsText.split('\n').filter(s => s.trim())
        : [],
      is_active: positionForm.is_active
    };

    try {
      if (editingPositionId) {
        await updateCareerPosition(editingPositionId, payload);
        toast.success('Position updated successfully');
      } else {
        await createCareerPosition(payload);
        toast.success('New position published');
      }
      setIsPositionModalOpen(false);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save position');
    }
  };

  const handleTogglePositionStatus = async (pos: any) => {
    const updatedStatus = !pos.is_active;
    try {
      await updateCareerPosition(pos.id, { is_active: updatedStatus });
      toast.success(updatedStatus ? 'Position activated' : 'Position paused');
      setPositions(prev =>
        prev.map(p => (p.id === pos.id ? { ...p, is_active: updatedStatus } : p))
      );
    } catch (err: any) {
      toast.error('Could not update status: ' + err.message);
    }
  };

  const handleDeletePosition = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${title}" position?`)) return;
    try {
      await deleteCareerPosition(id);
      toast.success('Position deleted');
      setPositions(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      toast.error('Could not delete position: ' + err.message);
    }
  };

  // Seed default positions into Supabase if table is empty
  const handleSeedDefaults = async () => {
    try {
      toast.info('Seeding default positions into Supabase...');
      for (const pos of DEFAULT_CAREER_POSITIONS) {
        await createCareerPosition({
          id: pos.id,
          title: pos.title,
          department: pos.department,
          type: pos.type,
          experience: pos.experience,
          summary: pos.summary,
          description: pos.description,
          key_responsibilities: pos.keyResponsibilities || [],
          requirements: pos.requirements || [],
          benefits: pos.benefits || [],
          is_active: true
        });
      }
      toast.success('Default positions inserted successfully!');
      loadAllData();
    } catch (err: any) {
      toast.error('Failed to seed: ' + err.message);
    }
  };

  // --- APPLICATION ACTIONS ---
  const handleUpdateAppStatus = async (id: string, status: string) => {
    try {
      await updateCareerApplicationStatus(id, status);
      toast.success(`Application marked as ${status}`);
      setApplications(prev =>
        prev.map(app => (app.id === id ? { ...app, status } : app))
      );
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp((prev: any) => ({ ...prev, status }));
      }
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this application?')) return;
    try {
      await deleteCareerApplication(id);
      toast.success('Application deleted');
      setApplications(prev => prev.filter(app => app.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (err: any) {
      toast.error('Failed to delete application');
    }
  };

  const handleOpenWhatsAppChat = (app: any) => {
    const cleanPhone = app.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${app.full_name}, thank you for applying for the ${app.position_title} role at The Loft by NM. We reviewed your credentials and would love to connect.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Filtering Applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      (app.full_name || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.phone || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.position_title || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reviewed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'interviewed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="animate-fadeIn">
      {/* Header Banner */}
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 p-8 sm:p-10 rounded-[2rem] shadow-sm mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-4">
              <Briefcase size={12} className="text-gold" /> Atelier Talent Acquisition
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal tracking-tight mb-2 leading-tight">
              Careers &amp; <span className="text-gold italic font-normal">Applications</span>.
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed">
              Review candidate portfolios, connect directly on WhatsApp, and manage active salon vacancies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNewPosition}
              className="px-5 py-3 bg-charcoal hover:bg-gold hover:text-charcoal text-ivory text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>Post New Vacancy</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs (Applications vs Positions) */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-charcoal/10">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'applications'
                ? 'bg-charcoal text-ivory shadow-sm'
                : 'text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5'
            }`}
          >
            <Users size={14} />
            <span>Applications</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gold/20 text-gold font-bold">
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('positions')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'positions'
                ? 'bg-charcoal text-ivory shadow-sm'
                : 'text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5'
            }`}
          >
            <Briefcase size={14} />
            <span>Open Vacancies</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-charcoal/10 text-charcoal font-bold">
              {positions.length}
            </span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. APPLICATIONS SUB-TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-charcoal/10 shadow-sm">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search by candidate name, phone, position..."
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
              />
            </div>
            <div className="relative min-w-[180px]">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <select
                value={appStatusFilter}
                onChange={e => setAppStatusFilter(e.target.value)}
                className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-charcoal/10 text-charcoal/60">
              <Users size={32} className="mx-auto mb-3 text-charcoal/30" />
              <p className="text-sm font-medium">No candidate applications found.</p>
              <p className="text-xs text-charcoal/40 mt-1">
                Submissions from the public "Join Us" page will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-charcoal/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-charcoal/5 text-charcoal/60 uppercase tracking-widest text-[10px] font-bold border-b border-charcoal/10">
                      <th className="py-4 px-6">Candidate</th>
                      <th className="py-4 px-6">Position</th>
                      <th className="py-4 px-6">Experience</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal/5">
                    {filteredApplications.map(app => (
                      <tr key={app.id} className="hover:bg-charcoal/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-charcoal">{app.full_name}</div>
                          <div className="text-xs text-charcoal/60 flex items-center gap-2 mt-0.5">
                            <span>{app.phone}</span>
                            {app.email && (
                              <>
                                <span>•</span>
                                <span>{app.email}</span>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-medium text-charcoal">{app.position_title}</span>
                          {app.portfolio_url && (
                            <div className="text-xs text-gold flex items-center gap-1 mt-0.5">
                              <ExternalLink size={10} />
                              <span className="truncate max-w-[150px]">{app.portfolio_url}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <div className="text-xs text-charcoal/80 font-medium">
                            {app.experience_years || 'Not specified'}
                          </div>
                          {app.previous_salon && (
                            <div className="text-[11px] text-charcoal/50 truncate max-w-[140px]">
                              {app.previous_salon}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-6 text-xs text-charcoal/60 whitespace-nowrap">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap">
                          <select
                            value={app.status || 'pending'}
                            onChange={e => handleUpdateAppStatus(app.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border outline-none cursor-pointer ${getStatusBadge(
                              app.status || 'pending'
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {app.cv_url && (
                              <a
                                href={app.cv_url}
                                target="_blank"
                                rel="noreferrer"
                                title="Download / View Candidate CV"
                                className="p-2 rounded-lg bg-gold/15 text-gold hover:bg-gold hover:text-charcoal transition-colors cursor-pointer"
                              >
                                <FileText size={15} />
                              </a>
                            )}

                            <button
                              onClick={() => handleOpenWhatsAppChat(app)}
                              title="Chat on WhatsApp"
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              <MessageCircle size={15} />
                            </button>

                            <button
                              onClick={() => setSelectedApp(app)}
                              title="View Application Details"
                              className="p-2 rounded-lg bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              title="Delete"
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OPEN POSITIONS SUB-TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'positions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-charcoal/70">
              Active positions appear live on the public <strong>Join Us</strong> page.
            </p>

            {positions.length === 0 && (
              <button
                onClick={handleSeedDefaults}
                className="px-4 py-2 bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Database size={13} />
                <span>Seed Default 4 Positions</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {positions.map(pos => {
              const isActive = pos.is_active !== false;

              return (
                <div
                  key={pos.id}
                  className={`bg-white rounded-2xl border p-6 shadow-sm transition-all duration-300 flex flex-col justify-between ${
                    isActive ? 'border-charcoal/10 hover:border-gold/50' : 'border-charcoal/10 opacity-70 bg-gray-50'
                  }`}
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                            {pos.department}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-charcoal/5 text-charcoal/70">
                            {pos.type}
                          </span>
                        </div>
                        <h3 className="text-xl font-serif text-charcoal font-medium">
                          {pos.title}
                        </h3>
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => handleTogglePositionStatus(pos)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-charcoal/5 text-charcoal/50 border border-charcoal/10'
                        }`}
                        title="Click to toggle live status"
                      >
                        <Power size={12} />
                        <span>{isActive ? 'Live' : 'Paused'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-charcoal/70 leading-relaxed mb-4 line-clamp-3">
                      {pos.summary}
                    </p>

                    <div className="text-xs text-charcoal/60 mb-2">
                      <strong className="text-charcoal">Experience:</strong> {pos.experience}
                    </div>
                  </div>

                  {/* Footer Action buttons */}
                  <div className="mt-6 pt-4 border-t border-charcoal/5 flex items-center justify-between">
                    <span className="text-[11px] text-charcoal/40 font-mono">ID: {pos.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditPosition(pos)}
                        className="p-2 rounded-lg bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors cursor-pointer"
                        title="Edit Position"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePosition(pos.id, pos.title)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Position"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. APPLICATION DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-charcoal/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 text-gold border border-gold/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
              Application Dossier
            </div>

            <h3 className="text-2xl font-serif text-charcoal mb-1">{selectedApp.full_name}</h3>
            <p className="text-xs text-charcoal/60 mb-6">
              Applied for <strong className="text-gold font-semibold">{selectedApp.position_title}</strong>
            </p>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-charcoal/[0.02] border border-charcoal/5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-0.5">Phone</div>
                  <div className="font-semibold text-charcoal">{selectedApp.phone}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-0.5">Email</div>
                  <div className="font-semibold text-charcoal">{selectedApp.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-0.5">Experience</div>
                  <div className="font-semibold text-charcoal">{selectedApp.experience_years || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-0.5">Previous Studio</div>
                  <div className="font-semibold text-charcoal">{selectedApp.previous_salon || 'N/A'}</div>
                </div>
              </div>

              {selectedApp.portfolio_url && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-1">Portfolio / Instagram</div>
                  <a
                    href={selectedApp.portfolio_url.startsWith('http') ? selectedApp.portfolio_url : `https://${selectedApp.portfolio_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-gold hover:underline font-medium"
                  >
                    <span>{selectedApp.portfolio_url}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {selectedApp.cover_note && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-1">Cover Note &amp; Motivation</div>
                  <div className="p-4 rounded-xl bg-ivory/60 border border-charcoal/10 text-charcoal/80 leading-relaxed font-light whitespace-pre-line">
                    {selectedApp.cover_note}
                  </div>
                </div>
              )}

              {/* CV Attachment Banner */}
              {selectedApp.cv_url && (
                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold text-charcoal flex items-center justify-center font-bold shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-charcoal">Attached Curriculum Vitae (CV)</div>
                      <div className="text-[11px] text-charcoal/60">Candidate document uploaded to secure storage</div>
                    </div>
                  </div>
                  <a
                    href={selectedApp.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-charcoal hover:bg-gold hover:text-charcoal text-ivory rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Download size={14} />
                    <span>View CV</span>
                  </a>
                </div>
              )}

              {/* Status Update Bar */}
              <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-charcoal/60 mr-2 font-medium">Status:</span>
                  <select
                    value={selectedApp.status || 'pending'}
                    onChange={e => handleUpdateAppStatus(selectedApp.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border outline-none cursor-pointer ${getStatusBadge(
                      selectedApp.status || 'pending'
                    )}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="contacted">Contacted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <button
                  onClick={() => handleOpenWhatsAppChat(selectedApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. POSITION CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      {isPositionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-charcoal/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPositionModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-2xl font-serif text-charcoal mb-1">
              {editingPositionId ? 'Edit Vacancy' : 'Create New Position'}
            </h3>
            <p className="text-xs text-charcoal/60 mb-6">
              Configure job title, department, responsibilities and candidate perks.
            </p>

            <form onSubmit={handleSavePosition} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Nail Artist"
                    value={positionForm.title}
                    onChange={e => setPositionForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                    Department *
                  </label>
                  <select
                    value={positionForm.department}
                    onChange={e => setPositionForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50 cursor-pointer"
                  >
                    <option value="Nails">Nails</option>
                    <option value="Hair">Hair</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Front of House">Front of House</option>
                    <option value="Bridal">Bridal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Time / Part-Time"
                    value={positionForm.type}
                    onChange={e => setPositionForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                    Experience Required
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2+ Years Required"
                    value={positionForm.experience}
                    onChange={e => setPositionForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                  Summary (Brief card excerpt)
                </label>
                <textarea
                  rows={2}
                  placeholder="Short, punchy summary of the role..."
                  value={positionForm.summary}
                  onChange={e => setPositionForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                  Full Role Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of the role in the sanctuary..."
                  value={positionForm.description}
                  onChange={e => setPositionForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                  Key Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Perform manicure services...&#10;Consult with clients...&#10;Sterilize equipment..."
                  value={positionForm.responsibilitiesText}
                  onChange={e => setPositionForm(prev => ({ ...prev, responsibilitiesText: e.target.value }))}
                  className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                  Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Recognized qualification...&#10;High hygiene standards...&#10;Professional portfolio..."
                  value={positionForm.requirementsText}
                  onChange={e => setPositionForm(prev => ({ ...prev, requirementsText: e.target.value }))}
                  className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                  Benefits &amp; Perks (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Competitive salary + commissions...&#10;Continuous masterclasses...&#10;Staff wellness discounts..."
                  value={positionForm.benefitsText}
                  onChange={e => setPositionForm(prev => ({ ...prev, benefitsText: e.target.value }))}
                  className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pos-is-active"
                  checked={positionForm.is_active}
                  onChange={e => setPositionForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded text-gold focus:ring-gold cursor-pointer"
                />
                <label htmlFor="pos-is-active" className="text-xs font-semibold text-charcoal cursor-pointer">
                  Publish vacancy immediately (visible on Join Us page)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPositionModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-charcoal/10 text-xs font-semibold uppercase text-charcoal/60 hover:text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-charcoal text-ivory hover:bg-gold hover:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  {editingPositionId ? 'Save Changes' : 'Create Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
