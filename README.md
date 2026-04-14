# AI Memory Companion 🕊️✨

AI Memory Companion is a premium **AI-powered emotional support and grief healing SaaS application** designed to help users preserve memories, relive cherished moments, and receive warm, empathetic conversations inspired by loved ones.

The platform combines **Google Gemini AI** for emotionally intelligent conversations and **ElevenLabs Voice AI** for realistic voice-based responses with **separate Male and Female companion voices**.

Built as a **resume-worthy full-stack SaaS project**, it delivers an app-like experience with a modern dark UI, smooth animations, and premium voice interaction.

---

## ✨ Key Features

### 🧠 Emotionally Intelligent AI

* Powered by **Google Gemini API**
* Emotion-aware responses
* Supports grief healing, companionship, and memory preservation
* Adapts tone based on user mood:

  * Sad / grieving
  * Lonely
  * Normal conversation

---

### 🎙️ AI Voice Companion

Integrated with **ElevenLabs Voice AI**

Supports:

* **Male companion voice**
* **Female companion voice**

Users can:

* record voice messages
* upload local audio files
* receive realistic AI voice replies

Supported audio formats:

* mp3
* wav
* m4a
* webm

---

### 🎧 Voice Interaction Flow

User Audio Input
↓
Speech to Text
↓
Gemini AI Response
↓
ElevenLabs Voice Generation
↓
Playable Audio Reply

---

### 💙 Memory Healing Features

* create personal memory spaces
* preserve special moments
* emotional support conversations
* guided grief healing experience

---

### 🔐 Secure Authentication

* JWT-based authentication
* protected routes
* persistent sessions
* secure login/signup
* user profile dropdown

---

### 🎨 Premium SaaS UI

* dark glassmorphism theme
* Framer Motion animations
* responsive dashboard
* premium landing page
* smooth page transitions

---

## 🚀 Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* Framer Motion
* React Router DOM
* Lucide React
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* BcryptJS

### AI & Voice

* Google Gemini API
* ElevenLabs API
* Male Voice
* Female Voice

### Deployment

* Frontend → Vercel
* Backend → Render
* Database → MongoDB Atlas

---

## 🛠️ Local Setup

### Clone Repository

```bash
git clone <your-repo-url>
cd AI-Memory-Companion
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret

ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID_MALE=your_male_voice_id
ELEVENLABS_VOICE_ID_FEMALE=your_female_voice_id
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🌍 Deployment

### Frontend → Vercel

```bash
cd frontend
vercel
```

### Backend → Render

**Root Directory**
backend

**Build Command**

```bash
npm install
```

**Start Command**

```bash
npm start
```

---

## 🗄️ MongoDB Atlas Setup

1. Create a free cluster
2. whitelist IP `0.0.0.0/0`
3. create DB user
4. copy connection string
5. add in `MONGO_URI`

---

## 🎤 Voice Features

The platform supports **dual AI companion voices**

### 👨 Male Voice

Warm and emotionally supportive masculine AI voice

### 👩 Female Voice

Soft and comforting feminine AI voice

Users can choose preferred voice dynamically.

---

## 📜 AI Ethics & Emotional Safety

This application follows strict emotional safety principles:

* AI inspired by memories, not the real person
* encourages healthy emotional recovery
* supports grief healing
* avoids unhealthy emotional dependency
* promotes real-world human connections

---

## 💡 Resume Highlights

* Full-stack SaaS AI product
* production-level UI/UX
* AI voice interaction system
* emotion-aware conversation flow
* deployed on Vercel + Render
* portfolio-ready project

---

Built with ❤️ for healing, memories, and meaningful conversations.
