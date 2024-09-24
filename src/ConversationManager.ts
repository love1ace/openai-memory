import OpenAI from 'openai';
import { StorageInterface, Message } from './storage/StorageInterface';
import { InMemoryStorage } from './storage/InMemoryStorage';

interface ConversationManagerOptions {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  storage?: StorageInterface;
  initialMessages?: string | Message[];
}

export class ConversationManager {
  private openai: OpenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private storage: StorageInterface;
  private initialMessages?: string | Message[];

  constructor(options: ConversationManagerOptions) {
    this.openai = new OpenAI({
      apiKey: options.apiKey,
    });
    this.model = options.model;
    this.temperature = options.temperature;
    this.maxTokens = options.maxTokens;
    this.storage = options.storage || new InMemoryStorage();
    this.initialMessages = options.initialMessages;
  }

  public async sendMessage(conversationId: string, userMessage: string): Promise<string> {
    let messages = await this.storage.getMessages(conversationId);

    if (messages.length === 0 && this.initialMessages) {
      if (typeof this.initialMessages === 'string') {
        const systemMessage: Message = { role: 'system', content: this.initialMessages };
        messages.push(systemMessage);
        await this.storage.saveMessage(conversationId, systemMessage);
      } else if (Array.isArray(this.initialMessages)) {
        messages = [...this.initialMessages];
        for (const msg of this.initialMessages) {
          await this.storage.saveMessage(conversationId, msg);
        }
      } else {
        throw new Error('initialMessages must be a string or an array of Message objects.');
      }
    }

    const userMsg: Message = { role: 'user', content: userMessage };
    messages.push(userMsg);
    await this.storage.saveMessage(conversationId, userMsg);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const assistantMessage = response.choices[0]?.message?.content?.trim() || '';

      const assistantMsg: Message = { role: 'assistant', content: assistantMessage };
      await this.storage.saveMessage(conversationId, assistantMsg);

      return assistantMessage;
    } catch (error: any) {
      throw new Error(`Error calling OpenAI API: ${error.message}`);
    }
  }

  public async resetConversation(conversationId: string): Promise<void> {
    await this.storage.resetConversation(conversationId);
  }
}