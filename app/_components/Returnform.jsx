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

    return (
        <div className="max-w-xl mx-auto mt-12 p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl relative">

            <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Submit Feedback
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Feedback
                    </label>
                    <textarea
                        ref={textareaRef}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-40 resize-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 shadow-sm"
                        placeholder="Describe your issue or feedback..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? "Processing..." : "Submit Feedback"}
                </button>
            </form>
        </div>
    );
}
