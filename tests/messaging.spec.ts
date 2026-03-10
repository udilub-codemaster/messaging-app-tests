import { test, expect } from '@playwright/test';
import { ChatPage } from '../pages/chatPage';
import { messagingConsts } from '../constants/messagingConsts';



test.beforeEach(async ({ page }) => {
    const chatPage = new ChatPage(page);
    await chatPage.navigate();
});


test.describe('Messaging App Tests', () => {
    test('Validate ui elements initial state', async ({ page }) => {
        const chatPage = new ChatPage(page);
        await expect(page).toHaveTitle('Dummy Messaging App');
        await expect(chatPage.messageInput).toBeVisible();
        await expect(chatPage.sendButton).toBeEnabled();
        await expect(chatPage.messageList).toBeAttached();
        await expect(chatPage.messages).toHaveCount(messagingConsts.MESSAGE_COUNT_INITIAL);
        const placeholder = await chatPage.getMessageInputPlaceholder();
        expect(placeholder).toBe(messagingConsts.MESSAGE_INPUT_PLACEHOLDER);
    });
});