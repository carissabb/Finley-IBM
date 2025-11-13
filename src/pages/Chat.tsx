import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, MessageSquarePlus } from 'lucide-react';
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {messages.length === 1 && (
          <section className="rounded-[32px] border border-white/60 bg-white/90 p-6 text-center shadow-2xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Recommended Prompts
            </p>
            <p className="mt-2 text-base text-gray-600">
              Choose a spark to start the conversation.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {QUICK_START_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleQuickStart(topic.prompt)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  <MessageSquarePlus className="h-4 w-4 text-indigo-500" />
                  {topic.label}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-1 flex-col rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="flex-1 overflow-y-auto rounded-2xl bg-gradient-to-br from-white to-indigo-50/40 p-6 shadow-inner">
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <div key={index} className={`mb-6 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-lg ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white/90 text-gray-800'
                    }`}
                  >
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                    <p
                      className={`mt-3 text-xs ${
                        isUser ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow">
                  Finley is thinking
                  <span className="ml-2 inline-flex items-center">
                    <span className="mx-0.5 h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                    <span className="mx-0.5 h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                    <span className="mx-0.5 h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="rounded-3xl border border-gray-200 bg-white shadow-inner">
              <textarea
                ref={inputRef}
                rows={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Finley anything about budgets, goals, or money wins..."
                className="h-full w-full resize-none rounded-3xl bg-transparent px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none"
                disabled={isTyping}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Finley can make mistakes. Check important info.
              </p>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-60"
                disabled={isTyping || !inputValue.trim()}
              >
                {isTyping ? 'Finley is replying...' : 'Send to Finley'}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
