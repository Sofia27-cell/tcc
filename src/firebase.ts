import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCHrMu71pDeLW2a4_kBRtGuikCMJ0yIzng",
  authDomain: "busline-company.firebaseapp.com",
  databaseURL: "https://busline-company-default-rtdb.firebaseio.com",
  projectId: "busline-company",
  storageBucket: "busline-company.firebasestorage.app",
  messagingSenderId: "391479096765",
  appId: "1:391479096765:web:9a2f9d6877859ea89f8ed4",
  measurementId: "G-S76HBJMH0G",
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { app, database }
