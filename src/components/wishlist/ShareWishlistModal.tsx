'use client';

import { Wishlist } from '@/types/wishlist';
import { Modal } from '@/components/ui/Modal';
import { useUpdateWishlistSharing } from '@/hooks/useUpdateWishlistSharing';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Clipboard, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ShareWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Wishlist | null;
}

export function ShareWishlistModal({
  isOpen,
  onClose,
  wishlist,
}: ShareWishlistModalProps) {
  const [copied, setCopied] = useState(false);

  const updateSharingMutation = useUpdateWishlistSharing();

  const handleToggleSharing = (isPublic: boolean) => {
    if (wishlist) {
      updateSharingMutation.mutate({
        wishlistId: wishlist.id,
        data: { isPublic },
      });
    }
  };

  const handleCopyLink = () => {
    if (wishlist?.sharing?.publicLinkToken) {
      const publicLink = `${window.location.origin}/public/${wishlist.sharing.publicLinkToken}`;
      navigator.clipboard.writeText(publicLink);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2500); // Reseta o ícone após 2.5 segundos
    }
  };

  if (!isOpen || !wishlist) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compartilhar Lista">
      <div className="mt-4 flex items-center justify-between rounded-lg border p-4">
        <div>
          <label htmlFor="public-toggle" className="font-medium text-dark">
            Compartilhamento por link público
          </label>
          <p className="text-sm text-dark-light">
            {wishlist.sharing?.isPublic
              ? 'Qualquer pessoa com o link pode ver.'
              : 'Ative para gerar um link compartilhável.'}
          </p>
        </div>
        <Switch
          id="public-toggle"
          checked={wishlist.sharing?.isPublic || false}
          onCheckedChange={handleToggleSharing}
          disabled={updateSharingMutation.isPending}
        />
      </div>

      {/* Seção que só aparece se a lista for pública */}
      {wishlist.sharing?.isPublic && (
        <div className="mt-4">
          <label htmlFor="share-link" className="text-sm font-medium text-dark">
            Copie o link abaixo para compartilhar
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              id="share-link"
              type="text"
              readOnly
              value={wishlist.sharing?.publicLinkToken ? `${window.location.origin}/public/${wishlist.sharing.publicLinkToken}` : 'Gerando link...'}
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
