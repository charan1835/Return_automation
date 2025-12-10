'use client';

import { useState, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function ReturnForm() {
    const { isSignedIn, user } = useUser();
    const { openSignIn } = useClerk();

    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef(null);

    const TRIGGER_URL = process.env.NEXT_PUBLIC_TRIGGER_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSignedIn) {
            toast.info("Please sign in first.");
            openSignIn();
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
                    feedback,
                    userEmail: user?.primaryEmailAddress?.emailAddress || null
                }),
            });

            if (!res.ok) {
                toast.error("Failed to submit feedback.");
                return;
            }

            toast.success("Feedback submitted and email logged!");
            setFeedback("");

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
        <div className="max-w-xl mx-auto mt-12 p-8 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <h2 className="text-4xl font-black mb-2 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                    Submit Return
                </h2>
                <p className="text-gray-400 text-center mb-8 text-sm font-medium">We're sorry things didn't work out. Tell us why.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wider text-xs">
                            Quick Select Reason
                        </label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {QUICK_REASONS.map((reason) => (
                                <button
                                    key={reason}
                                    type="button"
                                    onClick={() => handleQuickFeedback(reason)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${feedback === reason
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                                        : 'bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-white/10 hover:border-blue-400'
                                        }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>

                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider text-xs">
                            Detailed Feedback
                        </label>
                        <textarea
                            ref={textareaRef}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full p-4 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl h-40 resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-gray-800 dark:text-gray-100 shadow-inner transition-all placeholder:text-gray-400"
                            placeholder="Please provide more details about your return request..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" opacity="0.7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Submit Request"
                            )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </form>
            </div>
        </div>
    );
}
