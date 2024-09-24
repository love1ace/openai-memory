"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationManager = void 0;
const openai_1 = __importDefault(require("openai"));
const InMemoryStorage_1 = require("./storage/InMemoryStorage");
class ConversationManager {
    constructor(options) {
        this.openai = new openai_1.default({
            apiKey: options.apiKey,
        });
        this.model = options.model;
        this.temperature = options.temperature;
        this.maxTokens = options.maxTokens;
        this.storage = options.storage || new InMemoryStorage_1.InMemoryStorage();
        this.initialMessages = options.initialMessages;
    }
    async sendMessage(conversationId, userMessage) {
        var _a, _b, _c;
        let messages = await this.storage.getMessages(conversationId);
        if (messages.length === 0 && this.initialMessages) {
            if (typeof this.initialMessages === 'string') {
                const systemMessage = { role: 'system', content: this.initialMessages };
                messages.push(systemMessage);
                await this.storage.saveMessage(conversationId, systemMessage);
            }
            else if (Array.isArray(this.initialMessages)) {
                messages = [...this.initialMessages];
                for (const msg of this.initialMessages) {
                    await this.storage.saveMessage(conversationId, msg);
                }
            }
            else {
                throw new Error('initialMessages must be a string or an array of Message objects.');
            }
        }
        const userMsg = { role: 'user', content: userMessage };
        messages.push(userMsg);
        await this.storage.saveMessage(conversationId, userMsg);
        try {
            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                temperature: this.temperature,
                max_tokens: this.maxTokens,
            });
            const assistantMessage = ((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) || '';
            const assistantMsg = { role: 'assistant', content: assistantMessage };
            await this.storage.saveMessage(conversationId, assistantMsg);
            return assistantMessage;
        }
        catch (error) {
            throw new Error(`Error calling OpenAI API: ${error.message}`);
        }
    }
    async resetConversation(conversationId) {
        await this.storage.resetConversation(conversationId);
    }
}
exports.ConversationManager = ConversationManager;
//# sourceMappingURL=ConversationManager.js.map