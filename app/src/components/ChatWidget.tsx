import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import OpenAI from 'openai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_NVIDIA_API_KEY,
  baseURL: `${window.location.origin}/api/nvidia`,
  dangerouslyAllowBrowser: true,
});
const systemPrompt = 'You are a helpful assistant for Universe Software, a product engineering company. Be concise and helpful.';



export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'email'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! Welcome to Universe Software. How can we help you today?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [stopPulse, setStopPulse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStopPulse(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    // Add typing placeholder
    const typingMsg: Message = { id: 'typing', text: 'typing...', sender: 'bot' };
    setMessages((prev) => [...prev, typingMsg]);
    try {
      const stream = await openai.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
        ],
        temperature: 1,
        top_p: 1,
        max_tokens: 512,
        stream: true,
      });
      let full = '';
      for await (const part of stream as any) {
        const delta = part?.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          setMessages((prev) =>
            prev.map((m) => (m.id === 'typing' ? { ...m, text: full } : m))
          );
        }
      }
      // Replace typing with final message
      setMessages((prev) =>
        prev.filter((m) => m.id !== 'typing').concat({ id: Date.now().toString(), text: full, sender: 'bot' })
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.filter((m) => m.id !== 'typing').concat({ id: Date.now().toString(), text: 'Sorry, something went wrong. Please email us at hello@universe.dev', sender: 'bot' })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent-lime flex items-center justify-center shadow-fab"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        {!stopPulse && (
          <span className="absolute inset-0 rounded-full bg-accent-lime animate-pulse-ring" />
        )}
        {open ? (
          <X size={24} className="text-bg-base relative z-10" />
        ) : (
          <MessageCircle size={24} className="text-bg-base relative z-10" />
        )}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={spring}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-48px)] max-w-[420px] max-h-[600px] bg-bg-surface border border-border-surface rounded-2xl shadow-modal flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat widget"
          >
            {/* Tab bar */}
            <div className="flex border-b border-border-surface">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 font-mono text-xs uppercase tracking-[0.08em] transition-colors relative ${
                  activeTab === 'chat' ? 'text-accent-lime' : 'text-text-muted'
                }`}
              >
                Chat
                {activeTab === 'chat' && (
                  <motion.div
                    layoutId="chatTab"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-lime"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-3 font-mono text-xs uppercase tracking-[0.08em] transition-colors relative ${
                  activeTab === 'email' ? 'text-accent-lime' : 'text-text-muted'
                }`}
              >
                Email
                {activeTab === 'email' && (
                  <motion.div
                    layoutId="chatTab"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-lime"
                  />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' ? (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full"
                  >
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${
                              msg.sender === 'user'
                                ? 'bg-accent-lime text-bg-base rounded-br-sm'
                                : 'bg-bg-elevated text-text-primary rounded-bl-sm'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-border-surface flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isLoading ? 'AI is typing...' : 'Type a message...'}
                        disabled={isLoading}
                        className="flex-1 bg-bg-base border border-border-surface rounded-lg px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent disabled:opacity-50"
                      />
                      <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="p-2.5 bg-accent-lime rounded-lg text-bg-base hover:bg-accent-dim transition-colors disabled:opacity-50"
                        aria-label="Send message"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 overflow-y-auto"
                  >
                    {formSubmitted ? (
                      <div className="text-center py-8">
                        <p className="font-body text-lg text-text-primary">
                          Message sent!
                        </p>
                        <p className="font-body text-sm text-text-secondary mt-2">
                          We&apos;ll get back to you within 24 hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Name *"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full bg-bg-base border border-border-surface rounded-lg px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent"
                        />
                        <input
                          type="email"
                          placeholder="Email *"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full bg-bg-base border border-border-surface rounded-lg px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent"
                        />
                        <input
                          type="text"
                          placeholder="Company (optional)"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          className="w-full bg-bg-base border border-border-surface rounded-lg px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent"
                        />
                        <textarea
                          placeholder="Message *"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          className="w-full bg-bg-base border border-border-surface rounded-lg px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-accent resize-none"
                        />
                        <button
                          type="submit"
                          className="w-full py-3 rounded-lg bg-accent-lime text-bg-base font-body text-sm font-medium hover:bg-accent-dim transition-colors"
                        >
                          Send Message
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}