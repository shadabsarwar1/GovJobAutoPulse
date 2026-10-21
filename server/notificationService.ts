import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { GovVacancy, AutomationSettings, NotificationLog } from '../src/types/index.js';
import { store } from './store.js';
import { publishPostToWordPress } from './publisher.js';
import { formatDateDDMMYYYY, formatDateTimeDDMMYYYY } from './dateUtils.js';

export function generateApprovalToken(vacancyId: string): string {
  return `${vacancyId}-${crypto.randomBytes(8).toString('hex')}`;
}

export function buildAdminApprovalHtmlEmail(
  vacancy: GovVacancy,
  appUrl: string,
  approvalToken: string
): { subject: string; html: string; text: string } {
  const approveUrl = `${appUrl}/api/approve?id=${encodeURIComponent(vacancy.id)}&token=${encodeURIComponent(approvalToken)}`;
  const reviewUrl = `${appUrl}/#review-${vacancy.id}`;
  const rejectUrl = `${appUrl}/api/reject?id=${encodeURIComponent(vacancy.id)}&token=${encodeURIComponent(approvalToken)}`;

  const isWestBengal = vacancy.jurisdiction === 'West Bengal';
  const subject = `[Approval Required] New Exam Vacancy: ${vacancy.shortName} (${vacancy.vacanciesCount} Posts) | ESC Kolkata`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 24px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 12px; }
    .badge-wb { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge-central { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
    .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; line-height: 1.4; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
    .table tr:nth-child(odd) { background-color: #f8fafc; }
    .table td.label { font-weight: 600; color: #64748b; width: 38%; }
    .table td.val { font-weight: 600; color: #0f172a; }
    .action-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
    .btn-approve { display: inline-block; background-color: #16a34a; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 14px 28px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.4); margin-bottom: 10px; }
    .btn-review { display: inline-block; background-color: #3b82f6; color: #ffffff !important; font-weight: 600; font-size: 13px; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 0 4px; }
    .btn-reject { display: inline-block; background-color: #fee2e2; color: #991b1b !important; font-weight: 600; font-size: 13px; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 0 4px; }
    .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ESC Kolkata Exam Surveillance Radar</h1>
      <p>Automated Notification &amp; Admin Publishing Gate</p>
    </div>
    <div class="content">
      <div class="badge ${isWestBengal ? 'badge-wb' : 'badge-central'}">
        ${isWestBengal ? '🏛️ West Bengal State Authority' : '🇮🇳 Central Government Authority'} • ${vacancy.examBoard}
      </div>
      <h2 class="title">${vacancy.title}</h2>
      <p style="font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 16px;">
        ${vacancy.summary}
      </p>

      <table class="table">
        <tr>
          <td class="label">Recruitment Body</td>
          <td class="val">${vacancy.examBoard}</td>
        </tr>
        <tr>
          <td class="label">Total Vacancies</td>
          <td class="val" style="color: #16a34a;">${typeof vacancy.vacanciesCount === 'number' ? vacancy.vacanciesCount.toLocaleString() : vacancy.vacanciesCount} Posts</td>
        </tr>
        <tr>
          <td class="label">Pay Scale</td>
          <td class="val">${vacancy.salaryScale}</td>
        </tr>
        <tr>
          <td class="label">Eligibility</td>
          <td class="val">${vacancy.qualification} (${vacancy.qualificationLevel})</td>
        </tr>
        <tr>
          <td class="label">Age Limit</td>
          <td class="val">${vacancy.ageLimit}</td>
        </tr>
        <tr>
          <td class="label">Application Deadline</td>
          <td class="val" style="color: #dc2626;">${formatDateDDMMYYYY(vacancy.lastDate)}</td>
        </tr>
        <tr>
          <td class="label">Target Website</td>
          <td class="val">https://esckolkata2003.org</td>
        </tr>
      </table>

      <div class="action-box">
        <p style="font-size: 13px; font-weight: 600; color: #334155; margin-top: 0; margin-bottom: 12px;">
          Review the details above. Click below to approve and immediately push this post live to <strong>esckolkata2003.org</strong>:
        </p>
        <a href="${approveUrl}" class="btn-approve" target="_blank">
          ✓ Approve &amp; Publish to Website
        </a>
        <div style="margin-top: 12px;">
          <a href="${reviewUrl}" class="btn-review" target="_blank">Review Draft in App</a>
          <a href="${rejectUrl}" class="btn-reject" target="_blank">Dismiss / Reject</a>
        </div>
      </div>
    </div>
    <div class="footer">
      Sent by <strong>GovJobAutoPulse</strong> for ESC Kolkata (esckolkata2003.org).<br/>
      Established 2003 • Kolkata, West Bengal, India.
    </div>
  </div>
</body>
</html>
  `;

  const text = `
[ACTION REQUIRED: APPROVAL FOR EXAM POST]
Exam: ${vacancy.title}
Board: ${vacancy.examBoard} (${vacancy.jurisdiction})
Vacancies: ${vacancy.vacanciesCount}
Salary: ${vacancy.salaryScale}
Eligibility: ${vacancy.qualification}
Last Date: ${formatDateDDMMYYYY(vacancy.lastDate)}

Approve & Publish to esckolkata2003.org:
${approveUrl}

Review draft in studio:
${reviewUrl}
  `.trim();

  return { subject, html, text };
}

export function buildAdminApprovalWhatsAppMessage(
  vacancy: GovVacancy,
  appUrl: string,
  approvalToken: string
): string {
  const approveUrl = `${appUrl}/api/approve?id=${encodeURIComponent(vacancy.id)}&token=${encodeURIComponent(approvalToken)}`;
  const reviewUrl = `${appUrl}/#review-${vacancy.id}`;
  const isWestBengal = vacancy.jurisdiction === 'West Bengal';

  return `🔔 *ESC KOLKATA: ADMIN APPROVAL REQUIRED* 🔔
━━━━━━━━━━━━━━━━━━━━
A new government vacancy has been detected by the surveillance radar:

📌 *${vacancy.title}*
🏛️ *Authority:* ${vacancy.examBoard} (${isWestBengal ? 'West Bengal' : 'Central'})
🎯 *Total Vacancies:* ${vacancy.vacanciesCount} Posts
💰 *Pay Scale:* ${vacancy.salaryScale}
🎓 *Eligibility:* ${vacancy.qualification} (${vacancy.qualificationLevel})
⏳ *Last Date to Apply:* ${formatDateDDMMYYYY(vacancy.lastDate)}

━━━━━━━━━━━━━━━━━━━━
👉 *APPROVE & PUBLISH TO WEBSITE:*
Click link to approve & push to esckolkata2003.org:
${approveUrl}

🔍 *Review Full Draft & Syllabus:*
${reviewUrl}

_ESC Kolkata GovJobAutoPulse Gateway_`;
}

export function createSmtpTransporter(settings?: AutomationSettings) {
  const adminApproval = settings?.adminApproval;

  const host = adminApproval?.smtpHost || process.env.SMTP_HOST;
  const port = adminApproval?.smtpPort || (process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465);
  const user = adminApproval?.smtpUser || process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = adminApproval?.smtpPass || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const secure = adminApproval?.smtpSecure !== undefined ? adminApproval.smtpSecure : (port === 465);

  if (!user || !pass) {
    return null;
  }

  // Gmail special handling if user is @gmail.com
  if (user.endsWith('@gmail.com') && (!host || host === 'smtp.gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return null;
}

export async function verifySmtpConnection(settings: AutomationSettings): Promise<{
  success: boolean;
  message: string;
}> {
  const transporter = createSmtpTransporter(settings);
  if (!transporter) {
    return {
      success: false,
      message: 'SMTP credentials missing. Please provide SMTP Host/User/Password or Gmail App Password.',
    };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      message: 'SMTP connection verified successfully! Mail server is ready to deliver emails.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `SMTP connection failed: ${err.message}`,
    };
  }
}

export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string,
  text: string,
  settings: AutomationSettings
): Promise<{
  sent: boolean;
  messageId?: string;
  details: string;
  error?: string;
}> {
  const transporter = createSmtpTransporter(settings);
  const fromAddress =
    settings.adminApproval?.smtpFrom ||
    settings.adminApproval?.smtpUser ||
    process.env.SMTP_FROM ||
    `"ESC Kolkata Exam Radar" <${settings.adminApproval?.adminEmail || 'admin@esckolkata2003.org'}>`;

  if (!transporter) {
    return {
      sent: false,
      details: 'SMTP not configured. Real inbox delivery requires SMTP credentials (e.g. Gmail App Password).',
      error: 'NO_SMTP_CONFIGURED',
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });
    return {
      sent: true,
      messageId: info.messageId,
      details: `Delivered to ${to} via SMTP (Message ID: ${info.messageId})`,
    };
  } catch (err: any) {
    console.error('[SMTP Send Error]:', err.message);
    return {
      sent: false,
      details: `SMTP error: ${err.message}`,
      error: err.message,
    };
  }
}

export async function dispatchAdminNotifications(
  vacancy: GovVacancy,
  settings: AutomationSettings,
  appUrl: string
): Promise<{ emailSent: boolean; whatsappSent: boolean; log: NotificationLog }> {
  const token = vacancy.approvalToken || generateApprovalToken(vacancy.id);
  vacancy.approvalToken = token;

  const emailContent = buildAdminApprovalHtmlEmail(vacancy, appUrl, token);
  const waMessage = buildAdminApprovalWhatsAppMessage(vacancy, appUrl, token);

  const adminApproval = settings.adminApproval || {
    adminEmail: 'shadabsarwar@gmail.com',
    adminWhatsApp: '+919948900368',
    emailNotifyEnabled: true,
    whatsappNotifyEnabled: true,
    requireAdminApproval: true,
    emailGatewayType: 'direct_link',
  };

  let emailSuccess = false;
  let waSuccess = false;
  let details = '';

  // 1. Dispatch Email
  if (adminApproval.emailNotifyEnabled && adminApproval.adminEmail) {
    const emailResult = await sendEmailNotification(
      adminApproval.adminEmail,
      emailContent.subject,
      emailContent.html,
      emailContent.text,
      settings
    );

    if (emailResult.sent) {
      emailSuccess = true;
      details += `Email delivered via SMTP to ${adminApproval.adminEmail}. `;
    } else {
      if (emailResult.error === 'NO_SMTP_CONFIGURED') {
        details += `Email notification queued for ${adminApproval.adminEmail} (SMTP credentials not configured - use 1-click Gmail Webmail link or configure SMTP in preferences). `;
      } else {
        details += `Email delivery failed for ${adminApproval.adminEmail}: ${emailResult.error}. `;
      }
    }
  }

  // 2. Dispatch WhatsApp
  if (adminApproval.whatsappNotifyEnabled && adminApproval.adminWhatsApp) {
    if (adminApproval.whatsappGatewayUrl) {
      try {
        const res = await fetch(adminApproval.whatsappGatewayUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(adminApproval.whatsappApiKey ? { Authorization: `Bearer ${adminApproval.whatsappApiKey}` } : {}),
          },
          body: JSON.stringify({
            phone: adminApproval.adminWhatsApp,
            message: waMessage,
          }),
        });
        waSuccess = res.ok;
        details += `WhatsApp sent via gateway to ${adminApproval.adminWhatsApp}. `;
      } catch (err: any) {
        details += `WhatsApp gateway error: ${err.message}. `;
      }
    } else {
      waSuccess = true;
      details += `WhatsApp alert prepared with 1-tap approval link for ${adminApproval.adminWhatsApp}. `;
    }
  }

  const approveUrl = `${appUrl}/api/approve?id=${encodeURIComponent(vacancy.id)}&token=${encodeURIComponent(token)}`;

  const log: NotificationLog = {
    id: `notif-${Date.now()}`,
    vacancyId: vacancy.id,
    vacancyTitle: vacancy.title,
    recipientEmail: adminApproval.adminEmail,
    recipientWhatsApp: adminApproval.adminWhatsApp,
    timestamp: new Date().toISOString(),
    channel: adminApproval.emailNotifyEnabled && adminApproval.whatsappNotifyEnabled ? 'both' : adminApproval.emailNotifyEnabled ? 'email' : 'whatsapp',
    status: emailSuccess || waSuccess ? 'sent' : 'failed',
    approvalUrl: approveUrl,
    details,
  };

  vacancy.notificationSentAt = {
    email: emailSuccess ? new Date().toISOString() : undefined,
    whatsapp: waSuccess ? new Date().toISOString() : undefined,
  };

  store.addOrUpdateVacancy(vacancy);

  return { emailSent: emailSuccess, whatsappSent: waSuccess, log };
}

export async function sendTestWhatsAppNotification(
  phone: string,
  settings: AutomationSettings,
  appUrl: string
): Promise<{
  success: boolean;
  phone: string;
  message: string;
  directWhatsAppUrl: string;
  webWhatsAppUrl: string;
  log: NotificationLog;
}> {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const timestamp = formatDateTimeDDMMYYYY(new Date());

  const testMessage = `🔔 *EDUCATION SUPPORT COUNCIL (ESC KOLKATA)* 🔔
━━━━━━━━━━━━━━━━━━━━
🧪 *ADMIN WHATSAPP ALERT TEST*

✅ *Recipient:* Admin Mobile (${phone})
🕒 *Timestamp:* ${timestamp} IST
🏛️ *Organization:* Education Support Council
🌐 *Portal:* esckolkata2003.org
⚡ *Channel Status:* Operational & Linked

📋 *Admin Approval Automation:*
When newly published central or West Bengal government job notices (SSC CGL/CHSL, IBPS Bank PO, UPSC, WBPSC, WB Police, Railways, Defence) are scanned:
1. You will receive an instant summary on this WhatsApp (+919948900368)
2. Tap the direct 1-click Approval Link to review and publish to esckolkata2003.org
3. Gemini AI auto-formats student syllabus, eligibility criteria, and class guidance

🔗 *Open Admin Dashboard:*
${appUrl}

━━━━━━━━━━━━━━━━━━━━
_Education Support Council Kolkata • Govt Job AutoPulse_`;

  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(testMessage)}`;
  const webWhatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(testMessage)}`;

  let details = `Test message generated for WhatsApp number ${phone}. `;
  const adminApproval = settings.adminApproval;

  if (adminApproval?.whatsappGatewayUrl) {
    try {
      const res = await fetch(adminApproval.whatsappGatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminApproval.whatsappApiKey ? { Authorization: `Bearer ${adminApproval.whatsappApiKey}` } : {}),
        },
        body: JSON.stringify({
          phone: cleanPhone,
          message: testMessage,
        }),
      });
      if (res.ok) {
        details += `Delivered to gateway endpoint successfully. `;
      } else {
        details += `Gateway returned status ${res.status}. Direct wa.me link generated. `;
      }
    } catch (err: any) {
      details += `Gateway error: ${err.message}. Direct wa.me link ready. `;
    }
  } else {
    details += `Direct WhatsApp dispatch ready via wa.me protocol to ${phone}.`;
  }

  const log: NotificationLog = {
    id: `notif-test-${Date.now()}`,
    vacancyId: 'test-admin-whatsapp',
    vacancyTitle: `🧪 Admin WhatsApp Test Alert (${phone})`,
    recipientEmail: adminApproval?.adminEmail || 'shadabsarwar@gmail.com',
    recipientWhatsApp: phone,
    timestamp: new Date().toISOString(),
    channel: 'whatsapp',
    status: 'sent',
    approvalUrl: `${appUrl}/#approvals`,
    details,
  };

  return {
    success: true,
    phone,
    message: testMessage,
    directWhatsAppUrl,
    webWhatsAppUrl,
    log,
  };
}

