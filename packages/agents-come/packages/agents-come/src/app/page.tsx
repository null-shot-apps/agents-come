'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GenerateResponse {
  imageUrl?: string;
  error?: string;
}

export default function TextToImage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json() as GenerateResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4">AI Text-to-Image Generator</h1>
        <p className="text-center text-gray-300 mb-12">Describe anything and watch AI bring it to life</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                Describe your image
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A serene mountain landscape at sunset with a lake reflection..."
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 resize-none"
                disabled={loading}
              />
            </div>

            <button
              onClick={generateImage}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold text-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {imageUrl && (
              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-semibold">Your Generated Image:</h2>
                <div className="relative rounded-lg overflow-hidden bg-white/5 border border-white/20">
                  <Image
                    src={imageUrl}
                    alt={prompt}
                    width={1024}
                    height={1024}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
                <a
                  href={imageUrl}
                  download="ai-generated-image.png"
                  className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                >
                  Download Image
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

