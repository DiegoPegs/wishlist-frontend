import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Dependent } from '@/types/dependent';
import { useAuthStore } from '@/store/auth.store';

// Tipo para os dados brutos da API
interface ApiDependent {
  _id: string;
  name: string;
  birthDate: string;
  relationship: 'son' | 'daughter' | 'brother' | 'sister' | 'nephew' | 'niece' | 'other';
  guardianId: string;
  guardianName: string;
  secondGuardianId?: string;
  secondGuardianName?: string;
  createdAt: string;
  updatedAt: string;
}

// Função assíncrona para buscar meus dependentes
const fetchMyDependents = async (): Promise<Dependent[]> => {
  try {
    const response = await api.get('/users/me/dependents');

    // Transformar dados da API para o formato esperado pelo componente
    const transformedDependents = response.data.map((dependent: ApiDependent) => ({
      id: dependent._id, // Usar _id como id
      name: dependent.name,
      birthDate: dependent.birthDate,
      relationship: dependent.relationship,
      guardianId: dependent.guardianId,
      guardianName: dependent.guardianName,
      secondGuardianId: dependent.secondGuardianId,
      secondGuardianName: dependent.secondGuardianName,
      createdAt: dependent.createdAt,
      updatedAt: dependent.updatedAt,
    }));

    return transformedDependents;
  } catch (error) {
    throw error;
  }
};

// Hook customizado para buscar meus dependentes
export const useMyDependents = () => {
  const { authStatus } = useAuthStore();

  const query = useQuery({
    queryKey: ['my-dependents'],
    queryFn: fetchMyDependents,
    enabled: authStatus === 'AUTHENTICATED', // Evita race condition
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return query;
};
