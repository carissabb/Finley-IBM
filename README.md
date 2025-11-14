# <img src="https://github.com/carissabb/Finley-IBM/blob/main/src/assets/finbuddy.png?raw=true" alt="Finley Logo" width="40"/> Finley - Your Financial Friend  
### IBM watsonx AI Experiential Learning Lab | Challenge 3: Expenditure Patterns & Financial Planning  

---

## 🧠 Overview  

**Finley** is an AI-powered financial wellness assistant built for the **IBM watsonx AI Experiential Learning Challenge (Challenge 3: Expenditure Patterns & Financial Planning)**.  

The goal of this challenge is to **help young adults better track, interpret, and act on their spending patterns** so they can make smarter financial decisions and improve long-term planning.  

Finley addresses this problem by combining **AI-driven financial insights**, **budget tracking**, and **positive reinforcement** to make money management approachable and motivating. Instead of overwhelming users with numbers, Finley encourages them to celebrate small wins and build consistent financial habits.  

---

## 💬 About Finley  

Finley acts as your **AI financial friend** — not a formal advisor, but a supportive companion who:  
- Chats naturally about budgeting, saving, and spending habits.  
- Helps users create realistic budgets and track goals.  
- Rewards consistency through **Gamified Achievements**, turning financial progress into a fun, confidence-building journey.  

---

## 🌟 Key Features  

| Page | Description |
|------|--------------|
| **Chat Page** | Finley’s main interface — a friendly AI chatbot that answers finance questions and provides daily motivational tips. |
| **Budget Tracker** | Simple calculator that helps users create achievable savings plans and visualize weekly goals. |
| **Gamified Achievements** | Fun badge system that rewards users for setting goals, staying consistent, and checking in with Finley. |

---

## 🧩 Tech Stack  
### **Frontend**
- **React + TypeScript (Vite) + TailwindCSS** — Fast, modern UI

### **Backend & Services**
- **Supabase**
  - Authentication (email/password + Google OAuth)
  - Postgres database with Row-Level Security (RLS)
  - Tables for user profiles, budgets, savings goals, achievements, expenses

- **Node.js + Express**
  - Lightweight backend proxy for secure requests to IBM’s ML deployment

### **AI**
- **IBM watsonx.ai (Granite 8B)**
  - Powers Finley’s financial insights and assistant responses

### **Tooling**
- **Environment Variables (.env)** for Supabase + Watsonx keys

---

## ⚙️ Setup & Installation  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/carissabb/Finley-IBM.git
cd Finley-IBM
```
---

### 2️⃣ Install dependencies
```bash
npm install
```
---

### 3️⃣ Set up environment variables
Create a file named `.env` in the project root:
```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_AGENT_API_URL="https://your-api-endpoint"
VITE_IBM_PROJECT_ID="your-ibm-project-id"
VITE_IBM_MODEL_ID=ibm/"your-ibm-model-id"
AGENT_API_KEY="your-secret-key"
```

> ⚠️ **Never commit your `.env` file.** It’s already ignored via `.gitignore`.  

---

### 4️⃣ Run the express server
```bash
npm run backend
```
The backend will start on **http://localhost:3001** (or whichever port your terminal shows).

---

### 5️⃣ Run the development server
```bash
npm run dev
```
The app will start on **http://localhost:5173** (or whichever port your terminal shows).

---

## 🔒 Environment & Security

- Keep all API keys and sensitive data in **`.env`** files (excluded from git).  
- Replace placeholders in `.env.example` with your own credentials in `.env` (create this file) to connect Finley to IBM watsonx Orchestrate via API.  
- **Do not hardcode** secrets in the codebase; always read them from environment variables.  

---

## 🧭 Project Purpose

Built for **IBM’s AI Experiential Learning Lab (Challenge 3)** to show how AI can empower financial literacy and promote long-term wellness.  

Finley makes finance **personal, friendly, and motivating** — making budgeting feel simple, stress-free, and totally doable. 

---

## 👩‍💻 Contributors

- **Carissa Bostian** – Team Lead / Full-Stack Development / API Integration / AI Prompt Engineer
- **Sai Prasad Thalluri** – Data Ingestion / IBM Tooling Support
- **Atticus Wong** – Full-Stack Development / AI Workflow Support  


---

## 🏁 License

This project is for educational and demonstration purposes under the **IBM watsonx AI Experiential Learning Lab**.
