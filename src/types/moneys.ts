export interface ExpenseCategory {
  id: string; // UUID
  name: string;
  icon?: string | null; // emoji or icon identifier
  color?: string | null; // hex color code (#RRGGBB)
  created_at: string; // ISO timestamp
}

export type RecurrencePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type PaymentMethod =
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | string;

export interface Expense {
  id: string; // UUID
  user_id: string; // FK → user_profiles.id
  category_id?: string | null; // FK → expense_categories.id
  amount: number;
  currency: string; // ISO 4217, default 'USD'
  description?: string | null;
  expense_date: string; // 'YYYY-MM-DD'
  payment_method?: PaymentMethod | null;
  merchant?: string | null;
  is_recurring: boolean;
  recurrence_period?: RecurrencePeriod | null;
  receipt_url?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any> | null;
}
