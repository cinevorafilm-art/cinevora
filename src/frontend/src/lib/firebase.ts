import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWv2r4qE51XMCr3Q-VTVlBtjWPwnNR88s",
  authDomain: "cinevora-989f7.firebaseapp.com",
  projectId: "cinevora-989f7",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
