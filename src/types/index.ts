import { WishlistItem } from './wishlist';

export interface Wishlist {
  _id: string;
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  ownerName: string;
  items: WishlistItem[];
  sharing: {
    isPublic: boolean;
    publicLink?: string;
  };
  createdAt: string;
  updatedAt: string;
}
