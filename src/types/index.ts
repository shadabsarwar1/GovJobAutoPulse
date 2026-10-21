export interface ExamSyllabusTopic {
  subject: string;
  questions: number;
  marks: number;
  duration?: string;
  keyTopics: string;
}

export interface EscKolkataGuidance {
  strategyTips: string[];
  recommendedBatch: string;
  cutoffTrend: string;
  freeMaterialLink?: string;
}

export interface GeneratedPost {
  title: string;
  slug: string;
  excerpt: string;
  htmlContent: string;
  markdownContent: string;
  categories: string[];
  tags: string[];
  seoKeywords: string[];
  whatsAppAlert: string;
  telegramAlert: string;
}

export type ExamBoardType =
  // Central Government Authorities
  | 'SSC'
  | 'UPSC'
  | 'IBPS'
  | 'SBI'
  | 'RBI & Financial'
  | 'Income Tax & CBDT'
  | 'CBIC & Customs'
  | 'Railways RRB & RRC'
  | 'EPFO & ESIC'
  | 'Defence (Army/Navy/Air Force/Coast Guard)'
  | 'CAPFs & Central Police'
  | 'Central Teaching (KVS/NVS/EMRS)'
  | 'PSUs & Gate'
  | 'Other Central'
  // West Bengal State Authorities
  | 'WBPSC'
  | 'WB Police (WBPRB & KP)'
  | 'WB School Service (WBSSC)'
  | 'WB Primary Education (WBBPE)'
  | 'WB Health (WBHRB)'
  | 'WB Municipal Service (WBMSC)'
  | 'WB State Depts & Directorates'
  | 'WB PSUs (WBSEDCL/WBPDCL)'
  | 'WB Universities & Institutions'
  | 'WB District & Panchayat (DM/Zilla Parishad)'
  | 'Other West Bengal';

export type ExamCategoryType =
  | 'Central Govt'
  | 'West Bengal Govt'
  | 'Banking & Insurance'
  | 'Taxation, Customs & Labour'
  | 'Railways & Transport'
  | 'Defence & Paramilitary'
  | 'Teaching & Academia'
  | 'Police & Law Enforcement'
  | 'State Administration'
  | 'Municipal & Local Bodies'
  | 'PSU & Engineering';

export interface GovVacancy {
  id: string;
  title: string;
  shortName: string;
  examBoard: ExamBoardType;
  category: ExamCategoryType;
  jurisdiction: 'Central' | 'West Bengal';
  vacanciesCount: number | string;
  salaryScale: string;
  qualification: string;
  qualificationLevel: 'Graduate' | '12th Pass' | '10th Pass' | 'Post Graduate' | 'Engineering' | 'Diploma' | 'Medical / Nursing';
  ageLimit: string;
  startDate: string;
  lastDate: string;
  admitCardDate?: string;
  examDate?: string;
  applicationFee: string;
  officialWebsite: string;
  notificationPdfUrl?: string;
  applyOnlineUrl?: string;
  status: 'active' | 'closing_soon' | 'upcoming' | 'closed';
  syncStatus: 'pending_draft' | 'published_to_site' | 'failed' | 'ignored';
  approvalStatus: 'pending_approval' | 'approved' | 'rejected' | 'auto_approved';
  approvalToken?: string;
  approvedAt?: string;
  approvedBy?: string;
  notificationSentAt?: {
    email?: string;
    whatsapp?: string;
  };
  publishedAt?: string;
  publishedUrl?: string;
  detectedAt: string;
  source: string;
  summary: string;
  keyHighlights: string[];
  selectionProcess: string[];
  syllabusOverview: ExamSyllabusTopic[];
  esckolkataGuidance: EscKolkataGuidance;
  generatedPost?: GeneratedPost;
}

export interface MonitoredPortal {
  id: string;
  name: string;
  jurisdiction: 'Central' | 'West Bengal';
  domain: string;
  url: string;
  category: ExamCategoryType;
  keyExams: string;
  priority: 'High' | 'Standard';
  lastScanned?: string;
}

export interface EscBranding {
  instituteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  whatsappChannel: string;
  telegramChannel: string;
  includeStudyBatchCTA: boolean;
}

export interface AdminApprovalSettings {
  adminEmail: string;
  adminWhatsApp: string;
  emailNotifyEnabled: boolean;
  whatsappNotifyEnabled: boolean;
  requireAdminApproval: boolean; // Must approve before pushing to esckolkata2003.org
  emailGatewayType: 'smtp' | 'webhook' | 'direct_link';
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
  smtpFrom?: string;
  whatsappGatewayUrl?: string;
  whatsappApiKey?: string;
}

export interface AutomationSettings {
  siteUrl: string;
  wpApiEndpoint: string;
  wpUsername: string;
  wpAppPassword: string;
  postStatus: 'publish' | 'draft' | 'pending';
  autoPublish: boolean;
  autoScanInterval: number; // in minutes
  scanSources: string[];
  jurisdictionFilter: 'All' | 'Central Only' | 'West Bengal Only';
  webhookUrl: string;
  webhookEnabled: boolean;
  defaultAuthor: string;
  escBranding: EscBranding;
  adminApproval: AdminApprovalSettings;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  trigger: 'manual' | 'scheduled' | 'custom_input';
  foundCount: number;
  newVacancies: string[];
  status: 'success' | 'partial' | 'error';
  message: string;
}

export interface PublishLog {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  timestamp: string;
  destination: string;
  status: 'success' | 'simulated_success' | 'failed';
  statusCode?: number;
  responseMessage: string;
  postUrl?: string;
}

export interface NotificationLog {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  recipientEmail?: string;
  recipientWhatsApp?: string;
  timestamp: string;
  channel: 'email' | 'whatsapp' | 'both';
  status: 'sent' | 'simulated' | 'failed';
  approvalUrl: string;
  details?: string;
}

export interface SystemStatus {
  isScanning: boolean;
  lastScanTime: string | null;
  totalTracked: number;
  totalPublished: number;
  pendingDrafts: number;
  pendingApprovalCount: number;
  centralCount: number;
  wbCount: number;
  autoScanActive: boolean;
  wpConnectionStatus: 'connected' | 'untested' | 'error' | 'not_configured';
  wpLastChecked?: string;
  wpSiteName?: string;
}
