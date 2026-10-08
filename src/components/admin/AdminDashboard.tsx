import React, { useState, useEffect } from 'react';
import { AdminFullData, ServiceItem, ProjectItem, NavItem, WebsiteSettings, AboutSectionData, MediaAsset, ContactMessage } from '../../types';
import {
  fetchAdminData,
  updateAdminSettings,
  updateAdminAbout,
  saveService,
  deleteService,
  saveProject,
  deleteProject,
  updateNavigation,
  addMediaAsset,
  deleteMediaAsset,
  toggleMessageRead,
  deleteMessage,
  updateCredentials,
  logoutAdmin,
} from '../../lib/api';
import {
  LayoutDashboard,
  FileText,
  Boxes,
  FolderGit2,
  PhoneCall,
  Settings,
  Navigation,
  Image as ImageIcon,
  Mail,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Upload,
  Copy,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewPublicSite: () => void;
}

type TabType =
  | 'overview'
  | 'about'
  | 'services'
  | 'projects'
  | 'contact'
  | 'settings'
  | 'navigation'
  | 'media'
  | 'messages';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onViewPublicSite }) => {
  const [data, setData] = useState<AdminFullData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states for editors
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings | null>(null);
  const [aboutForm, setAboutForm] = useState<AboutSectionData | null>(null);
  const [navForm, setNavForm] = useState<NavItem[]>([]);

  // Project editing/adding modal
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Service editing/adding modal
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Credentials form
  const [credentialsForm, setCredentialsForm] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
  });

  // Media upload input
  const [mediaUpload, setMediaUpload] = useState({
    name: '',
    url: '',
    category: 'projects',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminData();
      setData(res);
      setSettingsForm(res.settings);
      setAboutForm(res.about);
      setNavForm(res.navigation);
      setCredentialsForm((prev) => ({ ...prev, username: res.adminUser.username }));
    } catch (err) {
      console.error(err);
      triggerToast('Session expired or network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setSaveStatus({ message, type });
    setTimeout(() => {
      setSaveStatus(null);
    }, 4000);
  };

  const handleLogoutClick = async () => {
    await logoutAdmin();
    onLogout();
  };

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      await updateAdminSettings(settingsForm);
      triggerToast('Website settings saved to database.');
      loadData();
    } catch {
      triggerToast('Failed to save settings.', 'error');
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutForm) return;
    try {
      await updateAdminAbout(aboutForm);
      triggerToast('About section saved to database.');
      loadData();
    } catch {
      triggerToast('Failed to save about section.', 'error');
    }
  };

  const handleSaveNavigation = async () => {
    try {
      await updateNavigation(navForm);
      triggerToast('Navigation structure saved.');
      loadData();
    } catch {
      triggerToast('Failed to save navigation.', 'error');
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      await saveProject(editingProject);
      triggerToast(isNewProject ? 'Project created successfully.' : 'Project updated.');
      setEditingProject(null);
      loadData();
    } catch {
      triggerToast('Failed to save project.', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      triggerToast('Project removed.');
      loadData();
    } catch {
      triggerToast('Failed to delete project.', 'error');
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      await saveService(editingService);
      triggerToast(isNewService ? 'Service added.' : 'Service updated.');
      setEditingService(null);
      loadData();
    } catch {
      triggerToast('Failed to save service.', 'error');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
      triggerToast('Service removed.');
      loadData();
    } catch {
      triggerToast('Failed to delete service.', 'error');
    }
  };

  const handleMediaUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUpload.name || !mediaUpload.url) return;
    try {
      await addMediaAsset(mediaUpload);
      triggerToast('Media asset recorded in database.');
      setMediaUpload({ name: '', url: '', category: 'projects' });
      loadData();
    } catch {
      triggerToast('Failed to add media.', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMediaUpload((prev) => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await deleteMediaAsset(id);
      triggerToast('Media item deleted.');
      loadData();
    } catch {
      triggerToast('Failed to delete media.', 'error');
    }
  };

  const handleMessageStatus = async (id: string, currentRead: boolean) => {
    try {
      await toggleMessageRead(id, !currentRead);
      loadData();
    } catch {
      triggerToast('Failed to update message status.', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage(id);
      triggerToast('Message deleted.');
      loadData();
    } catch {
      triggerToast('Failed to delete message.', 'error');
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialsForm.currentPassword) {
      triggerToast('Current password required to verify identity.', 'error');
      return;
    }
    try {
      await updateCredentials({
        username: credentialsForm.username,
        currentPassword: credentialsForm.currentPassword,
        newPassword: credentialsForm.newPassword || undefined,
      });
      triggerToast('Credentials updated successfully.');
      setCredentialsForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        triggerToast(err.message, 'error');
      } else {
        triggerToast('Failed to update credentials.', 'error');
      }
    }
  };

  if (loading || !data || !settingsForm || !aboutForm) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-white font-mono">
        <RefreshCw className="w-8 h-8 text-[#7042f8] animate-spin mb-4" />
        <div className="text-sm text-zinc-400">Loading Asura Kinetics CMS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-200 flex flex-col md:flex-row antialiased">
      {/* Toast Notification */}
      {saveStatus && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border flex items-center gap-3 text-xs font-mono shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${
            saveStatus.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0f] border-r border-white/[0.08] flex flex-col justify-between shrink-0">
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-base font-bold font-display uppercase text-white tracking-wider">
                ASURA CMS
              </div>
              <div className="text-[11px] font-mono text-zinc-500">
                Logged in as <span className="text-violet-400">{data.adminUser.username}</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <SidebarBtn
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Overview"
            />
            <SidebarBtn
              active={activeTab === 'about'}
              onClick={() => setActiveTab('about')}
              icon={<FileText className="w-4 h-4" />}
              label="About Studio"
            />
            <SidebarBtn
              active={activeTab === 'services'}
              onClick={() => setActiveTab('services')}
              icon={<Boxes className="w-4 h-4" />}
              label={`Services (${data.services.length})`}
            />
            <SidebarBtn
              active={activeTab === 'projects'}
              onClick={() => setActiveTab('projects')}
              icon={<FolderGit2 className="w-4 h-4" />}
              label={`Projects (${data.projects.length})`}
            />
            <SidebarBtn
              active={activeTab === 'contact'}
              onClick={() => setActiveTab('contact')}
              icon={<PhoneCall className="w-4 h-4" />}
              label="Contact & Channels"
            />
            <SidebarBtn
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              icon={<Settings className="w-4 h-4" />}
              label="Website Settings"
            />
            <SidebarBtn
              active={activeTab === 'navigation'}
              onClick={() => setActiveTab('navigation')}
              icon={<Navigation className="w-4 h-4" />}
              label="Navigation Order"
            />
            <SidebarBtn
              active={activeTab === 'media'}
              onClick={() => setActiveTab('media')}
              icon={<ImageIcon className="w-4 h-4" />}
              label={`Media (${data.media.length})`}
            />
            <SidebarBtn
              active={activeTab === 'messages'}
              onClick={() => setActiveTab('messages')}
              icon={<Mail className="w-4 h-4" />}
              label={`Inbox (${data.stats.totalMessages})`}
              badge={data.stats.unreadMessages > 0 ? `${data.stats.unreadMessages} new` : undefined}
            />
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <button
            type="button"
            onClick={onViewPublicSite}
            className="w-full py-2.5 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full py-2.5 px-3 rounded-lg hover:bg-rose-500/10 text-xs font-mono text-zinc-400 hover:text-rose-400 transition-colors flex items-center justify-between"
          >
            <span>Terminate Session</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen p-6 md:p-10 bg-[#070709]">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-3xl font-bold font-display text-white mb-2">Control Plane</h2>
              <p className="text-xs font-mono text-zinc-400">
                Persistent CMS operations · Real-time website synchronization
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Projects" value={data.stats.totalProjects} helper="Live in portfolio" />
              <StatCard label="Total Services" value={data.stats.totalServices} helper="Active capabilities" />
              <StatCard label="Contact Inquiries" value={data.stats.totalMessages} helper={`${data.stats.unreadMessages} unread`} />
              <StatCard label="System Status" value="Online" status="normal" helper="Persistent SQLite/JSON" />
            </div>

            {/* Quick Actions & Recent Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Inquiries */}
              <div className="rounded-2xl glass-panel p-6 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold font-display text-white">Recent Inquiries</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-mono text-violet-400 hover:underline"
                  >
                    View All
                  </button>
                </div>
                {data.messages.length === 0 ? (
                  <p className="text-xs font-mono text-zinc-500 py-6 text-center">
                    No inquiries received yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.messages.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setActiveTab('messages')}
                        className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-white">{m.name}</span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {new Date(m.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 line-clamp-1">{m.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Launch Panel */}
              <div className="rounded-2xl glass-panel p-6 border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-white mb-2">CMS Quick Controls</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    Manage project cards, add new services, adjust studio text, or review client proposals. Any change updates immediately without code deployment.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewProject(true);
                      setEditingProject({
                        id: '',
                        number: `0${data.projects.length + 1}`,
                        name: '',
                        category: 'Minecraft SMP',
                        tagline: '',
                        description: '',
                        longDescription: '',
                        tags: ['Minecraft', 'SMP'],
                        image: '/src/assets/images/arise_smp_hero_1791476499363.jpg',
                        gallery: [],
                        projectUrl: 'https://discord.gg/asurakinetics',
                        technologies: ['PaperMC', 'Java'],
                        features: ['Custom Economy', 'Custom Quests'],
                        status: 'Operational',
                        featured: true,
                        order: data.projects.length + 1,
                      });
                      setActiveTab('projects');
                    }}
                    className="p-3 rounded-xl bg-[#7042f8] hover:bg-[#6032e8] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsNewService(true);
                      setEditingService({
                        id: '',
                        number: `0${data.services.length + 1}`,
                        title: '',
                        shortDescription: '',
                        icon: 'Bot',
                        features: ['Custom Setup', 'Permissions'],
                        featured: true,
                        order: data.services.length + 1,
                      });
                      setActiveTab('services');
                    }}
                    className="p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold uppercase tracking-wider border border-white/[0.1] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Service</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ABOUT EDITOR */}
        {/* ======================================================== */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold font-display text-white mb-1">About Section Editor</h2>
              <p className="text-xs font-mono text-zinc-400">
                Edit Category 01 About copy, manifesto, statistics, and visuals.
              </p>
            </div>

            <form onSubmit={handleSaveAbout} className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/[0.08] space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Section Number</label>
                  <input
                    type="text"
                    value={aboutForm.sectionNumber}
                    onChange={(e) => setAboutForm({ ...aboutForm, sectionNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Lead Text</label>
                <textarea
                  rows={2}
                  value={aboutForm.leadText}
                  onChange={(e) => setAboutForm({ ...aboutForm, leadText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Paragraph 1</label>
                <textarea
                  rows={3}
                  value={aboutForm.paragraph1}
                  onChange={(e) => setAboutForm({ ...aboutForm, paragraph1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Paragraph 2</label>
                <textarea
                  rows={3}
                  value={aboutForm.paragraph2}
                  onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Philosophy Statement</label>
                <input
                  type="text"
                  value={aboutForm.philosophy}
                  onChange={(e) => setAboutForm({ ...aboutForm, philosophy: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Studio Image URL</label>
                <input
                  type="text"
                  value={aboutForm.studioImage}
                  onChange={(e) => setAboutForm({ ...aboutForm, studioImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                />
              </div>

              {/* Statistics Grid Editor */}
              <div className="pt-4 border-t border-white/[0.08]">
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-3">
                  Production Statistics
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aboutForm.stats.map((stat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Value (e.g. 50K+)"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...aboutForm.stats];
                          updated[idx].value = e.target.value;
                          setAboutForm({ ...aboutForm, stats: updated });
                        }}
                        className="w-28 px-2 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...aboutForm.stats];
                          updated[idx].label = e.target.value;
                          setAboutForm({ ...aboutForm, stats: updated });
                        }}
                        className="flex-1 px-2 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save About Content</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SERVICES EDITOR */}
        {/* ======================================================== */}
        {activeTab === 'services' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-display text-white mb-1">Services Editor</h2>
                <p className="text-xs font-mono text-zinc-400">
                  Manage interactive capability cards, features lists, and icons.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsNewService(true);
                  setEditingService({
                    id: '',
                    number: `0${data.services.length + 1}`,
                    title: '',
                    shortDescription: '',
                    icon: 'Bot',
                    features: ['Feature 1', 'Feature 2'],
                    featured: true,
                    order: data.services.length + 1,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-[#7042f8] hover:bg-[#6032e8] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            {/* Services List */}
            <div className="space-y-4">
              {data.services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl glass-panel p-6 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-violet-400 font-bold">
                        #{service.number}
                      </span>
                      <span className="text-lg font-bold text-white font-display">
                        {service.title}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 max-w-xl">{service.shortDescription}</p>
                    <div className="text-[11px] font-mono text-zinc-500 pt-1">
                      {service.features.length} deliverables configured · Icon: {service.icon}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewService(false);
                        setEditingService({ ...service });
                      }}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Edit Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="w-full max-w-2xl bg-[#0f0f17] rounded-2xl border border-white/[0.1] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold font-display text-white mb-4">
                    {isNewService ? 'Add Service' : 'Edit Service'}
                  </h3>

                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Service Number
                        </label>
                        <input
                          type="text"
                          value={editingService.number}
                          onChange={(e) => setEditingService({ ...editingService, number: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Icon (Bot, Box, Cpu)
                        </label>
                        <input
                          type="text"
                          value={editingService.icon}
                          onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingService.title}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingService.shortDescription}
                        onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Features (one per line)
                      </label>
                      <textarea
                        rows={5}
                        value={editingService.features.join('\n')}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            features: e.target.value.split('\n').filter((f) => f.trim().length > 0),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 rounded-lg bg-white/[0.04] text-xs font-mono text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-zinc-200"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PROJECTS EDITOR */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-display text-white mb-1">Projects Showcase Editor</h2>
                <p className="text-xs font-mono text-zinc-400">
                  Manage Arise SMP and future project showcases.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsNewProject(true);
                  setEditingProject({
                    id: '',
                    number: `0${data.projects.length + 1}`,
                    name: '',
                    category: 'Minecraft SMP',
                    tagline: '',
                    description: '',
                    longDescription: '',
                    tags: ['Minecraft', 'SMP', 'Server Development'],
                    image: '/src/assets/images/arise_smp_hero_1791476499363.jpg',
                    gallery: [],
                    projectUrl: 'https://discord.gg/asurakinetics',
                    technologies: ['PaperMC', 'Java 21'],
                    features: ['Bespoke Systems'],
                    status: 'Operational',
                    featured: true,
                    order: data.projects.length + 1,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-[#7042f8] hover:bg-[#6032e8] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Projects list */}
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl glass-panel p-6 border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={proj.image}
                      alt={proj.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-14 rounded-lg object-cover border border-white/[0.1] bg-zinc-900 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-violet-400 font-bold">
                          #{proj.number}
                        </span>
                        <span className="text-lg font-bold text-white font-display">
                          {proj.name}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          ({proj.category})
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 max-w-xl line-clamp-1">{proj.description}</p>
                      <div className="text-[11px] font-mono text-emerald-400 pt-0.5">
                        Status: {proj.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewProject(false);
                        setEditingProject({ ...proj });
                      }}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Edit Modal */}
            {editingProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="w-full max-w-3xl bg-[#0f0f17] rounded-2xl border border-white/[0.1] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold font-display text-white mb-4">
                    {isNewProject ? 'Add Project' : `Edit Project: ${editingProject.name}`}
                  </h3>

                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Project Number
                        </label>
                        <input
                          type="text"
                          value={editingProject.number}
                          onChange={(e) => setEditingProject({ ...editingProject, number: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Project Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.name}
                          onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-display"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editingProject.category}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={editingProject.tagline}
                        onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Extended Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.longDescription}
                        onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Main Image URL
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.image}
                          onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Live URL / Discord Link
                        </label>
                        <input
                          type="text"
                          value={editingProject.projectUrl}
                          onChange={(e) => setEditingProject({ ...editingProject, projectUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editingProject.tags.join(', ')}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                          Technologies (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editingProject.technologies.join(', ')}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Features (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.features.join('\n')}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            features: e.target.value.split('\n').filter((f) => f.trim().length > 0),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 rounded-lg bg-white/[0.04] text-xs font-mono text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-zinc-200"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CONTACT & SOCIALS EDITOR */}
        {/* ======================================================== */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold font-display text-white mb-1">Contact & Channels Editor</h2>
              <p className="text-xs font-mono text-zinc-400">
                Update studio inquiry channels, Discord invite, social handles, and CTA headings.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/[0.08] space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Studio Email</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Discord Invite URL</label>
                  <input
                    type="text"
                    value={settingsForm.discordInviteUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, discordInviteUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Twitter / X URL</label>
                  <input
                    type="text"
                    value={settingsForm.twitterUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={settingsForm.githubUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={settingsForm.youtubeUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">CTA Heading</label>
                  <input
                    type="text"
                    value={settingsForm.ctaHeading}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ctaHeading: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-display"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">CTA Subheading</label>
                  <input
                    type="text"
                    value={settingsForm.ctaSubheading}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ctaSubheading: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Contact Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: WEBSITE SETTINGS & CREDENTIALS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold font-display text-white mb-1">Website Settings & Security</h2>
              <p className="text-xs font-mono text-zinc-400">
                Core branding parameters, visual themes, and administrator credentials.
              </p>
            </div>

            {/* General Site Config */}
            <form onSubmit={handleSaveSettings} className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/[0.08] space-y-6">
              <h3 className="text-lg font-bold font-display text-white border-b border-white/[0.08] pb-3">
                Branding & Hero Copy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Website Title</label>
                  <input
                    type="text"
                    value={settingsForm.siteTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Studio Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.studioTagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, studioTagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Hero Eyebrow</label>
                  <input
                    type="text"
                    value={settingsForm.heroEyebrow}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroEyebrow: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Studio Status Tag</label>
                  <input
                    type="text"
                    value={settingsForm.statusText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, statusText: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Hero Description</label>
                <textarea
                  rows={3}
                  value={settingsForm.heroDescription}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Website Settings</span>
                </button>
              </div>
            </form>

            {/* Change Admin Password / Username */}
            <form onSubmit={handleUpdateCredentials} className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/[0.08] space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
                <ShieldAlert className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-bold font-display text-white">
                  Change Administrator Credentials
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Admin Username</label>
                  <input
                    type="text"
                    value={credentialsForm.username}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Current Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Verify identity"
                    value={credentialsForm.currentPassword}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep"
                    value={credentialsForm.newPassword}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shadow-violet-600/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Credentials</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: NAVIGATION EDITOR */}
        {/* ======================================================== */}
        {activeTab === 'navigation' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold font-display text-white mb-1">Navigation Editor</h2>
              <p className="text-xs font-mono text-zinc-400">
                Configure top navigation labels, target anchors, and enable/disable states.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/[0.08] space-y-4">
              {navForm.map((nav, idx) => (
                <div
                  key={nav.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500">#{idx + 1}</span>
                    <input
                      type="text"
                      value={nav.label}
                      onChange={(e) => {
                        const updated = [...navForm];
                        updated[idx].label = e.target.value;
                        setNavForm(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-semibold"
                    />
                    <input
                      type="text"
                      value={nav.href}
                      onChange={(e) => {
                        const updated = [...navForm];
                        updated[idx].href = e.target.value;
                        setNavForm(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-zinc-300 font-mono"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nav.enabled}
                      onChange={(e) => {
                        const updated = [...navForm];
                        updated[idx].enabled = e.target.checked;
                        setNavForm(updated);
                      }}
                      className="rounded bg-white/[0.08] border-white/20 text-[#7042f8] focus:ring-0"
                    />
                    <span>Visible in Top Bar</span>
                  </label>
                </div>
              ))}

              <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNavigation}
                  className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Navigation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: MEDIA MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'media' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold font-display text-white mb-1">Media Library</h2>
              <p className="text-xs font-mono text-zinc-400">
                Upload images or register URLs for projects, about sections, and services.
              </p>
            </div>

            {/* Upload Box */}
            <form onSubmit={handleMediaUploadSubmit} className="rounded-2xl glass-panel p-6 border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold font-mono uppercase text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-violet-400" />
                <span>Add / Upload Media</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Asset Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arise SMP Render"
                    value={mediaUpload.name}
                    onChange={(e) => setMediaUpload({ ...mediaUpload, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Image URL / Data URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /src/assets/..."
                    value={mediaUpload.url}
                    onChange={(e) => setMediaUpload({ ...mediaUpload, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Category</label>
                  <select
                    value={mediaUpload.category}
                    onChange={(e) => setMediaUpload({ ...mediaUpload, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#14141e] border border-white/[0.1] text-sm text-white"
                  >
                    <option value="projects">Projects</option>
                    <option value="studio">Studio</option>
                    <option value="services">Services</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-zinc-300">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Local File (Auto-converts to data URI)</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-zinc-200"
                >
                  Save Asset
                </button>
              </div>
            </form>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.media.map((item) => (
                <div key={item.id} className="rounded-xl glass-panel p-4 border border-white/[0.08] space-y-3">
                  <div className="aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.08] relative group">
                    <img
                      src={item.url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white truncate">{item.name}</div>
                    <div className="text-[11px] font-mono text-zinc-500">
                      Category: {item.category} {item.size && `· ${item.size}`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        triggerToast('Image URL copied to clipboard');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-1.5 rounded hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: MESSAGES INBOX */}
        {/* ======================================================== */}
        {activeTab === 'messages' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold font-display text-white mb-1">Inquiries Inbox</h2>
              <p className="text-xs font-mono text-zinc-400">
                Contact submissions stored in the persistent database.
              </p>
            </div>

            {data.messages.length === 0 ? (
              <div className="rounded-2xl glass-panel p-12 text-center text-zinc-500 font-mono text-xs border border-white/[0.08]">
                No messages recorded yet. Submissions from the public contact form will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {data.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl glass-panel p-6 border transition-all ${
                      msg.read ? 'border-white/[0.06] opacity-80' : 'border-violet-500/40 bg-violet-950/[0.08]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <span className="text-base font-bold text-white font-display mr-2">{msg.name}</span>
                        <span className="text-xs font-mono text-violet-400">{msg.projectType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-300 mb-4 pb-3 border-b border-white/[0.06]">
                      <span>Email: <a href={`mailto:${msg.email}`} className="text-white underline">{msg.email}</a></span>
                      {msg.discord && <span>· Discord: <span className="text-cyan-400">{msg.discord}</span></span>}
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed mb-4 whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => handleMessageStatus(msg.id, msg.read)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{msg.read ? 'Mark as Unread' : 'Mark as Read'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 rounded hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

interface SidebarBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

const SidebarBtn: React.FC<SidebarBtnProps> = ({ active, onClick, icon, label, badge }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors ${
      active
        ? 'bg-white text-zinc-950 font-bold shadow-sm'
        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
    }`}
  >
    <div className="flex items-center gap-2.5">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500 text-white font-mono">
        {badge}
      </span>
    )}
  </button>
);

interface StatCardProps {
  label: string;
  value: string | number;
  status?: string;
  helper: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, helper }) => (
  <div className="rounded-2xl glass-panel p-5 border border-white/[0.08]">
    <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight tabular-nums mb-1">
      {value}
    </div>
    <div className="text-[11px] font-mono text-zinc-400">{helper}</div>
  </div>
);
