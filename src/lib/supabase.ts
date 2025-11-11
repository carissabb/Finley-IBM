import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          display_name: string;
          level: number;
          total_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          level?: number;
          total_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          level?: number;
          total_points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          monthly_income: number;
          needs_percentage: number;
          wants_percentage: number;
          savings_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          monthly_income: number;
          needs_percentage?: number;
          wants_percentage?: number;
          savings_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          monthly_income?: number;
          needs_percentage?: number;
          wants_percentage?: number;
          savings_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          goal_name: string;
          target_amount: number;
          current_amount: number;
          deadline: string | null;
          weekly_target: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_name: string;
          target_amount: number;
          current_amount?: number;
          deadline?: string | null;
          weekly_target?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_name?: string;
          target_amount?: number;
          current_amount?: number;
          deadline?: string | null;
          weekly_target?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          title: string;
          description: string;
          points: number;
          icon: string;
          unlocked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_type: string;
          title: string;
          description: string;
          points?: number;
          icon?: string;
          unlocked_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_type?: string;
          title?: string;
          description?: string;
          points?: number;
          icon?: string;
          unlocked_at?: string;
          created_at?: string;
        };
      };
    };
  };
};
