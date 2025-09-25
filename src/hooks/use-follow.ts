import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PublicUser, UserProfile, UserSearchResult } from '@/types/user';

// Query Keys
export const followKeys = {
  all: ['follow'] as const,
  profile: (username: string) => [...followKeys.all, 'profile', username] as const,
  followers: (userId: string) => [...followKeys.all, 'followers', userId] as const,
  following: (userId: string) => [...followKeys.all, 'following', userId] as const,
  search: (query: string) => [...followKeys.all, 'search', query] as const,
};

// Hook para buscar perfil público de um usuário
export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: followKeys.profile(username),
    queryFn: async (): Promise<PublicUser> => {
      const response = await api.get(`/users/${username}`);
      return response.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar perfil completo do usuário logado
export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async (): Promise<UserProfile> => {
      const response = await api.get('/users/me');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar seguidores de um usuário
export function useFollowers(username: string) {
  return useQuery({
    queryKey: followKeys.followers(username),
    queryFn: async (): Promise<PublicUser[]> => {
      const response = await api.get(`/users/${username}/followers`);
      return response.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar usuários que um usuário segue
export function useFollowing(username: string) {
  return useQuery({
    queryKey: followKeys.following(username),
    queryFn: async (): Promise<PublicUser[]> => {
      const response = await api.get(`/users/${username}/following`);
      return response.data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar usuários (para adicionar guardião)
// NOTA: Endpoint /users/search não está implementado no backend
export function useUserSearch(query: string) {
  return useQuery({
    queryKey: followKeys.search(query),
    queryFn: async (): Promise<UserSearchResult[]> => {
      // TODO: Implementar endpoint de busca no backend
      // Por enquanto, retorna array vazio
      console.warn('Endpoint /users/search não implementado no backend');
      return [];
    },
    enabled: false, // Desabilitado até implementar no backend
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para seguir um usuário
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string): Promise<void> => {
      await api.post(`/users/${username}/follow`);
    },
    onSuccess: (_, username) => {
      // Invalidar queries relacionadas ao usuário seguido
      queryClient.invalidateQueries({ queryKey: followKeys.profile(username) });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(username) });
      // Invalidar perfil do usuário logado para atualizar contadores
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

// Hook para deixar de seguir um usuário
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string): Promise<void> => {
      await api.delete(`/users/${username}/follow`);
    },
    onSuccess: (_, username) => {
      // Invalidar queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: followKeys.profile(username) });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(username) });
      // Invalidar perfil do usuário logado para atualizar contadores
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}
