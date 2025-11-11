# 💸 Finley - Your Financial Friend  
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

- **Vite + React + TailwindCSS** – Front-end framework and styling  
- **Node / Express (API Proxy)** – Backend route to connect to Finley’s AI model  
- **IBM watsonx.ai & watsonx Orchestrate** – AI backend that powers Finley’s responses  
- **Chart.js / Recharts (optional)** – For visual spending insights  
- **.env configuration** – Securely stores API keys and environment variables  

---

## ⚙️ Setup & Installation  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/YOUR_USERNAME/finley.git
cd finley
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
VITE_AGENT_API_URL="https://your-api-endpoint"
VITE_AGENT_API_KEY="your-secret-key"
```

> ⚠️ **Never commit your `.env` file.** It’s already ignored via `.gitignore`.  
> Instead, commit a safe `.env.example` with placeholder values.

---

### 4️⃣ Run the development server
```bash
npm run dev
```
The app will start on **http://localhost:5173** (or whichever port your terminal shows).

---

## 🔒 Environment & Security

- Keep all API keys and sensitive data in **`.env`** files (excluded from git).  
- Replace placeholders in `.env.example` with your own credentials to connect Finley to IBM watsonx Orchestrate via API.  
- **Do not hardcode** secrets in the codebase; always read them from environment variables.  
- If deploying publicly, use a **backend proxy** to keep your API key off the client side.  

---

## 🧭 Project Purpose

Built for **IBM’s AI Experiential Learning Lab (Challenge 3)** to show how AI can empower financial literacy and promote long-term wellness.  

Finley makes finance **personal, friendly, and motivating** — turning “budgeting” into a journey of progress, not pressure.  

---

## 👩‍💻 Contributors

- **Carissa Bostian** – Team Lead / AI Integration  
- **Shannon Brooks** – Frontend Development  
- **Sai Prasad Thalluri** – Data & Analytics  
- **Hyungmin Kim** – UI/UX Design  
- **Atticus** – AI Workflow Support  

---

## 🏁 License

This project is for educational and demonstration purposes under the **IBM watsonx AI Experiential Learning Lab**.
