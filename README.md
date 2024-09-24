# OpenAI Memory

**OpenAI Memory** provides functionality to remember conversations with OpenAI.

![npm](https://img.shields.io/npm/v/openai-memory)
![license](https://img.shields.io/npm/l/openai-memory)

## Features

- **Conversation Management**: Keep track of user conversations effortlessly to provide context-aware responses.
- **Customizable Storage**: Use in-memory storage by default or switch to local storage, databases, or other storage systems.
- **Initial Prompt Setting**: Control the AI's behavior through initial prompts or arrays of messages.
- **Seamless OpenAI API Integration**: Works similarly to the `openai` package with added functionalities.

## Installation

Install **OpenAI Memory** using your preferred package manager:

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

## Usage

To use **OpenAI Memory** in your project, follow these steps:

### Importing the Package

- **TypeScript**

  ```typescript
  import { ConversationManager, InMemoryStorage } from 'openai-memory';
  ```

- **JavaScript (CommonJS)**

  ```javascript
  const { ConversationManager, InMemoryStorage } = require('openai-memory');
  ```

- **JavaScript (ES Modules)**

  ```javascript
  import { ConversationManager, InMemoryStorage } from 'openai-memory';
  ```

  > **Note**: To use ES Modules, add `"type": "module"` to your `package.json` or change your file extension to `.mjs`.

### Initializing ConversationManager

Use `ConversationManager` to manage conversations with OpenAI.

- **Required Options**
  - `apiKey`: Your OpenAI API key.
  - `model`: The OpenAI model to use (e.g., `'gpt-3.5-turbo'`).
- **Optional Options**
  - `temperature`: Adjusts the creativity level of the responses.
  - `maxTokens`: Maximum number of tokens for the generated response.
  - `initialMessages`: Initial prompts or an array of messages to control the AI's behavior.
  - `storage`: Custom storage to change how conversation histories are saved.

### Example Code

#### TypeScript Example

```typescript
import { ConversationManager, InMemoryStorage } from 'openai-memory';

const apiKey = process.env.OPENAI_API_KEY; // Use environment variables for security.
const initialPrompt = 'You are a helpful assistant that provides detailed and polite responses.';

const conversationManager = new ConversationManager({
  apiKey,
  model: 'gpt-3.5-turbo', // Specify the model.
  temperature: 0.7, // Adjust creativity.
  maxTokens: 1000, // Max tokens for the response.
  initialMessages: initialPrompt, // Set initial prompt.
  storage: new InMemoryStorage(), // Default storage.
});

async function chat() {
  const conversationId = 'user-123'; // Unique ID per user.

  const userMessage = "Hello, what's the weather like today?";
  const response = await conversationManager.sendMessage(conversationId, userMessage);

  console.log('AI Response:', response);
}

chat();
```

#### JavaScript Example

```javascript
const { ConversationManager, InMemoryStorage } = require('openai-memory');

const apiKey = process.env.OPENAI_API_KEY; // Use environment variables for security.
const initialPrompt = 'You are a helpful assistant that provides detailed and polite responses.';

const conversationManager = new ConversationManager({
  apiKey,
  model: 'gpt-3.5-turbo', // Specify the model.
  temperature: 0.7, // Adjust creativity.
  maxTokens: 1000, // Max tokens for the response.
  initialMessages: initialPrompt, // Set initial prompt.
  storage: new InMemoryStorage(), // Default storage.
});

async function chat() {
  const conversationId = 'user-123'; // Unique ID per user.

  const userMessage = "Hello, what's the weather like today?";
  const response = await conversationManager.sendMessage(conversationId, userMessage);

  console.log('AI Response:', response);
}

chat();
```

### Setting Initial Prompts

You can control the AI's behavior with initial prompts:

- **String Format**

  ```javascript
  const initialPrompt = 'You are a friendly assistant.';
  ```

- **Array of Messages**

  ```javascript
  const initialMessages = [
    { role: 'system', content: 'You are a friendly assistant.' },
    { role: 'user', content: 'Hello?' },
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
  ];
  ```

### Customizing Storage

**OpenAI Memory** uses in-memory storage by default, but you can customize it to use local storage or databases.

#### Using Local Storage (Browser Environment)

In a browser environment, you can use local storage to save conversation histories.

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
  // Other options...
});
```

#### Using a Database (e.g., MongoDB)

To use a database for storing conversation histories, implement the `StorageInterface`.

```javascript
import { ConversationManager, StorageInterface, Message } from 'openai-memory';
import mongoose from 'mongoose';

// Define MongoDB schema
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
  // Other options...
});
```

### Frontend and Backend Usage

#### Frontend Usage

You can create a simple interface to send messages to the server and display the AI's responses. The frontend communicates with the server via HTTP requests.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chatbot</title>
  <style>
    /* Simple styling */
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
  <h1>Chatbot</h1>
  <div id="chat-container"></div>
  <input type="text" id="message-input" placeholder="Type your message here">
  <button id="send-button">Send</button>

  <script src="script.js"></script>
</body>
</html>
```

```javascript
// script.js

const conversationId = 'user-123'; // Unique ID per user.

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
      console.error('Error:', data.error);
      displayMessage('assistant', 'An error occurred.');
    }
  } catch (error) {
    console.error('Exception:', error);
    displayMessage('assistant', 'Error communicating with the server.');
  }
}

function displayMessage(role, content) {
  const chatContainer = document.getElementById('chat-container');
  const messageElement = document.createElement('div');
  messageElement.className = role;
  messageElement.textContent = `${role === 'user' ? 'User' : 'AI'}: ${content}`;
  chatContainer.appendChild(messageElement);
}
```

> **Note**: Do not include your API key in the frontend code. Always keep it secure on the server-side.

#### Server-Side Usage

Set up an Express.js server to handle API requests:

```javascript
const express = require('express');
const cors = require('cors');
const { ConversationManager, InMemoryStorage } = require('openai-memory');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY; // Use environment variables for security.
const conversationManager = new ConversationManager({
  apiKey,
  model: 'gpt-3.5-turbo',
  storage: new InMemoryStorage(), // Use appropriate storage.
});

app.post('/api/chat', async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: 'conversationId and message are required.' });
    }

    const reply = await conversationManager.sendMessage(conversationId, message);
    res.json({ content: reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
```

### Contributing

We welcome contributions to **OpenAI Memory**! Whether it's reporting a bug, suggesting an enhancement, or submitting a pull request, your input is valued.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Contact

For any questions, suggestions, or feedback, please contact [love1ace](mailto:lovelacedud@gmail.com).