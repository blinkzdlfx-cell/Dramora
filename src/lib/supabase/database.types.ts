export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      conversation_summaries: {
        Row: {
          conversation_id: string
          covered_message_count: number
          covered_through_message_id: string
          created_at: string
          id: string
          owner_id: string
          status: string
          summary_content: Json
          summary_text: string
          token_estimate: number | null
          version: number
        }
        Insert: {
          conversation_id: string
          covered_message_count: number
          covered_through_message_id: string
          created_at?: string
          id?: string
          owner_id: string
          status?: string
          summary_content: Json
          summary_text: string
          token_estimate?: number | null
          version: number
        }
        Update: {
          conversation_id?: string
          covered_message_count?: number
          covered_through_message_id?: string
          created_at?: string
          id?: string
          owner_id?: string
          status?: string
          summary_content?: Json
          summary_text?: string
          token_estimate?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversation_summaries_conversation_owner_fkey"
            columns: ["conversation_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id", "owner_id"]
          },
          {
            foreignKeyName: "conversation_summaries_covered_message_fkey"
            columns: [
              "covered_through_message_id",
              "conversation_id",
              "owner_id",
            ]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id", "conversation_id", "owner_id"]
          },
        ]
      }
      conversation_summary_sources: {
        Row: {
          conversation_id: string
          message_id: string
          owner_id: string
          source_order: number
          summary_id: string
        }
        Insert: {
          conversation_id: string
          message_id: string
          owner_id: string
          source_order: number
          summary_id: string
        }
        Update: {
          conversation_id?: string
          message_id?: string
          owner_id?: string
          source_order?: number
          summary_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_summary_sources_message_fkey"
            columns: ["message_id", "conversation_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id", "conversation_id", "owner_id"]
          },
          {
            foreignKeyName: "conversation_summary_sources_summary_fkey"
            columns: ["summary_id", "conversation_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "conversation_summaries"
            referencedColumns: ["id", "conversation_id", "owner_id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          owner_id: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          owner_id: string
          project_id: string
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          owner_id?: string
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_project_owner_fkey"
            columns: ["project_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: Json
          conversation_id: string
          created_at: string
          id: string
          idempotency_key: string | null
          metadata: Json
          owner_id: string
          role: string
          status: string
        }
        Insert: {
          content: Json
          conversation_id: string
          created_at?: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          owner_id: string
          role: string
          status?: string
        }
        Update: {
          content?: Json
          conversation_id?: string
          created_at?: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          owner_id?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_owner_fkey"
            columns: ["conversation_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_context_summaries: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          project_id: string
          source_conversation_count: number
          status: string
          summary_content: Json
          summary_text: string
          token_estimate: number | null
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          project_id: string
          source_conversation_count?: number
          status?: string
          summary_content: Json
          summary_text: string
          token_estimate?: number | null
          version: number
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          project_id?: string
          source_conversation_count?: number
          status?: string
          summary_content?: Json
          summary_text?: string
          token_estimate?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_context_summaries_project_owner_fkey"
            columns: ["project_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      project_context_summary_sources: {
        Row: {
          conversation_id: string
          owner_id: string
          project_id: string
          source_order: number
          summary_id: string
        }
        Insert: {
          conversation_id: string
          owner_id: string
          project_id: string
          source_order: number
          summary_id: string
        }
        Update: {
          conversation_id?: string
          owner_id?: string
          project_id?: string
          source_order?: number
          summary_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_context_summary_sources_conversation_fkey"
            columns: ["conversation_id", "owner_id", "project_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id", "owner_id", "project_id"]
          },
          {
            foreignKeyName: "project_context_summary_sources_summary_fkey"
            columns: ["summary_id", "project_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "project_context_summaries"
            referencedColumns: ["id", "project_id", "owner_id"]
          },
        ]
      }
      projects: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          owner_id: string
          status: string
          studio: string
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          owner_id: string
          status?: string
          studio: string
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          status?: string
          studio?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_control_requests: {
        Row: {
          action: string
          created_at: string
          id: string
          idempotency_key: string | null
          outcome: Json | null
          owner_id: string
          payload: Json
          processed_at: string | null
          task_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          idempotency_key?: string | null
          outcome?: Json | null
          owner_id: string
          payload?: Json
          processed_at?: string | null
          task_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          idempotency_key?: string | null
          outcome?: Json | null
          owner_id?: string
          payload?: Json
          processed_at?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_control_task_owner_fkey"
            columns: ["task_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      task_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          owner_id: string
          payload: Json
          sequence_number: number
          task_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          owner_id: string
          payload?: Json
          sequence_number: number
          task_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          owner_id?: string
          payload?: Json
          sequence_number?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_events_task_owner_fkey"
            columns: ["task_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      tasks: {
        Row: {
          approval_required: boolean
          checkpoint: Json
          completed_at: string | null
          conversation_id: string | null
          created_at: string
          error: Json | null
          id: string
          idempotency_key: string | null
          input: Json
          max_retries: number
          mode: string
          owner_id: string
          project_id: string
          result: Json | null
          retry_count: number
          started_at: string | null
          status: string
          stop_requested_at: string | null
          task_type: string
          updated_at: string
        }
        Insert: {
          approval_required?: boolean
          checkpoint?: Json
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          error?: Json | null
          id?: string
          idempotency_key?: string | null
          input?: Json
          max_retries?: number
          mode?: string
          owner_id: string
          project_id: string
          result?: Json | null
          retry_count?: number
          started_at?: string | null
          status?: string
          stop_requested_at?: string | null
          task_type: string
          updated_at?: string
        }
        Update: {
          approval_required?: boolean
          checkpoint?: Json
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          error?: Json | null
          id?: string
          idempotency_key?: string | null
          input?: Json
          max_retries?: number
          mode?: string
          owner_id?: string
          project_id?: string
          result?: Json | null
          retry_count?: number
          started_at?: string | null
          status?: string
          stop_requested_at?: string | null
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_conversation_project_owner_fkey"
            columns: ["conversation_id", "owner_id", "project_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id", "owner_id", "project_id"]
          },
          {
            foreignKeyName: "tasks_project_owner_fkey"
            columns: ["project_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
