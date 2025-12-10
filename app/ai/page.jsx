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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-88px)] flex flex-col">
                <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/5'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 rounded-2xl rounded-bl-none px-5 py-4 border border-white/5 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                        >
                            <span>Send</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A.75.75 0 003.82 8.312l9.728 1.685-9.728 1.685a.75.75 0 00-.071.148l-1.414 4.925a.75.75 0 001.025.922l15.5-5.5a.75.75 0 000-1.415l-15.5-5.5z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
