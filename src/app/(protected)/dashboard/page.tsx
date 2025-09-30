'use client';

import Link from 'next/link';
import { useState } from 'react';
import { WishlistList } from '@/components/wishlist/WishlistList';
import { ShareWishlistModal } from '@/components/wishlist/ShareWishlistModal';
import { DeleteWishlistModal } from '@/components/wishlist/DeleteWishlistModal';
import { DependentSection } from '@/components/dependents/DependentSection';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { Wishlist } from '@/types';
import { useDeleteWishlist } from '@/hooks/useDeleteWishlist';
import { useMyWishlists } from '@/hooks/useMyWishlists';

export default function DashboardPage() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [wishlistToShare, setWishlistToShare] = useState<Wishlist | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState<Wishlist | null>(null);

  const deleteWishlistMutation = useDeleteWishlist();
  const { data: wishlists } = useMyWishlists();

  const handleShareClick = (wishlist: Wishlist) => {
    setWishlistToShare(wishlist);
    setIsShareModalOpen(true);
  };

  const handleDeleteClick = (wishlistId: string) => {
    const wishlist = wishlists?.find(w => w.id === wishlistId);
    if (wishlist) {
      setWishlistToDelete(wishlist);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (wishlistToDelete) {
      await deleteWishlistMutation.mutateAsync(wishlistToDelete.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Seção Minhas Listas de Desejos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display">Minhas Listas de Desejos</h2>
            <p className="text-sm text-dark-light">
              Gerenciando suas listas de desejos
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4" />
              Nova Lista
            </Button>
          </Link>
        </div>
        <WishlistList onShare={handleShareClick} onDelete={handleDeleteClick} />
      </section>

      {/* Seção Meus Dependentes */}
      <DependentSection />

      {/* Modal de Compartilhamento */}
      {wishlistToShare && (
        <ShareWishlistModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setWishlistToShare(null);
          }}
          wishlist={wishlistToShare}
        />
      )}

      {/* Modal de Exclusão */}
      {wishlistToDelete && (
        <DeleteWishlistModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setWishlistToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          wishlistTitle={wishlistToDelete.title}
          isLoading={deleteWishlistMutation.isPending}
        />
      )}
    </div>
  );
}