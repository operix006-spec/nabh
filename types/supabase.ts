export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          role: string;
          age_group: string;
          current_streak: number;
          best_streak: number;
          total_xp: number;
          cognitive_index: number;
          language: string;
          theme: string;
          accessibility: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          avatar_url?: string | null;
          role?: string;
          age_group?: string;
          current_streak?: number;
          best_streak?: number;
          total_xp?: number;
          cognitive_index?: number;
          language?: string;
          theme?: string;
          accessibility?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string | null;
          role?: string;
          age_group?: string;
          current_streak?: number;
          best_streak?: number;
          total_xp?: number;
          cognitive_index?: number;
          language?: string;
          theme?: string;
          accessibility?: Json;
          updated_at?: string;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          game_id: string;
          score: number;
          xp_earned: number;
          mean_reaction_time_ms: number;
          accuracy_rate: number;
          duration_seconds: number;
          telemetry: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          game_id: string;
          score: number;
          xp_earned: number;
          mean_reaction_time_ms: number;
          accuracy_rate: number;
          duration_seconds: number;
          telemetry: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_id?: string;
          game_id?: string;
          score?: number;
          xp_earned?: number;
          mean_reaction_time_ms?: number;
          accuracy_rate?: number;
          duration_seconds?: number;
          telemetry?: Json;
        };
      };
      user_skill_ratings: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          rating_score: number;
          percentile_rank: number;
          games_played_count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          rating_score?: number;
          percentile_rank?: number;
          games_played_count?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_id?: string;
          rating_score?: number;
          percentile_rank?: number;
          games_played_count?: number;
          updated_at?: string;
        };
      };
    };
  };
}
