export interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  birthDate?: {
    day: number;
    month: number;
    year?: number;
  };
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AuthStatus = 'PENDING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authStatus: AuthStatus;
}

export interface LoginCredentials {
  login: string; // Pode ser email ou username
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordCredentials {
  oldPassword: string;
  newPassword: string;
}
