'use client';

import { useAuthStore } from '@/store/auth.store';
import { useMyWishlists } from '@/hooks/useMyWishlists';

export function DebugAuth() {
  const { authStatus, user, isAuthenticated, accessToken } = useAuthStore();
  const { data: wishlists, isLoading, isError, error } = useMyWishlists();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded-lg shadow-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Debug Auth State:</h3>
      <div className="space-y-1">
        <div><strong>Auth Status:</strong> {authStatus}</div>
        <div><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'null'}</div>
        <div><strong>Token:</strong> {accessToken ? 'Present' : 'Missing'}</div>
        <div><strong>Wishlists Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Wishlists Error:</strong> {isError ? 'Yes' : 'No'}</div>
        <div><strong>Wishlists Count:</strong> {wishlists?.length || 0}</div>
        {error && <div><strong>Error:</strong> {error.message}</div>}
      </div>
    </div>
  );
}
