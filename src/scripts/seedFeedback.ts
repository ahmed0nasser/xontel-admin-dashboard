// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck   
import { feedbackData } from "../data/feedback";
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
} from 'firebase/firestore';

// 🔥 REPLACE with your Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedFeedback = async () => {
  try {
    for (const feedback of feedbackData) {
      await addDoc(collection(db, "feedback"), feedback);
    }
    console.log("Feedback seeded successfully!");
    // @ts-expect-error correct node process exit
    process.exit(0);  
  } catch (error) {
    console.error("Error seeding feedback:", error);
    // @ts-expect-error correct node process exit
    process.exit(1);
  }
};

seedFeedback();