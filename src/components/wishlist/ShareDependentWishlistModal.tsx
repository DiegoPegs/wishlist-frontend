'use client';

import { Wishlist } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { useUpdateDependentWishlistSharing } from '@/hooks/use-dependent-wishlists';
import { useDependentWishlist } from '@/hooks/use-dependent-wishlists';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Clipboard, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ShareDependentWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Wishlist | null;
  dependentId: string;
}

export function ShareDependentWishlistModal({
  isOpen,
  onClose,
  wishlist,
  dependentId,
}: ShareDependentWishlistModalProps) {
  const [copied, setCopied] = useState(false);

  // Buscar dados atualizados da wishlist do dependente
  const { data: updatedWishlist } = useDependentWishlist(
    dependentId,
    wishlist?.id || ''
  );

  const { mutate, isPending } = useUpdateDependentWishlistSharing(dependentId);

  // Usar dados atualizados se disponíveis, senão usar os dados passados como prop
  const currentWishlist = updatedWishlist || wishlist;

  const handleToggleSharing = (isPublic: boolean) => {
    if (currentWishlist && currentWishlist.id) {
      console.log('🔍 handleToggleSharing debug:', {
        currentWishlist,
        currentWishlistId: currentWishlist.id,
        isPublic,
        dependentId
      });

      mutate({
        wishlistId: currentWishlist.id,
        data: { isPublic },
      });
    } else {
      console.error('❌ Erro: currentWishlist ou currentWishlist.id está undefined:', {
        currentWishlist,
        currentWishlistId: currentWishlist?.id
      });
      toast.error('Erro: ID da wishlist não encontrado');
    }
  };

  const handleCopyLink = () => {
    if (currentWishlist?.sharing?.publicLinkToken) {
      // Incluir o locale padrão (pt-BR) no link público
      const publicLink = `${window.location.origin}/pt-BR/public/${currentWishlist.sharing.publicLinkToken}`;

      navigator.clipboard.writeText(publicLink).then(() => {
        setCopied(true);
        toast.success('Link copiado!');
        setTimeout(() => setCopied(false), 2500); // Reseta o ícone após 2.5 segundos
      }).catch((error) => {
        console.error('Erro ao copiar link:', error);
        toast.error('Erro ao copiar link');
      });
    } else {
      toast.error('Token de compartilhamento não encontrado');
    }
  };

  if (!isOpen || !currentWishlist) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compartilhar Lista">
      <div className="mt-4 flex items-center justify-between rounded-lg border p-4">
        <div>
          <label htmlFor="public-toggle" className="font-medium text-dark">
            Compartilhamento por link público
          </label>
          <p className="text-sm text-dark-light">
            {currentWishlist.sharing?.isPublic
              ? 'Qualquer pessoa com o link pode ver.'
              : 'Ative para gerar um link compartilhável.'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          )}
          <Switch
            id="public-toggle"
            checked={currentWishlist.sharing?.isPublic || false}
            onCheckedChange={handleToggleSharing}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Seção que só aparece se a lista for pública */}
      {currentWishlist.sharing?.isPublic && (
        <div className="mt-4">
          <label htmlFor="share-link" className="text-sm font-medium text-dark">
            Copie o link abaixo para compartilhar
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              id="share-link"
              type="text"
              readOnly
              value={currentWishlist.sharing?.publicLinkToken ? `${window.location.origin}/pt-BR/public/${currentWishlist.sharing.publicLinkToken}` : 'Gerando link...'}
              className="w-full rounded-md border bg-light-soft p-2 text-sm text-dark-light focus:outline-none focus:ring-2 focus:ring-primary-light"
              onClick={(e) => e.currentTarget.select()} // Seleciona o texto ao clicar
            />
            <Button
              variant="secondary"
              onClick={handleCopyLink}
              className="px-3"
            >
              {copied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Clipboard className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
