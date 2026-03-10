
import { Page } from '@playwright/test';
import path from 'path';

export class ChatPage {
  constructor(private page: Page) {}

  async navigate() {
    const filePath = `file://${path.resolve(__dirname, '../app/dummy-messaging-app.html')}`;
    await this.page.goto(filePath);
  }
  
}