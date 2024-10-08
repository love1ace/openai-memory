const dotenv = require('dotenv');
dotenv.config();

const { ConversationManager, InMemoryStorage } = require('./dist/index.js');
const initialPrompt = require('./test/prompt.js');

const expectedResponses = [
  '1',
  '6',
  '7',
];

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('API 키가 환경 변수에 설정되지 않았습니다.');
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
      '5 + 이전에 내가 보낸 숫자',
      '6 + 이전에 내가 보낸 숫자',
    ];

    for (let i = 0; i < userMessages.length; i++) {
      const userMessage = userMessages[i];
      const reply = await conversationManager.sendMessage(conversationId, userMessage);

      if (reply.trim() !== expectedResponses[i]) {
        console.error(`응답 ${i + 1}이 예상과 다릅니다. 예상: ${expectedResponses[i]}, 실제: ${reply}`);
        success = false; // 성공 플래그 수정
      }
    }

    // 전체 대화 기록 가져오기
    const messages = await conversationManager.storage.getMessages(conversationId);

    if (success) {
      console.log('true');
      process.exit(0);
    } else {
      console.log('false');
      process.exit(1); // 실패 시 프로세스 종료 코드 1
    }
  } catch (error) {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료 코드 1
  }
}

testConversation();
