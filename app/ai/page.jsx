'use client';
import { useState, useRef, useEffect } from 'react';
import Header from '../_components/Header';

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your Return Management Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.text }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black text-white relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-5xl h-[calc(100vh-88px)] flex flex-col relative z-10">
                <div className="flex-1 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-500">

                    {/* Chat Header Area */}
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
                        <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-400">
                                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                                <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 002.322-4.446z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Return Assistant</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <span className="text-xs text-blue-200/60 font-medium uppercase tracking-wider">AI Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 transition-colors">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-3xl px-6 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-sm shadow-[0_4px_20px_-5px_rgba(37,99,235,0.4)]'
                                        : 'bg-white/10 text-gray-100 rounded-bl-sm border border-white/5 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.2)]'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap text-[15px] leading-7 font-light tracking-wide">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white/5 rounded-3xl rounded-bl-sm px-6 py-5 border border-white/5 flex items-center space-x-2 backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-blue-400/80 rounded-full animate-[bounce_1s_infinite_0ms]" />
                                    <div className="w-2 h-2 bg-purple-400/80 rounded-full animate-[bounce_1s_infinite_200ms]" />
                                    <div className="w-2 h-2 bg-pink-400/80 rounded-full animate-[bounce_1s_infinite_400ms]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 flex gap-3 relative">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 pl-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all font-light tracking-wide group-hover:bg-black/40 group-hover:border-white/20"
                                disabled={isLoading}
                            />
                            {/* Input Glow */}
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none group-hover:ring-white/10 transition-all" />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-2xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] active:scale-95 flex items-center justify-center aspect-square"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transform rotate-[-45deg] relative left-[2px]">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
