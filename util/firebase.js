import firebase from "firebase/app";
import "firebase/analytics"
import "firebase/auth"
import "firebase/storage"

let firebaseConfig = {
  apiKey: "AIzaSyBe3KsTBPaXOkSGxl3hr9oCsHk1KjiXVGQ",
  authDomain: "recipes-book-537be.firebaseapp.com",
  projectId: "recipes-book-537be",
  storageBucket: "recipes-book-537be.appspot.com",
  messagingSenderId: "308043773158",
  appId: "1:308043773158:web:669f2da658255f39393727",
  measurementId: "G-SK1NHMPF72"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

let fireAuth = firebase.auth();
let fireStorage = firebase.storage();

export { firebase, fireAuth, fireStorage };