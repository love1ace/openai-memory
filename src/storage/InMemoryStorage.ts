import { StorageInterface, Message } from './StorageInterface';

export class InMemoryStorage implements StorageInterface {
  private conversations: Map<string, Message[]> = new Map();

  async getMessages(conversationId: string): Promise<Message[]> {
    const messages = this.conversations.get(conversationId) || [];
    return [...messages]; 
  }

  async saveMessage(conversationId: string, message: Message): Promise<void> {
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, []);
    }
    this.conversations.get(conversationId)!.push(message);
  }

  async resetConversation(conversationId: string): Promise<void> {
    this.conversations.set(conversationId, []);
  }
}