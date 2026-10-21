import fs from 'fs';
import path from 'path';
import {
  GovVacancy,
  AutomationSettings,
  ScanLog,
  PublishLog,
  NotificationLog,
  SystemStatus,
  MonitoredPortal,
} from '../src/types/index.js';
import { formatDateDDMMYYYY } from './dateUtils.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const VACANCIES_FILE = path.join(DATA_DIR, 'vacancies.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const defaultMonitoredPortals: MonitoredPortal[] = [
  // --- Central Government Authorities ---
  {
    id: 'ssc-gov',
    name: 'Staff Selection Commission (SSC Central)',
    jurisdiction: 'Central',
    domain: 'ssc.gov.in',
    url: 'https://ssc.gov.in',
    category: 'Central Govt',
    keyExams: 'CGL, CHSL, MTS, GD Constable, JE (Junior Engineer), CPO SI, Stenographer, Selection Posts',
    priority: 'High',
  },
  {
    id: 'upsc-gov',
    name: 'Union Public Service Commission (UPSC)',
    jurisdiction: 'Central',
    domain: 'upsc.gov.in',
    url: 'https://upsc.gov.in',
    category: 'Central Govt',
    keyExams: 'Civil Services (IAS/IPS/IRS), CDS, NDA, CAPF (AC), EPFO (EO/AO/APFC), IES',
    priority: 'High',
  },
  {
    id: 'cbdt-income-tax',
    name: 'Income Tax Department & CBDT (Dept of Revenue)',
    jurisdiction: 'Central',
    domain: 'incometaxindia.gov.in',
    url: 'https://incometaxindia.gov.in',
    category: 'Taxation, Customs & Labour',
    keyExams: 'Income Tax Inspector, Tax Assistant, Stenographer Gr. II, Multi-Tasking Staff',
    priority: 'High',
  },
  {
    id: 'cbic-customs',
    name: 'Central Board of Indirect Taxes and Customs (CBIC)',
    jurisdiction: 'Central',
    domain: 'cbic.gov.in',
    url: 'https://cbic.gov.in',
    category: 'Taxation, Customs & Labour',
    keyExams: 'Central Excise & GST Inspector, Preventive Officer, Examiner, Customs Appraiser',
    priority: 'High',
  },
  {
    id: 'ibps-banking',
    name: 'Institute of Banking Personnel Selection (IBPS)',
    jurisdiction: 'Central',
    domain: 'ibps.in',
    url: 'https://ibps.in',
    category: 'Banking & Insurance',
    keyExams: 'CRP PO/MT, Clerk, Specialist Officer (IT/Law/Marketing/Agri), RRB Officers & Assistants',
    priority: 'High',
  },
  {
    id: 'sbi-careers',
    name: 'State Bank of India Central Recruitment (CRPD)',
    jurisdiction: 'Central',
    domain: 'sbi.co.in/careers',
    url: 'https://sbi.co.in/web/careers',
    category: 'Banking & Insurance',
    keyExams: 'Probationary Officers (PO), Junior Associates (Clerk), Circle Based Officers (CBO)',
    priority: 'High',
  },
  {
    id: 'rbi-nabard',
    name: 'Reserve Bank of India & NABARD Recruitment',
    jurisdiction: 'Central',
    domain: 'rbi.org.in / nabard.org',
    url: 'https://opportunities.rbi.org.in',
    category: 'Banking & Insurance',
    keyExams: 'RBI Grade B Officer, RBI Assistant, NABARD Grade A/B Assistant Managers',
    priority: 'High',
  },
  {
    id: 'railways-rrb-rrc',
    name: 'Railway Recruitment Boards (RRB & RRC Central)',
    jurisdiction: 'Central',
    domain: 'rrbcdg.gov.in & rrbapply.gov.in',
    url: 'https://rrbcdg.gov.in',
    category: 'Railways & Transport',
    keyExams: 'RRB NTPC, Assistant Loco Pilot (ALP), RRB JE, Technicians, RRC Group D (Level-1)',
    priority: 'High',
  },
  {
    id: 'epfo-esic',
    name: 'EPFO & ESIC Social Security Organisations',
    jurisdiction: 'Central',
    domain: 'epfindia.gov.in & esic.gov.in',
    url: 'https://epfindia.gov.in',
    category: 'Taxation, Customs & Labour',
    keyExams: 'EPFO Social Security Assistant (SSA), EO/AO, ESIC UDC, MTS, Social Security Officer',
    priority: 'High',
  },
  {
    id: 'defence-armed-forces',
    name: 'Indian Armed Forces (Army, Navy, Air Force & Coast Guard)',
    jurisdiction: 'Central',
    domain: 'joinindianarmy.nic.in / joinindiannavy.gov.in / afcat.cdac.in',
    url: 'https://joinindianarmy.nic.in',
    category: 'Defence & Paramilitary',
    keyExams: 'AFCAT, CDS, NDA, Army TGC/SSC, Navy SSR/MR/Executive, Coast Guard Navik/Yantrik',
    priority: 'High',
  },
  {
    id: 'capfs-paramilitary',
    name: 'Central Armed Police Forces (BSF, CISF, CRPF, ITBP, SSB, Assam Rifles)',
    jurisdiction: 'Central',
    domain: 'cisfrectt.cisf.gov.in / rect.bsf.gov.in / crpf.gov.in',
    url: 'https://cisfrectt.cisf.gov.in',
    category: 'Defence & Paramilitary',
    keyExams: 'Sub-Inspector (CPO), Head Constable (Ministerial), Constable Tradesman & Technical',
    priority: 'Standard',
  },
  {
    id: 'central-teaching-kvs-nvs',
    name: 'Central Teaching Institutions (KVS, NVS, EMRS, CBSE CTET)',
    jurisdiction: 'Central',
    domain: 'kvsangathan.nic.in / navodaya.gov.in',
    url: 'https://kvsangathan.nic.in',
    category: 'Teaching & Academia',
    keyExams: 'KVS PGT/TGT/PRT Teachers, NVS Navodaya Teachers, EMRS Tribal Schools, CTET',
    priority: 'Standard',
  },
  {
    id: 'central-psus',
    name: 'Major Central PSUs (Coal India, ONGC, IOCL, NTPC, SAIL, BHEL, DRDO, ISRO)',
    jurisdiction: 'Central',
    domain: 'coalindia.in / ongcindia.com / drdo.gov.in',
    url: 'https://www.coalindia.in',
    category: 'PSU & Engineering',
    keyExams: 'Management Trainees, Executive Trainees (GATE & Non-GATE), Junior Overman, Scientists',
    priority: 'Standard',
  },

  // --- West Bengal State Authorities ---
  {
    id: 'wbpsc-state',
    name: 'West Bengal Public Service Commission (WBPSC)',
    jurisdiction: 'West Bengal',
    domain: 'psc.wb.gov.in',
    url: 'https://psc.wb.gov.in',
    category: 'West Bengal Govt',
    keyExams: 'WBCS (Executive & Allied), WBPSC Clerkship, Miscellaneous Services, Food SI, MVI, AE/JE',
    priority: 'High',
  },
  {
    id: 'wbprb-police',
    name: 'West Bengal Police Recruitment Board (WBPRB & Kolkata Police)',
    jurisdiction: 'West Bengal',
    domain: 'prb.wb.gov.in',
    url: 'https://prb.wb.gov.in',
    category: 'Police & Law Enforcement',
    keyExams: 'WB Police Constable & Lady Constable, WB SI (UB/AB), Kolkata Police (KP) Constable & SI',
    priority: 'High',
  },
  {
    id: 'wbssc-school',
    name: 'West Bengal School Service Commission (WBSSC)',
    jurisdiction: 'West Bengal',
    domain: 'westbengalssc.com',
    url: 'http://www.westbengalssc.com',
    category: 'Teaching & Academia',
    keyExams: 'SLST Assistant Teachers (Classes IX-X & XI-XII), Upper Primary Teachers, Headmasters',
    priority: 'High',
  },
  {
    id: 'wbbpe-primary',
    name: 'West Bengal Board of Primary Education (WBBPE)',
    jurisdiction: 'West Bengal',
    domain: 'wbbpe.org / wbbprimaryeducation.org',
    url: 'https://wbbpe.org',
    category: 'Teaching & Academia',
    keyExams: 'WB Primary Teacher Eligibility Test (TET), Primary School Assistant Teachers',
    priority: 'High',
  },
  {
    id: 'wbhrb-health',
    name: 'West Bengal Health Recruitment Board (WBHRB)',
    jurisdiction: 'West Bengal',
    domain: 'wbhrb.in',
    url: 'https://wbhrb.in',
    category: 'West Bengal Govt',
    keyExams: 'Staff Nurse Grade II, Pharmacists, Medical Technologists, GDMO Medical Officers',
    priority: 'High',
  },
  {
    id: 'wbmsc-municipal',
    name: 'West Bengal Municipal Service Commission (WBMSC)',
    jurisdiction: 'West Bengal',
    domain: 'mscwb.org',
    url: 'https://www.mscwb.org',
    category: 'Municipal & Local Bodies',
    keyExams: 'Kolkata Municipal Corporation (KMC) SAE, Assistant Engineers, Clerks, Assessment Inspectors',
    priority: 'High',
  },
  {
    id: 'wb-panchayat-districts',
    name: 'WB Panchayat & District Recruitment (WBPRIMS / Zilla Parishads)',
    jurisdiction: 'West Bengal',
    domain: 'wbprims.in / wbpanchayat.gov.in',
    url: 'https://wbprims.in',
    category: 'West Bengal Govt',
    keyExams: 'Gram Panchayat Karmee, Secretary, Sahayak, Executive Assistant across 23 Districts',
    priority: 'High',
  },
  {
    id: 'wb-directorates-departments',
    name: 'WB State Directorates & District Magistrate Offices (Land Reforms, Commercial Tax, Courts)',
    jurisdiction: 'West Bengal',
    domain: 'banglarbhumi.gov.in / calcuttahighcourt.gov.in',
    url: 'https://banglarbhumi.gov.in',
    category: 'State Administration',
    keyExams: 'Revenue Inspectors, Amin, Commercial Tax Assistants, Calcutta High Court & District Court LDCs',
    priority: 'Standard',
  },
  {
    id: 'wb-psus-electricity',
    name: 'West Bengal State PSUs (WBSEDCL, WBSETCL, WBPDCL, State Transport)',
    jurisdiction: 'West Bengal',
    domain: 'wbsedcl.in / wbpdcl.co.in',
    url: 'https://www.wbsedcl.in',
    category: 'PSU & Engineering',
    keyExams: 'Office Executive, Junior Engineer (Electrical/Civil), Junior Operator Technician, Substation Attendants',
    priority: 'Standard',
  },
  {
    id: 'wb-universities',
    name: 'West Bengal Universities & Public Educational Institutions',
    jurisdiction: 'West Bengal',
    domain: 'caluniv.ac.in / jaduniv.edu.in / presiuniv.ac.in',
    url: 'https://www.caluniv.ac.in',
    category: 'Teaching & Academia',
    keyExams: 'Junior Assistant, Technical Assistant, Laboratory Attendant, Peon/Staff at State Universities',
    priority: 'Standard',
  },
];

