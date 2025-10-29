import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { feedbackData } from "../data/feedback";

const seedFeedbacks = async () => {
  try {
    for (const feedback of feedbackData) {
      await addDoc(collection(db, "feedback"), feedback);
    }
    console.log("Feedbacks seeded successfully!");
    // @ts-expect-error correct node process exit
    process.exit(0);  
  } catch (error) {
    console.error("Error seeding feedbacks:", error);
    // @ts-expect-error correct node process exit
    process.exit(1);
  }
};

seedFeedbacks();