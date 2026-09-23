# 📘 StudyMate AI - Beginner's Guide to AI & Web Development

Welcome to the learning guide for **StudyMate AI**!

If you are a beginner in programming or AI engineering, this guide breaks down all the core concepts used in this project in clear, simple language with real-world analogies.

---

## 🗺️ The Complete Journey of a Message

Here is what happens every time you type a question and get an answer:

```text
       ┌──────────┐
       │   User   │
       └────┬─────┘
            │ Types: "Recursion ta easy kore bujhao"
            ▼
       ┌──────────┐
       │  React   │ (Frontend in your browser)
       └────┬─────┘
            │ Sends HTTP POST request with JSON message
            ▼
       ┌──────────┐
       │ Express  │ (Backend server on your machine)
       └────┬─────┘
            │ Attaches secret HF_TOKEN and System Prompt
            ▼
       ┌──────────────┐
       │ Hugging Face │ (Cloud AI platform API)
       └────┬─────────┘
            │ Hands data over to the neural network
            ▼
       ┌──────────┐
       │ AI Model │ (openai/gpt-oss-120b)
       └────┬─────┘
            │ Computes reply: "অবশ্যই! Recursion হলো..."
            ▼
       ┌──────────┐
       │ Express  │ (Receives text, sanitizes, packages as JSON)
       └────┬─────┘
            │ Sends reply back to browser
            ▼
       ┌──────────┐
       │  React   │ (Renders Markdown & saves to localStorage)
       └────┬─────┘
            │ Displays formatted response & code blocks
            ▼
       ┌──────────┐
       │   User   │ (Reads the answer & learns!)
       └──────────┘
```

---

## 1. What is an API?

**API** stands for **Application Programming Interface**.

### 🍽️ Real-World Analogy: The Restaurant Waiter
Imagine you sit down at a restaurant.
- You are the **Customer** (the client/frontend).
- The chef in the kitchen is the **Database / AI Model**.
- You cannot just walk into the kitchen and touch the stove yourself.
- Instead, you talk to the **Waiter** (the **API**). You hand the waiter your order (request), the waiter takes it to the kitchen, waits for the meal to be cooked, and brings the plate back to your table (response).

In code, an API is a messenger that lets two different software applications talk to each other over the internet using standardized messages.

---

## 2. What is Hugging Face?

**Hugging Face** is often called the *"GitHub of Artificial Intelligence"*.

It is the world's most popular platform where AI researchers, companies, and developers share:
- Pre-trained machine learning models (like GPT models, LLMs, vision models).
- Datasets.
- **Inference Providers**: Servers with powerful GPUs (graphics cards) that run AI models so you don't need a $10,000 graphics card on your own laptop to run big AI models.

---

## 3. What is an AI Model?

An **AI Model** (or Large Language Model / LLM) is a vast mathematical neural network trained on billions of sentences from books, websites, and code repositories.

It doesn't "think" like a human, but it has learned the deep grammatical, logical, and semantic patterns of human language and computer programming. Given a sequence of words (a prompt), it predicts the most helpful, logical next words to complete the conversation.

In StudyMate AI, we use the `openai/gpt-oss-120b` model hosted on Hugging Face.

---

## 4. What is an API Key / Token?

An **API Token** is like a digital VIP pass or a digital keycard.

When you send a request to Hugging Face:
- Hugging Face checks your token (`HF_TOKEN`) to verify who is making the request.
- It ensures you are an authorized user and keeps track of rate limits.

---

## 5. Why is the Token Kept in the Backend?

This is one of the **most critical security rules** in web development!

### ❌ If you put your token in React (Frontend):
React runs directly in the user's web browser. Anyone can press `F12` in Chrome, click on the **Network** or **Sources** tab, and view your token in plain text! If a malicious person steals your token, they can use up your quotas or rack up charges on your account.

