import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDo1805xkWXXoWlD0ufNmID8x0Xko9yLAA",
    authDomain: "desifoodauth.firebaseapp.com",
    projectId: "desifoodauth",
    storageBucket: "desifoodauth.firebasestorage.app",
    messagingSenderId: "730355069676",
    appId: "1:730355069676:web:ca1730a6f7d2d12063ebc9",
    measurementId: "G-WJM0SYFKSH"
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only on client side
let analytics;
if (typeof window !== "undefined") {
    isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { auth, googleProvider, analytics };
