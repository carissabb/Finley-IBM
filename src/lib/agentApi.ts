const AGENT_API_URL = import.meta.env.VITE_AGENT_API_URL || '';
const AGENT_API_KEY = import.meta.env.VITE_AGENT_API_KEY || '';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export async function sendMessageToFinley(message: string, conversationHistory: Message[]): Promise<string> {
  if (!AGENT_API_URL || !AGENT_API_KEY) {
    return "Hi! I'm Finley, your financial friend! 🌟 To connect with the real AI assistant, please configure your VITE_AGENT_API_URL and VITE_AGENT_API_KEY in the .env file. For now, I'm here to help you explore budgeting, saving, and achieving your financial goals!";
  }

  try {
    const response = await fetch(AGENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGENT_API_KEY}`,
      },
      body: JSON.stringify({
        message,
        history: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || "I'm here to help with your finances!";
  } catch (error) {
    console.error('Error calling agent API:', error);
    return "I'm having trouble connecting right now, but I'm still here to support your financial journey! Try checking your API configuration.";
  }
}
