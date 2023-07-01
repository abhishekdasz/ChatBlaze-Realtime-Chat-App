import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC1pYw67W2x6Efn19En0S0igqS3bo4L6IE",
  authDomain: "chatapp-1b293.firebaseapp.com",
  projectId: "chatapp-1b293",
  storageBucket: "chatapp-1b293.appspot.com",
  messagingSenderId: "653392394401",
  appId: "1:653392394401:web:133bbdfc572afa85ebd8e0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
