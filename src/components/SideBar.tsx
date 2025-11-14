import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Loader2,
  MessageCircle,
  PiggyBank,
  Trophy
} from 'lucide-react';
import finImg from '../assets/finbuddy.png';
import { supabase, type Database } from '../lib/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/expenses', label: 'Expenses', icon: PiggyBank },
  { to: '/achievements', label: 'Achievements', icon: Trophy }
];

export default function SideBar() {
  const [profile, setProfile] = useState<Pick<UserProfile, 'display_name'> | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      setLoadingProfile(true);

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const user = data.session?.user;
        if (!user) {
          setProfile(null);
          setUserEmail(null);
          return;
        }

        setUserEmail(user.email ?? null);

        // --- AUTO-CREATE PROFILE ON FIRST LOGIN ---
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('display_name')
          .eq('id', user.id)
          .maybeSingle();

        let finalProfile = profileData;

        // If no profile exists → create one automatically
        if (!profileData) {
          const defaultName = user.email?.split('@')[0] ?? 'New Finley User';

          const { data: created, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              display_name: defaultName,
            })
            .select('display_name')
            .maybeSingle();

          if (!createError) {
            finalProfile = created;
          } else {
            console.error('Failed to auto-create profile:', createError);
          }
        }

        if (!active) return;
        setProfile(finalProfile);

      } catch (err) {
        if (!active) return;
        console.error('Unable to load profile', err);
        setProfile(null);
        setUserEmail(null);
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // User just logged out
        setProfile(null);
        setUserEmail(null);
        return;
      }

      // User logged in or session changed → fetch profile again
      setUserEmail(session.user.email ?? null);

      supabase
        .from('user_profiles')
        .select('display_name')
        .eq('id', session.user.id)
        .maybeSingle()
        .then(({ data }) => setProfile(data));
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);


  const initials = profile?.display_name
    ? profile.display_name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : userEmail
    ? userEmail.charAt(0).toUpperCase()
    : null;

  return (
    <aside
      className={`flex h-screen flex-col justify-between border-r border-white/60 bg-white/90 py-6 shadow-xl backdrop-blur transition-all duration-300 ${
        collapsed ? 'w-20 px-2' : 'w-full max-w-xs px-4'
      }`}
    >
      {/* --- TOP LOGO + COLLAPSE BUTTON --- */}
      <div>
        {collapsed ? (
          <div className="mb-8 flex justify-center">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
              aria-label="Expand sidebar"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative mb-8 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 pr-10">
              <img src={finImg} alt="Finley logo" className="h-12 w-12" />
              <div>
                <p className="text-lg font-bold text-gray-900">Finley</p>
                <p className="text-sm text-gray-500">Financial flow, grounded</p>
              </div>
            </div>
          </div>
        )}

        {/* --- NAVIGATION --- */}
        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  collapsed ? 'justify-center px-0' : '',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* --- BOTTOM USER SECTION --- */}
      <div
        className={`rounded-2xl px-4 py-3 transition-all duration-300 ${
          collapsed ? 'flex items-center justify-center px-2 py-2' : ''
        }`}
      >
        <Link
          to="/account"
          className="flex items-center gap-3 hover:bg-gray-100/70 rounded-2xl p-2 transition"
        >
          <Avatar className="h-10 w-10 bg-indigo-100 text-indigo-600">
            {loadingProfile ? (
              <AvatarFallback>
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </AvatarFallback>
            ) : (
              <AvatarFallback className="text-base font-semibold text-indigo-600">
                {initials || '??'}
              </AvatarFallback>
            )}
          </Avatar>

          {!collapsed && (
            <div className="flex-1">
              {profile?.display_name || userEmail ? (
                <>
                  <p className="text-sm font-semibold text-gray-900">
                    {profile?.display_name || userEmail}
                  </p>
                  <p className="text-xs text-gray-500">View account</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-indigo-600">Guest Explorer</p>
                  <p className="text-xs text-indigo-500">Sign in to sync</p>
                </>
              )}
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
