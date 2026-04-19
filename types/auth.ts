export type Role = "USER" | "ADMIN"

export type RegisterRole = "user" | "admin" | "host"

export interface RegisterInput{
  name: string
  email: string
  password: string
  phone?: string
  role?: RegisterRole
  businessName?: string
}

export interface LoginInput{
  email: string
  password: string
}

export interface UserPayload {
 id: number;
  role: Role;
  isHost: boolean;
  isHostApproved: boolean;
}

export interface AuthResponse {
 user: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    businessName?: string | null;
    role: Role;
    isHost: boolean;
    isHostApproved: boolean;
    provider?: string;
  };
}