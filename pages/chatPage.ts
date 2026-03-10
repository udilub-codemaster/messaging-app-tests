import { Page, Locator } from '@playwright/test';

export class ChatPage {
  constructor(private page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/dummy-messaging-app.html');
  }

  get messageInput(): Locator {
    return this.page.locator('#messageInput');
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

  async typeMessage(text: string) {
    await this.messageInput.fill(text);
    console.log('Message input filled with text: ', text);
  }

  async clickSend() {
    await this.sendButton.click();
    console.log('Send button clicked');
  }

  async getMessages() {
    return this.messages.allTextContents();
  }
  
  async getMessageInputPlaceholder(): Promise<string | null> {
    return this.messageInput.getAttribute('placeholder');
  }
}