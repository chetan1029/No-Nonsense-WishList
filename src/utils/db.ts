// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyCDUxgw6T_rpwVN_BZ1z_R85jShkxvoIw0",
  authDomain: "wishlist-338a1.firebaseapp.com",
  projectId: "wishlist-338a1",
  storageBucket: "wishlist-338a1.appspot.com",
  messagingSenderId: "844329315873",
  appId: "1:844329315873:web:7580e928ecae718ff5fd60",
  measurementId: "G-W318FVNVCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;