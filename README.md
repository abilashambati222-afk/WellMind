# WellMind - AI-Powered Mental Wellness Platform

WellMind is a modern, premium, glassmorphism-designed mental wellness and mindfulness web portal. It leverages AI assistance and interactive features to help users manage stress, improve sleep, and combat anxiety.

---

## 🚀 Key Features

*   **🔒 OTP Verification Flow**: Secure registration and login. After entering credentials, a 6-digit OTP code is sent to the user's email (or printed to the console locally) and verified before giving access.
*   **🎓 Profile-Based Onboarding**: Dynamically categorizes users on first sign-in into **Student**, **Job Holder**, or **Senior / Old Age** to deliver personalized wellness plans.
*   **📊 Mood Tracking & Analytics**: Interactive daily check-ins with dynamic line charts analyzing emotional trends over the week.
*   **💤 Soothing Soundscapes & Meditation**: Procedurally generated ocean waves, pink noise rain, and Solfeggio Solfeggio frequency chimes.
*   **🧠 Personal AI Companion (Ebb)**: Real-time wellness guidance powered by server endpoints.
*   **🏜️ Mindful Interactive Games**: Zen Sand Garden raking, lotus pond breathing, and popping bubble breathing exercises.

---

## 📁 Repository Structure

```text
wellmind/
├── dist/                          # Compiled production bundles
├── public/                        # Static assets (icons, images)
├── server/                        # Express API Backend
│   ├── models/                    # MongoDB Schemas (User.js)
│   ├── server.js                  # Main server entrypoint (port 5000)
│   └── package.json               # Backend dependencies
├── .env                           # Local environment config (Private/Untracked)
├── index.html                     # Main SPA entrypoint
├── main.js                        # Single Page App routing, logic, & Audio Engine
├── style.css                      # Glassmorphism & premium UI design stylesheet
└── package.json                   # Frontend dependencies
```

---

## 🛠️ Local Installation & Setup

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017`)

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# MongoDB Connection URI
MONGO_URI=mongodb://127.0.0.1:27017/wellmind

# JWT Secret for session signing
JWT_SECRET=wellmind_secret_session_key

# SMTP Configuration for sending real OTP emails via Gmail
# (Required to get real verification emails in your inbox)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 4. Start Development Servers
```bash
npm run dev:all
```
This starts both the **Vite dev server** (port `5173`) and the **Express backend** (port `5000`) concurrently.

---

## 🧪 Testing OTP Email Setup

To test the OTP authentication flow:
1. Navigate to `http://localhost:5173/#/signup`.
2. Enter your credentials and click **Continue** -> select your goals and click **Finish Registration**.
3. If `SMTP_USER` and `SMTP_PASS` are configured in `.env`, check your inbox for the OTP.
4. If not configured, check the **server terminal console** where the code will be printed in a box as a fallback.


# Well-Mind

## AI-Powered Mental Wellness and Mindfulness Platform

Well-Mind is a web-based mental wellness platform designed to support users in improving their emotional well-being through AI-assisted guidance, mood tracking, meditation resources, sleep support, and self-help activities.

### Features
- User Registration and Login
- Mood Tracking Dashboard
- AI Mental Health Assistant
- Meditation Resources
- Sleep Support
- Self-Assessments
- Counseling Referral System
- Interactive Wellness Activities

### Technology Stack
- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MongoDB
- Chart.js
- Web Audio API
- OpenAI API (Optional)

### Project Team
- A. Laxmi Sriya – 24BD1A05C4
- A. Abhilash – 24BD1A05C6
- M. Thanmai – 24BD1A05D8
- Sheethal – 24BD1A05GH
- Renuka – 24BD1A05GY

### Guide
Gnanesh Sir

### Live Website
https://well-mind-lime.vercel.app
