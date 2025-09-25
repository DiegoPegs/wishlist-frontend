import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// Tipos para reservas (baseado no backend)
export interface Reservation {
  id: string;
  itemId: string;
  userId: string;
  quantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReserveItemData {
  itemId: string;
  quantity: number;
  message?: string;
}

export interface UpdateReservationQuantityData {
  quantity: number;
}

// Query Keys
export const reservationKeys = {
  all: ['reservations'] as const,
  mine: () => [...reservationKeys.all, 'mine'] as const,
  detail: (id: string) => [...reservationKeys.all, 'detail', id] as const,
};

// Hook para buscar minhas reservas
export function useMyReservations() {
  return useQuery({
    queryKey: reservationKeys.mine(),
    queryFn: async (): Promise<Reservation[]> => {
      const response = await api.get('/reservations/mine');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar uma reserva específica
export function useReservation(id: string) {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: async (): Promise<Reservation> => {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para criar uma reserva
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReserveItemData): Promise<Reservation> => {
      const response = await api.post('/reservations', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.mine() });
    },
  });
}

// Hook para atualizar quantidade da reserva
export function useUpdateReservationQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReservationQuantityData }): Promise<Reservation> => {
      const response = await api.patch(`/reservations/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.mine() });
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(data.id) });
    },
  });
}

// Hook para confirmar compra da reserva
export function useConfirmPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Reservation> => {
      const response = await api.post(`/reservations/${id}/confirm-purchase`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.mine() });
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(data.id) });
    },
  });
}

// Hook para cancelar reserva
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Reservation> => {
      const response = await api.delete(`/reservations/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.mine() });
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(data.id) });
    },
  });
}
