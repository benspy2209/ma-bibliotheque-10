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
      books: {
        Row: {
          book_data: Json
          completion_date: string | null
          created_at: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          book_data: Json
          completion_date?: string | null
          created_at?: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          book_data?: Json
          completion_date?: string | null
          created_at?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          custom_reading_goal: number | null
          favorite_authors: string[] | null
          full_name: string | null
          id: string
          language_preference: string | null
          last_username_change: string | null
          location: string | null
          preferred_genres: string[] | null
          reading_pace: number | null
          social_links: Json | null
          theme_preference: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          custom_reading_goal?: number | null
          favorite_authors?: string[] | null
          full_name?: string | null
          id: string
          language_preference?: string | null
          last_username_change?: string | null
          location?: string | null
          preferred_genres?: string[] | null
          reading_pace?: number | null
          social_links?: Json | null
          theme_preference?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          custom_reading_goal?: number | null
          favorite_authors?: string[] | null
          full_name?: string | null
          id?: string
          language_preference?: string | null
          last_username_change?: string | null
          location?: string | null
          preferred_genres?: string[] | null
          reading_pace?: number | null
          social_links?: Json | null
          theme_preference?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles_backup: {
        Row: {
          avatar_url: string | null
          bio: string | null
          custom_reading_goal: number | null
          favorite_authors: string[] | null
          full_name: string | null
          id: string | null
          language_preference: string | null
          last_username_change: string | null
          location: string | null
          preferred_genres: string[] | null
          reading_pace: number | null
          social_links: Json | null
          theme_preference: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          custom_reading_goal?: number | null
          favorite_authors?: string[] | null
          full_name?: string | null
          id?: string | null
          language_preference?: string | null
          last_username_change?: string | null
          location?: string | null
          preferred_genres?: string[] | null
          reading_pace?: number | null
          social_links?: Json | null
          theme_preference?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          custom_reading_goal?: number | null
          favorite_authors?: string[] | null
          full_name?: string | null
          id?: string | null
          language_preference?: string | null
          last_username_change?: string | null
          location?: string | null
          preferred_genres?: string[] | null
          reading_pace?: number | null
          social_links?: Json | null
          theme_preference?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reading_goals: {
        Row: {
          created_at: string
          id: string
          monthly_goal: number
          updated_at: string
          user_id: string
          yearly_goal: number
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_goal?: number
          updated_at?: string
          user_id: string
          yearly_goal?: number
        }
        Update: {
          created_at?: string
          id?: string
          monthly_goal?: number
          updated_at?: string
          user_id?: string
          yearly_goal?: number
        }
        Relationships: []
      }
      reading_streaks: {
        Row: {
          created_at: string
          date: string
          has_read: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          has_read?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          has_read?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      books_complete_view: {
        Row: {
          author: string | null
          book_id: string | null
          completion_date: string | null
          cover: string | null
          created_at: string | null
          pages: number | null
          purchased: boolean | null
          rating: number | null
          reading_time_days: number | null
          start_reading_date: string | null
          status: string | null
          title: string | null
          user_email: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_books_detailed: {
        Row: {
          book_author: string | null
          book_id: string | null
          book_title: string | null
          status: string | null
          user_email: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_books_stats: {
        Row: {
          book_authors: string[] | null
          book_count: number | null
          book_titles: string[] | null
          user_email: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_books_view: {
        Row: {
          author: string | null
          book_id: string | null
          completion_date: string | null
          created_at: string | null
          status: string | null
          title: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          author?: never
          book_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          status?: string | null
          title?: never
          user_id?: string | null
          user_name?: never
        }
        Update: {
          author?: never
          book_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          status?: string | null
          title?: never
          user_id?: string | null
          user_name?: never
        }
        Relationships: []
      }
    }
    Functions: {
      admin_update_username: {
        Args: {
          user_id: string
          new_username: string
        }
        Returns: undefined
      }
      can_change_username: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      can_perform_search: {
        Args: {
          p_user_id?: string
          p_ip_address?: string
        }
        Returns: Json
      }
      fetch_reading_goals: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      get_all_users_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          user_email: string
          name: string
          book_count: number
          created_at: string
          last_sign_in_at: string
        }[]
      }
      get_reading_streak: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
      increment_search_count: {
        Args: {
          p_user_id?: string
          p_ip_address?: string
        }
        Returns: Json
      }
      upsert_reading_goals: {
        Args: {
          p_user_id: string
          p_yearly_goal: number
          p_monthly_goal: number
        }
        Returns: undefined
      }
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
