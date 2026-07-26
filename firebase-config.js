// 🔥 Firebase Configuration - cuphro
const firebaseConfig = {
  apiKey: "AIzaSyAQryjjrawRkUxAFM3B0MgW07QnGncksU",
  authDomain: "cuphro.firebaseapp.com",
  projectId: "cuphro",
  storageBucket: "cuphro.firebasestorage.app",
  messagingSenderId: "406026864149",
  appId: "1:406026864149:web:661fb2c779507c4b40701c",
  measurementId: "G-9VMKK8V355"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
  .catch(err => console.log('Offline persistence error:', err));

console.log('🔥 Firebase initialized successfully!');
console.log('✅ Project: cuphro');
