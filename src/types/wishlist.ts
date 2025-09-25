export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  url?: string;
  imageUrl?: string;
  quantity?: number;
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
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  url?: string;
  imageUrl?: string;
  quantity?: number;
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  url?: string;
  imageUrl?: string;
  quantity?: number;
}

export interface ReservationData {
  itemId: string;
  quantity: number;
  message?: string;
}
