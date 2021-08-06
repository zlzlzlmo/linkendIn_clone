import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDeu1LxGEe-fj0JhMIGE3pGBAMk7xttaFg",
  authDomain: "linkedinclone-93ffe.firebaseapp.com",
  projectId: "linkedinclone-93ffe",
  storageBucket: "linkedinclone-93ffe.appspot.com",
  messagingSenderId: "48887406652",
  appId: "1:48887406652:web:817991c93254d284f96339",
  measurementId: "G-9LNQQSESXD",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export { auth, provider, storage };
export default db;
