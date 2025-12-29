// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCF8bONRVbKH4aA-sw5P4rI4JygddlWg4I",
    authDomain: "mini-chat-40c00.firebaseapp.com",
    projectId: "mini-chat-40c00",
    storageBucket: "mini-chat-40c00.appspot.com",
    messagingSenderId: "1046032115764",
    appId: "1:1046032115764:web:6952c095116542ab5d4261",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
