import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6IJz5uMWiyrJMMNGVVuzeF5jSNEpOgaI",
    authDomain: "ascenda-project-72211.firebaseapp.com",
    projectId: "ascenda-project-72211",
    storageBucket: "ascenda-project-72211.firebasestorage.app",
    messagingSenderId: "654423057886",
    appId: "1:654423057886:web:0c5d4a9135c2ef3206e94f",
    measurementId: "G-KN00E72S46"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {
    auth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
}