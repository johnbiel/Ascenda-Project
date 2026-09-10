const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "ascenda-project-72211.firebaseapp.com",
    projectId: "ascenda-project-72211",
    storageBucket: "ascenda-project-72211.firebasestorage.app",
    messagingSenderId: "654423057886",
    appId: "1:654423057886:web:0c5d4a9135c2ef3206e94f",
    measurementId: "G-KN00E72S46"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

console.log("Firebase conectado!");