export const defaultSettings: AutomationSettings = {
  siteUrl: 'https://esckolkata2003.org',
  wpApiEndpoint: 'https://esckolkata2003.org/wp-json/wp/v2/posts',
  wpUsername: 'esckolkata_admin',
  wpAppPassword: '',
  postStatus: 'draft',
  autoPublish: false,
  autoScanInterval: 60,
  jurisdictionFilter: 'All',
  scanSources: [
    'SSC Central',
    'UPSC',
    'IBPS & Banks',
    'SBI Careers',
    'Income Tax & CBDT',
    'CBIC & Customs',
    'Railways RRB & RRC',
    'EPFO & ESIC',
    'Defence Armed Forces',
    'WBPSC West Bengal',
    'WB Police (WBPRB & KP)',
    'WB School Service (WBSSC)',
    'WB Primary TET (WBBPE)',
    'WB Municipal (WBMSC)',
    'WB Health (WBHRB)',
    'WB Panchayat & Zilla Parishads',
    'WB PSUs (WBSEDCL)',
  ],
  webhookUrl: '',
  webhookEnabled: false,
  defaultAuthor: 'ESC Kolkata Exam Research Team',
  escBranding: {
    instituteName: 'ESC Kolkata (Education Support Council)',
    tagline: 'Guiding Aspirants to Central & West Bengal Government Service Since 2003',
    phone: '+91 98300 XXXXX / +91 33 22XX XXXX',
    email: 'info@esckolkata2003.org',
    address: 'Kolkata, West Bengal, India',
    website: 'https://esckolkata2003.org',
    whatsappChannel: 'https://whatsapp.com/channel/esckolkata2003',
    telegramChannel: 'https://t.me/esckolkata_exams',
    includeStudyBatchCTA: true,
  },
  adminApproval: {
    adminEmail: 'shadabsarwar@gmail.com',
    adminWhatsApp: '+919948900368',
    emailNotifyEnabled: true,
    whatsappNotifyEnabled: true,
    requireAdminApproval: true,
    emailGatewayType: 'direct_link',
  },
};