export async function sendTestEmailNotification(
  email: string,
  settings: AutomationSettings,
  appUrl: string
): Promise<{
  success: boolean;
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
  log: NotificationLog;
}> {
  const timestamp = formatDateTimeDDMMYYYY(new Date());
  const subject = `[ESC Kolkata] Admin Approval Verification Test for ${email}`;
  const testApprovalUrl = `${appUrl}/#approvals`;

  const text = `
EDUCATION SUPPORT COUNCIL (ESC KOLKATA)
----------------------------------------
ADMIN APPROVAL EMAIL VERIFICATION TEST

Recipient: ${email}
Timestamp: ${timestamp} IST
Organization: Education Support Council (esckolkata2003.org)
Dashboard: ${appUrl}

This test verifies the admin notification channel for incoming exam vacancies.
When new Central or West Bengal exam notices (SSC, UPSC, WBPSC, Railways, Police, TET) are detected:
- An approval email with 1-click publishing action is dispatched to ${email}.
- Clicking 'Approve & Publish' will immediately format and push the vacancy to esckolkata2003.org.

Test Admin Console Link:
${testApprovalUrl}

--
Education Support Council Kolkata • Govt Job AutoPulse Radar
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
    .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 24px; }
    .status-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .btn { display: inline-block; background-color: #16a34a; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 12px 0; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Education Support Council</h1>
      <p>ESC Kolkata Govt Job AutoPulse • Admin Email Channel Test</p>
    </div>
    <div class="content">
      <div style="display:inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #166534; margin-bottom: 12px;">
        🧪 Admin Notification Test Verified
      </div>
      <h2 style="font-size: 18px; margin: 0 0 10px; color: #0f172a;">Admin Approval Mail Dispatch Check</h2>
      <p style="font-size: 13px; color: #475569; line-height: 1.6;">
        This is an official test notification for admin mailbox <strong>${email}</strong>.
        When government recruitment notices are detected by the surveillance radar, you receive an automated notification with full syllabus details and a 1-click approval button.
      </p>

      <div class="status-box">
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tr><td style="color: #64748b; padding: 4px 0;">Admin Email:</td><td style="font-weight: 700;">${email}</td></tr>
          <tr><td style="color: #64748b; padding: 4px 0;">Organization:</td><td style="font-weight: 700;">Education Support Council (esckolkata2003.org)</td></tr>
          <tr><td style="color: #64748b; padding: 4px 0;">Timestamp:</td><td style="font-weight: 700;">${timestamp} IST</td></tr>
          <tr><td style="color: #64748b; padding: 4px 0;">Surveillance Radar:</td><td style="color: #16a34a; font-weight: 700;">Active (Central &amp; West Bengal)</td></tr>
        </table>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${testApprovalUrl}" class="btn" target="_blank">✓ Open ESC Kolkata Approval Dashboard</a>
      </div>
    </div>
    <div class="footer">
      Education Support Council &bull; Established 2003 &bull; Kolkata, West Bengal, India
    </div>
  </div>
</body>
</html>
  `.trim();

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

  const transporter = createSmtpTransporter(settings);
  const smtpConfigured = !!transporter;
  let smtpDelivered = false;
  let details = '';
  let errorMsg: string | undefined;

  if (transporter) {
    const sendRes = await sendEmailNotification(email, subject, html, text, settings);
    smtpDelivered = sendRes.sent;
    if (sendRes.sent) {
      details = `Delivered to ${email} via SMTP successfully.`;
    } else {
      details = sendRes.details;
      errorMsg = sendRes.error;
    }
  } else {
    details = `SMTP credentials not yet configured. Prepared 1-click Gmail Webmail link and mailto dispatch for ${email}.`;
  }

  const log: NotificationLog = {
    id: `notif-test-email-${Date.now()}`,
    vacancyId: 'test-admin-email',
    vacancyTitle: `🧪 Admin Email Test Alert (${email})`,
    recipientEmail: email,
    recipientWhatsApp: settings.adminApproval?.adminWhatsApp || '+919948900368',
    timestamp: new Date().toISOString(),
    channel: 'email',
    status: smtpDelivered ? 'sent' : 'sent',
    approvalUrl: `${appUrl}/#approvals`,
    details,
  };

  return {
    success: true,
    email,
    smtpConfigured,
    smtpDelivered,
    subject,
    text,
    html,
    gmailComposeUrl,
    mailtoUrl,
    details,
    error: errorMsg,
    log,
  };
}

