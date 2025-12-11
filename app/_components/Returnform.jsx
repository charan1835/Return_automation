'use client';

import { useState, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function ReturnForm() {
    const { isSignedIn, user } = useUser();
    const { openSignIn } = useClerk();

    const [feedback, setFeedback] = useState('');
    const [orderId, setOrderId] = useState('');
    const [reasonCategory, setReasonCategory] = useState(''); // <-- NEW STATE
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

        if (!reasonCategory) {
            toast.error("Please select a return reason category.");
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
                    orderid: orderId,
                    category: reasonCategory, // <-- ADDED
                    feedback,
                    userEmail: user?.primaryEmailAddress?.emailAddress || null
                }),
            });

            if (!res.ok) {
                toast.error("Failed to submit feedback.");
                return;
            }

            toast.success("Return request submitted successfully!");

            // Reset fields
            setOrderId('');
            setFeedback('');
            setReasonCategory('');

        } catch (err) {
            console.error(err);
            toast.error("Network error. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const REASON_CATEGORIES = [
        "Product Defect/Damage",
        "Size/Fit Issue",
        "Wrong Item Received",
        "Quality Not As Expected",
        "Better Price Available",
        "Changed Mind",
        "Shipping/Delivery Issue",
        "Food Quality/Freshness", // New
        "Incorrect Food Order"    // New
    ];

    const QUICK_REASONS = [
        "Product arrived damaged",
        "Too small",
        "Too large",
        "Material quality is poor",
        "Color doesn't match photo",
        "Found a better price elsewhere",
        "Arrived too late",
        "Box was open",
        "Food arrived cold",      // New
        "Items missing from order", // New
        "Tastes spoiled/stale",   // New
        "Wrong dietary ingredients" // New
    ];

    const handleQuickFeedback = (reason) => {
        setFeedback(reason);
        textareaRef.current?.focus();
    };

    return (
        <div className="max-w-3xl mx-auto w-full p-4 md:p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-60 md:w-80 h-60 md:h-80 rounded-full bg-blue-500/10 blur-[60px] md:blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-60 md:w-80 h-60 md:h-80 rounded-full bg-purple-500/10 blur-[60px] md:blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 font-sans">
                <div className="text-center mb-8 md:mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs font-bold tracking-widest uppercase mb-4">
                        Easy Returns
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
                        Start Your Return
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg font-light tracking-wide max-w-lg mx-auto">
                        We're sorry things didn't work out. Let's get this sorted for you in seconds.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

                    {/* GRID LAYOUT FOR LARGER SCREENS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* ORDER ID FIELD */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-[0.2em] ml-1">
                                Order ID
                            </label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none shadow-inner transition-all hover:bg-black/30"
                                placeholder="#123-456-789"
                                required
                            />
                        </div>

                        {/* REASON CATEGORY DROPDOWN */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-[0.2em] ml-1">
                                Reason Category
                            </label>
                            <div className="relative">
                                <select
                                    value={reasonCategory}
                                    onChange={(e) => setReasonCategory(e.target.value)}
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-gray-100 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none shadow-inner transition-all appearance-none cursor-pointer hover:bg-black/30"
                                    required
                                >
                                    <option value="" className="bg-gray-900 text-gray-500">Select a reason...</option>
                                    {REASON_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat} className="bg-gray-900 text-gray-100">{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QUICK SELECT */}
                    <div className="space-y-4">
                        <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-[0.2em] ml-1">
                            Quick Description
                        </label>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {QUICK_REASONS.map((reason) => (
                                <button
                                    key={reason}
                                    type="button"
                                    onClick={() => handleQuickFeedback(reason)}
                                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 border backdrop-blur-sm ${feedback === reason
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
                                className="w-full p-5 bg-black/20 border border-white/10 rounded-2xl h-40 md:h-48 resize-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none text-gray-100 shadow-inner transition-all placeholder:text-gray-600 group-hover:bg-black/30 group-hover:border-white/20 text-sm md:text-base leading-relaxed"
                                placeholder="Please describe the issue in detail..."
                                required
                            />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none group-hover:ring-white/10 transition-all" />
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full relative overflow-hidden bg-white text-black font-bold py-4 px-6 rounded-xl shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
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
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </form>
            </div>
        </div>
    );
}
