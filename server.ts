import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { store } from './server/store.js';
import { searchLatestGovVacancies, parseRawVacancyNotice, generateWebsitePost } from './server/geminiService.js';
import { publishPostToWordPress, testWordPressConnection, dispatchWebhook } from './server/publisher.js';
import {
  generateApprovalToken,
  buildAdminApprovalHtmlEmail,
  buildAdminApprovalWhatsAppMessage,
  dispatchAdminNotifications,
  sendTestWhatsAppNotification,
  sendTestEmailNotification,
  verifySmtpConnection,
} from './server/notificationService.js';
import { GovVacancy } from './src/types/index.js';
import { formatDateDDMMYYYY, getTodayDDMMYYYY, getOffsetDateDDMMYYYY } from './server/dateUtils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.use(express.json({ limit: '10mb' }));

// Health / Status endpoint
app.get('/api/status', async (req: Request, res: Response) => {
  try {
    const status = store.getStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Settings endpoints
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(store.getSettings());
});

app.post('/api/settings', (req: Request, res: Response) => {
  try {
    const updated = store.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Monitored portals endpoint
app.get('/api/portals', (req: Request, res: Response) => {
  res.json(store.getMonitoredPortals());
});

// Test WordPress connection to esckolkata2003.org
app.post('/api/test-connection', async (req: Request, res: Response) => {
  try {
    const settings = store.getSettings();
    const result = await testWordPressConnection(settings);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// 1-Click Approval link endpoint (accessed from email or WhatsApp link)
app.get('/api/approve', async (req: Request, res: Response) => {
  try {
    const vacancyId = req.query.id as string;
    const token = req.query.token as string;

    if (!vacancyId) {
      return res.status(400).send('Missing vacancy ID.');
    }

    const vacancy = store.getVacancyById(vacancyId);
    if (!vacancy) {
      return res.status(404).send('Vacancy not found.');
    }

    if (vacancy.approvalToken && token && vacancy.approvalToken !== token) {
      return res.status(403).send('Invalid or expired approval token.');
    }

    const settings = store.getSettings();

    // Mark as approved
    vacancy.approvalStatus = 'approved';
    vacancy.approvedAt = new Date().toISOString();
    vacancy.approvedBy = settings.adminApproval?.adminEmail || 'Admin (1-Click Notification)';

    // Generate post if not already created
    if (!vacancy.generatedPost) {
      vacancy.generatedPost = await generateWebsitePost(
        vacancy,
        settings.escBranding.instituteName,
        settings.siteUrl
      );
    }

    // Immediately publish to esckolkata2003.org!
    const pubResult = await publishPostToWordPress(vacancy, vacancy.generatedPost, settings);

    if (pubResult.success) {
      vacancy.syncStatus = 'published_to_site';
      vacancy.publishedAt = new Date().toISOString();
      vacancy.publishedUrl = pubResult.publishedUrl;
    }
    store.addOrUpdateVacancy(vacancy);

    // Return a sleek confirmation landing page for the admin
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Approved & Published | ESC Kolkata</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 90vh; }
    .card { background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; max-width: 520px; width: 100%; padding: 32px; text-align: center; }
    .icon { width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
    p { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 0 20px; }
    .meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: left; font-size: 13px; margin-bottom: 24px; }
    .meta div { display: flex; justify-content: space-between; padding: 4px 0; }
    .meta strong { color: #0f172a; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 4px; }
    .btn-site { background: #16a34a; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <h1>Approved &amp; Pushed to Website!</h1>
    <p>You have approved <strong>${vacancy.shortName}</strong>. The post has been dispatched directly to <strong>esckolkata2003.org</strong> as <em>${settings.postStatus}</em>.</p>
    
    <div class="meta">
      <div><span>Exam:</span> <strong>${vacancy.title}</strong></div>
      <div><span>Vacancies:</span> <strong>${vacancy.vacanciesCount} Posts</strong></div>
      <div><span>Status on Site:</span> <strong style="color: #16a34a; text-transform: uppercase;">${settings.postStatus}</strong></div>
      <div><span>Approved At:</span> <strong>${new Date().toLocaleTimeString()}</strong></div>
    </div>

    <div>
      <a href="${vacancy.publishedUrl || 'https://esckolkata2003.org'}" target="_blank" class="btn btn-site">View on esckolkata2003.org</a>
      <a href="${APP_URL}" class="btn">Open Admin Dashboard</a>
    </div>
  </div>
</body>
</html>
    `);
  } catch (err: any) {
    res.status(500).send(`Approval error: ${err.message}`);
  }
});

// Reject endpoint
app.get('/api/reject', (req: Request, res: Response) => {
  const vacancyId = req.query.id as string;
  const vacancy = store.getVacancyById(vacancyId);
  if (vacancy) {
    vacancy.approvalStatus = 'rejected';
    store.addOrUpdateVacancy(vacancy);
  }
  res.send(`
    <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #f8fafc;">
      <h2>Notice Dismissed</h2>
      <p>This vacancy will not be published to esckolkata2003.org.</p>
      <a href="${APP_URL}">Return to Dashboard</a>
    </body>
  `);
});

// In-app approve button endpoint
app.post('/api/approve', async (req: Request, res: Response) => {
  try {
    const { vacancyId } = req.body;
    const vacancy = store.getVacancyById(vacancyId);
    if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });

    const settings = store.getSettings();
    vacancy.approvalStatus = 'approved';
    vacancy.approvedAt = new Date().toISOString();
    vacancy.approvedBy = settings.adminApproval?.adminEmail || 'Admin UI';

    if (!vacancy.generatedPost) {
      vacancy.generatedPost = await generateWebsitePost(
        vacancy,
        settings.escBranding.instituteName,
        settings.siteUrl
      );
    }

    const pubResult = await publishPostToWordPress(vacancy, vacancy.generatedPost, settings);

    if (pubResult.success) {
      vacancy.syncStatus = 'published_to_site';
      vacancy.publishedAt = new Date().toISOString();
      vacancy.publishedUrl = pubResult.publishedUrl;
    }
    store.addOrUpdateVacancy(vacancy);

    res.json({ success: true, vacancy, pubResult });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger Notification Dispatch to Admin
app.post('/api/notify-admin', async (req: Request, res: Response) => {
  try {
    const { vacancyId } = req.body;
    const vacancy = store.getVacancyById(vacancyId);
    if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });

    const settings = store.getSettings();
    const result = await dispatchAdminNotifications(vacancy, settings, APP_URL);
    store.addNotificationLog(result.log);

    res.json({ success: true, result, vacancy });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Test Admin WhatsApp Mobile Number Endpoint
app.post('/api/test-whatsapp', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const settings = store.getSettings();
    const targetPhone = phone || settings.adminApproval?.adminWhatsApp || '+919948900368';

    const result = await sendTestWhatsAppNotification(targetPhone, settings, APP_URL);
    store.addNotificationLog(result.log);

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/test-whatsapp', async (req: Request, res: Response) => {
  try {
    const phone = (req.query.phone as string) || undefined;
    const settings = store.getSettings();
    const targetPhone = phone || settings.adminApproval?.adminWhatsApp || '+919948900368';

    const result = await sendTestWhatsAppNotification(targetPhone, settings, APP_URL);
    store.addNotificationLog(result.log);

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Test Admin Email Endpoint (supports real SMTP or 1-click webmail prefill)
app.post('/api/test-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const settings = store.getSettings();
    const targetEmail = email || settings.adminApproval?.adminEmail || 'shadabsarwar@gmail.com';

    const result = await sendTestEmailNotification(targetEmail, settings, APP_URL);
    store.addNotificationLog(result.log);

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/test-email', async (req: Request, res: Response) => {
  try {
    const email = (req.query.email as string) || undefined;
    const settings = store.getSettings();
    const targetEmail = email || settings.adminApproval?.adminEmail || 'shadabsarwar@gmail.com';

    const result = await sendTestEmailNotification(targetEmail, settings, APP_URL);
    store.addNotificationLog(result.log);

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Test SMTP Server Credentials Connection
app.post('/api/test-smtp', async (req: Request, res: Response) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, smtpFrom } = req.body;
    const settings = store.getSettings();
    const testSettings = {
      ...settings,
      adminApproval: {
        ...(settings.adminApproval || {
          adminEmail: 'shadabsarwar@gmail.com',
          adminWhatsApp: '+919948900368',
          emailNotifyEnabled: true,
          whatsappNotifyEnabled: true,
          requireAdminApproval: true,
          emailGatewayType: 'smtp' as const,
        }),
        smtpHost,
        smtpPort: smtpPort ? parseInt(smtpPort, 10) : undefined,
        smtpUser,
        smtpPass,
        smtpSecure: !!smtpSecure,
        smtpFrom,
      },
    };

    const result = await verifySmtpConnection(testSettings);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Preview Notification
app.get('/api/notification-preview/:id', (req: Request, res: Response) => {
  const vacancy = store.getVacancyById(req.params.id);
  if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });

  const token = vacancy.approvalToken || 'sample-token';
  const email = buildAdminApprovalHtmlEmail(vacancy, APP_URL, token);
  const wa = buildAdminApprovalWhatsAppMessage(vacancy, APP_URL, token);

  res.json({
    emailSubject: email.subject,
    emailHtml: email.html,
    emailText: email.text,
    whatsAppMessage: wa,
    approvalUrl: `${APP_URL}/api/approve?id=${vacancy.id}&token=${token}`,
  });
});

// Get all vacancies
app.get('/api/vacancies', (req: Request, res: Response) => {
  res.json(store.getVacancies());
});

// Get single vacancy
app.get('/api/vacancies/:id', (req: Request, res: Response) => {
  const vacancy = store.getVacancyById(req.params.id);
  if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });
  res.json(vacancy);
});

// Delete vacancy
app.delete('/api/vacancies/:id', (req: Request, res: Response) => {
  const success = store.deleteVacancy(req.params.id);
  res.json({ success });
});

// Scan for new vacancies using Gemini 3.8 Flash search
app.post('/api/scan', async (req: Request, res: Response) => {
  store.setIsScanning(true);
  try {
    const { query, autoGenerate = true } = req.body;
    const settings = store.getSettings();

    const searchResults = await searchLatestGovVacancies(query);
    const newlyAdded: string[] = [];

    for (const item of searchResults) {
      if (!item.title) continue;

      const id = item.shortName
        ? item.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : `gov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      const existing = store.getVacancyById(id);
      if (existing) continue;

      const isWB =
        item.jurisdiction === 'West Bengal' ||
        String(item.title).includes('West Bengal') ||
        String(item.title).includes('Kolkata') ||
        String(item.examBoard).includes('WB');

      const approvalToken = generateApprovalToken(id);

      const newVacancy: GovVacancy = {
        id,
        title: item.title,
        shortName: item.shortName || item.title.slice(0, 28),
        examBoard: item.examBoard || (isWB ? 'WBPSC' : 'SSC'),
        category: item.category || (isWB ? 'West Bengal Govt' : 'Central Govt'),
        jurisdiction: item.jurisdiction || (isWB ? 'West Bengal' : 'Central'),
        vacanciesCount: item.vacanciesCount || 'TBA',
        salaryScale: item.salaryScale || (isWB ? 'ROPA 2019 Scale' : '7th CPC Scale'),
        qualification: item.qualification || "Bachelor's Degree or Madhyamik pass",
        qualificationLevel: item.qualificationLevel || 'Graduate',
        ageLimit: item.ageLimit || (isWB ? '18 to 40 years' : '18 to 30 years'),
        startDate: item.startDate ? formatDateDDMMYYYY(item.startDate) : getTodayDDMMYYYY(),
        lastDate: item.lastDate ? formatDateDDMMYYYY(item.lastDate) : getOffsetDateDDMMYYYY(30),
        admitCardDate: item.admitCardDate,
        examDate: item.examDate,
        applicationFee: item.applicationFee || 'Standard Examination Fee',
        officialWebsite: item.officialWebsite || (isWB ? 'https://psc.wb.gov.in' : 'https://ssc.gov.in'),
        notificationPdfUrl: item.notificationPdfUrl,
        applyOnlineUrl: item.applyOnlineUrl || item.officialWebsite,
        status: 'active',
        syncStatus: 'pending_draft',
        approvalStatus: settings.adminApproval?.requireAdminApproval ? 'pending_approval' : 'auto_approved',
        approvalToken,
        detectedAt: new Date().toISOString(),
        source: item.source || 'AI Automated Web Radar (Gemini Search)',
        summary: item.summary || item.title,
        keyHighlights: item.keyHighlights || ['Official notification released', 'Online application started'],
        selectionProcess: item.selectionProcess || ['Preliminary Written Test', 'Main Examination', 'Interview / Document Verification'],
        syllabusOverview: item.syllabusOverview || [
          { subject: 'General Studies & Awareness', questions: 40, marks: 40, keyTopics: 'Indian & Bengal History, Geography, Science, Current Affairs' },
          { subject: 'Arithmetic & Mathematics', questions: 30, marks: 30, keyTopics: 'Arithmetic, Percentages, Ratio, Number Systems' },
          { subject: 'English Language', questions: 30, marks: 30, keyTopics: 'Grammar, Comprehension, Vocabulary' },
        ],
        esckolkataGuidance: item.esckolkataGuidance || {
          strategyTips: [
            'Review past 5 years question papers to grasp recurring topic patterns.',
            'Maintain daily structured practice of reasoning puzzles and numerical shortcuts.',
          ],
          recommendedBatch: `${settings.escBranding.instituteName} Intensive Guidance Batch`,
          cutoffTrend: 'High competition expected; aim for 75%+ in initial screening.',
        },
      };

      // Auto-generate post
      if (autoGenerate) {
        try {
          const generatedPost = await generateWebsitePost(
            newVacancy,
            settings.escBranding.instituteName,
            settings.siteUrl
          );
          newVacancy.generatedPost = generatedPost;
        } catch (genErr) {
          console.error('Failed auto generating post for new vacancy:', genErr);
        }
      }

      store.addOrUpdateVacancy(newVacancy);
      newlyAdded.push(newVacancy.shortName);

      // If Admin approval is required, dispatch Email and WhatsApp notifications right away!
      if (settings.adminApproval?.requireAdminApproval) {
        dispatchAdminNotifications(newVacancy, settings, APP_URL).then(({ log }) => {
          store.addNotificationLog(log);
        });
      } else if (settings.autoPublish && newVacancy.generatedPost) {
        // Direct publish if approval is not required
        publishPostToWordPress(newVacancy, newVacancy.generatedPost, settings).then((pubResult) => {
          if (pubResult.success) {
            newVacancy.syncStatus = 'published_to_site';
            newVacancy.publishedAt = new Date().toISOString();
            newVacancy.publishedUrl = pubResult.publishedUrl;
            store.addOrUpdateVacancy(newVacancy);
          }
        });
      }
    }

    store.addScanLog({
      trigger: 'manual',
      foundCount: searchResults.length,
      newVacancies: newlyAdded,
      status: 'success',
      message: `Surveillance scan completed. Discovered ${searchResults.length} notices (${newlyAdded.length} new records). Admin approval notifications queued.`,
    });

    store.setIsScanning(false);
    res.json({
      success: true,
      foundCount: searchResults.length,
      newCount: newlyAdded.length,
      newVacancies: newlyAdded,
      vacancies: store.getVacancies(),
    });
  } catch (err: any) {
    store.setIsScanning(false);
    store.addScanLog({
      trigger: 'manual',
      foundCount: 0,
      newVacancies: [],
      status: 'error',
      message: `Scan failed: ${err.message}`,
    });
    res.status(500).json({ error: err.message });
  }
});

// Generate or regenerate post for a vacancy
app.post('/api/generate-post', async (req: Request, res: Response) => {
  try {
    const { vacancyId } = req.body;
    const vacancy = store.getVacancyById(vacancyId);
    if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });

    const settings = store.getSettings();
    const generatedPost = await generateWebsitePost(
      vacancy,
      settings.escBranding.instituteName,
      settings.siteUrl
    );

    vacancy.generatedPost = generatedPost;
    store.addOrUpdateVacancy(vacancy);

    res.json({ success: true, generatedPost, vacancy });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Publish a vacancy post to esckolkata2003.org
app.post('/api/publish', async (req: Request, res: Response) => {
  try {
    const { vacancyId, customPost } = req.body;
    const vacancy = store.getVacancyById(vacancyId);
    if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });

    const settings = store.getSettings();
    let postToPublish = customPost || vacancy.generatedPost;

    if (!postToPublish) {
      postToPublish = await generateWebsitePost(
        vacancy,
        settings.escBranding.instituteName,
        settings.siteUrl
      );
      vacancy.generatedPost = postToPublish;
    }

    const result = await publishPostToWordPress(vacancy, postToPublish, settings);

    if (result.success) {
      vacancy.syncStatus = 'published_to_site';
      vacancy.approvalStatus = 'approved';
      vacancy.publishedAt = new Date().toISOString();
      vacancy.publishedUrl = result.publishedUrl;
      store.addOrUpdateVacancy(vacancy);

      if (settings.webhookEnabled && settings.webhookUrl) {
        await dispatchWebhook(vacancy, postToPublish, settings.webhookUrl);
      }
    }

    res.json({
      success: result.success,
      result,
      vacancy,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Custom raw text or circular ingestion
app.post('/api/custom-parse', async (req: Request, res: Response) => {
  try {
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) return res.status(400).json({ error: 'Text content is required' });

    const parsed = await parseRawVacancyNotice(rawText);
    const id = parsed.shortName
      ? parsed.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : `custom-${Date.now()}`;

    const settings = store.getSettings();
    const isWB =
      parsed.jurisdiction === 'West Bengal' ||
      String(parsed.title).includes('West Bengal') ||
      String(parsed.title).includes('Kolkata') ||
      String(parsed.examBoard).includes('WB');

    const approvalToken = generateApprovalToken(id);

    const fullVacancy: GovVacancy = {
      id,
      title: parsed.title || 'Government Exam Notification 2026',
      shortName: parsed.shortName || 'Govt Vacancy',
      examBoard: (parsed.examBoard as any) || (isWB ? 'WBPSC' : 'SSC'),
      category: (parsed.category as any) || (isWB ? 'West Bengal Govt' : 'Central Govt'),
      jurisdiction: (parsed.jurisdiction as any) || (isWB ? 'West Bengal' : 'Central'),
      vacanciesCount: parsed.vacanciesCount || 'TBA',
      salaryScale: parsed.salaryScale || (isWB ? 'ROPA Pay Scale' : '7th CPC Scale'),
      qualification: parsed.qualification || "Bachelor's Degree or 10th Pass",
      qualificationLevel: (parsed.qualificationLevel as any) || 'Graduate',
      ageLimit: parsed.ageLimit || (isWB ? '18-40 Years' : '18-30 Years'),
      startDate: parsed.startDate ? formatDateDDMMYYYY(parsed.startDate) : getTodayDDMMYYYY(),
      lastDate: parsed.lastDate ? formatDateDDMMYYYY(parsed.lastDate) : getOffsetDateDDMMYYYY(30),
      admitCardDate: parsed.admitCardDate,
      examDate: parsed.examDate,
      applicationFee: parsed.applicationFee || 'Standard Fee',
      officialWebsite: parsed.officialWebsite || (isWB ? 'https://psc.wb.gov.in' : 'https://ssc.gov.in'),
      notificationPdfUrl: parsed.notificationPdfUrl,
      applyOnlineUrl: parsed.applyOnlineUrl || parsed.officialWebsite,
      status: 'active',
      syncStatus: 'pending_draft',
      approvalStatus: 'pending_approval',
      approvalToken,
      detectedAt: new Date().toISOString(),
      source: `Custom Ingestion by Educator (ESC Kolkata - ${isWB ? 'West Bengal' : 'Central'})`,
      summary: parsed.summary || 'Custom government vacancy entered by educator.',
      keyHighlights: parsed.keyHighlights || ['Eligibility and application details updated'],
      selectionProcess: parsed.selectionProcess || ['Written Examination', 'Interview / Skill Test'],
      syllabusOverview: parsed.syllabusOverview || [],
      esckolkataGuidance: parsed.esckolkataGuidance || {
        strategyTips: ['Complete syllabus review', 'Daily sectional practice'],
        recommendedBatch: `${settings.escBranding.instituteName} Special Guidance Batch`,
        cutoffTrend: 'Check previous year trends',
      },
    };

    const generatedPost = await generateWebsitePost(
      fullVacancy,
      settings.escBranding.instituteName,
      settings.siteUrl
    );
    fullVacancy.generatedPost = generatedPost;

    store.addOrUpdateVacancy(fullVacancy);
    store.addScanLog({
      trigger: 'custom_input',
      foundCount: 1,
      newVacancies: [fullVacancy.shortName],
      status: 'success',
      message: `Parsed custom notice and generated post for "${fullVacancy.title}". Admin approval queued.`,
    });

    // Notify admin
    dispatchAdminNotifications(fullVacancy, settings, APP_URL).then(({ log }) => {
      store.addNotificationLog(log);
    });

    res.json({ success: true, vacancy: fullVacancy });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Logs endpoint
app.get('/api/logs', (req: Request, res: Response) => {
  res.json(store.getLogs());
});

// Initialize dev or prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[GovJobAutoPulse] ESC Kolkata Automation Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