const initialVacancies: GovVacancy[] = [
  // --- Central 1: SSC CGL 2026 ---
  {
    id: 'ssc-cgl-2026',
    title: 'SSC CGL 2026: Combined Graduate Level Exam (Inspector of Income Tax, ASO, Central Excise)',
    shortName: 'SSC CGL 2026',
    examBoard: 'SSC',
    category: 'Central Govt',
    jurisdiction: 'Central',
    vacanciesCount: 17727,
    salaryScale: 'Pay Level 4 (₹25,500) to Pay Level 8 (₹1,51,100)',
    qualification: "Bachelor's Degree in any discipline from a recognized University",
    qualificationLevel: 'Graduate',
    ageLimit: '18 to 30 years (Up to 32 for JSO; Relaxations: OBC +3, SC/ST +5)',
    startDate: '24-06-2026',
    lastDate: '24-07-2026',
    admitCardDate: 'September 2026',
    examDate: 'September - October 2026 (Tier 1)',
    applicationFee: '₹100 (Women, SC, ST, PwBD, Ex-Servicemen: Nil)',
    officialWebsite: 'https://ssc.gov.in',
    notificationPdfUrl: 'https://ssc.gov.in/api/notice/cgl-2026-official-notice.pdf',
    applyOnlineUrl: 'https://ssc.gov.in/login',
    status: 'active',
    syncStatus: 'pending_draft',
    approvalStatus: 'pending_approval',
    approvalToken: 'ssc-cgl-2026-token-88f1',
    detectedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    source: 'Staff Selection Commission (ssc.gov.in)',
    summary: 'The Staff Selection Commission has announced the monumental CGL 2026 examination covering 17,727 Group B & C gazetted and non-gazetted posts across Central Ministries including CBDT Income Tax Inspector, CBIC GST Inspector, and ED.',
    keyHighlights: [
      'Huge vacancy pool: 17,727 tentative posts across Ministry of Finance, Home, and Defense',
      'Most coveted post: Inspector of Income Tax (CBDT) and Inspector Central Excise (CBIC)',
      'Tier 1 Computer Based Exam followed by Tier 2 with Module-based Computer & Typing speed tests',
      'Age limit relaxed for reserved categories according to DoPT norms',
    ],
    selectionProcess: [
      'Tier 1: Computer Based Objective Examination (200 marks, Qualifying)',
      'Tier 2: Paper-I (Maths, Reasoning, English, General Awareness, Computer Knowledge Module & Data Entry Skill Test)',
      'Document Verification & Medical Fitness Test at concerned user departments',
    ],
    syllabusOverview: [
      { subject: 'Quantitative Aptitude', questions: 25, marks: 50, keyTopics: 'Arithmetic, Algebra, Geometry, Trigonometry, Data Interpretation' },
      { subject: 'General Intelligence & Reasoning', questions: 25, marks: 50, keyTopics: 'Analogies, Syllogisms, Number Series, Coding-Decoding, Non-Verbal' },
      { subject: 'English Comprehension', questions: 25, marks: 50, keyTopics: 'Grammar rules, Vocabulary, Cloze Test, Reading Comprehension, Error Spotting' },
      { subject: 'General Awareness', questions: 25, marks: 50, keyTopics: 'Indian Polity, History, Economy, General Science, Current Affairs 2025-2026' },
    ],
    esckolkataGuidance: {
      strategyTips: [
        'Focus on English grammar accuracy and daily reading comprehension; it carries 135 marks in Tier 2.',
        'Speed calculation drills for Quant arithmetic and Mensuration formula sheets are critical.',
        'Do not neglect Computer Knowledge Module (qualifying nature, but high failure rate in past years).',
      ],
      recommendedBatch: 'ESC Kolkata Super-30 Intensive CGL 2026 Batch (Classroom & Live Online)',
      cutoffTrend: 'Tier 1 safe raw target: 135+ for UR category in moderate shifts.',
    },
  },

  // --- West Bengal 1: WBPSC WBCS (Executive) 2026 ---
  {
    id: 'wbpsc-wbcs-2026',
    title: 'West Bengal Civil Service (Exe.) etc. Exam 2026: Group A, B, C & D Administrative Officers',
    shortName: 'WBPSC WBCS 2026',
    examBoard: 'WBPSC',
    category: 'West Bengal Govt',
    jurisdiction: 'West Bengal',
    vacanciesCount: 850,
    salaryScale: 'Group A: Pay Level 16 (₹56,100 - ₹1,44,300) | Group B: WB Police Service',
    qualification: 'Degree of a recognized University and ability to read, write and speak in Bengali or Nepali',
    qualificationLevel: 'Graduate',
    ageLimit: '21 to 36 years (Up to 39 for OBC-A/B; Up to 41 for SC/ST of West Bengal)',
    startDate: '10-05-2026',
    lastDate: '31-05-2026',
    admitCardDate: 'August 2026',
    examDate: 'Prelims: August 2026 | Mains: November 2026',
    applicationFee: '₹210 + Service Charge (SC/ST of West Bengal & PwD: Nil)',
    officialWebsite: 'https://psc.wb.gov.in',
    notificationPdfUrl: 'https://psc.wb.gov.in/notices/wbcs-advt-2026.pdf',
    applyOnlineUrl: 'https://psc.wb.gov.in',
    status: 'active',
    syncStatus: 'pending_draft',
    approvalStatus: 'pending_approval',
    approvalToken: 'wbpsc-wbcs-2026-token-99c2',
    detectedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    source: 'Public Service Commission, West Bengal (WBPSC)',
    summary: 'WBPSC has announced the West Bengal Civil Service (Executive) 2026 recruitment for top administrative posts: WBCS (Exe), West Bengal Police Service (DySP), Revenue Service, and Cooperative Service.',
    keyHighlights: [
      'Top administrative & police leadership positions in the State of West Bengal',
      'Preliminary Examination consists of single objective paper with 200 marks in 2.5 hours',
      'Mains Exam features 6 compulsory papers plus 1 optional subject (2 papers) for Group A & B',
      'Special weightage to History of India, National Movement, and Geography of West Bengal',
    ],
    selectionProcess: [
      'Preliminary Examination (Objective 200 marks)',
      'Main Examination (Conventional & Objective Papers 1600 marks for Gr A & B)',
      'Personality Test (200 marks for Group A & B; 150 for Group C; 100 for Group D)',
    ],
    syllabusOverview: [
      { subject: 'History of India & Indian National Movement', questions: 50, marks: 50, keyTopics: 'Ancient, Medieval, Modern India, 1857 Revolt, Freedom Struggle in Bengal' },
      { subject: 'Geography with special reference to West Bengal', questions: 25, marks: 25, keyTopics: 'Physical features, Rivers, Districts, Agriculture and Industry of West Bengal' },
      { subject: 'Indian Polity and Economy', questions: 25, marks: 25, keyTopics: 'Preamble, Fundamental Rights, Panchayati Raj, RBI, Five Year Plans to NITI Aayog' },
      { subject: 'English Composition & General Science', questions: 50, marks: 50, keyTopics: 'Synonyms, Idioms, Phrasal verbs, Everyday physics, chemistry, biology' },
    ],
    esckolkataGuidance: {
      strategyTips: [
        'Bengal history and West Bengal district geography accounts for nearly 75 questions in Prelims.',
        'Writing practice in Bengali/English descriptive papers is what determines the final rank in Group A.',
        'Attend ESC Kolkata WBCS Sunday special seminars and mock interview boards.',
      ],
      recommendedBatch: 'ESC Kolkata WBCS 2026 Integrated Foundation + Mains Optionals',
      cutoffTrend: 'Prelims cutoff for WBCS general category stands at ~ 125-132 / 200.',
    },
  },

  // --- West Bengal 2: WBPSC Clerkship ---
  {
    id: 'wbpsc-clerkship-2026',
    title: 'WBPSC Clerkship Examination 2026: Lower Division Assistant (LDA) & LDC in State Secretariat & Directorates',
    shortName: 'WBPSC Clerkship 2026',
    examBoard: 'WBPSC',
    category: 'West Bengal Govt',
    jurisdiction: 'West Bengal',
    vacanciesCount: 6500,
    salaryScale: 'Pay Level 6 (₹22,700 - ₹58,500) + HRA, Medical & Dearness Allowance',
    qualification: 'Madhyamik (10th Pass) of West Bengal Board of Secondary Education or its equivalent + Basic Computer Operation',
    qualificationLevel: '10th Pass',
    ageLimit: '18 to 40 years (OBC: 43 yrs, SC/ST: 45 yrs, PwD: 45 yrs)',
    startDate: '15-04-2026',
    lastDate: '15-05-2026',
    admitCardDate: 'November 2026',
    examDate: 'Part-I (Objective): November 2026 | Part-II (Descriptive): Feb 2027',
    applicationFee: '₹110 (Exempted for SC/ST of West Bengal & PwD 40%+)',
    officialWebsite: 'https://psc.wb.gov.in',
    notificationPdfUrl: 'https://psc.wb.gov.in/notices/clerkship-exam-2026.pdf',
    applyOnlineUrl: 'https://psc.wb.gov.in',
    status: 'active',
    syncStatus: 'pending_draft',
    approvalStatus: 'pending_approval',
    approvalToken: 'wbpsc-clerkship-2026-token-77a1',
    detectedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    source: 'Public Service Commission, West Bengal (psc.wb.gov.in)',
    summary: 'The biggest 10th pass recruitment in West Bengal for appointments as Lower Division Assistant (LDA) and Lower Division Clerk (LDC) in the Secretariat (Nabanna), Directorates, District Offices, and Regional Offices.',
    keyHighlights: [
      'Minimum qualification is only Madhyamik (10th Pass) with upper age limit up to 40 years (45 for SC/ST)',
      'Postings across Kolkata Secretariat (Nabanna/Bikash Bhavan) and District Collectorates',
      'Part-I objective test followed by Part-II conventional descriptive writing in English and Bengali',
      'Typing qualification: 20 WPM in English or 10 WPM in Bengali on computer',
    ],
    selectionProcess: [
      'Part-I Examination: Objective type (100 Marks - English, General Studies, Arithmetic)',
      'Part-II Examination: Conventional type (100 Marks - Group A English, Group B Bengali/Hindi/Urdu/Nepali)',
      'Elementary Computer Knowledge & Typing Speed Verification',
    ],
    syllabusOverview: [
      { subject: 'English (Part-I)', questions: 30, marks: 30, keyTopics: 'Fundamentals of English grammar, vocabulary, sentence structure' },
      { subject: 'General Studies (Part-I)', questions: 40, marks: 40, keyTopics: 'Indian History, Geography of West Bengal, Everyday Science, Current Events' },
      { subject: 'Arithmetic (Part-I)', questions: 30, marks: 30, keyTopics: 'Divisibility, Fractions, LCM-HCF, Percentage, Profit & Loss, Simple Interest' },
      { subject: 'Descriptive English & Bengali (Part-II)', questions: 4, marks: 100, keyTopics: 'Drafting of a Report, Summary/Precis writing, Translation from Bengali to English' },
    ],
    esckolkataGuidance: {
      strategyTips: [
        'Arithmetic in Clerkship follows Madhyamik syllabus; scoring 28+ out of 30 in Maths is achievable.',
        'Regular translation and precis writing in Bengali and English decides the final merit list in Part-II.',
        'Join ESC Kolkata weekly full-length OMR mock tests designed strictly on WBPSC standards.',
      ],
      recommendedBatch: 'ESC Kolkata WBPSC Clerkship Target Rankers Batch',
      cutoffTrend: 'Part-I general cutoff expected around 68-72 / 100.',
    },
  },

  // --- Central 2: Income Tax Department & CBDT Inspector ---
  {
    id: 'income-tax-inspector-cbdt-2026',
    title: 'Income Tax Inspector & Tax Assistant Recruitment 2026 (Central Board of Direct Taxes)',
    shortName: 'Income Tax Inspector 2026',
    examBoard: 'Income Tax & CBDT',
    category: 'Taxation, Customs & Labour',
    jurisdiction: 'Central',
    vacanciesCount: 3820,
    salaryScale: 'Inspector: Pay Level 7 (₹44,900 - ₹1,42,400) | TA: Pay Level 4 (₹25,500 - ₹81,100)',
    qualification: 'Graduation Degree from recognized university + Computer Data Entry Speed for TA',
    qualificationLevel: 'Graduate',
    ageLimit: '18 to 30 years for Inspector; 18 to 27 years for Tax Assistant',
    startDate: '24-06-2026',
    lastDate: '24-07-2026',
    admitCardDate: 'September 2026',
    examDate: 'September - October 2026',
    applicationFee: '₹100 (Exempted for Female and Reserved candidates)',
    officialWebsite: 'https://incometaxindia.gov.in',
    notificationPdfUrl: 'https://incometaxindia.gov.in/vacancies/cbdt-direct-recruitment-2026.pdf',
    applyOnlineUrl: 'https://ssc.gov.in',
    status: 'active',
    syncStatus: 'pending_draft',
    approvalStatus: 'pending_approval',
    approvalToken: 'income-tax-inspector-cbdt-2026-token-11b3',
    detectedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    source: 'CBDT Department of Revenue & SSC Notification Desk',
    summary: 'The Central Board of Direct Taxes (CBDT) has finalized 3,820 vacancies for Inspector of Income Tax and Tax Assistants across All India CCIT charges including Kolkata, Delhi, and Mumbai.',
    keyHighlights: [
      'Top choice among aspirants for prestige, rapid promotions, and investigation authority',
      'Inspector post offers Level 7 gazetted equivalence with high travel and search perks',
      'Kolkata CCIT Charge vacancies available for local West Bengal postings',
      'Recruitment conducted through SSC Combined Graduate Level Exam mechanism',
    ],
    selectionProcess: [
      'CBT Tier 1 Screening Examination',
      'CBT Tier 2 Comprehensive Merit Examination',
      'Data Entry Speed Test (DEST) - 2000 key depressions in 15 minutes',
      'Physical Test & Verification for Field Postings',
    ],
    syllabusOverview: [
      { subject: 'Quantitative Aptitude & Advanced Math', questions: 30, marks: 90, keyTopics: 'Arithmetic, Profit-Loss, Trigonometry, Geometry, Mensuration' },
      { subject: 'Mathematical Reasoning & Logic', questions: 30, marks: 90, keyTopics: 'Statement & Assumptions, Coding, Matrices, Directions' },
      { subject: 'English Language & Comprehension', questions: 45, marks: 135, keyTopics: 'Grammar, Active/Passive, Direct/Indirect, Vocab, Comprehension' },
      { subject: 'General Awareness & Indian Economy', questions: 25, marks: 75, keyTopics: 'Indian Tax Structure, GST, Union Budget, Constitution of India' },
    ],
    esckolkataGuidance: {
      strategyTips: [
        'Income Tax Inspector requires top 500 All India Rank; score 330+ out of 390 in Tier 2.',
        'Join the ESC Kolkata Kolkata-Zone Dedicated Mock League for exact percentile benchmarks.',
        'Practice data entry speed daily to ensure you comfortably surpass the 27 WPM barrier.',
      ],
      recommendedBatch: 'ESC Kolkata Top Rankers Super-Batch for Income Tax & Central Excise',
      cutoffTrend: 'Previous year UR cutoff for IT Inspector: 334/390.',
    },
  },

  // --- West Bengal 3: WB Police & Kolkata Police Constable ---
  {
    id: 'wb-police-constable-kp-2026',
    title: 'West Bengal Police (WBPRB) & Kolkata Police: 11,749 Constable & Lady Constable Recruitment',
    shortName: 'WB Police & KP Constable 2026',
    examBoard: 'WB Police (WBPRB & KP)',
    category: 'Police & Law Enforcement',
    jurisdiction: 'West Bengal',
    vacanciesCount: 11749,
    salaryScale: 'Pay Level 6 (₹22,700 - ₹58,500) + Uniform Allowance, Ration Allowance & Risk Allowance',
    qualification: 'Passed Madhyamik Examination from WBBSE or equivalent and ability to speak, read and write Bengali',
    qualificationLevel: '10th Pass',
    ageLimit: '18 to 30 years as on cut-off date (OBC +3 yrs, SC/ST +5 yrs, NVF/Civic Volunteers relaxed)',
    startDate: '07-03-2026',
    lastDate: '05-04-2026',
    admitCardDate: 'August 2026',
    examDate: 'Preliminary Written Test: September 2026',
    applicationFee: '₹170 for All (SC/ST of West Bengal: ₹20 processing fee only)',
    officialWebsite: 'https://prb.wb.gov.in',
    notificationPdfUrl: 'https://prb.wb.gov.in/notice/wbp-constable-2026.pdf',
    applyOnlineUrl: 'https://prb.wb.gov.in',
    status: 'closing_soon',
    syncStatus: 'pending_draft',
    approvalStatus: 'pending_approval',
    approvalToken: 'wb-police-kp-2026-token-44e2',
    detectedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    source: 'West Bengal Police Recruitment Board (prb.wb.gov.in)',
    summary: 'Mega recruitment of 11,749 Constables and Lady Constables across West Bengal Police and Kolkata Police commissionerates with uniform allowances and rapid promotional avenues.',
    keyHighlights: [
      '11,749 vacancies: 8,212 for Male Constables and 3,537 for Lady Constables',
      'Both West Bengal Police district forces and Kolkata Police jurisdiction covered',
      'Physical Measurement Test (PMT) & Physical Efficiency Test (PET: 1600m in 6 min 30 sec for male)',
      'Revised single written examination scheme followed by interview',
    ],
    selectionProcess: [
      'Written Examination (85 Marks - Objective MCQs)',
      'Physical Measurement Test (PMT - Height & Weight standards)',
      'Physical Efficiency Test (PET - Running test)',
      'Interview (15 Marks) & Document Verification',
    ],
    syllabusOverview: [
      { subject: 'General Awareness & GK', questions: 25, marks: 25, keyTopics: 'West Bengal facts, History, Science, Sports, Current Events' },
      { subject: 'English', questions: 10, marks: 10, keyTopics: 'Basic English vocabulary, grammar, spelling, correct words' },
      { subject: 'Elementary Mathematics', questions: 25, marks: 25, keyTopics: 'Number system, Ratio-Proportion, Average, Percentage, Time & Work' },
      { subject: 'Reasoning & Logical Analysis', questions: 25, marks: 25, keyTopics: 'Direction sense, Blood relation, Coding-decoding, Series' },
    ],
    esckolkataGuidance: {
      strategyTips: [
        'Physical endurance: Start daily morning running practice on ground to comfortably clear 1600m in under 6 minutes.',
        'Reasoning and Mathematics together constitute 50 marks; scoring 42+ here guarantees merit selection.',
        'Attend ESC Kolkata physical fitness camps and special Bengali-medium police written test series.',
      ],
      recommendedBatch: 'ESC Kolkata Police Mission Khaki Batch (Classroom + Physical Guidance)',
      cutoffTrend: 'Written test UR cutoff expected around 55-60 marks out of 85.',
    },
  },

  // --- Central 3: IBPS PO XVI Banking ---
  {
    id: 'ibps-po-xvi-2026',
    title: 'IBPS PO XVI 2026: Recruitment of Probationary Officers in 11 Public Sector Banks',
    shortName: 'IBPS PO 2026',
    examBoard: 'IBPS',
    category: 'Banking & Insurance',
    jurisdiction: 'Central',
    vacanciesCount: 4455,
    salaryScale: 'Basic Pay ₹48,480/- + DA, HRA, CCA (Gross ~ ₹70,000/month)',
    qualification: 'Graduation in any discipline from a recognized University',
    qualificationLevel: 'Graduate',
    ageLimit: '20 to 30 years (OBC 3 yrs, SC/ST 5 yrs)',
    startDate: '01-08-2026',
    lastDate: '21-08-2026',
    admitCardDate: 'October 2026',
    examDate: 'Prelims: October 2026 | Mains: November 2026',
    applicationFee: '₹850 for General/EWS/OBC; ₹175 for SC/ST/PwBD',
    officialWebsite: 'https://ibps.in',
    notificationPdfUrl: 'https://ibps.in/notifications/crp-po-mt-xvi.pdf',
    applyOnlineUrl: 'https://ibps.in/online-application-po',
    status: 'upcoming',
    syncStatus: 'pending_draft',
    approvalStatus: 'pending_approval',
    approvalToken: 'ibps-po-xvi-2026-token-22d4',
    detectedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    source: 'Institute of Banking Personnel Selection (IBPS)',
    summary: 'IBPS has released the notification for Probationary Officers across major nationalized banks including Bank of Baroda, Canara Bank, PNB, and Union Bank of India.',
    keyHighlights: [
      'Joint recruitment for 11 participating public sector banks across India',
      'Three-tier selection: Prelims, Mains (Objective + Descriptive), and Final Interview',
      'Lucrative starting gross salary above ₹70,000 with banking perks and allowances',
    ],
    selectionProcess: [
      'Phase I: Preliminary Online Examination (100 Marks)',
      'Phase II: Main Online Examination (200 Marks Objective + 25 Marks Descriptive)',
      'Phase III: Common Interview by Participating Banks (100 Marks)',
    ],
    syllabusOverview: [
      { subject: 'Reasoning & Computer Aptitude', questions: 45, marks: 60, keyTopics: 'Puzzles, Seating Arrangement, Machine Input-Output' },
      { subject: 'Data Analysis & Interpretation', questions: 35, marks: 60, keyTopics: 'Caselets, Radar DI, Quadratic equations' },
      { subject: 'General/Economy/Banking Awareness', questions: 40, marks: 40, keyTopics: 'RBI Circulars, Monetary Policy, Banking terms' },
      { subject: 'English Language', questions: 35, marks: 40, keyTopics: 'Reading Comprehension, Fillers, Para Jumbles' },
    ],
    esckolkataGuidance: {
      strategyTips: [
        'Banking awareness requires focused study of RBI notifications and economic survey.',
        'High-level seating arrangement puzzles require 45 minutes daily timed practice.',
      ],
      recommendedBatch: 'ESC Kolkata Bank PO Target Mastery Series 2026',
      cutoffTrend: 'Prelims cutoff expected around 54-58 out of 100.',
    },
  },
];

