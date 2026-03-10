import { test as baseTest } from '@playwright/test';
import { ChatPage } from '@pages/chatPage';

export type myFixtures = {
    chatPage: ChatPage;
}

export const test = baseTest.extend<myFixtures>({
    chatPage: async ({ page }, use) => {
        const chatPage = new ChatPage(page);
        await chatPage.navigate();
        await use(chatPage);
    },
});

export { expect } from '@playwright/test';
