'use client';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function ReturnForm() {
    const { isSignedIn, user } = useUser();
    const { openSignIn } = useClerk();
    const [explanation, setExplanation] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSignedIn) {
            openSignIn();
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/create-return', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    explanation,
                    reason,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    userImage: user?.imageUrl,
                    userName: user?.fullName,
                    userId: user?.id,
                }),
            });

            if (response.ok) {
                console.log('data transferred');
                toast.success('Return request submitted successfully!');
                setExplanation('');
                setReason('');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to submit return request.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Return Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Return</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
                        required
                    >
                        <option value="" disabled>Select a reason</option>
                        <option value="defective">Defective / Damaged</option>
                        <option value="wrong_item">Wrong Item Received</option>
                        <option value="no_longer_needed">No Longer Needed</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Explanation</label>
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
                        placeholder="Please explain why you are returning this product..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Return'}
                </button>
            </form>
        </div>
    );
}
