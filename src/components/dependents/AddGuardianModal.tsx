'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useUserSearch } from '@/hooks/use-follow';
import { useAddGuardian } from '@/hooks/use-dependents';
import { UserSearchResult } from '@/types/user';

interface AddGuardianModalProps {
  dependentId: string;
  dependentName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddGuardianModal({ dependentId, dependentName, onClose, onSuccess }: AddGuardianModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: searchResults, isLoading: isSearching } = useUserSearch(searchQuery);
  const addGuardianMutation = useAddGuardian();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedUser(null);
  };

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await addGuardianMutation.mutateAsync({
        dependentId,
        data: { guardianId: selectedUser.id },
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar guardião:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-dark">
              Adicionar Segundo Guardião
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Adicionando segundo guardião para <strong>{dependentName}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-dark mb-1">
                Buscar usuário
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Digite o nome ou username do usuário"
              />
              {isSearching && (
                <p className="mt-1 text-xs text-gray-500">Buscando...</p>
              )}
            </div>

            {searchResults && searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      selectedUser?.id === user.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark">{user.name}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                      {user.isFollowing && (
                        <span className="text-xs text-green-600 font-medium">Seguindo</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-4 text-gray-500 text-sm">
                Nenhum usuário encontrado
              </div>
            )}

            {selectedUser && (
              <div className="p-3 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Usuário selecionado:</h4>
                <div className="flex items-center space-x-3">
                  {selectedUser.avatarUrl ? (
                    <Image
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-dark">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500">@{selectedUser.username}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedUser || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar Guardião'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
