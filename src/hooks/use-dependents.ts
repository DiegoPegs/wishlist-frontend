import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Dependent, CreateDependentData, UpdateDependentData, AddGuardianData } from '@/types/dependent';

// Query Keys
export const dependentKeys = {
  all: ['dependents'] as const,
  lists: () => [...dependentKeys.all, 'list'] as const,
  list: (id: string) => [...dependentKeys.all, 'detail', id] as const,
  mine: () => [...dependentKeys.lists(), 'mine'] as const,
};

// Hook para buscar meus dependentes
export function useDependents() {
  return useQuery({
    queryKey: dependentKeys.mine(),
    queryFn: async (): Promise<Dependent[]> => {
      const response = await api.get('/users/me/dependents');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar um dependente específico
export function useDependent(id: string) {
  return useQuery({
    queryKey: dependentKeys.list(id),
    queryFn: async (): Promise<Dependent> => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para criar um dependente
export function useCreateDependent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDependentData): Promise<Dependent> => {
      const response = await api.post('/users/me/dependents', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependentKeys.mine() });
    },
  });
}

// Hook para atualizar um dependente
export function useUpdateDependent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDependentData }): Promise<Dependent> => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dependentKeys.mine() });
      queryClient.invalidateQueries({ queryKey: dependentKeys.list(data.id) });
    },
  });
}

// Hook para excluir um dependente
export function useDeleteDependent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/users/dependents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependentKeys.mine() });
    },
  });
}

// Hook para adicionar segundo guardião
export function useAddGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dependentId, data }: { dependentId: string; data: AddGuardianData }): Promise<Dependent> => {
      const response = await api.post(`/users/dependents/${dependentId}/add-guardian`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dependentKeys.mine() });
      queryClient.invalidateQueries({ queryKey: dependentKeys.list(data.id) });
    },
  });
}

// Hook para remover segundo guardião
export function useRemoveGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dependentId: string): Promise<Dependent> => {
      const response = await api.delete(`/users/dependents/${dependentId}/guardianship`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dependentKeys.mine() });
      queryClient.invalidateQueries({ queryKey: dependentKeys.list(data.id) });
    },
  });
}
