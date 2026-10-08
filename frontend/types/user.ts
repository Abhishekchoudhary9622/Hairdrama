export interface User {
  id: string;
  google_id?: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
