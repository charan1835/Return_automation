'use client';

import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-800/80 border-b border-white/10 text-white p-4 flex items-center justify-between shadow-lg">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Return Management System</h1>

            <nav className="flex items-center gap-6 mr-4">
                <Link href="/ai" className="text-gray-300 hover:text-white transition-colors">
                    AI Assistant
                </Link>
            </nav>
            <nav className="flex items-center gap-6 mr-4">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Create Return
                </Link>
            </nav>
            <div className="flex gap-4 items-center">
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                            Sign In
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                            Get Started
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10 border-2 border-white/20 hover:border-white/50 transition-colors"
                            }
                        }}
                    />
                </SignedIn>
            </div>
        </header>
    );
}
