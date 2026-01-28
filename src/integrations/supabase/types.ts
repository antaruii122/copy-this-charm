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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_emails: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      blog_structure: {
        Row: {
          citations: string
          id: number
          structure: string
          type: string
          word_count: string
        }
        Insert: {
          citations: string
          id: number
          structure: string
          type: string
          word_count: string
        }
        Update: {
          citations?: string
          id?: number
          structure?: string
          type?: string
          word_count?: string
        }
        Relationships: []
      }
      blog_views: {
        Row: {
          blog_slug: string
          created_at: string | null
          id: number
          updated_at: string | null
          view_count: number
        }
        Insert: {
          blog_slug: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
          view_count?: number
        }
        Update: {
          blog_slug?: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
          view_count?: number
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string | null
          course_id: string | null
          id: string
          issued_date: string | null
          pdf_url: string | null
          user_id: string
        }
        Insert: {
          certificate_number?: string | null
          course_id?: string | null
          id?: string
          issued_date?: string | null
          pdf_url?: string | null
          user_id: string
        }
        Update: {
          certificate_number?: string | null
          course_id?: string | null
          id?: string
          issued_date?: string | null
          pdf_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_videos: {
        Row: {
          content_text: string | null
          course_id: string | null
          created_at: string
          description: string | null
          drive_file_id: string | null
          duration_seconds: number | null
          id: string
          is_drive_video: boolean | null
          is_preview: boolean | null
          is_youtube_video: boolean | null
          module_id: string | null
          sort_order: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_path: string
        }
        Insert: {
          content_text?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          drive_file_id?: string | null
          duration_seconds?: number | null
          id?: string
          is_drive_video?: boolean | null
          is_preview?: boolean | null
          is_youtube_video?: boolean | null
          module_id?: string | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_path: string
        }
        Update: {
          content_text?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          drive_file_id?: string | null
          duration_seconds?: number | null
          id?: string
          is_drive_video?: boolean | null
          is_preview?: boolean | null
          is_youtube_video?: boolean | null
          module_id?: string | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_videos_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          author_image_url: string | null
          author_name: string | null
          author_role: string | null
          badge_text: string | null
          border_color: string | null
          border_theme: string | null
          card_style: string | null
          certificate_enabled: boolean | null
          color_theme: string | null
          created_at: string
          curriculum_summary: string | null
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          learning_outcomes: string[] | null
          long_description: string | null
          original_price: string | null
          price: string | null
          price_compare: number | null
          published: boolean | null
          rating: number | null
          sales_video_url: string | null
          slug: string
          status: string | null
          target_audience: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          author_image_url?: string | null
          author_name?: string | null
          author_role?: string | null
          badge_text?: string | null
          border_color?: string | null
          border_theme?: string | null
          card_style?: string | null
          certificate_enabled?: boolean | null
          color_theme?: string | null
          created_at?: string
          curriculum_summary?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          learning_outcomes?: string[] | null
          long_description?: string | null
          original_price?: string | null
          price?: string | null
          price_compare?: number | null
          published?: boolean | null
          rating?: number | null
          sales_video_url?: string | null
          slug: string
          status?: string | null
          target_audience?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          author_image_url?: string | null
          author_name?: string | null
          author_role?: string | null
          badge_text?: string | null
          border_color?: string | null
          border_theme?: string | null
          card_style?: string | null
          certificate_enabled?: boolean | null
          color_theme?: string | null
          created_at?: string
          curriculum_summary?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          learning_outcomes?: string[] | null
          long_description?: string | null
          original_price?: string | null
          price?: string | null
          price_compare?: number | null
          published?: boolean | null
          rating?: number | null
          sales_video_url?: string | null
          slug?: string
          status?: string | null
          target_audience?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string
          id: string
          progress: number | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string
          id?: string
          progress?: number | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string
          id?: string
          progress?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_records: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          quarter: string
          record_type: string
          status: string | null
          year: number
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          quarter?: string
          record_type?: string
          status?: string | null
          year?: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          quarter?: string
          record_type?: string
          status?: string | null
          year?: number
        }
        Relationships: []
      }
      lesson_resources: {
        Row: {
          created_at: string
          file_url: string
          id: string
          resource_type: string | null
          title: string
          video_id: string | null
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          resource_type?: string | null
          title: string
          video_id?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          resource_type?: string | null
          title?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_resources_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "course_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      video_progress: {
        Row: {
          created_at: string
          id: string
          is_completed: boolean | null
          last_position_seconds: number | null
          updated_at: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_completed?: boolean | null
          last_position_seconds?: number | null
          updated_at?: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_completed?: boolean | null
          last_position_seconds?: number | null
          updated_at?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "course_videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      user_role: "admin" | "user"
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
