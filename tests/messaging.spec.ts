import { test, expect } from '@playwright/test';
import { ChatPage } from '../pages/chatPage';


test.beforeEach(async ({ page }) => {
    const chatPage = new ChatPage(page);
    await chatPage.navigate();
});


test.describe('Messaging App Tests', () => {
    test('should navigate to the chat page', async ({ page }) => {
        await expect(page).toHaveTitle('Dummy Messaging App');

    });
});