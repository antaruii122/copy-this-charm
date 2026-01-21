export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
      blog_posts: {
        Row: {
            id: string
            slug: string
            title: string
            content: string | null
            excerpt: string | null
            cover_image: string | null
            author_name: string | null
            published: boolean
            created_at: string
            updated_at: string
        }
        Insert: {
            id?: string
            slug: string
            title: string
            content?: string | null
            excerpt?: string | null
            cover_image?: string | null
            author_name?: string | null
            published?: boolean
            created_at?: string
            updated_at?: string
        }
        Update: {
            id?: string
            slug?: string
            title?: string
            content?: string | null
            excerpt?: string | null
            cover_image?: string | null
            author_name?: string | null
            published?: boolean
            created_at?: string
            updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          price: string | null
          slug: string
          title: string
          updated_at: string
          video_url: string | null
          long_description: string | null
          learning_outcomes: string[] | null
          target_audience: string | null
          curriculum_summary: string | null
          rating: number | null
          author_name: string | null
          author_image_url: string | null
          author_role: string | null
          status: string | null
          sales_video_url: string | null
          price_compare: number | null
          certificate_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          price?: string | null
          slug: string
          title: string
          updated_at?: string
          video_url?: string | null
          long_description?: string | null
          learning_outcomes?: string[] | null
          target_audience?: string | null
          curriculum_summary?: string | null
          rating?: number | null
          author_name?: string | null
          author_image_url?: string | null
          author_role?: string | null
          status?: string | null
          sales_video_url?: string | null
          price_compare?: number | null
          certificate_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          price?: string | null
          slug?: string
          title?: string
          updated_at?: string
          video_url?: string | null
          long_description?: string | null
          learning_outcomes?: string[] | null
          target_audience?: string | null
          curriculum_summary?: string | null
          rating?: number | null
          author_name?: string | null
          author_image_url?: string | null
          author_role?: string | null
          status?: string | null
          sales_video_url?: string | null
          price_compare?: number | null
          certificate_enabled?: boolean | null
        }
        Relationships: []
      }
      course_videos: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          module_id: string | null
          sort_order: number | null
          title: string
          updated_at: string
          video_path: string
          content_text: string | null
          is_preview: boolean | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          module_id?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
          video_path: string
          content_text?: string | null
          is_preview?: boolean | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          module_id?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
          video_path?: string
          content_text?: string | null
          is_preview?: boolean | null
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
          }
        ]
      }
      modules: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          sort_order: number | null
          title: string
          updated_at: string
          description: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
          description?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
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
          }
        ]
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          enrolled_at: string
          status: string
          progress: number | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          enrolled_at?: string
          status?: string
          progress?: number | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          enrolled_at?: string
          status?: string
          progress?: number | null
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      lesson_resources: {
        Row: {
          id: string
          video_id: string | null
          title: string
          file_url: string
          resource_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          video_id?: string | null
          title: string
          file_url: string
          resource_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string | null
          title?: string
          file_url?: string
          resource_type?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_resources_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "course_videos"
            referencedColumns: ["id"]
          }
        ]
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          certificate_number: string | null
          pdf_url: string | null
          issued_date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          certificate_number?: string | null
          pdf_url?: string | null
          issued_date?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          certificate_number?: string | null
          pdf_url?: string | null
          issued_date?: string | null
        }
        Relationships: [
            {
                foreignKeyName: "certificates_course_id_fkey"
                columns: ["course_id"]
                isOneToOne: false
                referencedRelation: "courses"
                referencedColumns: ["id"]
            }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
