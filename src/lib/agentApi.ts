const AGENT_API_KEY = import.meta.env.VITE_AGENT_API_KEY || '';
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
  if (!IBM_PROJECT_ID || !IBM_MODEL_ID) {
    return "Hi! I'm Finley, your financial friend! 🌟 To connect with the real AI assistant, please configure your VITE_AGENT_API_URL and VITE_AGENT_API_KEY in the .env file. For now, I'm here to help you explore budgeting, saving, and achieving your financial goals!";
  }

  try {
    const token = await getIamToken();

    const res = await fetch(`${AGENT_API_URL}/ml/v1/text/generation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ml.project_id': IBM_PROJECT_ID
      },
      body: JSON.stringify({
        model_id: IBM_MODEL_ID,
        input: toPrompt(conversationHistory, message),
        parameters: {
          max_new_tokens: 300,
          temperature: 0.4,
          top_p: 0.9,
          stop_sequences: ["\nUser:"]
        }
      })
    });

    if (!res.ok) {
      throw new Error(`IBM watsonx.ai error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json() as {
      results?: { generated_text: string }[];
      generated_text?: string;
      output_text?: string;
    };

    const reply = data?.results?.[0]?.generated_text
      ?? data?.generated_text
      ?? data?.output_text
      ?? "Sorry, I don't have an answer right now.";

    return reply.trim();
  } catch (err) {
    console.error("Finley error:", err);
    return "Hmm, I had trouble reaching the model. Double-check the IBM credentials in your .env.";
  }
}
