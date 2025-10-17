import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Dependent } from '@/types/dependent';
import { useAuthStore } from '@/store/auth.store';

// Tipo para os dados brutos da API
interface ApiDependent {
  _id: string;
  name: string;
  birthDate: {
    day: number;
    month: number;
    year?: number;
  };
  relationship: 'son' | 'daughter' | 'brother' | 'sister' | 'nephew' | 'niece' | 'other';
  guardianId: string;
  guardianName: string;
  secondGuardianId?: string;
  secondGuardianName?: string;
  createdAt: string;
  updatedAt: string;
}

// Hook para buscar um dependente específico
export function useDependent(dependentId: string) {
  const { authStatus } = useAuthStore();

  return useQuery({
    queryKey: ['dependent', dependentId],
    queryFn: async (): Promise<Dependent> => {
      const response = await api.get(`/users/dependents/${dependentId}`);
      const apiDependent: ApiDependent = response.data;

      // Transformar dados da API para o formato esperado pelo componente
      return {
        id: apiDependent._id,
        name: apiDependent.name,
        birthDate: apiDependent.birthDate,
        relationship: apiDependent.relationship,
        guardianId: apiDependent.guardianId,
        guardianName: apiDependent.guardianName,
        secondGuardianId: apiDependent.secondGuardianId,
        secondGuardianName: apiDependent.secondGuardianName,
        createdAt: apiDependent.createdAt,
        updatedAt: apiDependent.updatedAt,
      };
    },
    enabled: !!dependentId && authStatus === 'AUTHENTICATED',
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
