# OpenAI Memory

**OpenAI Memory**는 OpenAI API와의 대화를 기억하는 기능을 제공합니다.

![npm](https://img.shields.io/npm/v/openai-memory)
![license](https://img.shields.io/npm/l/openai-memory)

## 주요 기능

- **대화 관리**: 사용자 대화를 손쉽게 추적하여 문맥에 맞는 응답을 제공합니다.
- **저장소 커스터마이징**: 기본적으로 메모리 저장소를 사용하지만, 로컬 스토리지나 데이터베이스 등으로 변경할 수 있습니다.
- **초기 프롬프트 설정**: 초기 프롬프트나 메시지 배열을 통해 AI의 동작을 제어할 수 있습니다.
- **Seamless OpenAI API 통합**: 추가 기능과 함께 `openai` 패키지와 유사하게 작동합니다.

## 설치

선호하는 패키지 관리자를 사용하여 **OpenAI Memory**를 설치하세요:

### npm

```bash
npm install openai-memory
```

### Yarn

```bash
yarn add openai-memory
```

### pnpm

```bash
pnpm add openai-memory
```

### Bun

```bash
bun add openai-memory
```

## 사용 방법

프로젝트에서 **OpenAI Memory**를 사용하려면 다음 단계를 따르세요:

### 패키지 임포트

- **TypeScript 사용 시**

  ```typescript
  import { ConversationManager, InMemoryStorage } from 'openai-memory';
  ```

- **JavaScript에서 CommonJS 사용 시**

  ```javascript
  const { ConversationManager, InMemoryStorage } = require('openai-memory');
  ```

- **JavaScript에서 ES Modules 사용 시**

  ```javascript
  import { ConversationManager, InMemoryStorage } from 'openai-memory';
  ```

  > **참고**: ES Modules를 사용하려면 `package.json`에 `"type": "module"`을 추가하거나 파일 확장자를 `.mjs`로 변경해야 합니다.

### ConversationManager 초기화

`ConversationManager`를 사용하여 OpenAI와의 대화를 관리할 수 있습니다.

- **필수 옵션**
  - `apiKey`: OpenAI API 키입니다.
  - `model`: 사용할 OpenAI 모델 (예: `'gpt-3.5-turbo'`).
- **선택적 옵션**
  - `temperature`: 응답의 창의성 정도를 조절합니다.
  - `maxTokens`: 생성될 응답의 최대 토큰 수.
  - `initialMessages`: 초기 프롬프트나 메시지 배열로 AI의 동작을 제어합니다.
  - `storage`: 대화 기록의 저장 방식을 커스터마이징합니다.

### 예제 코드

#### TypeScript 예제

```typescript
import { ConversationManager, InMemoryStorage } from 'openai-memory';

const apiKey = process.env.OPENAI_API_KEY; // 보안을 위해 환경 변수를 사용하세요.
const initialPrompt = '당신은 상세하고 정중한 답변을 제공하는 도움이 되는 도우미입니다.';

const conversationManager = new ConversationManager({
  apiKey,
  model: 'gpt-3.5-turbo', // 사용할 모델 지정
  temperature: 0.7, // 창의성 조절
  maxTokens: 1000, // 응답의 최대 토큰 수
  initialMessages: initialPrompt, // 초기 프롬프트 설정
  storage: new InMemoryStorage(), // 기본 저장소
});

async function chat() {
  const conversationId = 'user-123'; // 사용자별 고유 ID

  const userMessage = '안녕하세요, 오늘 날씨는 어떤가요?';
  const response = await conversationManager.sendMessage(conversationId, userMessage);

  console.log('AI 응답:', response);
}

chat();
```

#### JavaScript 예제

```javascript
const { ConversationManager, InMemoryStorage } = require('openai-memory');

const apiKey = process.env.OPENAI_API_KEY; // 보안을 위해 환경 변수를 사용하세요.
const initialPrompt = '당신은 상세하고 정중한 답변을 제공하는 도움이 되는 도우미입니다.';

const conversationManager = new ConversationManager({
  apiKey,
  model: 'gpt-3.5-turbo', // 사용할 모델 지정
  temperature: 0.7, // 창의성 조절
  maxTokens: 1000, // 응답의 최대 토큰 수
  initialMessages: initialPrompt, // 초기 프롬프트 설정
  storage: new InMemoryStorage(), // 기본 저장소
});

async function chat() {
  const conversationId = 'user-123'; // 사용자별 고유 ID

  const userMessage = '안녕하세요, 오늘 날씨는 어떤가요?';
  const response = await conversationManager.sendMessage(conversationId, userMessage);

  console.log('AI 응답:', response);
}

chat();
```

### 초기 프롬프트 설정

AI의 동작을 초기 프롬프트로 제어할 수 있습니다:

- **문자열 형태**

  ```javascript
  const initialPrompt = '당신은 친절한 도우미입니다.';
  ```

- **메시지 배열 형태**

  ```javascript
  const initialMessages = [
    { role: 'system', content: '당신은 친절한 도우미입니다.' },
    { role: 'user', content: '안녕하세요?' },
    { role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요?' },
  ];
  ```

### 저장소 커스터마이징

**OpenAI Memory**는 기본적으로 메모리 저장소를 사용하지만, 로컬 스토리지나 데이터베이스 등으로 커스터마이징할 수 있습니다.

#### 로컬 스토리지 사용 (브라우저 환경)

브라우저 환경에서 로컬 스토리지를 사용하여 대화 기록을 저장할 수 있습니다.

```javascript
import { ConversationManager, StorageInterface, Message } from 'openai-memory';

class LocalStorageStorage implements StorageInterface {
  async getMessages(conversationId) {
    const messages = localStorage.getItem(conversationId);
    return messages ? JSON.parse(messages) : [];
  }

  async saveMessage(conversationId, message) {
    const messages = await this.getMessages(conversationId);
    messages.push(message);
    localStorage.setItem(conversationId, JSON.stringify(messages));
  }

  async resetConversation(conversationId) {
    localStorage.removeItem(conversationId);
  }
}

const storage = new LocalStorageStorage();

const conversationManager = new ConversationManager({
  apiKey,
  model: 'gpt-3.5-turbo',
  storage,
  // 기타 옵션...
});
```

#### 데이터베이스 사용 (예: MongoDB)

대화 기록을 데이터베이스에 저장하려면 `StorageInterface`를 구현하면 됩니다.

```javascript
import { ConversationManager, StorageInterface, Message } from 'openai-memory';
import mongoose from 'mongoose';

// MongoDB 스키마 정의
const messageSchema = new mongoose.Schema({
  conversationId: String,
  role: String,
  content: String,
});

const MessageModel = mongoose.model('Message', messageSchema);

class MongoDBStorage implements StorageInterface {
  async getMessages(conversationId) {
    return await MessageModel.find({ conversationId });
  }

  async saveMessage(conversationId, message) {
    const msg = new MessageModel({ conversationId, ...message });
    await msg.save();
  }

  async resetConversation(conversationId) {
    await MessageModel.deleteMany({ conversationId });
  }
}

mongoose.connect('mongodb://localhost:27017/your-db');

const storage = new MongoDBStorage();

const conversationManager = new ConversationManager({
  apiKey,
  model: 'gpt-3.5-turbo',
  storage,
  // 기타 옵션...
});
```

### 프론트엔드와 백엔드에서의 사용

#### 프론트엔드 사용

프론트엔드에서 간단한 인터페이스를 만들어 서버로 메시지를 보내고 AI의 응답을 표시할 수 있습니다. 프론트엔드는 HTTP 요청을 통해 서버와 통신합니다.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>챗봇</title>
  <style>
    /* 간단한 스타일링 */
    #chat-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .user, .assistant {
      padding: 10px;
      margin: 5px;
    }
    .user {
      background-color: #d1e7dd;
      text-align: right;
    }
    .assistant {
      background-color: #f8d7da;
      text-align: left;
    }
  </style>
</head>
<body>
  <h1>챗봇</h1>
  <div id="chat-container"></div>
  <input type="text" id="message-input" placeholder="메시지를 입력하세요">
  <button id="send-button">전송</button>

  <script src="script.js"></script>
</body>
</html>
```

```javascript
// script.js

const conversationId = 'user-123'; // 사용자별 고유 ID

document.getElementById('send-button').addEventListener('click', sendMessage);

async function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  if (!message) return;

  displayMessage('user', message);
  messageInput.value = '';

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, message }),
    });

    const data = await response.json();
    if (response.ok) {
      displayMessage('assistant', data.content);
    } else {
      console.error('오류:', data.error);
      displayMessage('assistant', '오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('예외:', error);
    displayMessage('assistant', '서버와 통신 중 오류가 발생했습니다.');
  }
}

