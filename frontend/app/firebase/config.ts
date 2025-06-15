// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC79-VhJ98eS9wkwl--WWf4-QXbdvAQ-ko",
  authDomain: "properties-b8a48.firebaseapp.com",
  databaseURL: "https://properties-b8a48-default-rtdb.firebaseio.com",
  projectId: "properties-b8a48",
  storageBucket: "properties-b8a48.firebasestorage.app",
  messagingSenderId: "300729245600",
  appId: "1:300729245600:web:b6b9ef865403aeb27c0ec5",
  measurementId: "G-5QC8VVHZHV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
