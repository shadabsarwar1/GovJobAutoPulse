import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Eye,
  ExternalLink,
  Save,
  Check,
  Copy,
  Loader2,
  Bell,
  Sliders,
  Sparkles,
  Server,
  Key,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { GovVacancy, AutomationSettings, NotificationLog } from '../types/index.js';

interface AdminApprovalTabProps {
  vacancies: GovVacancy[];
  settings: AutomationSettings | null;
  notificationLogs: NotificationLog[];
  onOpenApprovalModal: (vacancy: GovVacancy) => void;
  onApproveVacancy: (vacancyId: string) => Promise<any>;
  onSaveSettings: (settings: Partial<AutomationSettings>) => Promise<any>;
  onTriggerNotification: (vacancyId: string) => Promise<any>;
  onRefreshLogs?: () => void;
}

export const AdminApprovalTab: React.FC<AdminApprovalTabProps> = ({
  vacancies,
  settings,
  notificationLogs,
  onOpenApprovalModal,
  onApproveVacancy,
  onSaveSettings,
  onTriggerNotification,
  onRefreshLogs,
}) => {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Settings form
  const [adminEmail, setAdminEmail] = useState(
    settings?.adminApproval?.adminEmail || 'shadabsarwar@gmail.com'
  );
  const [adminWhatsApp, setAdminWhatsApp] = useState(
    settings?.adminApproval?.adminWhatsApp || '+919948900368'
  );
  const [emailNotifyEnabled, setEmailNotifyEnabled] = useState(
    settings?.adminApproval?.emailNotifyEnabled ?? true
  );
  const [whatsappNotifyEnabled, setWhatsappNotifyEnabled] = useState(
    settings?.adminApproval?.whatsappNotifyEnabled ?? true
  );
  const [requireAdminApproval, setRequireAdminApproval] = useState(
    settings?.adminApproval?.requireAdminApproval ?? true
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // WhatsApp Testing State
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);
  const [testResult, setTestResult] = useState<{
    phone: string;
    message: string;
    directWhatsAppUrl: string;
    webWhatsAppUrl: string;
  } | null>(null);
  const [testCopied, setTestCopied] = useState(false);

  // Email Testing & SMTP State
  const [smtpHost, setSmtpHost] = useState(settings?.adminApproval?.smtpHost || '');
  const [smtpPort, setSmtpPort] = useState(
    settings?.adminApproval?.smtpPort ? String(settings.adminApproval.smtpPort) : '465'
  );
  const [smtpUser, setSmtpUser] = useState(settings?.adminApproval?.smtpUser || '');
  const [smtpPass, setSmtpPass] = useState(settings?.adminApproval?.smtpPass || '');
  const [smtpSecure, setSmtpSecure] = useState(settings?.adminApproval?.smtpSecure ?? true);
  const [smtpFrom, setSmtpFrom] = useState(settings?.adminApproval?.smtpFrom || '');
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  const [isVerifyingSmtp, setIsVerifyingSmtp] = useState(false);
  const [smtpVerifyResult, setSmtpVerifyResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<{
    email: string;
    smtpConfigured: boolean;
    smtpDelivered: boolean;
    subject: string;
    text: string;
    html: string;
    gmailComposeUrl: string;
    mailtoUrl: string;
    details: string;
    error?: string;
  } | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [showEmailHtmlModal, setShowEmailHtmlModal] = useState(false);

  const handleTestWhatsApp = async (phoneToTest?: string) => {
    setIsTestingWhatsApp(true);
    try {
      const res = await fetch('/api/test-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneToTest || adminWhatsApp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult(data.result);
        if (onRefreshLogs) onRefreshLogs();
      }
    } catch (err: any) {
      console.error('Failed to test WhatsApp:', err);
    } finally {
      setIsTestingWhatsApp(false);
    }
  };

  const handleTestEmail = async (emailToTest?: string) => {
    setIsTestingEmail(true);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToTest || adminEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailTestResult(data.result);
        if (onRefreshLogs) onRefreshLogs();
      }
    } catch (err: any) {
      console.error('Failed to test Email:', err);
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleVerifySmtp = async () => {
    setIsVerifyingSmtp(true);
    setSmtpVerifyResult(null);
    try {
      const res = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost,
          smtpPort: smtpPort ? parseInt(smtpPort, 10) : undefined,
          smtpUser,
          smtpPass,
          smtpSecure,
          smtpFrom,
        }),
      });
      const data = await res.json();
      setSmtpVerifyResult(data);
    } catch (err: any) {
      setSmtpVerifyResult({ success: false, message: `Verification failed: ${err.message}` });
    } finally {
      setIsVerifyingSmtp(false);
    }
  };

  const applySmtpPreset = (preset: 'gmail' | 'esc' | 'brevo') => {
    if (preset === 'gmail') {
      setSmtpHost('smtp.gmail.com');
      setSmtpPort('465');
      setSmtpSecure(true);
      setSmtpUser(adminEmail || 'shadabsarwar@gmail.com');
      setSmtpFrom(`"ESC Kolkata Surveillance" <${adminEmail || 'shadabsarwar@gmail.com'}>`);
    } else if (preset === 'esc') {
      setSmtpHost('mail.esckolkata2003.org');
      setSmtpPort('465');
      setSmtpSecure(true);
      setSmtpUser('notifications@esckolkata2003.org');
      setSmtpFrom('"ESC Kolkata Exam Radar" <notifications@esckolkata2003.org>');
    } else if (preset === 'brevo') {
      setSmtpHost('smtp-relay.brevo.com');
      setSmtpPort('587');
      setSmtpSecure(false);
      setSmtpFrom(`"ESC Kolkata Radar" <${adminEmail || 'shadabsarwar@gmail.com'}>`);
    }
  };

  const pendingApprovalVacancies = vacancies.filter(
    (v) => v.approvalStatus === 'pending_approval'
  );
  const approvedVacancies = vacancies.filter(
    (v) => v.approvalStatus === 'approved' || v.approvalStatus === 'auto_approved'
  );

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await onApproveVacancy(id);
    } finally {
      setApprovingId(null);
    }
  };

  const handleNotify = async (id: string) => {
    setNotifyingId(id);
    try {
      await onTriggerNotification(id);
    } finally {
      setNotifyingId(null);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const hasSmtp = Boolean(smtpHost && smtpUser && smtpPass);
      await onSaveSettings({
        adminApproval: {
          adminEmail,
          adminWhatsApp,
          emailNotifyEnabled,
          whatsappNotifyEnabled,
          requireAdminApproval,
          emailGatewayType: hasSmtp ? 'smtp' : 'direct_link',
          smtpHost: smtpHost.trim() || undefined,
          smtpPort: smtpPort ? parseInt(smtpPort, 10) : undefined,
          smtpUser: smtpUser.trim() || undefined,
          smtpPass: smtpPass.trim() || undefined,
          smtpSecure,
          smtpFrom: smtpFrom.trim() || undefined,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Admin Publishing Gate &amp; Notification Relay
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Email &amp; WhatsApp Approval Queue
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              When the surveillance radar detects newly announced vacancies (SSC, Bank PO, Income Tax, WBPSC, Police), GovJobAutoPulse notifies you immediately via <strong>Email ({adminEmail})</strong> and <strong>WhatsApp ({adminWhatsApp})</strong> with a 1-click button to approve and publish to <strong>esckolkata2003.org</strong>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-xs shrink-0 space-y-1">
            <div>
              <span className="text-slate-300">Approval Gate: </span>
              <strong className="text-emerald-300">{requireAdminApproval ? 'Active (Requires Admin Sign-off)' : 'Bypass'}</strong>
            </div>
            <div>
              <span className="text-slate-300">Target Site: </span>
              <strong className="text-white">esckolkata2003.org</strong>
            </div>
          </div>
        </div>

        {/* Quick Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Pending Admin Sign-Off:</span>
            <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">
              {pendingApprovalVacancies.length} Exams
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Approved &amp; Published:</span>
            <span className="text-xl font-extrabold text-emerald-300 mt-0.5 block">
              {approvedVacancies.length} Exams
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 block font-medium">Email Dispatch:</span>
              <button
                type="button"
                onClick={() => handleTestEmail()}
                disabled={isTestingEmail}
                className="text-[10px] text-blue-300 hover:text-white underline font-bold cursor-pointer transition disabled:opacity-50"
              >
                {isTestingEmail ? 'Testing...' : 'Test Now'}
              </button>
            </div>
            <span className="font-bold text-white mt-0.5 block truncate">
              {adminEmail}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 block font-medium">WhatsApp Dispatch:</span>
              <button
                type="button"
                onClick={() => handleTestWhatsApp()}
                disabled={isTestingWhatsApp}
                className="text-[10px] text-emerald-300 hover:text-white underline font-bold cursor-pointer transition disabled:opacity-50"
              >
                {isTestingWhatsApp ? 'Testing...' : 'Test Now'}
              </button>
            </div>
            <span className="font-bold text-emerald-400 mt-0.5 block">
              {adminWhatsApp}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending Admin Approval Queue ({pendingApprovalVacancies.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Exam notifications awaiting your sign-off before being published to esckolkata2003.org
            </p>
          </div>
        </div>

        {pendingApprovalVacancies.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">All Clear! No Pending Approvals</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              All discovered vacancies have either been reviewed or published to the website.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApprovalVacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        vacancy.jurisdiction === 'West Bengal'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {vacancy.jurisdiction === 'West Bengal' ? '🏛️ West Bengal' : '🇮🇳 Central'}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {vacancy.shortName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      {typeof vacancy.vacanciesCount === 'number'
                        ? `${vacancy.vacanciesCount.toLocaleString()} Posts`
                        : `${vacancy.vacanciesCount} Posts`}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs line-clamp-1">{vacancy.title}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>Pay: <strong>{vacancy.salaryScale}</strong></span>
                    <span>Deadline: <strong className="text-rose-600">{vacancy.lastDate}</strong></span>
                    <span>Eligibility: <strong>{vacancy.qualificationLevel}</strong></span>
                  </div>
                </div>

                {/* Approval Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => onOpenApprovalModal(vacancy)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inspect Notification</span>
                  </button>

                  <button
                    onClick={() => handleNotify(vacancy.id)}
                    disabled={notifyingId === vacancy.id}
                    title="Send instant notification email & WhatsApp to admin"
                    className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    {notifyingId === vacancy.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Mail className="w-3.5 h-3.5" />
                    )}
                    <span>Dispatch Alert</span>
                  </button>

                  <button
                    onClick={() => handleApprove(vacancy.id)}
                    disabled={approvingId === vacancy.id}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    {approvingId === vacancy.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Approve &amp; Publish Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Notification Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Admin Notification &amp; Delivery Channel Preferences
          </h3>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 text-sm block">
                Require Admin Approval Before Publishing
              </span>
              <span className="text-slate-500">
                When enabled, newly discovered notices stay in "Pending Approval" until you click Approve via Email, WhatsApp, or this dashboard.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={requireAdminApproval}
                onChange={(e) => setRequireAdminApproval(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Admin Notification Email
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifyEnabled}
                    onChange={(e) => setEmailNotifyEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded"
                  />
                  <span className="text-[11px] text-slate-600 font-semibold">Enabled</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="shadabsarwar@gmail.com"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleTestEmail()}
                  disabled={isTestingEmail}
                  className="px-3.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition disabled:opacity-50 cursor-pointer"
                  title="Dispatch instant test email notification to verify delivery"
                >
                  {isTestingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Mail className="w-3.5 h-3.5" />
                  )}
                  <span>Test Email</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-slate-500">
                  Receives responsive HTML emails with 1-click approval buttons
                </span>
                <button
                  type="button"
                  onClick={() => setShowSmtpConfig(!showSmtpConfig)}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{showSmtpConfig ? 'Hide SMTP Settings' : 'Configure SMTP / Gmail'}</span>
                  {showSmtpConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  Admin WhatsApp Mobile Number
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappNotifyEnabled}
                    onChange={(e) => setWhatsappNotifyEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span className="text-[11px] text-slate-600 font-semibold">Enabled</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={adminWhatsApp}
                  onChange={(e) => setAdminWhatsApp(e.target.value)}
                  placeholder="+919948900368"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleTestWhatsApp()}
                  disabled={isTestingWhatsApp}
                  className="px-3.5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition disabled:opacity-50 cursor-pointer"
                  title="Dispatch instant test WhatsApp notification to verify mobile number"
                >
                  {isTestingWhatsApp ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Test Mobile</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Receives WhatsApp alerts with instant tap-to-approve links. Click "Test Mobile" to test notification to {adminWhatsApp}.
              </span>
            </div>
          </div>

          {/* Active WhatsApp Test Result Card */}
          {testResult && (
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/80 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      WhatsApp Test Alert Sent &amp; Logged for {testResult.phone}
                    </h4>
                    <span className="text-[10px] text-emerald-700">
                      Channel active &bull; You can launch WhatsApp directly on this phone number or open WhatsApp Web
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTestResult(null)}
                  className="text-emerald-700 hover:text-emerald-950 text-xs font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Message preview */}
              <div className="mt-3 p-3 bg-slate-900 text-emerald-300 rounded-lg text-[11px] font-mono whitespace-pre-wrap border border-slate-800 max-h-48 overflow-y-auto">
                {testResult.message}
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-emerald-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(testResult.message);
                    setTestCopied(true);
                    setTimeout(() => setTestCopied(false), 2500);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-semibold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                >
                  {testCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{testCopied ? 'Copied Message!' : 'Copy Text'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={testResult.directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Open WhatsApp App ({testResult.phone})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={testResult.webWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1 transition"
                  >
                    <span>WhatsApp Web</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Active Email Test Result Card */}
          {emailTestResult && (
            <div
              className={`p-4 rounded-xl border shadow-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
                emailTestResult.smtpDelivered
                  ? 'border-emerald-300 bg-emerald-50/80'
                  : 'border-blue-300 bg-blue-50/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs ${
                      emailTestResult.smtpDelivered ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}
                  >
                    {emailTestResult.smtpDelivered ? '✓' : '✉'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {emailTestResult.smtpDelivered
                        ? `Live Email Delivered via SMTP to ${emailTestResult.email}`
                        : `Admin Approval Email Ready for ${emailTestResult.email}`}
                    </h4>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {emailTestResult.smtpDelivered
                        ? `Message ID: ${emailTestResult.details}. Check your inbox for the 1-click approval button.`
                        : emailTestResult.details}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEmailTestResult(null)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Email Content Summary Box */}
              <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-700">Subject: {emailTestResult.subject}</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                    Recipient: {emailTestResult.email}
                  </span>
                </div>
                <div className="font-mono text-slate-700 bg-slate-50 p-2 rounded text-[10px] whitespace-pre-wrap max-h-32 overflow-y-auto border border-slate-100">
                  {emailTestResult.text}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(emailTestResult.text);
                      setEmailCopied(true);
                      setTimeout(() => setEmailCopied(false), 2500);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                  >
                    {emailCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{emailCopied ? 'Copied Text!' : 'Copy Email'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEmailHtmlModal(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview HTML Render</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={emailTestResult.gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow-xs transition"
                    title="Open pre-filled test message directly in Gmail Webmail"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Gmail (Webmail)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={emailTestResult.mailtoUrl}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1 transition"
                  >
                    <span>Mail Client</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {!emailTestResult.smtpDelivered && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowSmtpConfig(true);
                        if (!smtpHost) applySmtpPreset('gmail');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Server className="w-3.5 h-3.5" />
                      <span>Configure Gmail SMTP</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Expandable SMTP / Gmail Delivery Configuration Panel */}
          {showSmtpConfig && (
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Live SMTP / Gmail Inbox Delivery Configuration
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure your mail server so incoming notices are delivered straight to <strong>{adminEmail}</strong> automatically.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applySmtpPreset('gmail')}
                    className="px-2 py-0.5 rounded bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold cursor-pointer transition shadow-2xs"
                  >
                    Gmail
                  </button>
                  <button
                    type="button"
                    onClick={() => applySmtpPreset('esc')}
                    className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold cursor-pointer transition shadow-2xs"
                  >
                    ESC Webmail
                  </button>
                  <button
                    type="button"
                    onClick={() => applySmtpPreset('brevo')}
                    className="px-2 py-0.5 rounded bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold cursor-pointer transition shadow-2xs"
                  >
                    Brevo
                  </button>
                </div>
              </div>

              {/* Google App Password Guide callout */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Important Notice for Gmail (@gmail.com) accounts:</span>
                  <p className="leading-relaxed">
                    Google security rejects your standard personal account login password. To enable automated mail delivery:
                  </p>
                  <ol className="list-decimal pl-4 space-y-0.5 text-[10.5px]">
                    <li>Go to your Google Account at <strong>myaccount.google.com/apppasswords</strong></li>
                    <li>Ensure 2-Step Verification is turned on, then generate an <strong>App Password</strong> (Name: <em>GovJobAutoPulse</em>)</li>
                    <li>Copy the 16-character code (e.g. <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">abcd efgh ijkl mnop</code>) and paste it into <strong>SMTP Password / App Password</strong> below.</li>
                  </ol>
                </div>
              </div>

              {/* SMTP Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    SMTP Host / Server
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="465 (SSL) or 587 (TLS)"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    SSL / TLS Security
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-white border border-slate-300 rounded-lg cursor-pointer h-[38px]">
                    <input
                      type="checkbox"
                      checked={smtpSecure}
                      onChange={(e) => setSmtpSecure(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Use SSL (Port 465)
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    SMTP Username / Sender Email
                  </label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder={adminEmail || 'shadabsarwar@gmail.com'}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    SMTP Password / 16-Char App Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSmtpPassword ? 'text' : 'password'}
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full p-2 pr-9 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showSmtpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Custom From Header (Optional)
                  </label>
                  <input
                    type="text"
                    value={smtpFrom}
                    onChange={(e) => setSmtpFrom(e.target.value)}
                    placeholder='"ESC Kolkata Radar" <notifications@esckolkata2003.org>'
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Verify SMTP Connection Button & Feedback */}
              <div className="flex items-center justify-between pt-2 border-t border-indigo-200/80">
                <div className="text-xs">
                  {smtpVerifyResult && (
                    <span
                      className={`font-semibold flex items-center gap-1.5 ${
                        smtpVerifyResult.success ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {smtpVerifyResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{smtpVerifyResult.message}</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifySmtp}
                  disabled={isVerifyingSmtp || !smtpHost || !smtpUser || !smtpPass}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-indigo-300 hover:bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  {isVerifyingSmtp ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span>Test SMTP Connection</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved!
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Approval Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Dispatch Audit History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Admin Alert Dispatch History ({notificationLogs.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Record of email and WhatsApp notifications triggered to the admin
            </p>
          </div>
        </div>

        {notificationLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No notification dispatches logged yet. Click "Dispatch Alert" on any pending exam above.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {notificationLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.vacancyTitle}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        log.channel === 'both'
                          ? 'bg-purple-100 text-purple-800'
                          : log.channel === 'email'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {log.channel === 'both' ? 'Email + WhatsApp' : log.channel.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    To: {log.recipientEmail} • {log.recipientWhatsApp} • {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyUrl(log.approvalUrl, log.id)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink === log.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink === log.id ? 'Copied' : 'Copy Approval Link'}</span>
                  </button>

                  <a
                    href={log.approvalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email HTML Preview Modal */}
      {showEmailHtmlModal && emailTestResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Email HTML Preview for {emailTestResult.email}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailHtmlModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-slate-100">
              <div
                className="bg-white rounded-xl shadow-xs overflow-hidden"
                dangerouslySetInnerHTML={{ __html: emailTestResult.html }}
              />
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Subject: {emailTestResult.subject}
              </span>
              <button
                type="button"
                onClick={() => setShowEmailHtmlModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
