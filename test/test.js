const dotenv = require('dotenv');
dotenv.config();

const { ConversationManager, InMemoryStorage } = require('../dist/index.js');
const initialPrompt = require('./prompt.js');

const expectedResponses = [
  '1',
  '6',
  '7',
];

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('API key is not set in the environment variables.');
  process.exit(1);
}

const conversationManager = new ConversationManager({
  apiKey: apiKey,
  model: 'gpt-4o-mini',
  temperature: 0.5,
  maxTokens: 100,
  initialMessages: initialPrompt,
  storage: new InMemoryStorage(),
});

async function testConversation() {
  const conversationId = 'test-conversation';
  let success = true;

  try {
    const userMessages = [
      '1',
      '5 + the number I previously sent',
      '6 + the number I previously sent',
    ];

    for (let i = 0; i < userMessages.length; i++) {
      const userMessage = userMessages[i];
      const reply = await conversationManager.sendMessage(conversationId, userMessage);

      if (reply.trim() !== expectedResponses[i]) {
        success = false;
      }
    }

    const messages = await conversationManager.storage.getMessages(conversationId);

    if (success) {
      console.log('true');
      process.exit(0);
    } else {
      console.log('false');
      process.exit(1);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

testConversation();