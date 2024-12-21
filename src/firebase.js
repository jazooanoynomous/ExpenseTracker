import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD46wwUYpe1RBoQr1FZ8DM2yGYg92T7g3E", // From google-services.json
  authDomain: "expensetracker-d6e81.firebaseapp.com", // Derived from project_id
  projectId: "expensetracker-d6e81", // Directly from google-services.json
  storageBucket: "expensetracker-d6e81.firebasestorage.app", // From google-services.json
  messagingSenderId: "473027130748", // From project_number
  appId: "1:473027130748:android:aeb9aa2ae6f3135e2be0f9", // From mobilesdk_app_id
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
