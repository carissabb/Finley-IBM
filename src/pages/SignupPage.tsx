import { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrorMsg(null);
  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // No inserting into user_profiles here if email confirmation is ON
    alert('Account created! Please check your email for confirmation.');
    navigate('/login');

  } catch (err) {
    setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
  } finally {
    setLoading(false);
  }
};


  const featureHighlights = [
    'Start building your financial flow',
    'Sync across all devices instantly',
    'Your data is encrypted & secure'
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-6xl grid items-center gap-12 lg:grid-cols-2">
        {/* LEFT SECTION — Same design as login */}
        <section className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700">
            <Sparkles className="w-4 h-4" />
            Create your Finley account
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Start your{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                financial journey
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Build better habits, track your money, and celebrate progress—Finley keeps you grounded every step of the way.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg shadow-purple-100 backdrop-blur"
              >
                <CheckCircle2 className="w-5 h-5 text-purple-500 mb-2" />
                <p className="text-sm font-semibold text-gray-800">{feature}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white shadow-2xl">
            <div className="rounded-2xl bg-white/20 p-3">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <p className="font-semibold">Secure & Private</p>
              <p className="text-sm text-white/80">Protected with Supabase Auth + RLS</p>
            </div>
          </div>
        </section>

        {/* RIGHT SECTION — Signup form */}
        <section className="relative">
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-30 blur-3xl" />
          <div className="rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur">
            
            <div className="mb-8 space-y-2 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
              <p className="text-sm text-gray-600">It only takes a minute.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSignup}>
              {/* Display Name */}
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-semibold text-gray-700">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-white px-12 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-white px-12 py-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Already have account */}
              <div className="text-sm font-semibold text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Already have an account?
                </button>
              </div>

              {/* SIGN UP BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-2xl"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {errorMsg && (
              <p className="mt-4 text-center text-sm text-red-500">
                {errorMsg}
              </p>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}
