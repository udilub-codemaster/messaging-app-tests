import { Page, Locator } from '@playwright/test';

export class ChatPage {
  constructor(private page: Page) {
    this.page = page;
  }

  // Element locators
  get messageInput(): Locator {
    return this.page.locator('#messageInput');
  }

  async getMessageInputPlaceholder(): Promise<string | null> {
    return this.messageInput.getAttribute('placeholder');
  }

  get sendButton(): Locator {
    return this.page.locator('#sendBtn');
  }

  get messageList(): Locator {
    return this.page.locator('#messageList');
  }

  get messages(): Locator {
    return this.page.locator('#messageList li');
  }

  async navigate() {
    await this.page.goto('/dummy-messaging-app.html');
  }

  async typeMessage(text: string) {
    await this.messageInput.fill(text);
    console.log('Message input filled with text: ', text);
  }

  async clickSend() {
    await this.sendButton.click();
  }

  async getMessages() {
    return this.messages.allTextContents();
  }
}