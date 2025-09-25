import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// Tipos para conversas (baseado no backend)
export interface Conversation {
  id: string;
  itemId: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AnonymizedMessage {
  id: string;
  message: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

export interface SendMessageData {
  message: string;
}

// Query Keys
export const conversationKeys = {
  all: ['conversations'] as const,
  detail: (id: string) => [...conversationKeys.all, 'detail', id] as const,
  messages: (id: string) => [...conversationKeys.all, 'messages', id] as const,
};

// Hook para iniciar conversa sobre item
export function useStartConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string): Promise<Conversation> => {
      const response = await api.post(`/conversations/items/${itemId}/start`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(data.id) });
    },
  });
}

// Hook para buscar mensagens da conversa
export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: async (): Promise<AnonymizedMessage[]> => {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      return response.data;
    },
    enabled: !!conversationId,
    staleTime: 1 * 60 * 1000, // 1 minuto (mensagens são mais dinâmicas)
  });
}

// Hook para enviar mensagem na conversa
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, data }: { conversationId: string; data: SendMessageData }): Promise<{ message: string; timestamp: Date }> => {
      const response = await api.post(`/conversations/${conversationId}/messages`, data);
      return response.data;
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.messages(conversationId) });
    },
  });
}
