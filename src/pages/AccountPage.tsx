import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogOut, User, Mail, Calendar } from 'lucide-react';

export default function AccountPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setProfile({
        email: user.email,
        ...profileData
      });

      setLoading(false);
    };

    load();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-2xl mx-auto rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Your Account
        </h1>

        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <User className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Display Name</p>
              <p className="font-semibold text-gray-900">{profile.display_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <Mail className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-900">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-semibold text-gray-900">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-2xl transition"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </main>
  );
}
