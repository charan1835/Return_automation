'use client';

import { useState, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function ReturnForm() {
    const { isSignedIn, user } = useUser();
    const { openSignIn } = useClerk();

    const [feedback, setFeedback] = useState('');
    const [orderId, setOrderId] = useState('');    // <-- NEW
    const [isSubmitting, setIsSubmitting] = useState(false);

    const textareaRef = useRef(null);

    // Boltic Trigger URL
    const TRIGGER_URL = process.env.NEXT_PUBLIC_TRIGGER_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSignedIn) {
            toast.info("Please sign in first.");
            openSignIn();
            return;
        }

        if (!orderId.trim()) {
            toast.error("Order ID is required.");
            return;
        }

        if (!feedback.trim()) {
            toast.error("Please enter feedback.");
            textareaRef.current?.focus();
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(TRIGGER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderid: orderId,  // <-- ADDED TO PAYLOAD
                    feedback,
                    userEmail: user?.primaryEmailAddress?.emailAddress || null
                }),
            });

            if (!res.ok) {
                toast.error("Failed to submit feedback.");
                return;
            }

            toast.success("Feedback submitted successfully!");

            // Reset fields
            setOrderId('');
            setFeedback('');

        } catch (err) {
            console.error(err);
            toast.error("Network error. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const QUICK_REASONS = [
        "Product is damaged",
        "Wrong item received",
        "Better price available",
        "No longer needed",
        "Quality not as expected"
    ];

    const handleQuickFeedback = (reason) => {
        setFeedback(reason);
        textareaRef.current?.focus();
    };

    return (
        <div className="max-w-2xl mx-auto w-full p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/5 animate-in fade-in slide-in-from-bottom-8 duration-700">

            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-80 h-80 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none"></div>

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
                        Return Item
                    </h2>
                    <p className="text-gray-400 text-lg font-light tracking-wide">We're here to make this right.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* ORDER ID FIELD */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-[0.2em] ml-1">
                            Order ID
                        </label>
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-gray-100 
                                       placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/30 
                                       focus:border-blue-500/50 outline-none shadow-inner transition-all"
                            placeholder="Enter your Order ID"
                            required
                        />
                    </div>

                    {/* QUICK SELECT */}
                    <div className="space-y-4">
                        <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-[0.2em] ml-1">
                            Quick Select Reason
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {QUICK_REASONS.map((reason) => (
                                <button
                                    key={reason}
                                    type="button"
                                    onClick={() => handleQuickFeedback(reason)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-sm ${feedback === reason
                                            ? 'bg-blue-600/90 text-white border-blue-500/50 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] scale-105'
                                            : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105'
                                        }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DETAILED FEEDBACK */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-[0.2em] ml-1">
                            Detailed Feedback
                        </label>
                        <div className="relative group">
                            <textarea
                                ref={textareaRef}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full p-5 bg-black/20 border border-white/10 rounded-2xl h-48 resize-none 
                                           focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 
                                           outline-none text-gray-100 shadow-inner transition-all 
                                           placeholder:text-gray-600 group-hover:bg-black/30 group-hover:border-white/20 text-base leading-relaxed"
                                placeholder="Describe the issue with your item..."
                                required
                            />
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full relative overflow-hidden bg-white text-black font-bold py-4 px-6 rounded-xl 
                                   shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.4)] 
                                   transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform 
                                   hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Submit Return Request"
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
