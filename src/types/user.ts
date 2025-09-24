export interface PublicUser {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  publicWishlistsCount: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  followersCount: number;
  followingCount: number;
  publicWishlistsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUserData {
  userId: string;
}

export interface UserSearchResult {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  isFollowing: boolean;
}
