// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:"podcastreact-2147d.firebaseapp.com",
    projectId: "podcastreact-2147d",
    storageBucket: "podcastreact-2147d.firebasestorage.app",
    messagingSenderId: "406863142883",
    appId: "1:406863142883:web:475ac187cc915f9bf60ad6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);