function displayMessage(role, content) {
  const chatContainer = document.getElementById('chat-container');
  const messageElement = document.createElement('div');
  messageElement.className = role;
  messageElement.textContent = `${role === 'user' ? '사용자' : 'AI'}: ${content}`;
  chatContainer.appendChild(messageElement);
}
```

> **주의**: API 키를 프론트엔드 코드에 포함시키지 마세요. 반드시 서버 측에서 안전하게 관리해야 합니다.

#### 서버 측 사용

API 요청을 처리하기 위해 Express.js 서버를 설정합니다:

```javascript
const express = require('express');
const cors = require('cors');
const { ConversationManager, InMemoryStorage } = require('openai-memory');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY; // 보안을 위해 환경 변수를 사용하세요.
const conversationManager = new ConversationManager({
  apiKey,
  model: 'gpt-3.5-turbo',
  storage: new InMemoryStorage(), // 적절한 저장소를 사용하세요.
});

app.post('/api/chat', async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: 'conversationId와 message는 필수입니다.' });
    }

    const reply = await conversationManager.sendMessage(conversationId, message);
    res.json({ content: reply });
  } catch (error) {
    console.error('오류:', error);
    res.status(500).json({ error: '서버에서 오류가 발생했습니다.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
```

## 기여하기

**OpenAI Memory**에 기여해주셔서 감사합니다! 버그 리포트, 개선 사항 제안, 풀 리퀘스트 제출 등 모든 형태의 기여를 환영합니다.

## 라이선스

이 프로젝트는 MIT 라이선스로 라이선스가 부여되어 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 연락처

질문이나 제안, 피드백이 있으시면 [love1ace](mailto:lovelacedud@gmail.com)로 연락해 주세요.