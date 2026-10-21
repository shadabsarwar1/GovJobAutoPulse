import { GovVacancy, AutomationSettings, GeneratedPost } from '../src/types/index.js';
import { store } from './store.js';

export interface PublishResult {
  success: boolean;
  isSimulated?: boolean;
  statusCode?: number;
  message: string;
  publishedUrl?: string;
  postId?: string | number;
  details?: any;
}

export async function testWordPressConnection(settings: AutomationSettings): Promise<{
  connected: boolean;
  siteName?: string;
  description?: string;
  routesAvailable?: boolean;
  error?: string;
}> {
  try {
    const endpoint = settings.wpApiEndpoint || 'https://esckolkata2003.org/wp-json/wp/v2/posts';
    const baseUrl = new URL(endpoint).origin;
    const testUrl = `${baseUrl}/wp-json`;

    // Attempt fetch with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const headers: Record<string, string> = {
      'User-Agent': 'ESC-Kolkata-AutoPulse/1.0',
      'Accept': 'application/json',
    };

    if (settings.wpUsername && settings.wpAppPassword) {
      const auth = Buffer.from(`${settings.wpUsername}:${settings.wpAppPassword}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    const res = await fetch(testUrl, {
      signal: controller.signal,
      headers,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        siteName: data.name || 'ESC Kolkata (esckolkata2003.org)',
        description: data.description || 'Education Support Council Exam Portal',
        routesAvailable: !!data.routes,
      };
    } else {
      return {
        connected: false,
        error: `Server responded with status ${res.status} ${res.statusText}. Check if REST API is enabled on esckolkata2003.org.`,
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      error: err.name === 'AbortError'
        ? 'Connection timed out while reaching https://esckolkata2003.org'
        : `Could not reach esckolkata2003.org: ${err.message || 'Network unreachable'}. The system is using the built-in WordPress Simulation & Direct Sync Pipeline.`,
    };
  }
}

export async function publishPostToWordPress(
  vacancy: GovVacancy,
  generatedPost: GeneratedPost,
  settings: AutomationSettings
): Promise<PublishResult> {
  const wpEndpoint = settings.wpApiEndpoint || 'https://esckolkata2003.org/wp-json/wp/v2/posts';

  // Build the payload for WordPress REST API
  const wpPayload = {
    title: generatedPost.title,
    content: generatedPost.htmlContent,
    excerpt: generatedPost.excerpt,
    status: settings.postStatus || 'draft',
    slug: generatedPost.slug,
    categories: generatedPost.categories,
    tags: generatedPost.tags,
    meta: {
      esc_exam_board: vacancy.examBoard,
      esc_vacancies: vacancy.vacanciesCount,
      esc_last_date: vacancy.lastDate,
      esc_official_link: vacancy.officialWebsite,
    },
  };

  // Check if live credentials exist
  const hasCredentials = Boolean(settings.wpUsername && settings.wpAppPassword);

  if (!hasCredentials) {
    // If no credentials provided yet, do a safe verified simulation
    const simulatedUrl = `https://esckolkata2003.org/${generatedPost.slug}`;
    const result: PublishResult = {
      success: true,
      isSimulated: true,
      statusCode: 200,
      message: `[Simulated Sync Mode] Ready for esckolkata2003.org as '${settings.postStatus}'. To publish live directly via API, configure your WordPress Application Password in the Settings tab.`,
      publishedUrl: simulatedUrl,
      postId: `sim-${Date.now()}`,
    };

    store.addPublishLog({
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      destination: wpEndpoint,
      status: 'simulated_success',
      statusCode: 200,
      responseMessage: result.message,
      postUrl: simulatedUrl,
    });

    return result;
  }

  // Attempt real REST API dispatch
  try {
    const auth = Buffer.from(`${settings.wpUsername}:${settings.wpAppPassword}`).toString('base64');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(wpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'ESC-Kolkata-AutoPulse/1.0',
      },
      body: JSON.stringify(wpPayload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const liveUrl = data.link || `https://esckolkata2003.org/${data.slug || generatedPost.slug}`;

      store.addPublishLog({
        vacancyId: vacancy.id,
        vacancyTitle: vacancy.title,
        destination: wpEndpoint,
        status: 'success',
        statusCode: res.status,
        responseMessage: `Successfully published post to esckolkata2003.org (Post ID: ${data.id || 'N/A'}) as ${settings.postStatus}.`,
        postUrl: liveUrl,
      });

      return {
        success: true,
        statusCode: res.status,
        message: `Successfully pushed to esckolkata2003.org as '${settings.postStatus}'!`,
        publishedUrl: liveUrl,
        postId: data.id,
      };
    } else {
      const errText = await res.text();
      const message = `WordPress API returned ${res.status}: ${errText.slice(0, 150)}`;

      store.addPublishLog({
        vacancyId: vacancy.id,
        vacancyTitle: vacancy.title,
        destination: wpEndpoint,
        status: 'failed',
        statusCode: res.status,
        responseMessage: message,
      });

      return {
        success: false,
        statusCode: res.status,
        message,
        details: errText,
      };
    }
  } catch (error: any) {
    const msg = `Network error reaching ${wpEndpoint}: ${error.message}`;
    store.addPublishLog({
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      destination: wpEndpoint,
      status: 'failed',
      responseMessage: msg,
    });

    return {
      success: false,
      message: msg,
      details: error,
    };
  }
}

export async function dispatchWebhook(
  vacancy: GovVacancy,
  generatedPost: GeneratedPost,
  webhookUrl: string
): Promise<{ success: boolean; message: string }> {
  try {
    const payload = {
      event: 'gov_vacancy_published',
      institute: 'ESC Kolkata (esckolkata2003.org)',
      vacancy,
      post: generatedPost,
      publishedAt: new Date().toISOString(),
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ESC-Kolkata-AutoPulse/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true, message: `Webhook sent to ${webhookUrl} (Status: ${res.status})` };
    }
    return { success: false, message: `Webhook error: ${res.status}` };
  } catch (err: any) {
    return { success: false, message: `Webhook error: ${err.message}` };
  }
}
