// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBY_mkLRMsWzdoEtg0rqe3rVPINIH1KGJg",
  authDomain: "virello-588ee.firebaseapp.com",
  projectId: "virello-588ee",
  storageBucket: "virello-588ee.firebasestorage.app",
  messagingSenderId: "595453686505",
  appId: "1:595453686505:web:70b0c4aece995432d4b678",
  measurementId: "G-6PGF7X4EDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
