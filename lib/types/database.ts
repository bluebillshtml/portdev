// Generated types from Supabase CLI: supabase gen types typescript --local
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
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          theme: string
          is_verified: boolean
          is_pro: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme?: string
          is_verified?: boolean
          is_pro?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme?: string
          is_verified?: boolean
          is_pro?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      links: {
        Row: {
          id: string
          profile_id: string
          title: string
          url: string
          description: string | null
          icon: string | null
          position: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          url: string
          description?: string | null
          icon?: string | null
          position?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          url?: string
          description?: string | null
          icon?: string | null
          position?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      page_views: {
        Row: {
          id: string
          profile_id: string
          viewed_at: string
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          country: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          viewed_at?: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          viewed_at?: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
        }
      }
      link_clicks: {
        Row: {
          id: string
          link_id: string
          profile_id: string
          clicked_at: string
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          country: string | null
          city: string | null
        }
        Insert: {
          id?: string
          link_id: string
          profile_id: string
          clicked_at?: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
        }
        Update: {
          id?: string
          link_id?: string
          profile_id?: string
          clicked_at?: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
        }
      }
    }
  }
}
