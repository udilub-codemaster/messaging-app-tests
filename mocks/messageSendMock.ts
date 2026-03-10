import { Page } from '@playwright/test';
import { messagingConsts } from '@constants/messagingConsts';

export interface MockOptions {
  success: boolean;
  status?: number;
  responseBody?: { success: boolean; message?: string; error?: string };
  abort?: boolean;
}

const API_PATTERN = `**${messagingConsts.SEND_MESSAGE_API_PATH}`;

/**
 * Sets up a Playwright route to mock the send-message API.
 * Call before navigation or before triggering the send action.
 *
 * @param page - Playwright page instance
 * @param options - Mock behavior: success/failure, status, response body, or abort
 */
export async function setupMessageSendMock(page: Page, options: MockOptions): Promise<void> {
  const { success, status, responseBody, abort } = options;

  await page.route(API_PATTERN, async (route) => {
    if (route.request().method() !== 'POST') {
      return route.continue();
    }

    if (abort) {
      return route.abort();
    }

    let body: { success: boolean; message?: string; error?: string };
    let statusCode: number;

    if (responseBody !== undefined) {
      body = responseBody;
      statusCode = status ?? (success ? 200 : 500);
    } else if (success) {
      let message = 'Message sent';
      try {
        const postData = route.request().postDataJSON();
        if (postData?.message) {
          message = postData.message;
        }
      } catch {
      }
      body = { success: true, message };
      statusCode = status ?? 200;
    } else {
      body = { success: false, error: 'Send failed' };
      statusCode = status ?? 500;
    }

    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}
