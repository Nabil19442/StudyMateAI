# 🎓 StudyMate AI - Your Personal AI Study Assistant

> A complete, production-quality AI tutor web application tailored for university students. Powered by Hugging Face Inference and modern React.

---

## 📌 Table of Contents
1. [What is StudyMate AI?](#1-what-is-studymate-ai)
2. [Key Features](#2-key-features)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [How to Install](#5-how-to-install)
6. [How to Get a Free Hugging Face Token](#6-how-to-get-a-free-hugging-face-token)
7. [Where to Put Your HF_TOKEN](#7-where-to-put-your-hf_token)
8. [How to Run the Application](#8-how-to-run-the-application)
9. [How the Architecture Works](#9-how-the-architecture-works)
10. [Common Errors & How to Fix Them](#10-common-errors--how-to-fix-them)
11. [How to Change the AI Model](#11-how-to-change-the-ai-model)
12. [For Beginners: Read LEARN.md](#12-for-beginners-read-learnmd)

---

## 1. What is StudyMate AI?

**StudyMate AI** is an intelligent, friendly AI tutor designed specifically for university students studying computer science, engineering, and mathematics. Instead of simply handing out raw answers, StudyMate AI guides students step-by-step through core concepts, provides beginner-friendly code examples, formulates study plans, and generates practice quizzes.

StudyMate AI natively supports **English**, **বাংলা (Bangla)**, and **Banglish** (e.g., *"recursion ta easy kore bujhao"*).

---

## 2. Key Features

- 👨‍🏫 **University Tutor Persona**: Explains concepts patiently with real-world analogies and clean code.
- 🌐 **Multilingual Support**: Fluently understands and responds in English, Bangla, and Banglish.
- 💻 **Syntax-Highlighted Code Blocks**: Displays language labels and includes a 1-click **Copy Code** button.
- 📝 **Rich Markdown Formatting**: Renders bullet lists, bold text, headings, blockquotes, and tables smoothly.
- 💾 **Local Conversation History**: Saves all chat sessions, messages, and titles directly to the browser's `localStorage`—no database required!
- ⏳ **Thinking State**: Animated indicator showing *"StudyMate is thinking..."* with bouncing dots while requests are processed.
- 📱 **Fully Responsive**: Sleek desktop layout with a sidebar drawer on mobile and tablets.
- 🔒 **Secure Architecture**: Your Hugging Face token is stored strictly on the Node.js backend and is never exposed to the client.

---

## 3. Tech Stack

### Frontend:
- **React (v18)** - Component-based user interface.
- **Vite** - Lightning-fast frontend build tool and local dev server.
- **Tailwind CSS** - Modern utility styling with a curated violet palette (`#6D35C8`).
- **Lucide React** - Clean and accessible modern UI icons.
- **React Markdown & Remark GFM** - GitHub-flavored markdown parsing.

### Backend:
- **Node.js & Express.js** - Lightweight, reliable REST API server.
- **@huggingface/inference** - Official Hugging Face JavaScript SDK.
- **dotenv** - Secure environment variable management.
- **cors** - Cross-Origin Resource Sharing middleware.

### AI Model:
- **Model**: `openai/gpt-oss-120b` (accessible via Hugging Face Inference Providers).

---

## 4. Project Structure

```text
studymate/
├── package.json              # Root package script (runs server & client together)
├── .gitignore                # Protects secrets (.env) and excludes node_modules
├── README.md                 # Complete documentation & quickstart guide
├── LEARN.md                  # Beginner educational guide on APIs, tokens, etc.
│
├── server/                   # Backend (Node.js + Express)
│   ├── server.js             # Express app setup, CORS, health endpoint, error handling
│   ├── routes/
│   │   └── chat.js           # POST /api/chat endpoint with request validation
│   ├── services/
│   │   └── huggingface.js    # Hugging Face client & 14-rule tutor system prompt
│   ├── .env                  # Your private environment variables (DO NOT COMMIT)
│   ├── .env.example          # Template for environment variables
│   └── package.json          # Backend dependencies
│
└── client/                   # Frontend (React + Vite + Tailwind CSS)
    ├── index.html            # HTML entry point with Google Fonts (Outfit, Inter)
    ├── vite.config.js        # Vite config with /api proxy to backend
    ├── tailwind.config.js    # Design system palette, shadows, and fonts
    ├── postcss.config.js     # PostCSS setup
    ├── package.json          # Frontend dependencies
    └── src/
        ├── components/
        │   ├── Sidebar.jsx          # New Chat, conversation history, mobile drawer
        │   ├── ChatWindow.jsx       # Header, scrollable feed, and bottom input
        │   ├── MessageBubble.jsx    # User & AI bubbles with Markdown and Code Copy
        │   ├── ChatInput.jsx        # Multiline textarea with Enter/Shift+Enter shortcuts
        │   ├── WelcomeScreen.jsx    # Robot hero & clickable study suggestion cards
        │   ├── ThinkingIndicator.jsx# Animated bouncing dots loader
        │   └── SettingsModal.jsx    # AI status & token instructions modal
        ├── utils/
        │   └── storage.js           # LocalStorage helpers for chat persistence
        ├── App.jsx                  # Main application state and API coordination
        ├── main.jsx                 # React root renderer
        └── index.css                # Global styles, scrollbars, and markdown typography
```

---

## 5. How to Install

Make sure you have [Node.js](https://nodejs.org/) installed (v18 or newer).

Open your terminal in the root `studymate` directory and run:

```bash
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Return to root
cd ..
```

*(Or simply run `npm run install:all` from the root directory).*

---

## 6. How to Get a Free Hugging Face Token

1. Go to [https://huggingface.co](https://huggingface.co) and sign up for a free account (or log in).
2. Click on your profile picture in the top-right corner and select **Settings**.
3. In the left menu, click **Access Tokens** (or navigate directly to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)).
4. Click **Create new token**.
5. Set:
   - **Token type**: `Read`
   - **Name**: `studymate-token`
6. Click **Generate a token** and copy the resulting string (it starts with `hf_...`).

---

## 7. Where to Put Your HF_TOKEN

1. Navigate to the `server/` directory.
2. Open the file named `.env`. (If it does not exist, copy `.env.example` and rename it to `.env`).
3. Set your token:

```env
PORT=5000
HF_TOKEN=hf_your_actual_token_here
HF_MODEL=openai/gpt-oss-120b
```

> ⚠️ **Important Security Rule**: Never share your token, and never commit `server/.env` to GitHub. It is already added to `.gitignore`.

---

## 8. How to Run the Application

You can run both the frontend and backend with a single command from the project root:

### Option A: Run Both Together (Recommended)
```bash
npm run dev
```
This runs the Express backend on `http://localhost:5000` and the Vite frontend on `http://localhost:5173` concurrently.

### Option B: Run in Separate Terminals

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*Backend will start at: `http://localhost:5000`*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*Frontend will start at: `http://localhost:5173`*

Now open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 9. How the Architecture Works

```text
  React Client (Browser)
          │
          │ 1. User sends a message (or clicks suggestion)
          ▼
   POST /api/chat (JSON payload)
          │
          │ 2. Vite proxies request to Express backend
          ▼
  Node.js Express Server (Port 5000)
          │
          │ 3. Validates request & appends System Prompt
          ▼
  Hugging Face Inference SDK (@huggingface/inference)
          │
          │ 4. Authenticates with private HF_TOKEN
          ▼
   Hugging Face Model (e.g. openai/gpt-oss-120b)
          │
          │ 5. Generates AI response text
          ▼
  Express Backend receives response
          │
          │ 6. Sends JSON: { "reply": "..." }
          ▼
  React Client updates UI & saves to browser localStorage
```

---

## 10. Common Errors & How to Fix Them

### 1. `Hugging Face API token is missing or not configured`
- **Cause**: You haven't added your token to `server/.env`.
- **Fix**: Open `server/.env`, set `HF_TOKEN=hf_...`, save, and restart the backend.

### 2. `Failed to fetch` or `Network Error`
- **Cause**: The Express backend is not running.
- **Fix**: Ensure the backend server is running in a terminal (`cd server && npm run dev`). Check `http://localhost:5000/api/health` in your browser.

### 3. `Model is currently loading`
- **Cause**: Some Hugging Face models take 20–30 seconds to wake up on the free tier when cold.
- **Fix**: Wait 30 seconds and send your message again.

### 4. `400 Invalid request: messages must be a non-empty array`
- **Cause**: Empty message payload sent.
- **Fix**: Type a message before hitting Send.

---

## 11. How to Change the AI Model

StudyMate AI uses `openai/gpt-oss-120b` by default. If you want to experiment with other models available on Hugging Face:

1. Open `server/.env`.
2. Change the `HF_MODEL` variable:
   ```env
   # Example: Switch to Qwen or Llama models
   HF_MODEL=Qwen/Qwen2.5-72B-Instruct
   ```
3. Restart the server.

---

## 12. For Beginners: Read LEARN.md

If you are new to AI engineering, APIs, and full-stack development, open [`LEARN.md`](./LEARN.md). It contains beginner-friendly explanations with real-world analogies explaining how every component works under the hood.

Happy Studying with **StudyMate AI**! 🚀
