import type { UserProfile } from "@/types";
import type { Principal } from "@dfinity/principal";
import { create } from "zustand";

interface AuthState {
  principal: Principal | null;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isPremium: boolean;
  login: () => void;
  logout: () => void;
  setPrincipal: (principal: Principal | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setUserProfile: (profile: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  principal: null,
  isAuthenticated: false,
  userProfile: null,
  isPremium: false,
  login: () => {
    // Triggers Internet Identity — actual auth handled via useInternetIdentity
    set({ isAuthenticated: true });
  },
  logout: () => {
    set({
      principal: null,
      isAuthenticated: false,
      userProfile: null,
      isPremium: false,
    });
  },
  setPrincipal: (principal) => set({ principal }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setUserProfile: (userProfile) =>
    set({
      userProfile,
      isPremium: userProfile?.isPremium ?? false,
    }),
}));
