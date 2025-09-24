// DTOs para comunicação com a API backend

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  login: string; // Pode ser email ou username
  password: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  recoveryCode: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
