import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { CalendarDays, CreditCard, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Expense } from '../types/moneys';

const CATEGORY_LOOKUP: Record<
  string,
  {
    label: string;
    color: string;
    emoji: string;
  }
> = {
  'cat-groceries': { label: 'Groceries', color: 'bg-emerald-50 text-emerald-700', emoji: '🥕' },
  'cat-transport': { label: 'Transport', color: 'bg-blue-50 text-blue-700', emoji: '🚇' },
  'cat-dining': { label: 'Dining Out', color: 'bg-pink-50 text-pink-600', emoji: '🍽️' },
  'cat-housing': { label: 'Housing', color: 'bg-indigo-50 text-indigo-700', emoji: '🏠' },
  'cat-health': { label: 'Health', color: 'bg-amber-50 text-amber-700', emoji: '🩺' }
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchExpenses = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const user = sessionData.session?.user;
        if (!user?.id) {
          setExpenses([]);
          throw new Error('Please sign in to view your expenses.');
        }

        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('expense_date', { ascending: false });

        if (error) {
          throw error;
        }

        if (!active) {
          return;
        }

        setExpenses(data ?? []);
      } catch (err) {
        if (!active) {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Unable to fetch your expenses right now.';
        setErrorMessage(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchExpenses();

    return () => {
      active = false;
    };
  }, []);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const recurringCount = useMemo(
    () => expenses.filter((expense) => expense.is_recurring).length,
    [expenses]
  );

  const latestExpenseDate = useMemo(() => {
    if (!expenses.length) {
      return null;
    }

    const newest = expenses.reduce((latest, expense) =>
      new Date(expense.expense_date) > new Date(latest.expense_date) ? expense : latest
    );
    return newest.expense_date;
  }, [expenses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-[32px] border border-white/60 bg-white/95 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                Expense journal
              </p>
              <h1 className="mt-2 text-4xl font-bold text-gray-900">Every dollar accounted for</h1>
              <p className="mt-2 text-base text-gray-600 md:text-lg">
                Review recent spending, track recurring commitments, and keep your cash flow grounded.
              </p>
            </div>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <SummaryPill
                icon={<DollarSign className="h-4 w-4" />}
                label="This month"
                value={formatCurrency(totalSpent)}
                hint="Tracked spend"
              />
              <SummaryPill
                icon={<RefreshCw className="h-4 w-4" />}
                label="Recurring bills"
                value={`${recurringCount}`}
                hint="Auto commitments"
              />
              <SummaryPill
                icon={<CalendarDays className="h-4 w-4" />}
                label="Last update"
                value={latestExpenseDate ? formatDate(latestExpenseDate) : '—'}
                hint="Newest entry"
              />
            </div>
          </div>
        </header>

        <section className="rounded-[32px] border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                Ledger
              </p>
              <h2 className="text-2xl font-bold text-gray-900">All expenses</h2>
            </div>
            <p className="text-sm text-gray-500">
              {loading
                ? 'Loading entries...'
                : `Showing ${expenses.length} entr${expenses.length === 1 ? 'y' : 'ies'} · Sorted by newest first`}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-inner">
            {loading ? (
              <div className="flex items-center justify-center px-6 py-24 text-gray-500">
                Loading your expense history...
              </div>
            ) : errorMessage ? (
              <div className="flex items-center gap-3 px-6 py-6 text-sm text-red-600">
                <AlertCircle className="h-5 w-5" />
                {errorMessage}
              </div>
            ) : expenses.length === 0 ? (
              <div className="px-6 py-16 text-center text-gray-500">
                No expenses yet. Add your first entry to watch this table come alive.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50/80 text-left text-xs font-semibold uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Merchant</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white/60">
                  {expenses.map((expense) => {
                    const categoryMeta =
                      expense.category_id && CATEGORY_LOOKUP[expense.category_id]
                        ? CATEGORY_LOOKUP[expense.category_id]
                        : null;

                    return (
                      <tr key={expense.id} className="hover:bg-indigo-50/30">
                        <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                          {formatDate(expense.expense_date)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {expense.description ?? 'Expense'}
                          </p>
                          {expense.tags && expense.tags.length > 0 && (
                            <span className="text-xs text-gray-500">#{expense.tags.join(' #')}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {categoryMeta ? (
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${categoryMeta.color}`}
                            >
                              <span>{categoryMeta.emoji}</span>
                              {categoryMeta.label}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-gray-400">Uncategorized</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{expense.merchant ?? '—'}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-gray-900">
                          {formatCurrency(expense.amount, expense.currency)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="inline-flex items-center gap-2 capitalize">
                            <CreditCard className="h-4 w-4 text-indigo-500" />
                            {expense.payment_method ?? 'n/a'}
                          </span>
                          {expense.is_recurring && (
                            <p className="text-xs text-indigo-500">
                              Recurs {expense.recurrence_period ?? 'monthly'}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {expense.notes ? expense.notes : <span className="text-gray-400">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

type SummaryPillProps = {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
};

function SummaryPill({ icon, label, value, hint }: SummaryPillProps) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{hint}</p>
    </div>
  );
}

function formatCurrency(value: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
