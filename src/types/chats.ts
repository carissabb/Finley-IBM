export interface ChatSession {
  id: string; // UUID
  user_id: string; // UUID
  title: string | null;
  created_at: Date;
  updated_at: Date;
  last_message_at: Date | null;
  is_archived: boolean;
  metadata: Record<string, any> | null; // JSONB
}

export interface ChatMessage {
  id: string; // UUID
  session_id: string; // UUID
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: Date;
  tokens_used: number | null;
  model_name: string | null;
  metadata: Record<string, any> | null; // JSONB
}

export interface ChatSessionInsert {
  id?: string;
  user_id: string;
  title?: string | null;
  created_at?: Date;
  updated_at?: Date;
  last_message_at?: Date | null;
  is_archived?: boolean;
  metadata?: Record<string, any> | null;
}

export interface ChatMessageInsert {
  id?: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: Date;
  tokens_used?: number | null;
  model_name?: string | null;
  metadata?: Record<string, any> | null;
}

// Update types (all fields optional except id)
export interface ChatSessionUpdate {
  title?: string | null;
  updated_at?: Date;
  last_message_at?: Date | null;
  is_archived?: boolean;
  metadata?: Record<string, any> | null;
}

export interface ChatMessageUpdate {
  role?: 'user' | 'assistant' | 'system';
  content?: string;
  tokens_used?: number | null;
  model_name?: string | null;
  metadata?: Record<string, any> | null;
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: ChatMessage[];
}

export interface ChatMessageWithSession extends ChatMessage {
  session: ChatSession;
}
