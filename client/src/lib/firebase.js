// src/lib/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  appId: process.env.REACT_APP_APP_ID,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const app = initializeApp(firebaseConfig);
export default app;