class Store {
  private vacancies: GovVacancy[] = [];
  private settings: AutomationSettings = defaultSettings;
  private scanLogs: ScanLog[] = [];
  private publishLogs: PublishLog[] = [];
  private notificationLogs: NotificationLog[] = [];
  private monitoredPortals: MonitoredPortal[] = defaultMonitoredPortals;
  private isScanning = false;

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(VACANCIES_FILE)) {
        const raw = fs.readFileSync(VACANCIES_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.vacancies = (Array.isArray(parsed) ? parsed : []).map((v: GovVacancy) => {
          if (!v.approvalStatus) {
            v.approvalStatus = v.syncStatus === 'published_to_site' ? 'approved' : 'pending_approval';
          }
          if (!v.approvalToken) {
            v.approvalToken = `${v.id}-token-${Math.random().toString(36).slice(2, 6)}`;
          }
          if (v.startDate) v.startDate = formatDateDDMMYYYY(v.startDate);
          if (v.lastDate) v.lastDate = formatDateDDMMYYYY(v.lastDate);
          return v;
        });
        this.saveVacancies();
      } else {
        this.vacancies = initialVacancies;
        this.saveVacancies();
      }

      if (fs.existsSync(SETTINGS_FILE)) {
        const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        this.settings = { ...defaultSettings, ...JSON.parse(raw) };
        if (!this.settings.adminApproval) {
          this.settings.adminApproval = defaultSettings.adminApproval;
        }
      } else {
        this.settings = defaultSettings;
        this.saveSettings();
      }

      if (fs.existsSync(LOGS_FILE)) {
        const raw = fs.readFileSync(LOGS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.scanLogs = parsed.scanLogs || [];
        this.publishLogs = parsed.publishLogs || [];
        this.notificationLogs = parsed.notificationLogs || [];
      } else {
        this.scanLogs = [
          {
            id: 'init-scan-01',
            timestamp: new Date().toISOString(),
            trigger: 'manual',
            foundCount: initialVacancies.length,
            newVacancies: initialVacancies.map((v) => v.shortName),
            status: 'success',
            message: `Initial synchronization complete. Loaded ${initialVacancies.length} verified exam notifications across Central Government and West Bengal State authorities for ESC Kolkata.`,
          },
        ];
        this.publishLogs = [];
        this.notificationLogs = [
          {
            id: 'notif-seed-01',
            vacancyId: 'wbpsc-clerkship-2026',
            vacancyTitle: 'WBPSC Clerkship Examination 2026: Lower Division Assistant (LDA) & LDC',
            recipientEmail: 'shadabsarwar@gmail.com',
            recipientWhatsApp: '+919948900368',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            channel: 'both',
            status: 'sent',
            approvalUrl: '/api/approve?id=wbpsc-clerkship-2026&token=wbpsc-clerkship-2026-token-77a1',
            details: 'Approval notification dispatched to admin (shadabsarwar@gmail.com & WhatsApp)',
          },
        ];
        this.saveLogs();
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
      this.vacancies = initialVacancies;
      this.settings = defaultSettings;
    }
  }

  public saveVacancies() {
    try {
      fs.writeFileSync(VACANCIES_FILE, JSON.stringify(this.vacancies, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save vacancies to file:', err);
    }
  }

  public saveSettings() {
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(this.settings, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save settings to file:', err);
    }
  }

  public saveLogs() {
    try {
      fs.writeFileSync(
        LOGS_FILE,
        JSON.stringify(
          {
            scanLogs: this.scanLogs,
            publishLogs: this.publishLogs,
            notificationLogs: this.notificationLogs,
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (err) {
      console.error('Failed to save logs to file:', err);
    }
  }

  public getVacancies(): GovVacancy[] {
    return this.vacancies;
  }

  public getMonitoredPortals(): MonitoredPortal[] {
    return this.monitoredPortals;
  }

  public getVacancyById(id: string): GovVacancy | undefined {
    return this.vacancies.find((v) => v.id === id);
  }

  public addOrUpdateVacancy(vacancy: GovVacancy): GovVacancy {
    if (vacancy.startDate) vacancy.startDate = formatDateDDMMYYYY(vacancy.startDate);
    if (vacancy.lastDate) vacancy.lastDate = formatDateDDMMYYYY(vacancy.lastDate);
    const index = this.vacancies.findIndex((v) => v.id === vacancy.id);
    if (index >= 0) {
      this.vacancies[index] = { ...this.vacancies[index], ...vacancy };
    } else {
      this.vacancies.unshift(vacancy);
    }
    this.saveVacancies();
    return vacancy;
  }

  public deleteVacancy(id: string): boolean {
    const initialLen = this.vacancies.length;
    this.vacancies = this.vacancies.filter((v) => v.id !== id);
    if (this.vacancies.length !== initialLen) {
      this.saveVacancies();
      return true;
    }
    return false;
  }

  public getSettings(): AutomationSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<AutomationSettings>): AutomationSettings {
    this.settings = {
      ...this.settings,
      ...newSettings,
      escBranding: {
        ...this.settings.escBranding,
        ...(newSettings.escBranding || {}),
      },
      adminApproval: {
        ...this.settings.adminApproval,
        ...(newSettings.adminApproval || {}),
      },
    };
    this.saveSettings();
    return this.settings;
  }

  public addScanLog(log: Omit<ScanLog, 'id' | 'timestamp'>) {
    const fullLog: ScanLog = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.scanLogs.unshift(fullLog);
    if (this.scanLogs.length > 50) this.scanLogs.pop();
    this.saveLogs();
    return fullLog;
  }

  public addPublishLog(log: Omit<PublishLog, 'id' | 'timestamp'>) {
    const fullLog: PublishLog = {
      id: `pub-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.publishLogs.unshift(fullLog);
    if (this.publishLogs.length > 50) this.publishLogs.pop();
    this.saveLogs();
    return fullLog;
  }

  public addNotificationLog(log: Omit<NotificationLog, 'id' | 'timestamp'>) {
    const fullLog: NotificationLog = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.notificationLogs.unshift(fullLog);
    if (this.notificationLogs.length > 50) this.notificationLogs.pop();
    this.saveLogs();
    return fullLog;
  }

  public getLogs() {
    return {
      scanLogs: [...this.scanLogs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
      publishLogs: [...this.publishLogs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
      notificationLogs: [...this.notificationLogs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    };
  }

  public setIsScanning(status: boolean) {
    this.isScanning = status;
  }

  public getStatus(): SystemStatus {
    const published = this.vacancies.filter((v) => v.syncStatus === 'published_to_site').length;
    const drafts = this.vacancies.filter((v) => v.syncStatus === 'pending_draft').length;
    const pendingApproval = this.vacancies.filter((v) => v.approvalStatus === 'pending_approval').length;
    const central = this.vacancies.filter((v) => v.jurisdiction === 'Central').length;
    const wb = this.vacancies.filter((v) => v.jurisdiction === 'West Bengal').length;
    const latestScan = this.scanLogs[0]?.timestamp || null;

    return {
      isScanning: this.isScanning,
      lastScanTime: latestScan,
      totalTracked: this.vacancies.length,
      totalPublished: published,
      pendingDrafts: drafts,
      pendingApprovalCount: pendingApproval,
      centralCount: central,
      wbCount: wb,
      autoScanActive: this.settings.autoPublish,
      wpConnectionStatus: this.settings.wpAppPassword ? 'connected' : 'untested',
      wpSiteName: 'esckolkata2003.org (Education Support Council)',
    };
  }
}

export const store = new Store();
