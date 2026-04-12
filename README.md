# AI Memory Companion 🕊️

AI Memory Companion is an emotionally intelligent SaaS application designed for grief support and memory healing. It uses OpenAI's GPT models to provide a warm, empathetic space to honor and interact with the legacy of loved ones through memories.

## ✨ Features

- **Emotionally Intelligent AI**: Adapts its tone based on your mood (Sad, Lonely, Normal).
- **Memory Management**: Create a dedicated space for special moments and memories.
- **Personalized Memorials**: Build a detailed profile for your loved one to guide the AI's persona.
- **Premium SaaS UI**: Modern, glassmorphism-inspired design with smooth animations.
- **Privacy First**: Secure authentication and private data storage.
- **Healthy Boundaries**: Encourages real-world connections and provides grief support resources.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Deployment**: Vercel-ready

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ORM**: Mongoose
- **AI**: OpenAI API
- **Auth**: JWT & BcryptJS
- **Deployment**: Render-ready

---

## 🛠️ Local Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd AI-Memory-Companion
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret_key
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` folder:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```

---

## 🗄️ MongoDB Atlas Setup Guide

1.  Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Go to **Network Access** and whitelist IP `0.0.0.0/0` (for development).
3.  Go to **Database Access** and create a user with a password.
4.  Click **Connect** -> **Connect your application** and copy the connection string.
5.  Paste it into `backend/.env` as `MONGO_URI`.
    - Format: `mongodb+srv://username:password@cluster.mongodb.net/aimemory`

---

## 🌍 Deployment Guide

### Frontend (Vercel)
1.  Install Vercel CLI: `npm install -g vercel`
2.  Inside `frontend/` folder, run: `vercel`
3.  Add environment variable `VITE_API_URL` (your backend URL) in Vercel dashboard.

### Backend (Render)
1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  **Root Directory**: `backend`
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`
6.  Add Environment Variables:
    - `MONGO_URI`
    - `OPENAI_API_KEY`
    - `JWT_SECRET`
    - `PORT` (usually 5000 or Render will assign)

---

## 📜 AI Ethics & Boundaries
This application is built with the following core principles:
- **AI Inspired, Not Real**: The AI clearly states it is inspired by memories and is not the actual person.
- **Hinglish Support**: Natural language mixing for a familiar feel.
- **Healthy Recovery**: If signs of extreme dependency are detected, the AI gently encourages seeking professional help or connecting with real-life support networks.

---

Built with ❤️ for those who remember.
