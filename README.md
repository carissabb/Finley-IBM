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
- Rewards consistency through gamified achievements, turning financial progress into a fun, confidence-building journey.  

---

## 🌟 Key Features  

| Page | Description |
|------|--------------|
| **Chat Page** | Finley’s main interface — a friendly AI chatbot that answers finance questions and provides daily motivational tips. |
| **Budget Tracker** | Simple calculator that helps users create achievable savings plans and visualize weekly goals. |
| **Gamified Achievements** | Fun badge system that rewards users for setting goals, staying consistent, and checking in with Finley. |

---

## 🎥 Demo
<p align="center">
  <img src="https://github.com/user-attachments/assets/b13c3ac9-671f-4ca2-a321-f28bb31203aa" width="900"/>
</p>

---

## 🖼️ Screenshots
<p align="center">
  <img src="https://github.com/user-attachments/assets/e02046ef-2e34-4304-b17e-bc02201fd7a3" width="900"/>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/4f11e90d-c27a-4b1a-82ec-0b7cd6ee38bb" width="400"/>
  <img src="https://github.com/user-attachments/assets/4f10957e-64af-4df4-b88e-ffdbaee3beff" width="400"/>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/5e0c6274-2812-4297-bc8a-9de74c4d930b" width="400"/>
  <img src="https://github.com/user-attachments/assets/9497b0dc-2212-446c-bc7e-8699d4454162" width="400"/>
</p>

---

## 🧩 Tech Stack  
### **Frontend**
- **React + TypeScript (Vite) + TailwindCSS**

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


## 👩‍💻 Contributors

- **Carissa Bostian** – Team Lead / Full-Stack Development / API Integration / AI Prompt Engineer
- **Sai Prasad Thalluri** – Data Ingestion / IBM Tooling Support
- **Atticus Wong** – Full-Stack Development / AI Workflow Support  


---

## 🏁 License

This project is for educational and demonstration purposes under the **IBM watsonx AI Experiential Learning Lab**.
