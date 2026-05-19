export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Sales';
}

export interface AuthResponse {
  token: string;
  user: User;
}