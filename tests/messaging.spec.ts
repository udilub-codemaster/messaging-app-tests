import { test, expect } from '@fixtures/baseTest';
import { messagingConsts } from '@constants/messagingConsts';
import { setupMessageSendMock } from '@mocks/messageSendMock';


test.describe('Messaging App Tests', () => {
    test('Validate ui elements initial state', async ({ page, chatPage }) => {
        await expect(page).toHaveTitle('Dummy Messaging App');
        await expect(chatPage.messageInput).toBeVisible();
        await expect(chatPage.sendButton).toBeEnabled();
        await expect(chatPage.messageList).toBeAttached();
        await expect(chatPage.messages).toHaveCount(messagingConsts.MESSAGE_COUNT_INITIAL);
        const placeholder = await chatPage.getMessageInputPlaceholder();
        expect(placeholder).toBe(messagingConsts.MESSAGE_INPUT_PLACEHOLDER);
    });
    test('Validate successful message send', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage('This is a valid test message');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe('This is a valid test message');
    });
    test('Validate multiple message send', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage('This is a valid test message');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        await chatPage.typeMessage('This is a second valid test message');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(2);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe('This is a valid test message');
        expect(messages[1]).toBe('This is a second valid test message');
    });
    test('Validate special characters message send', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage('This is a valid test message with special characters: !@#$%^&*()');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe('This is a valid test message with special characters: !@#$%^&*()');
    });
});