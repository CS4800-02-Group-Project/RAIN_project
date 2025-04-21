// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCG5EPGm0R5T2SjSw3rkv4ZlvMVtiBkf5k",
    authDomain: "valdez-chatroom.firebaseapp.com",
    projectId: "valdez-chatroom",
    storageBucket: "valdez-chatroom.firebasestorage.app",
    messagingSenderId: "71713759625",
    appId: "1:71713759625:web:f56b903db98393aa864158"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };