const  { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCl-gPyLyv7Gn5kjk6AAuzUrgFpsHF3EP4",
  authDomain: "post-integration.firebaseapp.com",
  projectId: "post-integration",
  storageBucket: "post-integration.appspot.com",
  messagingSenderId: "979103937198",
  appId: "1:979103937198:web:fdceb83d1bac5da6d2f33f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

// export default {db};
module.exports = db;