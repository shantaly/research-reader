'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      router.push('/reader');
      return;
    }

    // If it's a URL, pass it directly; otherwise treat as ID
    const isUrl = input.startsWith('http://') || input.startsWith('https://');
    const query = isUrl ? `url=${encodeURIComponent(input)}` : `id=${input.trim()}`;
    
    router.push(`/reader?${query}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold mb-2">
          Article Learning Assistant
        </h1>
        <p className="text-xl mb-8">
          Enter an article ID (e.g., 2307.16832v1) or paste a PDF URL
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Enter article ID or paste URL"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
