import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowRight } from 'lucide-react';
import OpenAI from 'openai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_NVIDIA_API_KEY || 'missing-api-key',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  dangerouslyAllowBrowser: true,
});
const systemPrompt = 'You are a helpful assistant for Universe Software, a product engineering company. Be concise and helpful.';

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 h-5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-accent-lime animate-bounce"
          style={{ animationDelay: `${delay}ms`, animationDuration: '0.6s' }}
        />
      ))}
    </div>
  );
}

const inputClass = "w-full liquid-glass-input px-4 py-3 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none transition-all";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'email'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', text: "Hi! Welcome to Universe Software. How can we help you today?", sender: 'bot' },
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
    setMessages((prev) => [...prev, { id: 'typing', text: 'typing...', sender: 'bot' }]);
    try {
      const stream = await openai.chat.completions.create({
        model: import.meta.env.VITE_MODEL_LLM_SELECTION || 'nvidia/openai/gpt-oss-120b',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: input }],
        temperature: 1, top_p: 1, max_tokens: 512, stream: true,
      });
      let full = '';
      for await (const part of stream as any) {
        const delta = part?.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          setMessages((prev) => prev.map((m) => (m.id === 'typing' ? { ...m, text: full } : m)));
        }
      }
      setMessages((prev) =>
        prev.filter((m) => m.id !== 'typing').concat({ id: Date.now().toString(), text: full, sender: 'bot' })
      );
    } catch (error: any) {
      setMessages((prev) =>
        prev.filter((m) => m.id !== 'typing').concat({
          id: Date.now().toString(),
          text: `Error [${error?.status || 403}]: ${error?.message || 'Connection lost.'}`,
          sender: 'bot',
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
        className="fixed bottom-6 right-6 z-50 w-16 h-16 flex items-center justify-center rounded-full shadow-2xl overflow-hidden border border-white/20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
      >
        {!stopPulse && (
          <span className="absolute inset-0 rounded-full bg-accent-lime/20 animate-pulse pointer-events-none" />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.img
              key="icon"
              src="/images/chatbot_icon.png"
              alt="Chat"
              className="w-9 h-9 object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={spring}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-48px)] max-w-[400px] liquid-glass !rounded-[2rem] shadow-[0_32px_80px_-8px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
            style={{ maxHeight: '560px' }}
            role="dialog"
            aria-label="Chat widget"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <img src="/images/chatbot_icon.png" alt="" className="w-8 h-8 object-contain" />
              <div className="flex-1">
                <p className="font-mono text-xs font-semibold text-text-primary uppercase tracking-widest">Universe AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-lime animate-pulse" />
                  <span className="font-mono text-[10px] text-accent-lime uppercase tracking-widest">Online</span>
                </div>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 bg-white/5 rounded-full p-1">
                {(['chat', 'email'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
                      activeTab === tab ? 'bg-white/15 text-text-primary' : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {tab === 'chat' ? 'Chat' : 'Email'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' ? (
                  <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full" style={{ height: '420px' }}>
                    <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-hide">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-accent-lime/15 text-text-primary rounded-[1.2rem] rounded-tr-sm border border-accent-lime/20'
                                : 'bg-white/5 text-text-secondary rounded-[1.2rem] rounded-tl-sm border border-white/10'
                            }`}
                          >
                            {msg.id === 'typing' ? (
                              <div className="space-y-1.5">
                                <TypingDots />
                                {msg.text !== 'typing...' && <div className="text-sm text-text-secondary">{msg.text}</div>}
                              </div>
                            ) : (
                              msg.text
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-white/10 flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isLoading ? 'Computing...' : 'Ask anything…'}
                        disabled={isLoading}
                        className="flex-1 liquid-glass-input px-4 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none disabled:opacity-50"
                      />
                      <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-lime/10 border border-accent-lime/30 text-accent-lime hover:bg-accent-lime/20 transition-all disabled:opacity-40"
                        aria-label="Send"
                      >
                        {isLoading ? (
                          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <Send size={14} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 overflow-y-auto scrollbar-hide" style={{ maxHeight: '420px' }}>
                    {formSubmitted ? (
                      <div className="text-center py-10">
                        <div className="w-14 h-14 rounded-full bg-accent-lime/10 border border-accent-lime/30 flex items-center justify-center mx-auto mb-4">
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-accent-lime text-2xl">✓</motion.span>
                        </div>
                        <p className="text-base text-text-primary font-medium">Message Sent!</p>
                        <p className="text-sm text-text-muted mt-2">We'll get back to you within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-3">
                        <input type="text" placeholder="Full Name" required value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClass} />
                        <input type="email" placeholder="Email Address" required value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputClass} />
                        <input type="text" placeholder="Organization (Optional)" value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className={inputClass} />
                        <textarea placeholder="How can we help?" required rows={3} value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className={`${inputClass} resize-none`} />
                        <button type="submit"
                          className="w-full py-3 rounded-xl bg-accent-lime text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                          Send Message <ArrowRight size={14} />
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
