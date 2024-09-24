export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  export interface StorageInterface {
    getMessages(conversationId: string): Promise<Message[]>;
    saveMessage(conversationId: string, message: Message): Promise<void>;
    resetConversation(conversationId: string): Promise<void>;
  }