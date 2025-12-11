'use client';

import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-white/10 text-white p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="z-50">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                        RMS
                    </h1>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:tracking-wide">
                            Create Return
                        </Link>
                        <Link href="/ai" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:tracking-wide">
                            AI Assistant
                        </Link>
                    </nav>

                    <div className="flex gap-4 items-center pl-6 border-l border-white/10">
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
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden z-50 p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>

                {/* MOBILE MENU OVERLAY */}
                {isMenuOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 md:hidden flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-top-10 duration-300">
                        <nav className="flex flex-col items-center gap-6">
                            <Link
                                href="/"
                                className="text-2xl font-light text-white hover:text-blue-400 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Create Return
                            </Link>
                            <Link
                                href="/ai"
                                className="text-2xl font-light text-white hover:text-blue-400 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                AI Assistant
                            </Link>
                        </nav>

                        <div className="flex flex-col gap-4 mt-8 w-64">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="w-full px-6 py-3 text-lg font-medium border border-white/20 hover:bg-white/10 rounded-xl transition-all">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="w-full px-6 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all">
                                        Get Started
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex justify-center transform scale-150 p-2">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-12 h-12 border-2 border-white/20 hover:border-white/50 transition-colors shadow-lg"
                                            }
                                        }}
                                        userProfileMode="modal"
                                    />
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
