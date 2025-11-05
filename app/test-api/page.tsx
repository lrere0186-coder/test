'use client';

import { useState } from 'react';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testExpireReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/slots/expire-reservations', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to call API', details: error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <h1 className="text-4xl font-bold mb-8">API Testing Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={testExpireReservations}
          disabled={loading}
          className="bg-[#D4AF37] text-black px-6 py-3 rounded-md font-bold hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Expire Reservations API'}
        </button>

        {result && (
          <div className="bg-[#1A1A1A] p-6 rounded-lg mt-6">
            <h2 className="text-xl font-bold mb-4">Result:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}