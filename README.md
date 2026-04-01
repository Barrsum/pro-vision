# 👁️ Pro.Vision - AI Image Analysis

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-Fast-yellow) ![Nvidia NIM](https://img.shields.io/badge/AI-Nvidia%20Llama%203.2-green)

**Day 01 / 30 - April Vibe Coding Challenge**

## Try the live demo - [Demo](https://.vercel.app/)

Pro.Vision is a high-performance visual intelligence tool that uses **Llama 3.2 11B Vision** (via Nvidia NIM) to analyze images and generate detailed, Markdown-formatted descriptions.

Built with a "Cyber-Industrial" aesthetic, it features a custom camera viewport, real-time quota tracking, and a fully responsive layout.

## Screenshots

![Project Screenshot](/public/home-01.png) 
![Project Screenshot](/public/home-02.png) 
![Project Screenshot](/public/home-03.png) 
![Project Screenshot](/public/home-04.png) 


## ✨ Features

*   **📸 In-Viewport Camera:** Custom-built camera interface with Front/Rear toggling (no native file picker needed).
*   **🧠 Llama 3.2 Intelligence:** accurate, semantic understanding of complex scenes.
*   **🎨 Dynamic Theming:** Premium "Deep Black" Dark Mode and "Crisp" Light Mode.
*   **⚡ Real-Time Quota:** Tracks your daily API usage limits via response headers.
*   **📱 Mobile Optimized:** A seamless, app-like experience on phones and tablets.

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide React.
*   **Backend Proxy:** Firebase Cloud Functions (Node.js).
*   **AI Model:** Meta Llama 3.2 11B Vision Instruct (Hosted by Nvidia NIM).

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Barrsum/pro-vision.git
cd pro-vision
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
You need a backend to talk to Nvidia.

**Option A: Use the Open Source Proxy (Recommended for local dev)**
I have provided a simple Node.js proxy server in a separate repo.
1.  Get your API Key from [build.nvidia.com](https://build.nvidia.com).
2.  Set up the proxy locally on port 3000.

Refer to This Repo's Readme for this steup.
[Backend Node Server Repo](https://github.com/Barrsum/Simple-Node-Backend-Server-For-Nvidia-AI-Processing)

**Option B: Configure Frontend**
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000/api/chat
# Or your production URL if you have one
```

### 4. Run the App
```bash
npm run dev
```
The app will launch on `http://localhost:4040`.



## 🛡️ Architecture & Security

This app uses a **Facade Pattern** architecture. The frontend never communicates directly with Nvidia.
1.  **Frontend** sends image -> **Secure Proxy**.
2.  **Proxy** validates Rate Limits (IP-based) & CORS.
3.  **Proxy** injects the API Key and calls Nvidia.
4.  **Result** is returned to the user.

*Note: The demo backend is rate-limited to prevent abuse.*

## 👤 Author

**Ram Bapat**
*   [LinkedIn](https://www.linkedin.com/in/ram-bapat-barrsum-diamos)
*   [GitHub](https://github.com/Barrsum)

---
*Part of the April 2026 Vibe Coding Challenge.*