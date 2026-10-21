import { GoogleGenAI } from '@google/genai';
import { GovVacancy, GeneratedPost } from '../src/types/index.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function searchLatestGovVacancies(query?: string): Promise<any[]> {
  try {
    const searchQuery =
      query ||
      'Latest Indian government exam notifications and West Bengal state vacancies 2026 SSC CGL CHSL Bank PO SBI RRB Income Tax WBPSC Clerkship WBCS WB Police KMC WBHRB';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are the chief government exam research director for ESC Kolkata (esckolkata2003.org), preparing candidates for Central Government and West Bengal State government examinations.

Surveillance targets:
1. Central Government Authorities:
   - Staff Selection Commission (SSC): CGL, CHSL, MTS, GD, JE, CPO, Stenographer, Selection Posts
   - UPSC: Civil Services (IAS/IPS/IRS), CDS, NDA, CAPF (AC), EPFO (EO/AO/APFC), IES
   - Banking & Financial: IBPS (PO, Clerk, SO, RRB Gramin Bank), SBI (PO, Clerk, CBO), RBI (Grade B, Assistant), NABARD, SEBI, LIC
   - Railways: RRB & RRC (NTPC, ALP, JE, Technicians, Paramedical, Level 1 Group D)
   - Income Tax & CBDT: Income Tax Inspector, Tax Assistant, Stenographer
   - CBIC & Customs: Central Excise & GST Inspector, Preventive Officer, Customs Appraiser
   - EPFO & ESIC: Social Security Assistant (SSA), EO/AO, ESIC UDC, MTS, SSO
   - Defence: Indian Army (Agniveer, TGC), Indian Navy (SSR/MR/Executive), Indian Air Force (AFCAT, Agniveervayu), Indian Coast Guard (Navik/Yantrik)
   - CAPFs: BSF, CISF, CRPF, ITBP, SSB, Assam Rifles
   - Central Teaching: KVS (PGT/TGT/PRT), NVS, EMRS, CTET
   - Major PSUs: Coal India, ONGC, IOCL, NTPC, BHEL, SAIL, DRDO, ISRO

2. West Bengal State Authorities (Kolkata & Districts):
   - West Bengal Public Service Commission (WBPSC): WBCS (Executive & Allied), WBPSC Clerkship, Miscellaneous Services, Food SI, Motor Vehicles Inspector, AE/JE
   - West Bengal Police Recruitment Board (WBPRB & Kolkata Police): WB Police Constable, Lady Constable, Sub-Inspector (UB/AB), KP Constable & SI, Wireless Operator, Excise Constable
   - West Bengal School Service Commission (WBSSC): SLST Assistant Teachers (IX-X, XI-XII), Headmaster
   - West Bengal Board of Primary Education (WBBPE): WB Primary TET & Assistant Teachers
   - West Bengal Health Recruitment Board (WBHRB): Staff Nurse Grade II, Pharmacists, GDMO Medical Officers
   - West Bengal Municipal Service Commission (WBMSC): Kolkata Municipal Corporation (KMC) Sub-Assistant Engineers, Assistant Engineers, Clerks, Assessment Inspectors
   - WB State Departments & Directorates: Land & Land Reforms (Revenue Inspector, Amin), Commercial Taxes, Forest Directorate (Forest Guard), Calcutta High Court & District Court Clerks
   - WB State PSUs: WBSEDCL, WBSETCL, WBPDCL, State Transport (CTC/CSTC/SBSTC)
   - WB Universities: Calcutta University, Jadavpur University, Presidency University (Non-teaching Group C & D)
   - District & Panchayat Recruitment: WBPRIMS Gram Panchayat Karmee, Secretary, Sahayak, Executive Assistant across 23 Districts

Query context: "${searchQuery}".
Current year: 2026.

Return a JSON array of up to 4 real or upcoming notifications matching these categories. Each object MUST include:
- title: string (Formal complete post name)
- shortName: string (Short identifiable name e.g. "WBPSC Clerkship 2026", "SSC CGL 2026", "WB Police Constable 2026")
- examBoard: string (one of: 'SSC', 'UPSC', 'IBPS', 'SBI', 'RBI & Financial', 'Income Tax & CBDT', 'CBIC & Customs', 'Railways RRB & RRC', 'EPFO & ESIC', 'Defence (Army/Navy/Air Force/Coast Guard)', 'CAPFs & Central Police', 'Central Teaching (KVS/NVS/EMRS)', 'PSUs & Gate', 'WBPSC', 'WB Police (WBPRB & KP)', 'WB School Service (WBSSC)', 'WB Primary Education (WBBPE)', 'WB Health (WBHRB)', 'WB Municipal Service (WBMSC)', 'WB State Depts & Directorates', 'WB PSUs (WBSEDCL/WBPDCL)', 'WB Universities & Institutions', 'WB District & Panchayat (DM/Zilla Parishad)')
- category: string ('Central Govt' | 'West Bengal Govt' | 'Banking & Insurance' | 'Taxation, Customs & Labour' | 'Railways & Transport' | 'Defence & Paramilitary' | 'Teaching & Academia' | 'Police & Law Enforcement' | 'State Administration' | 'Municipal & Local Bodies' | 'PSU & Engineering')
- jurisdiction: string ('Central' | 'West Bengal')
- vacanciesCount: number or string (e.g. 6500 or "4,500+")
- salaryScale: string (e.g. "Pay Level 6 (₹22,700 - ₹58,500)")
- qualification: string (e.g. "Madhyamik 10th Pass or Graduation")
- qualificationLevel: string ('Graduate' | '12th Pass' | '10th Pass' | 'Post Graduate' | 'Engineering' | 'Diploma' | 'Medical / Nursing')
- ageLimit: string (e.g. "18 to 40 years for WB; 18-30 for Central")
- startDate: string (YYYY-MM-DD)
- lastDate: string (YYYY-MM-DD)
- admitCardDate: string
- examDate: string
- applicationFee: string
- officialWebsite: string
- notificationPdfUrl: string
- applyOnlineUrl: string
- summary: string (2-3 sentences summary)
- keyHighlights: array of 4 bullet strings
- selectionProcess: array of stage strings
- syllabusOverview: array of { subject: string, questions: number, marks: number, keyTopics: string }
- esckolkataGuidance: object { strategyTips: string[], recommendedBatch: string, cutoffTrend: string }
`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (error) {
    console.error('Error during searchLatestGovVacancies:', error);
    return [];
  }
}

export async function parseRawVacancyNotice(rawText: string): Promise<Partial<GovVacancy>> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: `Analyze this raw government job circular / notification excerpt from either Central Government or West Bengal State Government authorities for ESC Kolkata (esckolkata2003.org):
Text:
"""
${rawText}
"""

Return a single JSON object with these keys:
- title: string
- shortName: string
- examBoard: string (e.g. 'SSC', 'UPSC', 'IBPS', 'SBI', 'Income Tax & CBDT', 'CBIC & Customs', 'Railways RRB & RRC', 'EPFO & ESIC', 'Defence (Army/Navy/Air Force/Coast Guard)', 'CAPFs & Central Police', 'WBPSC', 'WB Police (WBPRB & KP)', 'WB School Service (WBSSC)', 'WB Primary Education (WBBPE)', 'WB Health (WBHRB)', 'WB Municipal Service (WBMSC)', 'WB District & Panchayat (DM/Zilla Parishad)')
- category: string ('Central Govt' | 'West Bengal Govt' | 'Banking & Insurance' | 'Taxation, Customs & Labour' | 'Railways & Transport' | 'Defence & Paramilitary' | 'Teaching & Academia' | 'Police & Law Enforcement' | 'State Administration' | 'Municipal & Local Bodies' | 'PSU & Engineering')
- jurisdiction: string ('Central' | 'West Bengal')
- vacanciesCount: string or number
- salaryScale: string
- qualification: string
- qualificationLevel: string ('Graduate' | '12th Pass' | '10th Pass' | 'Post Graduate' | 'Engineering' | 'Diploma' | 'Medical / Nursing')
- ageLimit: string
- startDate: string (YYYY-MM-DD if found)
- lastDate: string (YYYY-MM-DD if found)
- admitCardDate: string
- examDate: string
- applicationFee: string
- officialWebsite: string
- notificationPdfUrl: string
- applyOnlineUrl: string
- summary: string
- keyHighlights: array of strings
- selectionProcess: array of strings
- syllabusOverview: array of objects { subject: string, questions: number, marks: number, keyTopics: string }
- esckolkataGuidance: object { strategyTips: string[], recommendedBatch: string, cutoffTrend: string }
`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.text || '{}';
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

export async function generateWebsitePost(
  vacancy: GovVacancy,
  instituteName = 'ESC Kolkata',
  websiteUrl = 'https://esckolkata2003.org'
): Promise<GeneratedPost> {
  const isWestBengal = vacancy.jurisdiction === 'West Bengal' || vacancy.category === 'West Bengal Govt';

  const prompt = `You are the chief educator and academic content director at ${instituteName} (${websiteUrl}), located in Kolkata, West Bengal.
Your task is to generate a comprehensive, authoritative, student-centric, SEO-optimized blog article and student alert broadcast for:
"${vacancy.title}".

Jurisdiction: ${vacancy.jurisdiction} (${isWestBengal ? 'West Bengal State & Kolkata' : 'All India Central Government'})
Board: ${vacancy.examBoard}
Category: ${vacancy.category}
Vacancies: ${vacancy.vacanciesCount}
Salary Scale: ${vacancy.salaryScale}
Eligibility: ${vacancy.qualification} (${vacancy.qualificationLevel})
Age Criteria: ${vacancy.ageLimit}
Application Start: ${vacancy.startDate}
Last Date: ${vacancy.lastDate}
Exam Date: ${vacancy.examDate || 'Tentative'}
Official Website: ${vacancy.officialWebsite}
Selection Stages: ${vacancy.selectionProcess.join(', ')}

Requirements:
1. Title: Catchy, authoritative, SEO-rich (e.g. "${vacancy.shortName} Recruitment 2026: ${vacancy.vacanciesCount} Posts Released, Eligibility, Syllabus & Apply Online | ${instituteName}")
2. Slug: Clean URL slug
3. Excerpt: High impact 2 sentences summary highlighting posts, pay scale, and deadline.
4. HTML Content: A beautifully styled HTML body ready for WordPress with:
   - Notice Announcement Badge with jurisdiction tag (${isWestBengal ? '🏛️ West Bengal State Notification' : '🇮🇳 Central Govt Notification'})
   - Quick Overview Table (Recruitment Body, Total Vacancies, Application Dates, Pay Level, Eligibility, Official Link)
   - Detailed Eligibility Breakdown (Age limits, category relaxations for WB SC/ST/OBC-A/OBC-B/General, educational criteria)
   - Post-wise or Department-wise vacancy table
   - Comprehensive Syllabus & Exam Pattern Table (Subjects, marks, question breakdown)
   - Step-by-Step "How to Apply on ${vacancy.officialWebsite}"
   - ${instituteName} Preparation Strategy & Kolkata Classroom / Online Batch Note
   - Callout Box: "${instituteName} Expert Exam Guidance Batch - Contact Kolkata Center (est. 2003)"
   - Official Links Section (Direct Apply URL, Official PDF link)
5. Markdown Content: Full markdown format of the article.
6. WhatsApp Broadcast: A viral, emoji-rich WhatsApp message for student groups with bold headers, bullet dates, and call-to-action link to ${websiteUrl}.
7. Telegram Alert: Clean markdown broadcast for Telegram channel subscribers.
8. Categories: 2-3 relevant categories (e.g. ["${vacancy.jurisdiction === 'West Bengal' ? 'West Bengal Govt Jobs' : 'Central Govt Jobs'}", "${vacancy.examBoard}", "Job Notifications"]).
9. Tags: 5-8 relevant tags.
10. SEO Keywords: 6-10 keywords.

Return ONLY a JSON object with keys:
- title
- slug
- excerpt
- htmlContent
- markdownContent
- categories (array of strings)
- tags (array of strings)
- seoKeywords (array of strings)
- whatsAppAlert (string)
- telegramAlert (string)
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    try {
      return JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn('[Gemini Service] Model unavailable or rate-limited; generating structured fallback post:', err);
    return generateFallbackWebsitePost(vacancy, instituteName, websiteUrl);
  }
}

