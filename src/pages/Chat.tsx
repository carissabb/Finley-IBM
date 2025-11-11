import { useState, useRef, useEffect } from 'react';
import { sendMessageToFinley, type Message } from '../lib/agentApi';

const QUICK_START_TOPICS = [
  { id: 'budgeting', label: '💰 Help me budget', prompt: 'Can you help me create a budget?' },
  { id: 'saving', label: '🎯 Savings tips', prompt: 'What are some good ways to save money?' },
  { id: 'investing', label: '📈 Investing basics', prompt: 'Can you explain investing for beginners?' },
  { id: 'motivation', label: '✨ Motivate me!', prompt: 'I need some financial motivation!' },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm Finley, your financial friend! 🌟 I'm here to help you build healthy money habits, create budgets, and reach your financial goals. What would you like to talk about today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await sendMessageToFinley(messageText, messages);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: "Oops! Something went wrong. But don't worry, we'll get through this together!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickStart = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat with Finley</h1>
        <p>Your encouraging financial assistant</p>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
          >
            <div className="message-bubble">
              {message.content}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message message-assistant">
            <div className="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="quick-start-buttons">
        {messages.length === 1 && (
          <>
            {QUICK_START_TOPICS.map(topic => (
              <button
                key={topic.id}
                className="quick-start-btn"
                onClick={() => handleQuickStart(topic.prompt)}
              >
                {topic.label}
              </button>
            ))}
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Finley anything about finances..."
          className="chat-input"
          disabled={isTyping}
        />
        <button type="submit" className="chat-send-btn" disabled={isTyping || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
