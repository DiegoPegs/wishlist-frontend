import api from './api';
import {
  RegisterUserDto,
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse,
  UserProfile,
} from '@/types/auth-dto';

export const authService = {
  register: async (data: RegisterUserDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // O token será enviado automaticamente pelo interceptor do Axios
    await api.post('/auth/logout');
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await api.post('/auth/change-password', data);
  },

  forgotPassword: async (data: ForgotPasswordDto): Promise<void> => {
    await api.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await api.post('/auth/reset-password', data);
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
