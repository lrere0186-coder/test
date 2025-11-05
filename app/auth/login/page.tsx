'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair font-bold text-[#D4AF37] mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to your Legacy Vault account</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#0A0A0A] font-bold py-3 rounded-md hover:bg-yellow-300 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[#D4AF37] hover:text-yellow-300">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}