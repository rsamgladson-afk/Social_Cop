    // src/firebase.ts
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    import { getStorage } from "firebase/storage";

    const firebaseConfig = {
    apiKey: "AIzaSyCrM65fe00SvWO2V8z6654HAeki-UMaJ_s",
    authDomain: "sociall-cop.firebaseapp.com",
    projectId: "sociall-cop",
    storageBucket: "sociall-cop.firebasestorage.app",
    messagingSenderId: "225764139679",
    appId: "1:225764139679:web:1967becf7b42bc999478aa",
    measurementId: "G-Z07LK1KEK8"
    };

    const app = initializeApp(firebaseConfig);

    export const auth = getAuth(app);
    export const db = getFirestore(app);
    export const storage = getStorage(app);
