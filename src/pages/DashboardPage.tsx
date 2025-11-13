import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Award, Loader2, PieChart, Sparkles, Target, Trophy, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase, type Database } from '../lib/supabase';

type Budget = Database['public']['Tables']['budgets']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];

export default function DashboardPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const hydrateDashboard = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const sessionUser = sessionData.session?.user;
        if (!sessionUser?.id) {
          setBudgets([]);
          setAchievements([]);
          setUserEmail('');
          throw new Error('Please sign in to view your dashboard.');
        }

        setUserEmail(sessionUser.email ?? 'Explorer');

        const [
          { data: budgetsData, error: budgetsError },
          { data: achievementsData, error: achievementsError }
        ] = await Promise.all([
          supabase
            .from('budgets')
            .select('*')
            .eq('user_id', sessionUser.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('achievements')
            .select('*')
            .eq('user_id', sessionUser.id)
            .order('unlocked_at', { ascending: false })
        ]);

        if (budgetsError) {
          throw budgetsError;
        }
        if (achievementsError) {
          throw achievementsError;
        }

        if (!active) {
          return;
        }

        setBudgets(budgetsData ?? []);
        setAchievements(achievementsData ?? []);
      } catch (error) {
        if (!active) {
          return;
        }
        const message =
          error instanceof Error ? error.message : 'We could not refresh your dashboard right now.';
        setErrorMessage(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    hydrateDashboard();

    return () => {
      active = false;
    };
  }, []);

  const primaryBudget = budgets[0];
  const recentAchievement = achievements[0];

  const formattedSummary = useMemo(
    () => ({
      income: primaryBudget ? formatCurrency(primaryBudget.monthly_income) : '—',
      needs: primaryBudget ? `${primaryBudget.needs_percentage}%` : '—',
      wants: primaryBudget ? `${primaryBudget.wants_percentage}%` : '—',
      savings: primaryBudget ? `${primaryBudget.savings_percentage}%` : '—',
      touchedAt: primaryBudget ? formatDate(primaryBudget.updated_at ?? primaryBudget.created_at) : null
    }),
    [primaryBudget]
  );

  const totalPoints = useMemo(
    () => achievements.reduce((sum, achievement) => sum + (achievement.points ?? 0), 0),
    [achievements]
  );

  const summaryMetrics = useMemo(
    () =>
      [
        {
          label: 'Monthly Income',
          value: formattedSummary.income,
          note: formattedSummary.touchedAt
            ? `Updated ${formattedSummary.touchedAt}`
            : 'Link your first budget to personalize this view.',
          icon: <Wallet className="w-5 h-5" />,
          iconBg: 'bg-indigo-100 text-indigo-600'
        },
        {
          label: 'Needs Allocation',
          value: formattedSummary.needs,
          note: 'Cover essentials & commitments.',
          icon: <PieChart className="w-5 h-5" />,
          iconBg: 'bg-purple-100 text-purple-600'
        },
        {
          label: 'Wants Allocation',
          value: formattedSummary.wants,
          note: 'Intentional lifestyle spending.',
          icon: <Sparkles className="w-5 h-5" />,
          iconBg: 'bg-pink-100 text-pink-600'
        },
        {
          label: 'Savings Allocation',
          value: formattedSummary.savings,
          note: 'Fuel long-term goals & cushions.',
          icon: <Target className="w-5 h-5" />,
          iconBg: 'bg-emerald-100 text-emerald-600'
        }
      ] as SummaryMetric[],
    [formattedSummary]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="rounded-[32px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold uppercase tracking-wide">
                <Sparkles className="w-4 h-4" />
                {userEmail ? `Signed in as ${userEmail}` : 'Welcome back to Finley'}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
                Your Financial Flow,{' '}
                <span className="text-white/90">
                  grounded in {primaryBudget ? 'fresh data' : 'calm focus'}
                </span>
              </h1>
              <p className="mt-3 text-white/80 text-lg max-w-2xl">
                Review budgets, celebrate achievements, and keep every goal moving forward with a
                dashboard crafted to match Finley&apos;s calm energy.
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-lg border border-white/20 w-full md:w-auto">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
                Next celebration
              </p>
              <p className="mt-2 text-2xl font-bold">
                {recentAchievement ? recentAchievement.title : 'Awaiting your next win'}
              </p>
              <p className="text-white/80 text-sm">
                {recentAchievement
                  ? `Unlocked ${formatDate(recentAchievement.unlocked_at)}`
                  : 'Track a budget or hit a savings milestone to unlock more magic.'}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="bg-white/90 border-white/70 shadow-lg backdrop-blur"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="mt-2 text-3xl font-bold text-gray-900">
                    {metric.value}
                  </CardTitle>
                </div>
                <div className={`rounded-2xl p-3 ${metric.iconBg}`}>{metric.icon}</div>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">{metric.note}</CardContent>
            </Card>
          ))}
        </section>

        {loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white/80 px-5 py-3 text-indigo-600 shadow-sm backdrop-blur">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Refreshing your personalized insights...</span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-red-100 bg-red-50/80 px-5 py-4 text-red-700 shadow">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <Card className="border-white/60 bg-white/95 shadow-xl backdrop-blur">
              <CardHeader>
                <CardDescription className="text-indigo-600 font-semibold uppercase tracking-wide">
                  Budgets
                </CardDescription>
                <CardTitle className="text-3xl text-gray-900">Your spending plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
                    Gathering your budgets...
                  </div>
                ) : budgets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
                    No budgets yet—create one to see allocations come alive in this space.
                  </div>
                ) : (
                  budgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-indigo-50/40 p-6 shadow-inner space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Monthly income</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {formatCurrency(budget.monthly_income)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Updated {formatDate(budget.updated_at ?? budget.created_at)}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          {
                            label: 'Needs',
                            value: budget.needs_percentage,
                            tone: 'from-indigo-500 to-indigo-300'
                          },
                          {
                            label: 'Wants',
                            value: budget.wants_percentage,
                            tone: 'from-pink-500 to-pink-300'
                          },
                          {
                            label: 'Savings',
                            value: budget.savings_percentage,
                            tone: 'from-emerald-500 to-emerald-300'
                          }
                        ].map((slice) => (
                          <div
                            key={`${budget.id}-${slice.label}`}
                            className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm"
                          >
                            <p className="text-sm font-semibold text-gray-500">{slice.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{slice.value}%</p>
                            <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${slice.tone}`}
                                style={{ width: `${slice.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/95 shadow-md backdrop-blur">
              <CardHeader>
                <CardDescription className="text-purple-600 font-semibold uppercase tracking-wide">
                  Focus Mix
                </CardDescription>
                <CardTitle className="text-2xl text-gray-900">Where your money wants to go</CardTitle>
              </CardHeader>
              <CardContent>
                {primaryBudget ? (
                  <div className="space-y-4">
                    {[
                      {
                        label: 'Essentials & fixed costs',
                        value: primaryBudget.needs_percentage,
                        accent: 'bg-indigo-500'
                      },
                      {
                        label: 'Lifestyle & glow-up',
                        value: primaryBudget.wants_percentage,
                        accent: 'bg-pink-500'
                      },
                      {
                        label: 'Savings & future self',
                        value: primaryBudget.savings_percentage,
                        accent: 'bg-emerald-500'
                      }
                    ].map((focus) => (
                      <div key={focus.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
                          <span>{focus.label}</span>
                          <span>{focus.value}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${focus.accent}`}
                            style={{ width: `${focus.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                    We&apos;ll visualize your allocations as soon as a budget is created.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 text-white border-none shadow-2xl">
              <CardHeader>
                <CardDescription className="text-white/80 font-semibold uppercase tracking-wide">
                  Momentum
                </CardDescription>
                <CardTitle className="text-3xl">Flow score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-4xl font-bold">{achievements.length}</p>
                    <p className="text-sm text-white/80">Total achievements</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">{totalPoints}</p>
                    <p className="text-sm text-white/80">Lifetime points</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                    Latest milestone
                  </p>
                  <p className="text-lg font-bold">
                    {recentAchievement ? recentAchievement.title : 'Keep going'}
                  </p>
                  <p className="text-sm text-white/80">
                    {recentAchievement
                      ? `Unlocked ${formatDate(recentAchievement.unlocked_at)}`
                      : 'Track consistent actions to unlock new streaks.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/95 shadow-lg backdrop-blur">
              <CardHeader>
                <CardDescription className="text-pink-600 font-semibold uppercase tracking-wide">
                  Achievements
                </CardDescription>
                <CardTitle className="text-2xl text-gray-900">Moments worth celebrating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                    Gathering your wins...
                  </div>
                ) : achievements.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                    Unlock achievements by tracking budgets, staying consistent, and reaching your
                    goals.
                  </div>
                ) : (
                  achievements.slice(0, 5).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-600/10 via-white to-pink-500/10 p-4"
                    >
                      <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-3 text-white shadow-lg">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-gray-900">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(achievement.unlocked_at)} • +{achievement.points ?? 0} pts
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/95 shadow-md backdrop-blur">
              <CardHeader>
                <CardDescription className="text-indigo-600 font-semibold uppercase tracking-wide">
                  Gentle prompts
                </CardDescription>
                <CardTitle className="text-2xl text-gray-900">Next best actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {buildRecommendations(primaryBudget, achievements).map((recommendation) => (
                  <div key={recommendation.title} className="flex items-start gap-3">
                    <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{recommendation.title}</p>
                      <p className="text-sm text-gray-600">{recommendation.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

type SummaryMetric = {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  iconBg: string;
};

function formatCurrency(value?: number) {
  if (typeof value !== 'number') {
    return '—';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'recently';
  }

  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'recently';
  }
}

function buildRecommendations(primaryBudget?: Budget, achievements: Achievement[] = []) {
  if (!primaryBudget) {
    return [
      {
        title: 'Create your first budget',
        detail: 'Add income and allocation percentages to unlock personalized insights.'
      },
      {
        title: 'Turn on notifications',
        detail: 'Stay gently nudged with reminders to track expenses and celebrate wins.'
      }
    ];
  }

  const hasRecentAchievement = Boolean(achievements[0]);

  return [
    {
      title: 'Review needs vs wants',
      detail:
        primaryBudget.needs_percentage > 50
          ? 'Consider nudging a few essentials into savings to keep goals accelerating.'
          : 'You have healthy breathing room—protect it with automatic transfers.'
    },
    {
      title: 'Lock in savings ritual',
      detail: `Automate ${primaryBudget.savings_percentage}% of income the day it arrives so momentum never stalls.`
    },
    {
      title: hasRecentAchievement ? 'Capture what worked' : 'Claim your first achievement',
      detail: hasRecentAchievement
        ? 'Journal how you unlocked your latest badge so you can replay the playbook next month.'
        : 'Track a budget or reach a savings checkpoint to start your streak.'
    }
  ];
}
