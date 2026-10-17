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
  Power,
  Sparkles,
  Database,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  UserCheck
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
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState<string | null>(null);
  const [showAdvancedPositionFields, setShowAdvancedPositionFields] = useState(false);
  const [positionForm, setPositionForm] = useState({
    id: '',
    title: '',
    department: 'Nails',
    type: 'Full-Time',
    experience: 'Experience Preferred',
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
          summary: p.summary || '',
          description: p.description || p.summary || '',
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
    setShowAdvancedPositionFields(false);
    setPositionForm({
      id: `pos-${Date.now()}`,
      title: '',
      department: 'Nails',
      type: 'Full-Time',
      experience: 'Experience Preferred',
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
    setShowAdvancedPositionFields(Boolean(pos.experience && pos.experience !== 'Experience Preferred'));
    setPositionForm({
      id: pos.id,
      title: pos.title,
      department: pos.department || 'Nails',
      type: pos.type || 'Full-Time',
      experience: pos.experience || 'Experience Preferred',
      summary: pos.summary || '',
      description: pos.description || pos.summary || '',
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

    if (!positionForm.summary.trim()) {
      toast.error('Role summary / description is required');
      return;
    }

    const payload = {
      id: positionForm.id || `pos-${Date.now()}`,
      title: positionForm.title.trim(),
      department: positionForm.department,
      type: positionForm.type || 'Full-Time',
      experience: positionForm.experience || 'Experience Preferred',
      summary: positionForm.summary.trim(),
      description: positionForm.description.trim() || positionForm.summary.trim(),
      key_responsibilities: positionForm.responsibilitiesText
        ? positionForm.responsibilitiesText.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      requirements: positionForm.requirementsText
        ? positionForm.requirementsText.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      benefits: positionForm.benefitsText
        ? positionForm.benefitsText.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      is_active: positionForm.is_active
    };

    try {
      if (editingPositionId) {
        await updateCareerPosition(editingPositionId, payload);
        toast.success('Position updated successfully');
      } else {
        await createCareerPosition(payload);
        toast.success('New vacancy published live to Join Us page');
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
      toast.success(updatedStatus ? 'Vacancy is now Live on Join Us' : 'Vacancy paused');
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
      toast.info('Seeding default positions into database...');
      for (const pos of DEFAULT_CAREER_POSITIONS) {
        await createCareerPosition({
          id: pos.id,
          title: pos.title,
          department: pos.department,
          type: pos.type || 'Full-Time',
          experience: pos.experience || 'Experience Preferred',
          summary: pos.summary,
          description: pos.summary,
          key_responsibilities: [],
          requirements: [],
          benefits: [],
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
    let cleanPhone = (app.phone || '').replace(/[^\d+]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '94' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1);
    }
    const message = encodeURIComponent(
      `Hello ${app.full_name}, thank you for your application for the ${app.position_title} role at The Loft by NM. We reviewed your profile and would love to connect with you.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Departments list matching public website
  const departments = ['All', 'Nails', 'Hair', 'Skincare', 'Wellness', 'General'];

  // Filtered positions based on department tab
  const filteredPositions =
    selectedDeptFilter === 'All'
      ? positions
      : positions.filter(pos => pos.department === selectedDeptFilter);

  // Filtering Applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      (app.full_name || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.phone || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.position_title || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.gender || '').toLowerCase().includes(appSearch.toLowerCase());
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
              Review candidate submissions (with age, gender, and CV attachments) and manage open positions matching the current website design.
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
            <span>Open Positions</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-charcoal/10 text-charcoal font-bold">
              {positions.length}
            </span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. CANDIDATE APPLICATIONS SUB-TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          {/* Controls / Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-charcoal/10 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" size={16} />
              <input
                type="text"
                placeholder="Search candidates by name, position, phone, or gender..."
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-charcoal/5 border border-charcoal/10 rounded-xl text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={15} className="text-charcoal/40 hidden sm:block" />
              <select
                value={appStatusFilter}
                onChange={e => setAppStatusFilter(e.target.value)}
                className="bg-charcoal/5 border border-charcoal/10 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-gold/50 cursor-pointer"
              >
                <option value="all">All Statuses ({applications.length})</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-charcoal/10 p-12 text-center text-charcoal/60">
              <Users size={36} className="mx-auto mb-3 text-charcoal/30" />
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
                      <th className="py-4 px-6">Applied Role</th>
                      <th className="py-4 px-6">Age &amp; Gender</th>
                      <th className="py-4 px-6">CV Document</th>
                      <th className="py-4 px-6">Applied Date</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal/5">
                    {filteredApplications.map(app => (
                      <tr key={app.id} className="hover:bg-charcoal/[0.02] transition-colors">
                        {/* Candidate Name & Contact */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-charcoal text-sm">{app.full_name}</div>
                          <div className="text-xs text-charcoal/60 flex items-center gap-2 mt-0.5">
                            <span className="font-mono">{app.phone}</span>
                            {app.email && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[150px]">{app.email}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Applied Role */}
                        <td className="py-4 px-6">
                          <span className="font-medium text-charcoal block">{app.position_title}</span>
                          <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                            Vacancy ID: {app.position_id}
                          </span>
                        </td>

                        {/* Age & Gender */}
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {app.age ? (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-charcoal/5 text-charcoal">
                                {app.age} yrs
                              </span>
                            ) : null}
                            {app.gender ? (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gold/15 text-gold border border-gold/30">
                                {app.gender}
                              </span>
                            ) : null}
                            {!app.age && !app.gender && (
                              <span className="text-xs text-charcoal/40 italic">Not specified</span>
                            )}
                          </div>
                        </td>

                        {/* CV Document */}
                        <td className="py-4 px-6">
                          {app.cv_url ? (
                            <a
                              href={app.cv_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal text-xs font-semibold transition-all cursor-pointer shadow-xs"
                              title="Click to view/download applicant CV"
                            >
                              <FileText size={13} />
                              <span>View CV</span>
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span className="text-xs text-charcoal/40 italic">No CV attached</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 text-xs text-charcoal/60 whitespace-nowrap">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                        </td>

                        {/* Status Dropdown */}
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

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Button */}
                            <button
                              onClick={() => handleOpenWhatsAppChat(app)}
                              title="Chat with applicant on WhatsApp"
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              <MessageCircle size={15} />
                            </button>

                            {/* View Full Dossier */}
                            <button
                              onClick={() => setSelectedApp(app)}
                              title="View Application Details"
                              className="p-2 rounded-lg bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              title="Delete Application"
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
      {/* 2. OPEN POSITIONS SUB-TAB (MATCHING CURRENT WEB PAGE VERSION) */}
      {/* ========================================================================= */}
      {activeSubTab === 'positions' && (
        <div className="space-y-6">
          {/* Top Bar with Department Filters & Live count */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-charcoal/10 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal/50 mr-2">
                Filter:
              </span>
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDeptFilter(dept)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    selectedDeptFilter === dept
                      ? 'bg-charcoal text-ivory shadow-xs'
                      : 'text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              {positions.length === 0 && (
                <button
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Database size={13} />
                  <span>Seed Default 4 Positions</span>
                </button>
              )}

              <button
                onClick={handleOpenNewPosition}
                className="px-4 py-2 bg-charcoal text-ivory hover:bg-gold hover:text-charcoal text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>Add Position</span>
              </button>
            </div>
          </div>

          {/* Helper Notice */}
          <div className="flex items-center justify-between text-xs text-charcoal/60 px-1">
            <span>
              Showing {filteredPositions.length} vacancies matching web layout (Department • Title • Description • Status).
            </span>
            <span className="text-gold font-medium">
              Changes reflect live on the website immediately.
            </span>
          </div>

          {/* Positions Directory Cards - MATCHING WEB PAGE CARDS */}
          <div className="space-y-4">
            {filteredPositions.map(pos => {
              const isActive = pos.is_active !== false;

              return (
                <div
                  key={pos.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white/95 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isActive
                      ? 'border-gold/30 hover:border-gold/60'
                      : 'border-charcoal/15 opacity-65 bg-gray-50/80'
                  }`}
                >
                  {/* Position Details Matching Web Page */}
                  <div className="space-y-3 flex-1 text-left">
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Department Badge */}
                      <span className="inline-block px-3 py-1 bg-gold/15 text-gold border border-gold/30 rounded-full text-xs font-semibold tracking-widest uppercase">
                        {pos.department}
                      </span>

                      {/* Web View Preview Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-charcoal/5 text-charcoal/60">
                        <Sparkles size={10} className="text-gold" />
                        Web Layout
                      </span>

                      {/* Type Badge if specified */}
                      {pos.type && (
                        <span className="text-[11px] text-charcoal/50 font-medium">
                          • {pos.type}
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                      {pos.title}
                    </h3>

                    {/* Role Summary / Description */}
                    <p className="text-sm sm:text-base text-charcoal/80 font-normal leading-relaxed max-w-3xl">
                      {pos.summary}
                    </p>

                    <div className="text-[11px] text-charcoal/40 font-mono pt-1">
                      ID: {pos.id}
                    </div>
                  </div>

                  {/* Actions & Status Controls */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-3 shrink-0 self-start md:self-center">
                    {/* Live / Paused Status Toggle */}
                    <button
                      onClick={() => handleTogglePositionStatus(pos)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-charcoal/5 text-charcoal/60 border border-charcoal/20 hover:bg-charcoal/10'
                      }`}
                      title="Click to toggle live status on website"
                    >
                      <Power size={13} />
                      <span>{isActive ? 'Live on Site' : 'Paused (Draft)'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditPosition(pos)}
                        className="px-3.5 py-2 rounded-xl bg-charcoal/5 hover:bg-charcoal/10 text-charcoal text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Edit Position"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeletePosition(pos.id, pos.title)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Position"
                      >
                        <Trash2 size={15} />
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
      {/* 3. APPLICATION DETAIL DOSSIER MODAL */}
      {/* ========================================================================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-charcoal/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 text-gold border border-gold/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
              Candidate Dossier
            </div>

            <h3 className="text-2xl font-serif text-charcoal mb-1">{selectedApp.full_name}</h3>
            <p className="text-xs text-charcoal/60 mb-6">
              Applied for <strong className="text-gold font-semibold">{selectedApp.position_title}</strong>
            </p>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-charcoal/[0.02] border border-charcoal/5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-0.5">Phone</div>
                  <div className="font-semibold text-charcoal font-mono">{selectedApp.phone}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-0.5">Email</div>
                  <div className="font-semibold text-charcoal truncate">{selectedApp.email || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-0.5">Age</div>
                  <div className="font-semibold text-charcoal">{selectedApp.age ? `${selectedApp.age} years old` : 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold mb-0.5">Gender</div>
                  <div className="font-semibold text-charcoal">{selectedApp.gender || 'Not provided'}</div>
                </div>
              </div>

              {/* CV Document Section */}
              {selectedApp.cv_url ? (
                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold text-charcoal flex items-center justify-center font-bold shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-charcoal">Attached Curriculum Vitae (CV)</div>
                      <div className="text-[11px] text-charcoal/60">Candidate document attached to application</div>
                    </div>
                  </div>
                  <a
                    href={selectedApp.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-charcoal hover:bg-gold hover:text-charcoal text-ivory rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    <Download size={14} />
                    <span>View CV</span>
                  </a>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-charcoal/[0.03] border border-charcoal/10 text-center text-charcoal/50 text-xs">
                  No CV was uploaded for this submission.
                </div>
              )}

              {/* Quick Actions (WhatsApp, Call, Email) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => handleOpenWhatsAppChat(selectedApp)}
                  className="px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={`tel:${selectedApp.phone}`}
                  className="px-3 py-2.5 rounded-xl bg-charcoal/5 hover:bg-charcoal/10 text-charcoal font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone size={14} />
                  <span>Call Phone</span>
                </a>

                {selectedApp.email ? (
                  <a
                    href={`mailto:${selectedApp.email}?subject=Application for ${selectedApp.position_title} at The Loft by NM`}
                    className="px-3 py-2.5 rounded-xl bg-charcoal/5 hover:bg-charcoal/10 text-charcoal font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1"
                  >
                    <Mail size={14} />
                    <span>Send Email</span>
                  </a>
                ) : null}
              </div>

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
                  onClick={() => handleDeleteApplication(selectedApp.id)}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Delete Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. POSITION CREATE / EDIT MODAL (STREAMLINED FOR CURRENT WEB PAGE) */}
      {/* ========================================================================= */}
      {isPositionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-charcoal/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPositionModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 text-gold border border-gold/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
              Web Job Post
            </div>

            <h3 className="text-2xl font-serif text-charcoal mb-1">
              {editingPositionId ? 'Edit Vacancy' : 'Post New Vacancy'}
            </h3>
            <p className="text-xs text-charcoal/60 mb-6">
              Configure job title, department, and role description to display on the public Join Us page.
            </p>

            <form onSubmit={handleSavePosition} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Job Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
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

                {/* Department Matching Web Tabs */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
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
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Role Summary / Description (The primary text shown on the website card) */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                  Role Summary / Description * (Displayed on Join Us card)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the role, key focus areas, client care standards, and ideal background..."
                  value={positionForm.summary}
                  onChange={e => setPositionForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50 leading-relaxed"
                />
                <span className="text-[10px] text-charcoal/50">
                  This description is shown prominently to applicants under the job title.
                </span>
              </div>

              {/* Employment Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                    Employment Type (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Time, Part-Time"
                    value={positionForm.type}
                    onChange={e => setPositionForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                    Experience Level (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1+ Years Required"
                    value={positionForm.experience}
                    onChange={e => setPositionForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              {/* Expandable Advanced Fields for extra database details */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedPositionFields(!showAdvancedPositionFields)}
                  className="text-xs text-charcoal/60 hover:text-charcoal font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {showAdvancedPositionFields ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{showAdvancedPositionFields ? 'Hide' : 'Show'} Advanced Details (Responsibilities, Requirements, Perks)</span>
                </button>

                {showAdvancedPositionFields && (
                  <div className="space-y-4 pt-3 mt-2 border-t border-charcoal/10 animate-fadeIn">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                        Key Responsibilities (One per line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Perform luxury manicure & pedicure services...&#10;Consult with clients on customized therapies..."
                        value={positionForm.responsibilitiesText}
                        onChange={e => setPositionForm(prev => ({ ...prev, responsibilitiesText: e.target.value }))}
                        className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2 text-xs text-charcoal focus:outline-none focus:border-gold/50 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                        Requirements (One per line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Recognized qualification...&#10;Hospital-grade sanitization standards..."
                        value={positionForm.requirementsText}
                        onChange={e => setPositionForm(prev => ({ ...prev, requirementsText: e.target.value }))}
                        className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2 text-xs text-charcoal focus:outline-none focus:border-gold/50 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                        Benefits &amp; Perks (One per line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Generous commission structure...&#10;Continuous masterclass training..."
                        value={positionForm.benefitsText}
                        onChange={e => setPositionForm(prev => ({ ...prev, benefitsText: e.target.value }))}
                        className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2 text-xs text-charcoal focus:outline-none focus:border-gold/50 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pos-is-active"
                  checked={positionForm.is_active}
                  onChange={e => setPositionForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded text-gold focus:ring-gold cursor-pointer"
                />
                <label htmlFor="pos-is-active" className="text-xs font-semibold text-charcoal cursor-pointer">
                  Publish vacancy immediately (visible live on Join Us page)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-charcoal/10">
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
                  {editingPositionId ? 'Save Changes' : 'Publish Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
