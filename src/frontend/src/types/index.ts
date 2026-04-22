export interface Movie {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  rating: number;
  cast: string[];
  isPremium: boolean;
  isTrending: boolean;
  isTopRated: boolean;
  createdAt: bigint;
}

export interface WatchEntry {
  movieId: number;
  progressSeconds: number;
  lastWatched: bigint;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  isPremium: boolean;
  subscriptionExpiry: bigint | null;
  myList: number[];
  watchHistory: WatchEntry[];
  createdAt: bigint;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  features: string[];
}

export interface HeroMovie {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  rating: number;
  isPremium: boolean;
}
