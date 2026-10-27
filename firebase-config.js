// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6IJz5uMWYirjMMNGVVuzeF5jSNEpOgaI",
  authDomain: "ascenda-project-72211.firebaseapp.com",
  projectId: "ascenda-project-72211",
  storageBucket: "ascenda-project-72211.firebasestorage.app",
  messagingSenderId: "654423057886",
  appId: "1:654423057886:web:0c5d4a9135c2ef3206e94f",
  measurementId: "G-KN00E72S46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);