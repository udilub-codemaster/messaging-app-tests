import { test, expect } from '@fixtures/baseTest';
import { messagingConsts } from '@constants/messagingConsts';
import { setupMessageSendMock } from '@mocks/messageSendMock';
import { delay } from '@utils/delay';


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
        await expect(chatPage.messageInput).toHaveValue('This is an invalid message');
    });
    test('Validate whitespace message send', async ({ page, chatPage }) => { // Not sure if this is the currect behaviour. best practice would be not to allow whitespace to be sent.
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage('   ');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
    });
    const errorStatusCodes = [400, 401, 403, 404, 500, 502, 503] as const;
    for (const status of errorStatusCodes) {
        test(`Validate message send failure with status ${status}`, async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: false, status });
            await chatPage.typeMessage('This is an invalid message');
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(0);
            await expect(chatPage.messageInput).toHaveValue('This is an invalid message');
        });
    }
    test('Validate message send when request is aborted', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true, abort: true });
        await chatPage.typeMessage('Message during network abort');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(0);
        await expect(chatPage.messageInput).toHaveValue('Message during network abort');
    });
    test('Validate message with emoji icon', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage('This is a message with an emoji: 😊');
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe(messagingConsts.EMOJI_MESSAGE);
    });
    test('Validate message with Hebrew characters', async ({ page, chatPage }) => {
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage(messagingConsts.HEBREW_MESSAGE);
        await chatPage.clickSend();
        await expect(chatPage.messages).toHaveCount(1);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe(messagingConsts.HEBREW_MESSAGE);
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
        // Slow mock ensures both clicks fire before first response; app currently allows duplicate submissions (no debouncing)
        await setupMessageSendMock(page, { success: true, delayMs: messagingConsts.MOCK_RESPONSE_DELAY_MS });
        await chatPage.typeMessage(messagingConsts.FIRST_VALID_MESSAGE);
        await chatPage.clickSend();
        await chatPage.clickSend();
        await delay(messagingConsts.MOCK_RESPONSE_DELAY_MS);
        await expect(chatPage.messages).toHaveCount(2);
        const messages = await chatPage.getMessages();
        expect(messages[0]).toBe(messagingConsts.FIRST_VALID_MESSAGE);
        expect(messages[1]).toBe(messagingConsts.FIRST_VALID_MESSAGE);
    });
    test('Validate Send message does not through a page error on the console', async ({ page, chatPage }) => {
        const errors : Error[] = [];
        page.on('pageerror', (error) => {   
                errors.push(error);
            }
        );
        await setupMessageSendMock(page, { success: true });
        await chatPage.typeMessage(messagingConsts.FIRST_VALID_MESSAGE);
        await chatPage.clickSend();
        expect(errors).toHaveLength(0);
    });
});