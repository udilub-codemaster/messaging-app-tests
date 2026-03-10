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
        const textBoxValue = await chatPage.messageInput.inputValue();
        expect(textBoxValue).toBe('');
        const placeholder = await chatPage.getMessageInputPlaceholder();
        expect(placeholder).toBe(messagingConsts.MESSAGE_INPUT_PLACEHOLDER);
    });
    test('Validate multiple message send', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage(messagingConsts.FIRST_VALID_MESSAGE);
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        await chatPage.typeMessage(messagingConsts.SECOND_VALID_MESSAGE);
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(2);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe(messagingConsts.FIRST_VALID_MESSAGE);
        expect(messages[1]).toBe(messagingConsts.SECOND_VALID_MESSAGE);
    });
    test('Validate special characters message send', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage(messagingConsts.SPECIAL_CHARACTERS_MESSAGE);
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe(messagingConsts.SPECIAL_CHARACTERS_MESSAGE);
    });
    test('Validate empty message send', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage('');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(0);
    });
    test('Validate message send failure', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: false });
        await chatPage.typeMessage('This is an invalid message');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(0);
    });
    test('Validate whitespace message send', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage('   ');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(0);
    });
    test('Validate message send failure with invalid status code', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: false, status: 500 });
        await chatPage.typeMessage('This is an invalid message');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(0);
    });
    test('Validate message with emoji icon', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage('This is a message with an emoji: 😊');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe(messagingConsts.EMOJI_MESSAGE);
    });
    test('Validate very long message send', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage(messagingConsts.VERY_LONG_MESSAGE);
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe(messagingConsts.VERY_LONG_MESSAGE);
    });
    test('Validate rapid double click on send button', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage(messagingConsts.FIRST_VALID_MESSAGE);
        await chatPage.clickSend();
        await new Promise(resolve => setTimeout(resolve, 100));
        await chatPage.clickSend();
        await new Promise(resolve => setTimeout(resolve, 100));
        await expect(chatPage.messages).toHaveCount(1);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe(messagingConsts.FIRST_VALID_MESSAGE);
    });

});