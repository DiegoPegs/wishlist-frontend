'use client';

import { useMyWishlists } from '@/hooks/useMyWishlists';
import { useAuthStore } from '@/store/auth.store';

export function TestWishlists() {
  const { authStatus, isAuthenticated } = useAuthStore();
  const { data: wishlists, isLoading, isError, error } = useMyWishlists();

  return (
    <div className="bg-yellow-100 p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-800 mb-2">Teste Wishlists:</h3>
      <div className="text-sm space-y-1">
        <div><strong>Auth Status:</strong> {authStatus}</div>
        <div><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Is Error:</strong> {isError ? 'Yes' : 'No'}</div>
        <div><strong>Wishlists Count:</strong> {wishlists?.length || 0}</div>
        {error && <div><strong>Error:</strong> {error.message}</div>}
        {wishlists && (
          <div>
            <strong>Wishlists:</strong>
            <pre className="text-xs mt-1 bg-white p-2 rounded">
              {JSON.stringify(wishlists, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
