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
      business: {
        Row: {
          address: string | null
          createdAt: string
          description: string | null
          email: string
          id: string
          industry: string | null
          logo: string | null
          "password ": string | null
          role: string | null
          subject: string | null
          "tier ": string | null
          updatedAt: string | null
          usage: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          createdAt?: string
          description?: string | null
          email: string
          id?: string
          industry?: string | null
          logo?: string | null
          "password "?: string | null
          role?: string | null
          subject?: string | null
          "tier "?: string | null
          updatedAt?: string | null
          usage?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          createdAt?: string
          description?: string | null
          email?: string
          id?: string
          industry?: string | null
          logo?: string | null
          "password "?: string | null
          role?: string | null
          subject?: string | null
          "tier "?: string | null
          updatedAt?: string | null
          usage?: number | null
          website?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          birthDate: string | null
          city: string | null
          country: string | null
          createdAt: string | null
          document: Json | null
          email: string
          firstname: string
          history: Json | null
          id: string
          isVerified: boolean | null
          lastname: string
          password: string | null
          phone: string | null
          picture: string | null
          postalCode: string | null
          role: string
          state: string | null
          subject: string
          updatedAt: string
        }
        Insert: {
          address?: string | null
          birthDate?: string | null
          city?: string | null
          country?: string | null
          createdAt?: string | null
          document?: Json | null
          email: string
          firstname: string
          history?: Json | null
          id?: string
          isVerified?: boolean | null
          lastname: string
          password?: string | null
          phone?: string | null
          picture?: string | null
          postalCode?: string | null
          role?: string
          state?: string | null
          subject: string
          updatedAt?: string
        }
        Update: {
          address?: string | null
          birthDate?: string | null
          city?: string | null
          country?: string | null
          createdAt?: string | null
          document?: Json | null
          email?: string
          firstname?: string
          history?: Json | null
          id?: string
          isVerified?: boolean | null
          lastname?: string
          password?: string | null
          phone?: string | null
          picture?: string | null
          postalCode?: string | null
          role?: string
          state?: string | null
          subject?: string
          updatedAt?: string
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