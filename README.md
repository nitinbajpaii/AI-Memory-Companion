# AI Memory Companion 🕊️✨

AI Memory Companion is a premium **AI-powered emotional support and grief healing SaaS application** designed to help users preserve memories, relive cherished moments, and receive warm, empathetic conversations inspired by loved ones.

The platform combines **Groq AI** for ultra-fast emotionally intelligent conversations and **ElevenLabs Voice AI** for realistic voice-based responses with separate Male and Female companion voices.

Built as a modern **full-stack AI SaaS application**, it delivers a premium app-like experience with smooth animations, emotional voice interaction, and real-time AI companionship.

---

# ✨ Key Features

## 🧠 Emotionally Intelligent AI

Powered by **Groq API**

Features:

* Emotion-aware conversations
* Grief healing support
* Companionship experience
* Memory-inspired emotional conversations
* Ultra-fast AI responses

The AI adapts tone dynamically based on:

* Sadness
* Loneliness
* Emotional stress
* Normal conversation

---

## 🎙️ AI Voice Companion

Integrated with **ElevenLabs Voice AI**

Supports:

* Male AI companion voice
* Female AI companion voice

Users can:

* Speak directly using microphone
* Send text messages
* Receive realistic AI voice replies
* Interact in real-time

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

* Zero transcription cost
* No Gemini/OpenAI speech limits
* Low latency voice interaction
* Fully frontend-powered transcription

---

## 💙 Memory Healing Features

* Create personal memory spaces
* Preserve emotional memories
* Supportive AI conversations
* Grief healing interaction system
* Emotionally safe companionship

---

## 🔐 Secure Authentication

* JWT-based authentication
* Protected routes
* Secure login/signup
* Persistent sessions
* User profile management

---

# 🎨 Premium SaaS UI

* Dark glassmorphism UI
* Framer Motion animations
* Premium landing page
* Responsive design
* Smooth transitions
* Mobile-optimized experience

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
* openai/gpt-oss-120b
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

### Root Directory

```txt
backend
```

### Build Command

```bash
npm install
```

### Start Command

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

3. Create a database user
4. Copy the connection string
5. Add it to:

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

# ⚡ Smart Interaction System

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
* Promotes healthy emotional recovery
* Avoids harmful dependency patterns
* Supports healing and companionship
* Encourages real-world human connection

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

# 📌 Future Improvements

* Multi-language support
* Custom voice cloning
* Emotion detection analytics
* Memory timeline visualization
* AI journaling features
* Mobile app version

---

Built with ❤️ for healing, memories, emotional support, and meaningful AI conversations.
