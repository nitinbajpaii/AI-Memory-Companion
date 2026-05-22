# AI Memory Companion 🕊️✨

AI Memory Companion is a premium **AI-powered emotional support and grief healing SaaS application** designed to help users preserve memories, relive cherished moments, and receive warm, empathetic conversations inspired by loved ones.

The platform combines **Groq AI** for ultra-fast emotionally intelligent conversations and **ElevenLabs Voice AI** for realistic voice-based responses with separate Male and Female companion voices.

Built as a modern **full-stack AI SaaS application**, it delivers a premium app-like experience with smooth animations, emotional voice interaction, and real-time AI companionship.

---

# ✨ Key Features

## 🧠 Emotionally Intelligent AI

Powered by **Groq API**

Features:

* emotionally aware conversations
* grief healing support
* companionship experience
* memory-inspired emotional conversations
* ultra-fast AI responses

The AI adapts tone dynamically based on:

* sadness
* loneliness
* emotional stress
* normal conversation

---

## 🎙️ AI Voice Companion

Integrated with **ElevenLabs Voice AI**

Supports:

* Male AI companion voice
* Female AI companion voice

Users can:

* speak directly using microphone
* send text messages
* receive realistic AI voice replies
* interact in real-time

---

## 🎧 Modern Voice Interaction Architecture

VOICE INPUT
↓
Browser Speech Recognition
↓
Transcript Text
↓
Groq AI Emotional Response
↓
ElevenLabs Voice Generation
↓
Playable Audio Reply

This architecture removes expensive backend speech-to-text services and provides faster real-time interactions.

---

## ⚡ Browser-Based Speech Recognition

Uses:

* webkitSpeechRecognition
* SpeechRecognition API

Benefits:

* zero transcription cost
* no Gemini/OpenAI speech limits
* low latency voice interaction
* fully frontend-powered transcription

---

## 💙 Memory Healing Features

* create personal memory spaces
* preserve emotional memories
* supportive AI conversations
* grief healing interaction system
* emotionally safe companionship

---

## 🔐 Secure Authentication

* JWT-based authentication
* protected routes
* secure login/signup
* persistent sessions
* profile dropdown system

---

# 🎨 Premium SaaS UI

* dark glassmorphism UI
* Framer Motion animations
* premium landing page
* responsive design
* smooth transitions
* mobile optimized experience

---

# 🚀 Tech Stack

## Frontend

* React + Vite
* Tailwind CSS
* Framer Motion
* React Router DOM
* Axios
* Browser SpeechRecognition API

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* BcryptJS

## AI & Voice

* Groq API
* llama-3.1-8b-instant
* ElevenLabs Voice AI
* Male AI Voice
* Female AI Voice

## Deployment

* Frontend → Vercel
* Backend → Render
* Database → MongoDB Atlas

---

# 🛠️ Local Setup

## Clone Repository

```bash
git clone <your-repository-url>
cd AI-Memory-Companion
```

---

## Backend Setup

```bash
cd backend
npm install
npm install groq-sdk
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

## Backend `.env`

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key

ELEVENLABS_API_KEY=your_elevenlabs_api_key

ELEVENLABS_VOICE_ID_MALE=your_male_voice_id

ELEVENLABS_VOICE_ID_FEMALE=your_female_voice_id
```

---

## Frontend `.env`

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

# 🌍 Deployment

## Frontend → Vercel

```bash
cd frontend
vercel
```

---

## Backend → Render

Root Directory:

```txt
backend
```

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

---

# 🗄️ MongoDB Atlas Setup

1. Create a free cluster
2. Whitelist IP:

```txt
0.0.0.0/0
```

3. Create database user
4. Copy MongoDB connection string
5. Add in:

```env
MONGO_URI
```

---

# 🎤 Voice Features

The platform supports dual AI companion voices.

## 👨 Male Voice

Warm and emotionally supportive masculine AI voice.

## 👩 Female Voice

Soft and comforting feminine AI voice.

Users can dynamically switch between companion voices.

---

# ⚡ Smart Voice System

## Text Message Flow

TEXT INPUT
↓
Groq AI Response
↓
Text Reply

---

## Voice Message Flow

VOICE INPUT
↓
Browser SpeechRecognition
↓
Groq AI Response
↓
ElevenLabs Voice Generation
↓
Auto-play Voice Reply

---

# 🛡️ AI Safety Principles

This platform follows emotional AI safety guidelines:

* AI inspired by memories, not real identity replication
* promotes healthy emotional recovery
* avoids harmful dependency patterns
* supports healing and companionship
* encourages real-world human connection

---

# 💡 Resume Highlights

* Full-stack AI SaaS platform
* Real-time voice AI interaction
* Browser speech recognition system
* Emotion-aware AI conversation flow
* Modern premium UI/UX
* Vercel + Render deployment
* Production-ready architecture
* Portfolio-quality project

---

Built with ❤️ for healing, memories, emotional support, and meaningful AI conversations.
