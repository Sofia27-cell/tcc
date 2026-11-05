import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const App = initializeApp(firebaseConfig);

export const Database = getDatabase(app);
export const Auth = getAuth(app);

// For firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHrMu71pDeLW2a4_kBRtGuikCMJ0yIzng",
  authDomain: "busline-company.firebaseapp.com",
  databaseURL: "https://busline-company-default-rtdb.firebaseio.com",
  projectId: "busline-company",
  storageBucket: "busline-company.firebasestorage.app",
  messagingSenderId: "391479096765",
  appId: "1:391479096765:web:9a2f9d6877859ea89f8ed4",
  measurementId: "G-S76HBJMH0G"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);