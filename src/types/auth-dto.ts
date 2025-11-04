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

export interface UpdateUserDto {
  name: string;
  birthDate: {
    day: number;
    month: number;
    year?: number; // Ano opcional
  };
}

export interface UpdateProfileDto {
  name: string;
  giftingProfile: {
    interests?: string[];
    budget?: {
      min?: number;
      max?: number;
    };
    preferences?: string[];
  };
}

export interface UpdateLanguageDto {
  language: string;
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
  _id: string;
  id?: string;
  email: string;
  name: string;
  birthDate?: {
    day: number;
    month: number;
    year?: number;
  };
  language?: string;
  emailVerified?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
