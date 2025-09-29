import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterCredentials, AuthStatus } from '@/types/auth';
import { authService } from '@/lib/authService';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthStatus: (status: AuthStatus) => void;
  clearAuth: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      authStatus: 'PENDING',

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);

          // Salvar o token
          set({ accessToken: response.accessToken });

          // Salvar no localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.accessToken);
          }

          // Buscar dados do usuário
          const userProfile = await authService.getCurrentUser();
          const user: User = {
            _id: userProfile.id,
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            emailVerified: userProfile.emailVerified,
            createdAt: userProfile.createdAt,
            updatedAt: userProfile.updatedAt,
          };

          set({ user, isAuthenticated: true, authStatus: 'AUTHENTICATED' });

          // Salvar dados do usuário no localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true });
        try {
          await authService.register(credentials);
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Sempre limpar o estado local, mesmo se a chamada da API falhar
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            authStatus: 'UNAUTHENTICATED',
          });

          // Limpar localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setAccessToken: (token: string | null) => {
        set({ accessToken: token });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setAuthStatus: (status: AuthStatus) => {
        set({ authStatus: status });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          authStatus: 'UNAUTHENTICATED',
        });
      },

      checkAuthStatus: async () => {
        set({ isLoading: true, authStatus: 'PENDING' });

        try {
          // Verificar se há token no localStorage
          if (typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('accessToken');

            if (savedToken) {
              try {
                // Definir o token no estado para que o interceptor do Axios funcione
                set({ accessToken: savedToken });

                // Buscar dados atualizados do usuário
                const userProfile = await authService.getCurrentUser();
                const user: User = {
                  _id: userProfile.id,
                  id: userProfile.id,
                  email: userProfile.email,
                  name: userProfile.name,
                  emailVerified: userProfile.emailVerified,
                  createdAt: userProfile.createdAt,
                  updatedAt: userProfile.updatedAt,
                };

                set({ user, isAuthenticated: true, authStatus: 'AUTHENTICATED' });

                // Atualizar dados no localStorage
                localStorage.setItem('user', JSON.stringify(user));
              } catch (error) {
                // Token inválido ou expirado, limpar dados
                console.error('Token inválido:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                set({
                  user: null,
                  accessToken: null,
                  isAuthenticated: false,
                  authStatus: 'UNAUTHENTICATED'
                });
              }
            } else {
              // Não há token, usuário não autenticado
              set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                authStatus: 'UNAUTHENTICATED'
              });
            }
          } else {
            // Server-side, definir como não autenticado
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              authStatus: 'UNAUTHENTICATED'
            });
          }
        } catch (error) {
          console.error('Erro ao verificar status de autenticação:', error);
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            authStatus: 'UNAUTHENTICATED'
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        authStatus: state.authStatus,
      }),
    }
  )
);
