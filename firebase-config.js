// Firebase v9 Modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsS8nLvi5WJJHv8LmRomO4StBb7Hq8xk4",
  authDomain: "cpd-anytime.firebaseapp.com",
  projectId: "cpd-anytime",
  storageBucket: "cpd-anytime.firebasestorage.app",
  messagingSenderId: "221514305010",
  appId: "1:221514305010:web:fe079e7a6e59218e4daf6b",
  measurementId: "G-CCM2M1JZXE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const questionsRef = collection(db, "questions");
