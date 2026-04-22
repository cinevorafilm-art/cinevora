import type { Movie, WatchEntry } from "@/types";
import { create } from "zustand";

interface MovieState {
  movies: Movie[];
  myList: number[];
  watchHistory: WatchEntry[];
  searchQuery: string;
  searchResults: Movie[];
  setMovies: (movies: Movie[]) => void;
  setMyList: (list: number[]) => void;
  addToMyList: (movieId: number) => void;
  removeFromMyList: (movieId: number) => void;
  setWatchHistory: (history: WatchEntry[]) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Movie[]) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  myList: [],
  watchHistory: [],
  searchQuery: "",
  searchResults: [],
  setMovies: (movies) => set({ movies }),
  setMyList: (myList) => set({ myList }),
  addToMyList: (movieId) =>
    set((state) => ({
      myList: state.myList.includes(movieId)
        ? state.myList
        : [...state.myList, movieId],
    })),
  removeFromMyList: (movieId) =>
    set((state) => ({
      myList: state.myList.filter((id) => id !== movieId),
    })),
  setWatchHistory: (watchHistory) => set({ watchHistory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchResults: (searchResults) => set({ searchResults }),
}));
