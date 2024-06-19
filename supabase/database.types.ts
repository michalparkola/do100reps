export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Nuggets: {
        Row: {
          created_at: string;
          id: number;
          is_todo: boolean;
          next_review: string | null;
          practice: string | null;
          practice_id: number | null;
          rating: string;
          tags: string[] | null;
          text: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          is_todo?: boolean;
          next_review?: string | null;
          practice?: string | null;
          practice_id?: number | null;
          rating?: string;
          tags?: string[] | null;
          text?: string | null;
          title: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_todo?: boolean;
          next_review?: string | null;
          practice?: string | null;
          practice_id?: number | null;
          rating?: string;
          tags?: string[] | null;
          text?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Nuggets_practice_id_fkey";
            columns: ["practice_id"];
            isOneToOne: false;
            referencedRelation: "Practices";
            referencedColumns: ["id"];
          },
        ];
      };
      Practices: {
        Row: {
          category: string | null;
          do100reps_count: number;
          do100reps_title: string | null;
          id: number;
          name: string;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          do100reps_count?: number;
          do100reps_title?: string | null;
          id?: number;
          name: string;
          user_id?: string;
        };
        Update: {
          category?: string | null;
          do100reps_count?: number;
          do100reps_title?: string | null;
          id?: number;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      RepNotes: {
        Row: {
          author_id: string | null;
          created_at: string;
          id: number;
          modified_at: string;
          rep_id: number;
          text: string;
        };
        Insert: {
          author_id?: string | null;
          created_at?: string;
          id?: number;
          modified_at?: string;
          rep_id: number;
          text: string;
        };
        Update: {
          author_id?: string | null;
          created_at?: string;
          id?: number;
          modified_at?: string;
          rep_id?: number;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Notes_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notes_rep_id_fkey";
            columns: ["rep_id"];
            isOneToOne: false;
            referencedRelation: "Reps";
            referencedColumns: ["id"];
          },
        ];
      };
      Reps: {
        Row: {
          created_at: string;
          id: number;
          practice: string | null;
          practice_id: number | null;
          summary: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          practice?: string | null;
          practice_id?: number | null;
          summary: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          practice?: string | null;
          practice_id?: number | null;
          summary?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Reps_practice_fkey";
            columns: ["practice"];
            isOneToOne: false;
            referencedRelation: "Practices";
            referencedColumns: ["name"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & PublicSchema["Tables"]
    & PublicSchema["Views"]
  ) ? (
      & PublicSchema["Tables"]
      & PublicSchema["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

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
  : never;
