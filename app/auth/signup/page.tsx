'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccess(true);
        // Auto-login après signup
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
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
            Create Account
          </h1>
          <p className="text-gray-400">Join Legacy Vault and secure your legacy</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Account Created!</h3>
              <p className="text-gray-400">Redirecting you to the homepage...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#D4AF37] hover:text-yellow-300">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}