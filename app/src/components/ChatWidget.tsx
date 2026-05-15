import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import OpenAI from 'openai';
import { SplineScene } from '@/components/ui/splite';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_NVIDIA_API_KEY || 'missing-api-key',
  baseURL: `${window.location.origin}/api/nvidia`,
  dangerouslyAllowBrowser: true,
});
const systemPrompt = 'You are a helpful assistant for Universe Software, a product engineering company. Be concise and helpful.';

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 h-5">
      <span
        className="w-2 h-2 rounded-full bg-accent-lime animate-bounce"
        style={{ animationDelay: '0ms', animationDuration: '0.6s' }}
      />
      <span
        className="w-2 h-2 rounded-full bg-accent-lime animate-bounce"
        style={{ animationDelay: '150ms', animationDuration: '0.6s' }}
      />
      <span
        className="w-2 h-2 rounded-full bg-accent-lime animate-bounce"
        style={{ animationDelay: '300ms', animationDuration: '0.6s' }}
      />
    </div>
  );
}

function StatusPill({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-lime opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-lime" />
      </span>
      <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent-lime">
        {text}
      </span>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'email'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
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
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStopPulse(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsUserTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsUserTyping(false), 800);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsUserTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    // Add typing placeholder
    const typingMsg: Message = { id: 'typing', text: 'typing...', sender: 'bot' };
    setMessages((prev) => [...prev, typingMsg]);
    try {
      const stream = await openai.chat.completions.create({
        model: import.meta.env.VITE_MODEL_LLM_SELECTION || 'nvidia/openai/gpt-oss-120b',
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
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.message || 'Connection lost to the neural network.';
      setMessages((prev) =>
        prev.filter((m) => m.id !== 'typing').concat({
          id: Date.now().toString(),
          text: `Error [${error?.status || 403}]: ${errorMessage}. Please check your API configuration or model access.`,
          sender: 'bot'
        })
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
        className="fixed bottom-6 right-6 z-50 w-24 h-24 flex items-center justify-center !rounded-full shadow-2xl bg-gray-900 border border-white/10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        {!stopPulse && (
          <span className="absolute inset-0 rounded-full bg-accent-lime/20 animate-pulse-ring pointer-events-none" />
        )}

        {/* Spline container - needs pointer events for WebGL to sometimes initialize properly,
            so we remove pointer-events-none from it and put an absolute overlay for clicks */}
        <div className="absolute inset-0 z-0 scale-150 w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Clickable overlay to trigger the chat open/close */}
        <div className="absolute inset-0 z-10 rounded-full cursor-pointer" onClick={() => setOpen(!open)} />

        {/* If chat is open, we can show an overlay X to close it */}
        {open && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-[2px] rounded-full pointer-events-none">
            <X size={32} className="text-white drop-shadow-md" />
          </div>
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
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-48px)] max-w-[420px] max-h-[600px] liquid-glass !rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat widget"
          >
            {/* Header / Tab bar */}
            <div className="flex bg-white/5 backdrop-blur-md border-b border-white/10 px-2 py-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2.5 rounded-[1.5rem] font-mono text-[10px] uppercase tracking-[0.1em] transition-all relative ${
                  activeTab === 'chat' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                Intelligent Chat
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-2.5 rounded-[1.5rem] font-mono text-[10px] uppercase tracking-[0.1em] transition-all relative ${
                  activeTab === 'email' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                Direct Inquiry
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-transparent to-black/10">
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
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 scrollbar-hide">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[85%] px-5 py-3 rounded-[1.5rem] text-sm leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-white/15 text-text-primary rounded-tr-sm border border-white/10 shadow-sm'
                                : 'bg-black/20 backdrop-blur-md text-text-secondary rounded-tl-sm border border-white/5'
                            }`}
                          >
                            {msg.id === 'typing' ? (
                              <div className="space-y-2">
                                <TypingDots />
                                {msg.text !== 'typing...' && (
                                  <div className="text-sm text-text-secondary leading-relaxed">
                                    {msg.text}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm leading-relaxed">{msg.text}</div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10 flex flex-col gap-2">
                      {(isUserTyping || isLoading) && (
                        <div className="px-1">
                          <StatusPill text={isLoading ? 'Assistant is computing…' : 'You are typing…'} />
                        </div>
                      )}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={input}
                          onChange={handleInputChange}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder={isLoading ? 'Computing...' : 'Ask anything...'}
                          disabled={isLoading}
                          className={`flex-1 bg-black/20 border rounded-[1.2rem] px-5 py-3 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none disabled:opacity-50 transition-all shadow-inner ${
                            isUserTyping && !isLoading
                              ? 'border-accent-lime/50 shadow-[0_0_12px_rgba(200,241,53,0.08)]'
                              : 'border-white/10 focus:border-white/30'
                          }`}
                        />
                        <button
                          onClick={handleSend}
                          disabled={isLoading}
                          className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full text-text-primary hover:bg-white/20 transition-all disabled:opacity-50 border border-white/10 shadow-sm"
                          aria-label="Send message"
                        >
                          {isLoading ? (
                            <svg className="animate-spin h-4 w-4 text-text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
                            </svg>
                          ) : (
                            <Send size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 overflow-y-auto scrollbar-hide"
                  >
                    {formSubmitted ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-accent-lime"
                          >
                            ✓
                          </motion.div>
                        </div>
                        <p className="text-xl text-text-primary font-medium tracking-tight">
                          Transmission Received
                        </p>
                        <p className="text-base text-text-muted mt-3 leading-relaxed">
                          Our team will reach out to you within 24 hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full bg-black/20 border border-white/10 rounded-[1rem] px-5 py-3.5 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/30 transition-all"
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full bg-black/20 border border-white/10 rounded-[1rem] px-5 py-3.5 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/30 transition-all"
                          />
                          <input
                            type="text"
                            placeholder="Organization (Optional)"
                            value={formData.company}
                            onChange={(e) =>
                              setFormData({ ...formData, company: e.target.value })
                            }
                            className="w-full bg-black/20 border border-white/10 rounded-[1rem] px-5 py-3.5 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/30 transition-all"
                          />
                          <textarea
                            placeholder="How can we help?"
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            className="w-full bg-black/20 border border-white/10 rounded-[1.2rem] px-5 py-4 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/30 transition-all resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-4 mt-2 rounded-[1.2rem] bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl"
                        >
                          Send Transmission
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
