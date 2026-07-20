// Hand-written to mirror supabase/schema.sql.
// Regenerate with `supabase gen types typescript` once the CLI is available.

export type UserRole = "operator" | "viewer";
export type RouteStatus = "in_progress" | "at_sorting" | "recycled";
export type CollectionPointType =
  | "sorting"
  | "recycling"
  | "collection"
  | "landfill";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          role: UserRole | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          role?: UserRole | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole | null;
          created_at?: string;
        };
        Relationships: [];
      };
      trucks: {
        Row: {
          id: string;
          plate_number: string;
          driver_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          plate_number: string;
          driver_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          plate_number?: string;
          driver_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      routes: {
        Row: {
          id: string;
          truck_id: string | null;
          status: RouteStatus;
          origin_point_id: string | null;
          destination_point_id: string | null;
          cargo_type: string | null;
          started_at: string;
          ended_at: string | null;
        };
        Insert: {
          id?: string;
          truck_id?: string | null;
          status?: RouteStatus;
          origin_point_id?: string | null;
          destination_point_id?: string | null;
          cargo_type?: string | null;
          started_at?: string;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          truck_id?: string | null;
          status?: RouteStatus;
          origin_point_id?: string | null;
          destination_point_id?: string | null;
          cargo_type?: string | null;
          started_at?: string;
          ended_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "routes_truck_id_fkey";
            columns: ["truck_id"];
            referencedRelation: "trucks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "routes_origin_point_id_fkey";
            columns: ["origin_point_id"];
            referencedRelation: "collection_points";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "routes_destination_point_id_fkey";
            columns: ["destination_point_id"];
            referencedRelation: "collection_points";
            referencedColumns: ["id"];
          },
        ];
      };
      route_points: {
        Row: {
          id: string;
          route_id: string | null;
          lat: number;
          lng: number;
          ts: string;
        };
        Insert: {
          id?: string;
          route_id?: string | null;
          lat: number;
          lng: number;
          ts?: string;
        };
        Update: {
          id?: string;
          route_id?: string | null;
          lat?: number;
          lng?: number;
          ts?: string;
        };
        Relationships: [
          {
            foreignKeyName: "route_points_route_id_fkey";
            columns: ["route_id"];
            referencedRelation: "routes";
            referencedColumns: ["id"];
          },
        ];
      };
      collection_points: {
        Row: {
          id: string;
          name: string;
          lat: number;
          lng: number;
          type: CollectionPointType | null;
        };
        Insert: {
          id?: string;
          name: string;
          lat: number;
          lng: number;
          type?: CollectionPointType | null;
        };
        Update: {
          id?: string;
          name?: string;
          lat?: number;
          lng?: number;
          type?: CollectionPointType | null;
        };
        Relationships: [];
      };
      waste_items: {
        Row: {
          id: string;
          user_id: string | null;
          image_url: string | null;
          category: string | null;
          material: string | null;
          recyclable: boolean | null;
          confidence: number | null;
          disposal_instructions: string | null;
          nearest_point_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          image_url?: string | null;
          category?: string | null;
          material?: string | null;
          recyclable?: boolean | null;
          confidence?: number | null;
          disposal_instructions?: string | null;
          nearest_point_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          image_url?: string | null;
          category?: string | null;
          material?: string | null;
          recyclable?: boolean | null;
          confidence?: number | null;
          disposal_instructions?: string | null;
          nearest_point_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "waste_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "waste_items_nearest_point_id_fkey";
            columns: ["nearest_point_id"];
            referencedRelation: "collection_points";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
