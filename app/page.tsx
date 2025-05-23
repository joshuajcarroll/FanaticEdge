'use client'; // This directive is necessary for client-side interactivity in the App Router

import { useState } from 'react';

export default function HomePage() {
  const [articleText, setArticleText] = useState('');
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSummary('');
    setKeywords('');

    try {
      // This will be our Next.js API route later
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary.');
      }

      const data = await response.json();
      setSummary(data.summary);
      setKeywords(data.keywords);

    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Article Summarizer & Keyword Generator</h1>

        <div className="mb-4">
          <label htmlFor="article" className="block text-gray-700 text-sm font-bold mb-2">
            Paste Article Text Here:
          </label>
          <textarea
            id="article"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48 resize-y"
            placeholder="Enter your sports article..."
            value={articleText}
            onChange={(e) => setArticleText(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !articleText.trim()}
          className={`w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline text-white font-bold transition-colors duration-200 ${
            loading || !articleText.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Summary & Keywords'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {(summary || keywords) && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
            {summary && (
              <>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Summary:</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
              </>
            )}
            {keywords && (
              <>
                <h2 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Keywords:</h2>
                <p className="text-gray-700">{keywords}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}