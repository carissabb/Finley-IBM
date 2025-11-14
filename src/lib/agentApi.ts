export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface Message extends ConversationTurn {
  timestamp: Date;
}

// -------------------- Public API --------------------
export async function sendMessageToFinley(
  message: string,
  conversationHistory: ConversationTurn[]
): Promise<string> {
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
