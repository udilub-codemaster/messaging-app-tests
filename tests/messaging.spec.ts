import { test, expect } from '@fixtures/baseTest';
import { messagingConsts } from '@constants/messagingConsts';
import { setupMessageSendMock } from '@mocks/messageSendMock';
import { delay } from '@utils/delay';

test.describe('Messaging App Tests', () => {
    test.describe('1. Smoke & Setup', { tag: ['@sanity', '@full-regression'] }, () => {
        test('Validate ui elements initial state', async ({ page, chatPage }) => {
            await expect(page).toHaveTitle(messagingConsts.ui.PAGE_TITLE);
            await expect(chatPage.messageInput).toBeVisible();
            await expect(chatPage.sendButton).toBeEnabled();
            await expect(chatPage.messageList).toBeAttached();
            await expect(chatPage.messages).toHaveCount(messagingConsts.ui.MESSAGE_COUNT_INITIAL);
            const placeholder = await chatPage.getMessageInputPlaceholder();
            expect(placeholder).toBe(messagingConsts.ui.MESSAGE_INPUT_PLACEHOLDER);
        });
    });

    test.describe('2. Happy Path', { tag: '@full-regression' }, () => {
        test('Validate successful message send', { tag: '@sanity' }, async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage(messagingConsts.messages.FIRST_VALID_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(1);
            const messages = await chatPage.getMessages();
            expect(messages[0]).toBe(messagingConsts.messages.FIRST_VALID_MESSAGE);
            const textBoxValue = await chatPage.messageInput.inputValue();
            expect(textBoxValue).toBe('');
            const placeholder = await chatPage.getMessageInputPlaceholder();
            expect(placeholder).toBe(messagingConsts.ui.MESSAGE_INPUT_PLACEHOLDER);
        });
        test('Validate multiple message send', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage(messagingConsts.messages.FIRST_VALID_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(1);
            await chatPage.typeMessage(messagingConsts.messages.SECOND_VALID_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(2);
            const messages = await chatPage.getMessages();
            expect(messages[0]).toBe(messagingConsts.messages.FIRST_VALID_MESSAGE);
            expect(messages[1]).toBe(messagingConsts.messages.SECOND_VALID_MESSAGE);
        });
        test('Validate special characters message send', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage(messagingConsts.messages.SPECIAL_CHARACTERS_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(1);
            const messages = await chatPage.getMessages();
            expect(messages[0]).toBe(messagingConsts.messages.SPECIAL_CHARACTERS_MESSAGE);
        });
    });

    test.describe('3. Input Validation', { tag: '@full-regression' }, () => {
        test('Validate empty message send', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage('');
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(0);
        });
        test('Validate whitespace message send', async ({ page, chatPage }) => {
            // Not sure if this is the correct behaviour. Best practice would be not to allow whitespace to be sent.
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage(messagingConsts.messages.WHITESPACE_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(1);
        });
    });

    test.describe('4. Error Handling', { tag: ['@full-regression', '@error-handling'] }, () => {
        test('Validate message send failure', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: false });
            await chatPage.typeMessage(messagingConsts.messages.INVALID_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(0);
            await expect(chatPage.messageInput).toHaveValue(messagingConsts.messages.INVALID_MESSAGE);
        });
        const errorStatusCodes = [400, 401, 403, 404, 500, 502, 503] as const;
        for (const status of errorStatusCodes) {
            test(`Validate message send failure with status ${status}`, async ({ page, chatPage }) => {
                await setupMessageSendMock(page, { success: false, status });
                await chatPage.typeMessage(messagingConsts.messages.INVALID_MESSAGE);
                await chatPage.clickSend();
                await expect(chatPage.messages).toHaveCount(0);
                await expect(chatPage.messageInput).toHaveValue(messagingConsts.messages.INVALID_MESSAGE);
            });
        }
        test('Validate message send when request is aborted', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true, abort: true });
            await chatPage.typeMessage(messagingConsts.messages.MESSAGE_DURING_NETWORK_ABORT);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(0);
            await expect(chatPage.messageInput).toHaveValue(messagingConsts.messages.MESSAGE_DURING_NETWORK_ABORT);
        });
    });

    test.describe('5. Edge Cases', { tag: ['@full-regression', '@edge-case'] }, () => {
        test('Validate message with emoji icon', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage(messagingConsts.messages.EMOJI_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(1);
            const messages = await chatPage.getMessages();
            expect(messages[0]).toBe(messagingConsts.messages.EMOJI_MESSAGE);
        });
        test('Validate message with Hebrew characters', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage(messagingConsts.messages.HEBREW_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(1);
            const messages = await chatPage.getMessages();
            expect(messages[0]).toBe(messagingConsts.messages.HEBREW_MESSAGE);
        });
        test('Validate very long message send', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage(messagingConsts.messages.VERY_LONG_MESSAGE);
            await chatPage.clickSend();
            await expect(chatPage.messages).toHaveCount(1);
            const messages = await chatPage.getMessages();
            expect(messages[0]).toBe(messagingConsts.messages.VERY_LONG_MESSAGE);
        });
        test('Validate rapid double click on send button', async ({ page, chatPage }) => {
            await setupMessageSendMock(page, { success: true, delayMs: messagingConsts.timing.MOCK_RESPONSE_DELAY_MS });
            await chatPage.typeMessage(messagingConsts.messages.FIRST_VALID_MESSAGE);
            await chatPage.clickSend();
            await chatPage.clickSend();
            await delay(messagingConsts.timing.MOCK_RESPONSE_DELAY_MS);
            await expect(chatPage.messages).toHaveCount(2);
            const messages = await chatPage.getMessages();
            expect(messages[0]).toBe(messagingConsts.messages.FIRST_VALID_MESSAGE);
            expect(messages[1]).toBe(messagingConsts.messages.FIRST_VALID_MESSAGE);
        });
    });

    test.describe('6. Non-Functional', { tag: '@full-regression' }, () => {
        test('Validate Send message does not throw a page error on the console', async ({ page, chatPage }) => {
            const errors: Error[] = [];
            page.on('pageerror', (error) => {
                errors.push(error);
            });
            await setupMessageSendMock(page, { success: true });
            await chatPage.typeMessage(messagingConsts.messages.FIRST_VALID_MESSAGE);
            await chatPage.clickSend();
            expect(errors).toHaveLength(0);
        });
    });
});
