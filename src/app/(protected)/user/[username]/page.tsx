'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { usePublicProfile, useFollowUser, useUnfollowUser, useUserProfile, useFollowing } from '@/hooks/use-follow';
import { useWishlists } from '@/hooks/use-wishlists';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { useState, useEffect } from 'react';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: profile, isLoading: profileLoading, error: profileError } = usePublicProfile(username);
  const { data: currentUser } = useUserProfile();
  const { data: following } = useFollowing(currentUser?.username || '');
  const { data: wishlists, isLoading: wishlistsLoading } = useWishlists();
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  // Determinar se o usuário logado está seguindo o perfil visitado
  useEffect(() => {
    if (following && profile) {
      const isCurrentlyFollowing = following.some(
        (user) => user.id === profile.id
      );
      setIsFollowing(isCurrentlyFollowing);
    }
  }, [following, profile]);

  const handleFollow = async () => {
    if (!profile) return;

    try {
      if (isFollowing) {
        await unfollowUserMutation.mutateAsync(profile.username);
      } else {
        await followUserMutation.mutateAsync(profile.username);
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-dark mb-2">Usuário não encontrado</h3>
        <p className="text-gray-600 mb-4">O usuário que você está procurando não existe ou foi removido.</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-dark mb-1">
                {profile.name}
              </h1>
              <p className="text-gray-600 mb-2">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-700 mb-3">{profile.bio}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  <strong>{profile.followersCount}</strong> seguidores
                </span>
                <span>
                  <strong>{profile.followingCount}</strong> seguindo
                </span>
                <span>
                  <strong>{profile.publicWishlistsCount}</strong> listas públicas
                </span>
                <span>
                  Membro desde {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="ml-4">
            <button
              onClick={handleFollow}
              disabled={followUserMutation.isPending || unfollowUserMutation.isPending}
              className={`px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFollowing
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
                  : 'bg-primary text-white hover:bg-primary/90 focus:ring-primary'
              }`}
            >
              {followUserMutation.isPending || unfollowUserMutation.isPending
                ? 'Processando...'
                : isFollowing
                ? 'Deixar de Seguir'
                : 'Seguir'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Listas Públicas */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-dark">Listas Públicas</h2>
          <p className="text-gray-600 mt-1">
            {wishlistsLoading ? 'Carregando...' : `${wishlists?.length || 0} ${(wishlists?.length || 0) === 1 ? 'lista' : 'listas'} encontrada${(wishlists?.length || 0) === 1 ? '' : 's'}`}
          </p>
        </div>

        {wishlistsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlists && (wishlists.length || 0) > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlists.map((wishlist) => (
              <WishlistCard key={wishlist.id} wishlist={wishlist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-dark mb-2">Nenhuma lista pública encontrada</h3>
            <p className="text-gray-600">
              {profile.name} ainda não criou nenhuma lista pública.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
