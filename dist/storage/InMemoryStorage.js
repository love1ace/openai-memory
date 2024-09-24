"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStorage = void 0;
class InMemoryStorage {
    constructor() {
        this.conversations = new Map();
    }
    async getMessages(conversationId) {
        return this.conversations.get(conversationId) || [];
    }
    async saveMessage(conversationId, message) {
        if (!this.conversations.has(conversationId)) {
            this.conversations.set(conversationId, []);
        }
        this.conversations.get(conversationId).push(message);
    }
    async resetConversation(conversationId) {
        this.conversations.set(conversationId, []);
    }
}
exports.InMemoryStorage = InMemoryStorage;
//# sourceMappingURL=InMemoryStorage.js.map