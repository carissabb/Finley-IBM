const IBM_PROJECT_ID = import.meta.env.VITE_IBM_PROJECT_ID || '';
const IBM_MODEL_ID = import.meta.env.VITE_IBM_MODEL_ID || '';
const AGENT_API_URL = import.meta.env.VITE_AGENT_API_URL || 'https://us-south.ml.cloud.ibm.com';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// -------------------- IAM Token --------------------
let iamToken = '';
let iamExpiry = 0;

async function getIamToken(): Promise<string> {
  const now = Date.now();
  if (iamToken && now < iamExpiry - 60_000) {
    return iamToken;
  }

  const res = await fetch("http://localhost:3001/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });


  if (!res.ok) {
    throw new Error(`IAM token error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as {
    access_token: string;
    expires_in: number;
  };

  iamToken = data.access_token;
  iamExpiry = now + (data.expires_in ?? 3600) * 1000;
  return iamToken;
}

// -------------------- Prompt Builder --------------------
function toPrompt(history: Message[], userText: string): string {
  const convo = history
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');
  return `${convo}\nUser: ${userText}\nAssistant:`;
}

// -------------------- Public API --------------------
export async function sendMessageToFinley(message: string, conversationHistory: Message[]): Promise<string> {
  try {
    const res = await fetch("http://localhost:3001/api/finley", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        history: conversationHistory
      })
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "Sorry, no response.";
  } catch (err) {
    console.error("Finley error:", err);
    return "Hmm, I had trouble reaching the backend.";
  }
}

