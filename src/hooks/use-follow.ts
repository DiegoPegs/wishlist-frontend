import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PublicUser, UserProfile, FollowUserData, UserSearchResult } from '@/types/user';

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
      const response = await api.get('/users/me/profile');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar seguidores de um usuário
export function useFollowers(userId: string) {
  return useQuery({
    queryKey: followKeys.followers(userId),
    queryFn: async (): Promise<PublicUser[]> => {
      const response = await api.get(`/users/${userId}/followers`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar usuários que um usuário segue
export function useFollowing(userId: string) {
  return useQuery({
    queryKey: followKeys.following(userId),
    queryFn: async (): Promise<PublicUser[]> => {
      const response = await api.get(`/users/${userId}/following`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar usuários (para adicionar guardião)
export function useUserSearch(query: string) {
  return useQuery({
    queryKey: followKeys.search(query),
    queryFn: async (): Promise<UserSearchResult[]> => {
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      return response.data;
    },
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para seguir um usuário
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FollowUserData): Promise<void> => {
      await api.post('/users/follow', data);
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas ao usuário seguido
      queryClient.invalidateQueries({ queryKey: followKeys.profile(variables.userId) });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(variables.userId) });
      // Invalidar perfil do usuário logado para atualizar contadores
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

// Hook para deixar de seguir um usuário
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      await api.delete(`/users/${userId}/follow`);
    },
    onSuccess: (_, userId) => {
      // Invalidar queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: followKeys.profile(userId) });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) });
      // Invalidar perfil do usuário logado para atualizar contadores
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}
