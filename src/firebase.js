import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyCdshR6NWHNhRyhry3OBnRA8TdoJ1wm27I",
    authDomain: "ai-summarizer-c7583.firebaseapp.com",
    projectId: "ai-summarizer-c7583",
    storageBucket: "ai-summarizer-c7583.firebasestorage.app",
    messagingSenderId: "961417166098",
    appId: "1:961417166098:web:917a429f8594ec730507cb",
    measurementId: "G-Z3387LGVY3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