### ✅ When you keep your token in Node.js (Backend):
The backend runs securely on a server (or your private terminal). The browser only communicates with your backend (`/api/chat`). Your backend attaches the token, communicates with Hugging Face, and sends only the AI's final text reply back to the browser.
**Your token never leaves the server.**

---

## 6. What is Express?

**Express.js** is a fast, minimalist web framework for **Node.js**.

Node.js allows you to run JavaScript outside the browser. Express makes it very easy to create an HTTP web server, listen on a specific port (like port `5000`), define routes (like `POST /api/chat`), and send back responses in JSON format.

---

## 7. What Happens When I Send a Message?

1. **User types a question** into the input box in React.
2. **React triggers `handleSendMessage()`**:
   - Creates a new message object: `{ role: "user", content: "..." }`.
   - Appends it to the active conversation.
   - Saves it to `localStorage`.
   - Activates the "StudyMate is thinking..." animation.
3. **HTTP Fetch**: React sends a `POST` request to `http://localhost:5000/api/chat` with all recent messages in the session.
4. **Express Route (`server/routes/chat.js`)**:
   - Validates that the message is not empty (returns `400 Bad Request` if invalid).
   - Calls the `generateChatReply` function in `server/services/huggingface.js`.
5. **Hugging Face Service**:
   - Prepends the **System Prompt**.
   - Authenticates using `HF_TOKEN`.
   - Sends the payload to Hugging Face's inference server.
6. **AI Response Received**:
   - Express returns `{ "reply": "Here is how recursion works..." }`.
7. **React updates the UI**:
   - Appends the AI response to the message feed.
   - Formats the response with headings, bold text, bullet points, and code copy blocks.
   - Smoothly scrolls the screen to the bottom.

---

## 8. What is a System Prompt?

A **System Prompt** is a set of foundational instructions given to an AI model before any user message.

The user usually doesn't see the system prompt in the chat bubble, but the AI keeps it in mind for every reply.

In StudyMate AI, our system prompt tells the AI:
- You are a friendly university tutor.
- You must support English, Bangla, and Banglish.
- If the user writes Banglish, respond in natural Bangla.
- Always explain concepts with beginner-friendly examples and clean code.
- Never make up fake facts.

---

## 9. What is Conversation History?

AI models are **stateless**. This means each time you make a call to an AI model, it has zero memory of what you said 2 seconds ago!

### How do chatbots remember context?
The frontend or backend sends the **entire list of previous messages** along with the new question:
```json
{
  "messages": [
    { "role": "user", "content": "What is a binary tree?" },
    { "role": "assistant", "content": "A binary tree is a tree data structure..." },
    { "role": "user", "content": "Can you give me an example in C++?" }
  ]
}
```
Because the model sees the previous turns, it knows what *"an example in C++"* refers to!

---

## 10. What is `localStorage`?

`localStorage` is a built-in key-value storage system inside every modern web browser.

- It allows web apps to save data (up to ~5MB) directly on the student's computer.
- Data saved in `localStorage` stays there even if you refresh the page or close your browser.
- In StudyMate AI, we use `localStorage` to save your chat sessions and message history without needing to set up a database like MongoDB or PostgreSQL.

---

## 11. How Frontend and Backend Communicate

The frontend (React) and backend (Express) communicate via **HTTP Requests and Responses** using **JSON** (JavaScript Object Notation):

1. **Request Method**: `POST` (used when sending data to the server).
2. **Request URL**: `/api/chat`.
3. **Request Headers**: `"Content-Type": "application/json"`.
4. **Request Body**: A JSON string containing the message array.
5. **Response Status**:
   - `200 OK`: Successful response.
   - `400 Bad Request`: User sent an invalid payload.
   - `401 Unauthorized`: Token is missing or invalid.
   - `500 Internal Server Error`: Something failed on the server or Hugging Face.
6. **Response Body**: A JSON string like `{"reply": "..."}` that React parses with `await response.json()`.

---

🎉 **Congratulations!** You now understand the fundamental architecture of modern full-stack AI web applications.
