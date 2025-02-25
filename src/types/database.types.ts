export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          created_at: string
          department: string | null
          file_type: string | null
          folder_id: string | null
          id: string
          metadata: Json | null
          name: string
          project_id: string | null
          size: number
          storage_path: string
          type: string
          version: string | null
          waveform_length: unknown | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          file_type?: string | null
          folder_id?: string | null
          id?: string
          metadata?: Json | null
          name: string
          project_id?: string | null
          size: number
          storage_path: string
          type: string
          version?: string | null
          waveform_length?: unknown | null
        }
        Update: {
          created_at?: string
          department?: string | null
          file_type?: string | null
          folder_id?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          project_id?: string | null
          size?: number
          storage_path?: string
          type?: string
          version?: string | null
          waveform_length?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string
          id: string
          name: string
          path: string[]
          project_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          path?: string[]
          project_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          path?: string[]
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_session_files: {
        Row: {
          bar_offset: number | null
          created_at: string
          file_id: string | null
          file_type: string
          id: string
          part_name: string | null
          practice_session_id: string | null
        }
        Insert: {
          bar_offset?: number | null
          created_at?: string
          file_id?: string | null
          file_type: string
          id?: string
          part_name?: string | null
          practice_session_id?: string | null
        }
        Update: {
          bar_offset?: number | null
          created_at?: string
          file_id?: string | null
          file_type?: string
          id?: string
          part_name?: string | null
          practice_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_session_files_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_session_files_practice_session_id_fkey"
            columns: ["practice_session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          created_at: string
          department: string | null
          id: string
          metadata: Json | null
          name: string
          project_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          metadata?: Json | null
          name: string
          project_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          project_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          composer_arranger: string | null
          created_at: string
          department: string | null
          id: string
          metadata: Json | null
          name: string
          order_index: number | null
          owner: string | null
          piece_name: string | null
          updated_at: string
          version_number: string | null
        }
        Insert: {
          composer_arranger?: string | null
          created_at?: string
          department?: string | null
          id?: string
          metadata?: Json | null
          name: string
          order_index?: number | null
          owner?: string | null
          piece_name?: string | null
          updated_at?: string
          version_number?: string | null
        }
        Update: {
          composer_arranger?: string | null
          created_at?: string
          department?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          order_index?: number | null
          owner?: string | null
          piece_name?: string | null
          updated_at?: string
          version_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          department: string | null
          description: string
          end_time: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          start_time: string
        }
        Insert: {
          department?: string | null
          description: string
          end_time?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          start_time: string
        }
        Update: {
          department?: string | null
          description?: string
          end_time?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          department: string | null
          description: string
          due_date: string | null
          id: string
          project_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          department?: string | null
          description: string
          due_date?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          department?: string | null
          description?: string
          due_date?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          department: string
          email: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          department: string
          email: string
          full_name?: string | null
          id?: string
          role: string
        }
        Update: {
          department?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          capacity: number | null
          id: string
          layout: Json | null
          location: string
          metadata: Json | null
          name: string
        }
        Insert: {
          capacity?: number | null
          id?: string
          layout?: Json | null
          location: string
          metadata?: Json | null
          name: string
        }
        Update: {
          capacity?: number | null
          id?: string
          layout?: Json | null
          location?: string
          metadata?: Json | null
          name?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
