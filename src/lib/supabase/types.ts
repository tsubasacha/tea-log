export type TeaType =
  | "sencha"
  | "fukamushi"
  | "gyokuro"
  | "kabusecha"
  | "bancha"
  | "hojicha"
  | "genmaicha"
  | "wakoucha"
  | "other";

export type InfusionNumber = "1" | "2" | "3" | "other";

export interface Database {
  public: {
    Tables: {
      tea_leaves: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          tea_type: TeaType;
          producer: string | null;
          origin: string | null;
          memo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          tea_type: TeaType;
          producer?: string | null;
          origin?: string | null;
          memo?: string | null;
        };
        Update: Partial<
          Omit<Database["public"]["Tables"]["tea_leaves"]["Insert"], "user_id">
        >;
        Relationships: [];
      };
      brews: {
        Row: {
          id: string;
          user_id: string;
          tea_leaf_id: string;
          brewed_at: string;
          tea_amount: number;
          water_amount: number;
          water_temperature: number;
          steeping_time: number;
          infusion_number: InfusionNumber;
          aroma: number;
          sweetness: number;
          umami: number;
          astringency: number;
          bitterness: number;
          memo: string | null;
          is_best: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tea_leaf_id: string;
          brewed_at?: string;
          tea_amount: number;
          water_amount: number;
          water_temperature: number;
          steeping_time: number;
          infusion_number?: InfusionNumber;
          aroma: number;
          sweetness: number;
          umami: number;
          astringency: number;
          bitterness: number;
          memo?: string | null;
          is_best?: boolean;
        };
        Update: Partial<
          Omit<Database["public"]["Tables"]["brews"]["Insert"], "user_id">
        >;
        Relationships: [
          {
            foreignKeyName: "brews_tea_leaf_id_fkey";
            columns: ["tea_leaf_id"];
            isOneToOne: false;
            referencedRelation: "tea_leaves";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_best_brew: {
        Args: { brew_id: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
