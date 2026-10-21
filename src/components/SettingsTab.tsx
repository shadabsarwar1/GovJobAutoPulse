import React, { useState } from 'react';
import {
  Globe,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Radio,
  ExternalLink,
  ShieldAlert,
  Webhook,
  Building,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { AutomationSettings, SystemStatus } from '../types/index.js';

interface SettingsTabProps {
  settings: AutomationSettings;
  status: SystemStatus | null;
  onSaveSettings: (newSettings: Partial<AutomationSettings>) => Promise<any>;
  onTestConnection: () => Promise<any>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  status,
  onSaveSettings,
  onTestConnection,
}) => {
  const [formData, setFormData] = useState<AutomationSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    siteName?: string;
    description?: string;
    error?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPasswordGuide, setShowPasswordGuide] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        connected: false,
        error: err.message || 'Connection test failed.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/50 border border-blue-400/30 flex items-center justify-center">
              <Globe className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">esckolkata2003.org Website Integration</h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Configure direct publishing via native WordPress REST API and automated webhooks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
            <span>Test Connection to esckolkata2003.org</span>
          </button>
        </div>

        {/* Live Test Status output */}
        {testResult && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs border ${
              testResult.connected
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                : 'bg-amber-500/20 border-amber-400/40 text-amber-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {testResult.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">
                  {testResult.connected
                    ? `Connected to ${testResult.siteName || 'esckolkata2003.org'}!`
                    : 'Simulation & Diagnostic Mode Active'}
                </div>
                <div className="mt-1 opacity-90">
                  {testResult.connected
                    ? 'WordPress REST API endpoints (/wp-json/wp/v2/posts) are responsive and ready to accept posts.'
                    : testResult.error}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: WordPress Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">WordPress REST API Credentials</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordGuide(!showPasswordGuide)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showPasswordGuide ? 'Hide App Password Guide' : 'How to get Application Password?'}</span>
            </button>
          </div>

          {/* Guide Box */}
          {showPasswordGuide && (
            <div className="p-4 mb-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
              <h4 className="font-bold text-blue-950 flex items-center gap-1">
                <span>🔐 Generating an Application Password in WordPress (Takes 30 seconds):</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 ml-1">
                <li>Log in to your website admin dashboard: <code className="bg-blue-100 px-1 py-0.5 rounded">https://esckolkata2003.org/wp-admin</code></li>
                <li>Go to <strong>Users &gt; Profile</strong> (or <strong>Edit User</strong>).</li>
                <li>Scroll down to the <strong>Application Passwords</strong> section.</li>
                <li>Enter a name like <code className="bg-blue-100 px-1 py-0.5 rounded">GovJobAutoPulse</code> and click <strong>Add New Application Password</strong>.</li>
                <li>Copy the generated 24-character code (e.g. <code className="bg-blue-100 px-1 py-0.5 rounded">xxxx xxxx xxxx xxxx</code>) and paste it below.</li>
              </ol>
              <p className="text-[11px] text-blue-800 italic">
                * Note: Application Passwords do not share your actual admin login password and can be revoked anytime.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Website URL</label>
              <input
                type="url"
                value={formData.siteUrl}
                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://esckolkata2003.org"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WordPress Posts REST Endpoint</label>
              <input
                type="url"
                value={formData.wpApiEndpoint}
                onChange={(e) => setFormData({ ...formData, wpApiEndpoint: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://esckolkata2003.org/wp-json/wp/v2/posts"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WordPress Username / Author</label>
              <input
                type="text"
                value={formData.wpUsername}
                onChange={(e) => setFormData({ ...formData, wpUsername: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="admin or author username"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WordPress Application Password</label>
              <input
                type="password"
                value={formData.wpAppPassword}
                onChange={(e) => setFormData({ ...formData, wpAppPassword: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Paste Application Password (e.g. abcd efgh ijkl mnop)"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                If left empty, system runs in Verified Simulation Mode with one-click Gutenberg copy.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Automation & Publishing Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <Radio className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Automation & Publication Mode</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-sm block">Auto-Publish to esckolkata2003.org</span>
                <span className="text-slate-500">
                  When enabled, newly discovered exam notices are automatically formatted and pushed directly to WordPress.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoPublish}
                  onChange={(e) => setFormData({ ...formData, autoPublish: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Default Post Status on Website</label>
                <select
                  value={formData.postStatus}
                  onChange={(e) => setFormData({ ...formData, postStatus: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="draft">Draft (Safe mode - review in WordPress before publishing)</option>
                  <option value="publish">Publish (Goes live immediately on esckolkata2003.org)</option>
                  <option value="pending">Pending Review (Marked for editorial approval)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Auto-Surveillance Scan Frequency</label>
                <select
                  value={formData.autoScanInterval}
                  onChange={(e) => setFormData({ ...formData, autoScanInterval: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value={15}>Every 15 Minutes (High Priority / Fast Breaking)</option>
                  <option value={30}>Every 30 Minutes</option>
                  <option value={60}>Every 1 Hour (Standard)</option>
                  <option value={360}>Every 6 Hours</option>
                  <option value={1440}>Every 24 Hours</option>
                </select>
              </div>
            </div>

            {/* External Webhook */}
            <div className="pt-2">
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Webhook className="w-3.5 h-3.5 text-purple-600" />
                Optional Webhook Relay (Zapier, Make, n8n, or Custom CMS):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
                <label className="flex items-center gap-1.5 shrink-0 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.webhookEnabled}
                    onChange={(e) => setFormData({ ...formData, webhookEnabled: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Enable</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: ESC Kolkata Educator & Institute Branding */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <Building className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">ESC Kolkata Branding in Generated Articles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Institute Name</label>
              <input
                type="text"
                value={formData.escBranding.instituteName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    escBranding: { ...formData.escBranding, instituteName: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={formData.escBranding.tagline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    escBranding: { ...formData.escBranding, tagline: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kolkata Contact Phone / Helplines</label>
              <input
                type="text"
                value={formData.escBranding.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    escBranding: { ...formData.escBranding, phone: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Student Channel Link</label>
              <input
                type="text"
                value={formData.escBranding.whatsappChannel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    escBranding: { ...formData.escBranding, whatsappChannel: e.target.value },
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.escBranding.includeStudyBatchCTA}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      escBranding: { ...formData.escBranding, includeStudyBatchCTA: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-semibold text-slate-800">
                  Include ESC Kolkata Classroom & Online Batch Call-to-Action in every article
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess && (
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings saved successfully! Automation active.</span>
            </div>
          )}
          {!saveSuccess && <div />}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Automation Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
