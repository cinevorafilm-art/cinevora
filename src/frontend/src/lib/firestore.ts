import type { Movie } from "@/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

interface FirestoreMovieDoc {
  title?: string;
  image?: string;
  video?: string;
}

/**
 * Converts a Firestore doc id (string) to a stable numeric id.
 * Uses a simple djb2-style hash so the same doc always yields the same number.
 */
function stableNumericId(docId: string): number {
  let hash = 5381;
  for (let i = 0; i < docId.length; i++) {
    hash = (hash * 33) ^ docId.charCodeAt(i);
  }
  // Keep positive and fit in a safe integer range
  return Math.abs(hash >>> 0) || 1;
}

function mapDocToMovie(docId: string, data: FirestoreMovieDoc): Movie {
  return {
    id: stableNumericId(docId),
    title: data.title ?? "Untitled",
    description: "",
    category: "Movies",
    thumbnailUrl: data.image ?? "/assets/images/placeholder.svg",
    videoUrl: data.video ?? "",
    duration: "N/A",
    rating: 0,
    cast: [],
    isPremium: false,
    isTrending: false,
    isTopRated: false,
    createdAt: BigInt(Date.now()),
  };
}

/**
 * Fetches all documents from the Firestore "movies" collection
 * and maps them to the app's Movie type.
 */
export async function fetchMoviesFromFirestore(): Promise<Movie[]> {
  const snapshot = await getDocs(collection(db, "movies"));
  return snapshot.docs.map((doc) =>
    mapDocToMovie(doc.id, doc.data() as FirestoreMovieDoc),
  );
}
