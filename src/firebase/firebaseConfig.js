import { initializeApp } from 'firebase/app';
const firebaseConfig = {
    apiKey: "AIzaSyBsse7gF8SLEdxjG6s-ksDZ2WL0s4btWHQ",
    authDomain: "gonetwork-community.firebaseapp.com",
    databaseURL: "https://gonetwork-community-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gonetwork-community",
    storageBucket: "gonetwork-community.appspot.com",
    messagingSenderId: "631428932968",
    appId: "1:631428932968:web:edb5120e33eb81e94a62dd"
};

export  const app = initializeApp(firebaseConfig);