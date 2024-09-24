const dotenv = require('dotenv');
dotenv.config();

const { ConversationManager, InMemoryStorage } = require('./dist/index.js');
const initialPrompt = require('./prompt.js');

// 예상 응답을 test.js 내부에 정의
const expectedResponses = [
  '1', // 첫 번째 메시지 '1'에 대한 예상 응답
  '6', // 두 번째 메시지 '5 + 이전에 내가 보낸 숫자'에 대한 예상 응답 (1 + 5 = 6)
  '7', // 세 번째 메시지 '6 + 이전에 내가 보낸 숫자'에 대한 예상 응답 (1 + 6 = 7)
];

// OpenAI API 키를 환경 변수에서 가져옵니다.
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('API 키가 환경 변수에 설정되지 않았습니다.');
  process.exit(1);
}

const conversationManager = new ConversationManager({
  apiKey: apiKey,
  model: 'gpt-4o-mini', // 원하는 모델로 대체하세요.
  temperature: 0.5, // 원하는 값으로 설정하세요.
  maxTokens: 100, // 원하는 값으로 설정하세요.
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
    console.log('대화 기록:', messages);

    if (success) {
      console.log('테스트 결과: true');
      process.exit(0); // 성공 시 프로세스 종료 코드 0
    } else {
      console.log('테스트 결과: false');
      process.exit(1); // 실패 시 프로세스 종료 코드 1
    }
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
    process.exit(1); // 오류 발생 시 프로세스 종료 코드 1
  }
}

testConversation();