export function generateFallbackWebsitePost(
  vacancy: GovVacancy,
  instituteName: string,
  websiteUrl: string
): GeneratedPost {
  const isWestBengal = vacancy.jurisdiction === 'West Bengal' || vacancy.category === 'West Bengal Govt';
  const vacancyPosts = typeof vacancy.vacanciesCount === 'number' ? vacancy.vacanciesCount.toLocaleString() : vacancy.vacanciesCount;

  const title = `${vacancy.shortName} Recruitment 2026: ${vacancyPosts} Vacancies, Eligibility, Syllabus & Apply Online | ${instituteName}`;
  const slug = `${vacancy.id}-recruitment-notification-2026`;
  const excerpt = `${vacancy.examBoard} has officially released the notification for ${vacancy.title} featuring ${vacancyPosts} vacancies (${vacancy.salaryScale}). Apply online before ${vacancy.lastDate}.`;

  const syllabusRows = vacancy.syllabusOverview?.map((s) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">${s.subject}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: center;">${s.questions}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600; color: #16a34a;">${s.marks}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">${s.keyTopics}</td>
    </tr>
  `).join('') || '';

  const selectionList = vacancy.selectionProcess?.map((step, idx) => `
    <li style="margin-bottom: 6px;"><strong>Stage ${idx + 1}:</strong> ${step}</li>
  `).join('') || '';

  const tipsList = vacancy.esckolkataGuidance?.strategyTips?.map((tip) => `
    <li style="margin-bottom: 8px;">${tip}</li>
  `).join('') || '';

  const htmlContent = `
<div class="esc-exam-article" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b;">
  <!-- Authority Badge -->
  <div style="display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-bottom: 16px; background-color: ${isWestBengal ? '#dcfce7' : '#dbeafe'}; color: ${isWestBengal ? '#166534' : '#1e40af'}; border: 1px solid ${isWestBengal ? '#86efac' : '#93c5fd'};">
    ${isWestBengal ? '🏛️ West Bengal State Government Notification' : '🇮🇳 Central Government Recruitment Notice'} • ${vacancy.examBoard}
  </div>

  <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 16px;">
    ${title}
  </h1>

  <p style="font-size: 15px; color: #475569; margin-bottom: 24px; line-height: 1.7;">
    ${vacancy.summary}
  </p>

  <!-- Quick Overview Table -->
  <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; border-left: 4px solid #2563eb; padding-left: 12px; margin: 24px 0 16px;">
    1. Key Examination Highlights
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
    <tbody>
      <tr style="background-color: #f8fafc;"><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600; width: 35%;">Recruitment Authority</td><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 700; color: #1e3a8a;">${vacancy.examBoard}</td></tr>
      <tr><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Post Title</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${vacancy.title}</td></tr>
      <tr style="background-color: #f8fafc;"><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Total Vacancies</td><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 700; color: #16a34a;">${vacancyPosts} Posts</td></tr>
      <tr><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Pay Scale / Salary</td><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${vacancy.salaryScale}</td></tr>
      <tr style="background-color: #f8fafc;"><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Educational Qualification</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${vacancy.qualification} (<strong>${vacancy.qualificationLevel}</strong>)</td></tr>
      <tr><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Age Limit</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${vacancy.ageLimit}</td></tr>
      <tr style="background-color: #f8fafc;"><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Application Start Date</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${vacancy.startDate}</td></tr>
      <tr><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Application Last Date</td><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 700; color: #dc2626;">${vacancy.lastDate}</td></tr>
      <tr style="background-color: #f8fafc;"><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Application Fee</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${vacancy.applicationFee}</td></tr>
      <tr><td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">Official Portal</td><td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="${vacancy.officialWebsite}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${vacancy.officialWebsite}</a></td></tr>
    </tbody>
  </table>

  <!-- Selection Process -->
  <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; border-left: 4px solid #2563eb; padding-left: 12px; margin: 24px 0 16px;">
    2. Selection Procedure
  </h2>
  <ol style="padding-left: 20px; font-size: 14px; color: #334155;">
    ${selectionList}
  </ol>

  <!-- Syllabus Pattern -->
  ${syllabusRows ? `
  <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; border-left: 4px solid #2563eb; padding-left: 12px; margin: 24px 0 16px;">
    3. Examination Pattern &amp; Syllabus Overview
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
    <thead>
      <tr style="background-color: #1e293b; color: #ffffff;">
        <th style="padding: 10px; border: 1px solid #334155; text-align: left;">Subject / Module</th>
        <th style="padding: 10px; border: 1px solid #334155; text-align: center;">Questions</th>
        <th style="padding: 10px; border: 1px solid #334155; text-align: center;">Marks</th>
        <th style="padding: 10px; border: 1px solid #334155; text-align: left;">Key Topics to Master</th>
      </tr>
    </thead>
    <tbody>
      ${syllabusRows}
    </tbody>
  </table>
  ` : ''}

  <!-- ESC Kolkata Guidance Box -->
  <div style="background: linear-gradient(to right, #eff6ff, #f0fdf4); border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 28px 0;">
    <h3 style="margin-top: 0; font-size: 16px; font-weight: 800; color: #1e3a8a; display: flex; align-items: center; gap: 8px;">
      🎓 ${instituteName} Preparation Strategy &amp; Cutoff Insights
    </h3>
    <ul style="padding-left: 20px; font-size: 14px; color: #1e293b; margin-bottom: 14px;">
      ${tipsList}
    </ul>
    <p style="font-size: 13px; color: #475569; margin: 0;">
      <strong>Recommended Batch:</strong> ${vacancy.esckolkataGuidance?.recommendedBatch || `${instituteName} Exam Masterclass Series`} |
      <strong>Cutoff Trend:</strong> ${vacancy.esckolkataGuidance?.cutoffTrend || 'Competitive target'}
    </p>
  </div>

  <!-- Official Action Links -->
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; text-align: center; margin-top: 24px;">
    <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">
      Official Application &amp; Notice Links
    </p>
    <div>
      <a href="${vacancy.applyOnlineUrl || vacancy.officialWebsite}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 4px;">
        Apply Online on Official Website
      </a>
      ${vacancy.notificationPdfUrl ? `
      <a href="${vacancy.notificationPdfUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #475569; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 20px; text-decoration: none; border-radius: 8px; margin: 4px;">
        Download Official Notification PDF
      </a>
      ` : ''}
    </div>
  </div>
</div>
`.trim();

  const markdownContent = `
# ${title}

**Authority:** ${vacancy.examBoard} (${isWestBengal ? 'West Bengal State' : 'Central Government'})
**Total Vacancies:** ${vacancyPosts} Posts
**Salary:** ${vacancy.salaryScale}
**Last Date to Apply:** ${vacancy.lastDate}

---

## Examination Overview
${vacancy.summary}

### Key Details Table
- **Exam:** ${vacancy.title}
- **Eligibility:** ${vacancy.qualification} (${vacancy.qualificationLevel})
- **Age Criteria:** ${vacancy.ageLimit}
- **Application Window:** ${vacancy.startDate} to ${vacancy.lastDate}
- **Official Portal:** ${vacancy.officialWebsite}

### Selection Stages
${vacancy.selectionProcess?.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### ${instituteName} Mentorship Note
${vacancy.esckolkataGuidance?.strategyTips?.map((t) => `- ${t}`).join('\n')}

Official Link: ${vacancy.applyOnlineUrl || vacancy.officialWebsite}
Source: Published via ${instituteName} (${websiteUrl})
`.trim();

  const whatsAppAlert = `🚨 *NEW GOVT JOB NOTIFICATION | ${instituteName}* 🚨
━━━━━━━━━━━━━━━━━━━━
📢 *${vacancy.title}*
🏛️ *Authority:* ${vacancy.examBoard} (${isWestBengal ? 'West Bengal' : 'Central'})
🎯 *Total Vacancies:* ${vacancyPosts} Posts
💰 *Pay Scale:* ${vacancy.salaryScale}
🎓 *Eligibility:* ${vacancy.qualification}
⏳ *Last Date to Apply:* ${vacancy.lastDate}

━━━━━━━━━━━━━━━━━━━━
👉 *Full Details, Syllabus & Apply Online:*
🔗 ${websiteUrl}

_Guided by ${instituteName} (Est. 2003) • Kolkata_`;

  const telegramAlert = `📣 **NEW GOVT RECRUITMENT NOTIFICATION**
🏛️ **Authority:** ${vacancy.examBoard} (${isWestBengal ? 'West Bengal' : 'Central'})
📌 **Post:** ${vacancy.title}
👥 **Vacancies:** ${vacancyPosts} Posts
💰 **Pay Scale:** ${vacancy.salaryScale}
🎓 **Eligibility:** ${vacancy.qualification} (${vacancy.qualificationLevel})
⏳ **Deadline:** ${vacancy.lastDate}

🔗 **Read Complete Syllabus & Apply Online:**
${websiteUrl}

_Provided by ${instituteName} Kolkata_`;

  return {
    title,
    slug,
    excerpt,
    htmlContent,
    markdownContent,
    categories: [
      isWestBengal ? 'West Bengal Govt Jobs' : 'Central Govt Jobs',
      vacancy.examBoard,
      'Job Notifications',
    ],
    tags: [
      vacancy.examBoard,
      vacancy.shortName,
      'Govt Vacancies 2026',
      vacancy.qualificationLevel,
      'Sarkari Naukri',
      isWestBengal ? 'West Bengal Jobs' : 'Central Jobs',
    ],
    seoKeywords: [
      `${vacancy.shortName} notification 2026`,
      `${vacancy.examBoard} recruitment apply online`,
      `${vacancy.shortName} eligibility syllabus`,
      'government jobs Kolkata',
      'esckolkata2003 government exam prep',
    ],
    whatsAppAlert,
    telegramAlert,
  };
}

