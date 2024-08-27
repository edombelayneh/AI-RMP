import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8PHzTsNYt78Qn_0f3feZo3PGctkb-gR4",
  authDomain: "ai-rate-myprofessor.firebaseapp.com",
  projectId: "ai-rate-myprofessor",
  storageBucket: "ai-rate-myprofessor.appspot.com",
  messagingSenderId: "124552038187",
  appId: "1:124552038187:web:f53c3199f3fa87c5c6e76e",
  measurementId: "G-RC079LG481"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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
