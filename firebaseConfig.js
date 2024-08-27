import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyCv0nDGfpnX1yykkmHwpbrTG4nbYD0faUA",
  authDomain: "ai-rate-my-professor-19cc1.firebaseapp.com",
  projectId: "ai-rate-my-professor-19cc1",
  storageBucket: "ai-rate-my-professor-19cc1.appspot.com",
  messagingSenderId: "734794403153",
  appId: "1:734794403153:web:c4a68a63324170dcfcd770",
  measurementId: "G-9SZ0FJPE4G"
};


// Conditionally initialize Firebase Analytics
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => {
    console.error("Error initializing analytics:", err);
  });
}

export { auth, provider, analytics };
