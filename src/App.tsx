import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  Calendar,
  ExternalLink,
  Send,
  Radio,
  FileText,
  SlidersHorizontal,
  Landmark,
  Globe,
  Bell,
  Mail,
} from 'lucide-react';
import { GovVacancy, AutomationSettings, SystemStatus, GeneratedPost, NotificationLog } from './types/index.js';
import { Header } from './components/Header.js';
import { MetricsOverview } from './components/MetricsOverview.js';
import { VacancyCard } from './components/VacancyCard.js';
import { PostReviewModal } from './components/PostReviewModal.js';
import { ScanModal } from './components/ScanModal.js';
import { CustomIngestModal } from './components/CustomIngestModal.js';
import { SettingsTab } from './components/SettingsTab.js';
import { SchedulerTab } from './components/SchedulerTab.js';
import { BroadcastStudioTab } from './components/BroadcastStudioTab.js';
import { AutomationLogsTab } from './components/AutomationLogsTab.js';
import { AdminApprovalTab } from './components/AdminApprovalTab.js';
import { AdminApprovalModal } from './components/AdminApprovalModal.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('vacancies');
  const [vacancies, setVacancies] = useState<GovVacancy[]>([]);
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [logs, setLogs] = useState<{
    scanLogs: any[];
    publishLogs: any[];
    notificationLogs?: NotificationLog[];
  }>({
    scanLogs: [],
    publishLogs: [],
    notificationLogs: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedQualification, setSelectedQualification] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals state
  const [reviewingVacancy, setReviewingVacancy] = useState<GovVacancy | null>(null);
  const [approvalModalVacancy, setApprovalModalVacancy] = useState<GovVacancy | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [vRes, sRes, stRes, lRes] = await Promise.all([
        fetch('/api/vacancies'),
        fetch('/api/settings'),
        fetch('/api/status'),
        fetch('/api/logs'),
      ]);

      if (vRes.ok) setVacancies(await vRes.json());
      if (sRes.ok) setSettings(await sRes.json());
      if (stRes.ok) setStatus(await stRes.json());
      if (lRes.ok) setLogs(await lRes.json());
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick Publish from Vacancy Card
  const handleQuickPublish = async (vacancy: GovVacancy) => {
    setPublishingId(vacancy.id);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancyId: vacancy.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          `Published "${vacancy.shortName}" to ${settings?.siteUrl || 'esckolkata2003.org'}!`,
          'success'
        );
        fetchData();
      } else {
        showToast(data.error || data.result?.message || 'Publishing failed.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error publishing post', 'error');
    } finally {
      setPublishingId(null);
    }
  };

  // Publish from Review Modal
  const handlePublishFromModal = async (vacancy: GovVacancy, customPost?: GeneratedPost) => {
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vacancyId: vacancy.id, customPost }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Article published to ${settings?.siteUrl || 'esckolkata2003.org'}!`, 'success');
      fetchData();
    }
    return data;
  };

  // Approve vacancy directly
  const handleApproveVacancy = async (vacancyId: string) => {
    try {
      const res = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancyId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Exam approved & published to esckolkata2003.org!', 'success');
        fetchData();
      } else {
        showToast('Approval failed.', 'error');
      }
      return data;
    } catch (err: any) {
      showToast(err.message || 'Approval error', 'error');
    }
  };

  // Trigger admin notification
  const handleTriggerAdminNotification = async (vacancyId: string) => {
    try {
      const res = await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancyId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Approval notification dispatched to ${settings?.adminApproval?.adminEmail}!`, 'success');
        fetchData();
      }
      return data;
    } catch (err: any) {
      showToast(err.message || 'Notification error', 'error');
    }
  };

  // Regenerate post using Gemini
  const handleRegeneratePost = async (vacancyId: string) => {
    const res = await fetch('/api/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vacancyId }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Article regenerated with Gemini 3.8 Flash!', 'success');
      setReviewingVacancy(data.vacancy);
      fetchData();
    }
    return data;
  };

  // Delete vacancy
  const handleDeleteVacancy = async (id: string) => {
    if (!window.confirm('Remove this vacancy notice from ESC Kolkata pulse radar?')) return;
    try {
      const res = await fetch(`/api/vacancies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVacancies((prev) => prev.filter((v) => v.id !== id));
        showToast('Vacancy notice removed.', 'info');
        fetchData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async (newSettings: Partial<AutomationSettings>) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    });
    const data = await res.json();
    if (res.ok) {
      setSettings(data);
      showToast('Settings saved successfully!', 'success');
      fetchData();
    }
    return data;
  };

  // Test WordPress connection
  const handleTestConnection = async () => {
    const res = await fetch('/api/test-connection', { method: 'POST' });
    const data = await res.json();
    fetchData();
    return data;
  };

  // Run AI scan from modal
  const handleRunScan = async (query: string, autoGenerate: boolean) => {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, autoGenerate }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Scan complete: ${data.newCount} new exams found. Admin approval queued.`, 'success');
      fetchData();
    }
    return data;
  };

  // Ingest custom notice
  const handleIngestSuccess = (newVacancy: GovVacancy) => {
    setVacancies((prev) => [newVacancy, ...prev]);
    setIsIngestModalOpen(false);
    setReviewingVacancy(newVacancy);
    showToast(`Notice for "${newVacancy.shortName}" created and queued for admin approval!`, 'success');
    fetchData();
  };

  // Filter vacancies
  const filteredVacancies = vacancies.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.examBoard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBoard = selectedBoard === 'all' || v.examBoard === selectedBoard;
    const matchesQualification =
      selectedQualification === 'all' || v.qualificationLevel === selectedQualification;

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'west_bengal' && v.jurisdiction === 'West Bengal') ||
      (activeFilter === 'central' && v.jurisdiction === 'Central') ||
      (activeFilter === 'published' && v.syncStatus === 'published_to_site') ||
      (activeFilter === 'pending' && v.syncStatus === 'pending_draft') ||
      (activeFilter === 'approvals' && v.approvalStatus === 'pending_approval') ||
      (activeFilter === 'closing_soon' && v.status === 'closing_soon');

    return matchesSearch && matchesBoard && matchesQualification && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-200">
      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center gap-2 text-white ${
              toast.type === 'success'
                ? 'bg-emerald-600 border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 border-rose-500'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-200" />
            ) : (
              <Radio className="w-4 h-4 text-blue-200" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        status={status}
        settings={settings}
        onOpenScan={() => setIsScanModalOpen(true)}
        onOpenIngest={() => setIsIngestModalOpen(true)}
        onOpenSettings={() => setActiveTab('settings')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Vacancies Feed */}
        {activeTab === 'vacancies' && (
          <div>
            {/* Top Metrics Overview */}
            <MetricsOverview
              vacancies={vacancies}
              status={status}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Filter and Search Controls Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by exam name, board, post (e.g. WBPSC Clerkship, WBCS, Police, Income Tax, CGL, Bank PO, KMC)..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Exam Board Filter */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    Board:
                  </span>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Boards</option>
                    <optgroup label="West Bengal Authorities">
                      <option value="WBPSC">WBPSC (WBCS, Clerkship, Food SI)</option>
                      <option value="WB Police (WBPRB & KP)">WB Police & Kolkata Police</option>
                      <option value="WB School Service (WBSSC)">WBSSC School Teachers</option>
                      <option value="WB Primary Education (WBBPE)">WB Primary TET</option>
                      <option value="WB Health (WBHRB)">WBHRB Health & Nurses</option>
                      <option value="WB Municipal Service (WBMSC)">WBMSC Kolkata Municipal Corp</option>
                      <option value="WB District & Panchayat (DM/Zilla Parishad)">WB Panchayats (23 Districts)</option>
                    </optgroup>
                    <optgroup label="Central Government Authorities">
                      <option value="SSC">SSC (CGL, CHSL, MTS, GD, JE, CPO)</option>
                      <option value="UPSC">UPSC (Civil Services, CDS, NDA)</option>
                      <option value="IBPS">IBPS Banking (PO, Clerk, SO)</option>
                      <option value="Income Tax & CBDT">Income Tax & CBDT</option>
                      <option value="Railways RRB & RRC">Railways RRB & RRC</option>
                      <option value="EPFO & ESIC">EPFO & ESIC Labour</option>
                      <option value="Defence (Army/Navy/Air Force/Coast Guard)">Defence Armed Forces</option>
                    </optgroup>
                  </select>

                  <span className="text-slate-500 font-semibold ml-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Eligibility:
                  </span>
                  <select
                    value={selectedQualification}
                    onChange={(e) => setSelectedQualification(e.target.value)}
                    className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Qualifications</option>
                    <option value="Graduate">Graduate</option>
                    <option value="12th Pass">12th Pass (+2)</option>
                    <option value="10th Pass">10th Pass (Madhyamik)</option>
                    <option value="Engineering">Engineering (Diploma/Degree)</option>
                    <option value="Medical / Nursing">Medical / Nursing</option>
                  </select>

                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBoard('all');
                      setSelectedQualification('all');
                      setActiveFilter('all');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline ml-1 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Status & Region Pills */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto text-xs">
                <span className="text-slate-400 font-medium shrink-0">Filter by:</span>

                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer shrink-0 ${
                    activeFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Exams ({vacancies.length})
                </button>

                <button
                  onClick={() => setActiveFilter('west_bengal')}
                  className={`px-2.5 py-1 rounded-md font-bold cursor-pointer shrink-0 flex items-center gap-1 ${
                    activeFilter === 'west_bengal'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span>🏛️ West Bengal & Kolkata</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900">
                    {vacancies.filter((v) => v.jurisdiction === 'West Bengal').length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveFilter('central')}
                  className={`px-2.5 py-1 rounded-md font-bold cursor-pointer shrink-0 flex items-center gap-1 ${
                    activeFilter === 'central'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <span>🇮🇳 Central Govt</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-200 text-blue-900">
                    {vacancies.filter((v) => v.jurisdiction === 'Central').length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveFilter('approvals')}
                  className={`px-2.5 py-1 rounded-md font-bold cursor-pointer shrink-0 flex items-center gap-1 ${
                    activeFilter === 'approvals'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Bell className="w-3 h-3 text-amber-600" />
                  <span>Pending Admin Approval</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-extrabold">
                    {vacancies.filter((v) => v.approvalStatus === 'pending_approval').length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveFilter('published')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer shrink-0 ${
                    activeFilter === 'published'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Live on Website ({vacancies.filter((v) => v.syncStatus === 'published_to_site').length})
                </button>

                <button
                  onClick={() => setActiveFilter('closing_soon')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer shrink-0 ${
                    activeFilter === 'closing_soon'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Closing Soon
                </button>
              </div>
            </div>

            {/* Vacancy Cards Grid */}
            {isLoading ? (
              <div className="text-center py-20">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">Connecting to GovJobAutoPulse engine...</p>
              </div>
            ) : filteredVacancies.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Exam Notifications Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search filters or click "Run Web Scan" to discover newly released vacancies.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBoard('all');
                      setSelectedQualification('all');
                      setActiveFilter('all');
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setIsScanModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-xs transition cursor-pointer"
                  >
                    Run Web Radar Scan
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVacancies.map((vacancy) => (
                  <div key={vacancy.id} className="relative flex flex-col">
                    {/* Admin Approval Notice tag if pending */}
                    {vacancy.approvalStatus === 'pending_approval' && (
                      <div className="bg-amber-500 text-slate-900 px-3 py-1 rounded-t-xl text-[11px] font-extrabold flex items-center justify-between border-t border-x border-amber-600 shadow-xs">
                        <span className="flex items-center gap-1">
                          <Bell className="w-3 h-3" /> Requires Admin Approval
                        </span>
                        <button
                          onClick={() => setApprovalModalVacancy(vacancy)}
                          className="underline hover:text-slate-800 font-black cursor-pointer"
                        >
                          Review &amp; Approve &rarr;
                        </button>
                      </div>
                    )}
                    <VacancyCard
                      vacancy={vacancy}
                      onPreviewPost={(v) => setReviewingVacancy(v)}
                      onQuickPublish={handleQuickPublish}
                      onDeleteVacancy={handleDeleteVacancy}
                      isPublishing={publishingId === vacancy.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Admin Approvals & Alerts */}
        {activeTab === 'approvals' && (
          <AdminApprovalTab
            vacancies={vacancies}
            settings={settings}
            notificationLogs={logs.notificationLogs || []}
            onOpenApprovalModal={(v) => setApprovalModalVacancy(v)}
            onApproveVacancy={handleApproveVacancy}
            onSaveSettings={handleSaveSettings}
            onTriggerNotification={handleTriggerAdminNotification}
            onRefreshLogs={fetchData}
          />
        )}

        {/* Tab 3: Scheduler / Radar Tab */}
        {activeTab === 'scheduler' && (
          <SchedulerTab
            status={status}
            settings={settings}
            onRunScan={() => setIsScanModalOpen(true)}
            onOpenSettings={() => setActiveTab('settings')}
          />
        )}

        {/* Tab 4: Student Broadcast Studio */}
        {activeTab === 'broadcast' && (
          <BroadcastStudioTab vacancies={vacancies} settings={settings} />
        )}

        {/* Tab 5: esckolkata2003.org Website Integration Settings */}
        {activeTab === 'settings' && settings && (
          <SettingsTab
            settings={settings}
            status={status}
            onSaveSettings={handleSaveSettings}
            onTestConnection={handleTestConnection}
          />
        )}

        {/* Tab 6: Audit & Sync Logs */}
        {activeTab === 'logs' && (
          <AutomationLogsTab logs={logs} onRefresh={fetchData} />
        )}
      </main>

      {/* Modals */}
      {reviewingVacancy && (
        <PostReviewModal
          vacancy={reviewingVacancy}
          settings={settings}
          onClose={() => setReviewingVacancy(null)}
          onPublish={handlePublishFromModal}
          onRegeneratePost={handleRegeneratePost}
        />
      )}

      {approvalModalVacancy && (
        <AdminApprovalModal
          vacancy={approvalModalVacancy}
          settings={settings}
          onClose={() => setApprovalModalVacancy(null)}
          onApproveSuccess={() => {
            setApprovalModalVacancy(null);
            fetchData();
          }}
        />
      )}

      {isScanModalOpen && (
        <ScanModal
          onClose={() => setIsScanModalOpen(false)}
          onRunScan={handleRunScan}
        />
      )}

      {isIngestModalOpen && (
        <CustomIngestModal
          onClose={() => setIsIngestModalOpen(false)}
          onIngestSuccess={handleIngestSuccess}
        />
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <strong>GovJobAutoPulse</strong> &copy; 2026. Custom Built for{' '}
            <strong className="text-slate-800">ESC Kolkata (esckolkata2003.org)</strong>.
          </div>
          <div className="flex items-center gap-4">
            <span>Admin Notifications Active ({settings?.adminApproval?.adminEmail || 'shadabsarwar@gmail.com'})</span>
            <span>•</span>
            <a
              href="https://esckolkata2003.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              Visit esckolkata2003.org <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
