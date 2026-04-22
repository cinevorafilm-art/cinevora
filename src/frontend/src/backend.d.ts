import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subscription {
    startedAt: bigint;
    expiresAt: bigint;
    planId: string;
    userId: string;
    isActive: boolean;
}
export interface Movie {
    id: bigint;
    title: string;
    duration: string;
    thumbnailUrl: string;
    isPremium: boolean;
    cast: Array<string>;
    createdAt: bigint;
    description: string;
    isTopRated: boolean;
    category: string;
    rating: number;
    videoUrl: string;
    isTrending: boolean;
}
export interface MovieInput {
    title: string;
    duration: string;
    thumbnailUrl: string;
    isPremium: boolean;
    cast: Array<string>;
    description: string;
    isTopRated: boolean;
    category: string;
    rating: number;
    videoUrl: string;
    isTrending: boolean;
}
export interface WatchEntry {
    movieId: bigint;
    progressSeconds: bigint;
    lastWatched: bigint;
}
export interface SubscriptionPlan {
    id: string;
    features: Array<string>;
    name: string;
    durationMonths: bigint;
    price: bigint;
}
export interface UserProfile {
    isPremium: boolean;
    userId: string;
    subscriptionExpiry?: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    myList: Array<bigint>;
    watchHistory: Array<WatchEntry>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMovie(input: MovieInput): Promise<Movie>;
    addToMyList(userId: string, movieId: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelSubscription(userId: string): Promise<boolean>;
    createOrUpdateUserProfile(userId: string, name: string, email: string): Promise<UserProfile>;
    deleteMovie(id: bigint): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    getFreeMovies(): Promise<Array<Movie>>;
    getMovie(id: bigint): Promise<Movie | null>;
    getMovies(): Promise<Array<Movie>>;
    getMoviesByCategory(category: string): Promise<Array<Movie>>;
    getMyList(userId: string): Promise<Array<bigint>>;
    getPremiumMovies(): Promise<Array<Movie>>;
    getSubscriptionPlans(): Promise<Array<SubscriptionPlan>>;
    getTopRatedMovies(): Promise<Array<Movie>>;
    getTrendingMovies(): Promise<Array<Movie>>;
    getUserProfile(userId: string): Promise<UserProfile | null>;
    getUserSubscription(userId: string): Promise<Subscription | null>;
    getWatchHistory(userId: string): Promise<Array<WatchEntry>>;
    isCallerAdmin(): Promise<boolean>;
    removeFromMyList(userId: string, movieId: bigint): Promise<boolean>;
    searchMovies(searchTerm: string): Promise<Array<Movie>>;
    subscribe(userId: string, planId: string): Promise<Subscription>;
    updateMovie(id: bigint, input: MovieInput): Promise<Movie | null>;
    updateWatchProgress(userId: string, movieId: bigint, progressSeconds: bigint): Promise<boolean>;
}
