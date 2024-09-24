import { StorageInterface, Message } from './storage/StorageInterface';
interface ConversationManagerOptions {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
    storage?: StorageInterface;
    initialMessages?: string | Message[];
}
export declare class ConversationManager {
    private openai;
    private model;
    private temperature;
    private maxTokens;
    private storage;
    private initialMessages?;
    constructor(options: ConversationManagerOptions);
    sendMessage(conversationId: string, userMessage: string): Promise<string>;
    resetConversation(conversationId: string): Promise<void>;
}
export {};
