import { StorageInterface, Message } from './StorageInterface';
export declare class InMemoryStorage implements StorageInterface {
    private conversations;
    getMessages(conversationId: string): Promise<Message[]>;
    saveMessage(conversationId: string, message: Message): Promise<void>;
    resetConversation(conversationId: string): Promise<void>;
}
