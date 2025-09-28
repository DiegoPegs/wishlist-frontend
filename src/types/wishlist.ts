export type ItemType = 'SPECIFIC_PRODUCT' | 'ONGOING_SUGGESTION';

export interface WishlistItem {
  _id: string;
  id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  link?: string;
  imageUrl?: string;
  quantity?: number;
  itemType: ItemType;
  reservedBy?: string;
  reservedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistSharing {
  isPublic: boolean;
  publicLink?: string;
}

export interface Wishlist {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  ownerName: string;
  items: WishlistItem[];
  sharing: WishlistSharing;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWishlistData {
  title: string;
  description?: string;
}

export interface UpdateWishlistData {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateWishlistSharingData {
  isPublic: boolean;
}

export interface CreateItemData {
  title: string;
  description?: string;
  price?: {
    min?: number;
    max?: number;
  };
  currency?: string;
  url?: string;
  imageUrl?: string;
  quantity?: number;
  itemType: ItemType;
}

export interface UpdateItemData {
  title?: string;
  description?: string;
  price?: {
    min?: number;
    max?: number;
  };
  currency?: string;
  url?: string;
  imageUrl?: string;
  quantity?: number;
  itemType?: ItemType;
}

export interface ReservationData {
  itemId: string;
  quantity: number;
  message?: string;
}
