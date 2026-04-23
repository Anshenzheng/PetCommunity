export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}
