import { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setErrorMsg(null);
    setLoadingEmail(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        setErrorMsg(`Error: ${error.message}`);
        return;
      }

      setFeedback('Success! Redirecting you to your dashboard...');
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to sign in right now.');
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFeedback(null);
    setErrorMsg(null);
    setLoadingGoogle(true);

    try {
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: redirectTo ? { redirectTo } : {}
      });

      if (error) {
        setErrorMsg(error.message);
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to reach Google right now.');
    } finally {
      setLoadingGoogle(false);
    }
  };

  const featureHighlights = [
    'Personalized insights every morning',
    'Realtime syncing across every device',
    'Encrypted vault with MFA protection'
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-6xl grid items-center gap-12 lg:grid-cols-2">
        <section className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
            <Sparkles className="w-4 h-4" />
            Finley makes money feel magical
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Welcome back
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Sign in to{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                continue your financial flow
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Track every dollar, celebrate achievements, and stay aligned with goals—all from one beautiful, intelligent dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg shadow-indigo-100 backdrop-blur"
              >
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mb-2" />
                <p className="text-sm font-semibold text-gray-800">{feature}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow-2xl">
            <div className="rounded-2xl bg-white/20 p-3">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <p className="font-semibold">A Secure Platform.</p>
              <p className="text-sm text-white/80">
                Secure with Auth and MFA.
              </p>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl" />
          <div className="rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur">
            <div className="mb-8 space-y-2 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Sign in to Finley</h2>
              <p className="text-sm text-gray-600">All your budgets, insights, and goals—exactly where you left them.</p>
            </div>

            <form className="space-y-6" onSubmit={handleEmailSignIn}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@finley.app"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-white px-12 py-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-white px-12 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm font-semibold">
                <button type="button" className="text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </button>
                <button type="button" className="text-purple-600 hover:text-purple-700">
                  Create an account
                </button>
              </div>

              <button
                type="submit"
                disabled={loadingEmail}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-2xl ${
                  loadingEmail ? 'opacity-80' : ''
                }`}
              >
                {loadingEmail ? 'Signing you in...' : 'Continue'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="my-8 flex items-center gap-4 text-gray-400 text-sm">
              <span className="h-px flex-1 bg-gray-200" />
              or continue with
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className="w-full rounded-2xl border-2 border-gray-100 bg-white px-6 py-3 font-semibold text-gray-800 shadow hover:border-indigo-200 hover:shadow-lg transition-all"
            >
              {loadingGoogle ? 'Connecting to Google...' : 'Continue with Google'}
            </button>

            {feedback && <p className="mt-6 text-center text-sm font-semibold text-indigo-600">{feedback}</p>}
            {errorMsg && <p className="mt-3 text-center text-sm text-red-500">{errorMsg}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
