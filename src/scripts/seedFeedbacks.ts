import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { feedbackData } from "../data/feedback";

const seedFeedbacks = async () => {
  try {
    for (const feedback of feedbackData) {
      await addDoc(collection(db, "feedbacks"), feedback);
    }
    console.log("Feedbacks seeded successfully!");
  } catch (error) {
    console.error("Error seeding feedbacks:", error);
  }
};

seedFeedbacks();