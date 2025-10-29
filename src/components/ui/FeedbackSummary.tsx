import React, { useState, useEffect } from "react";
import { subscribeToFeedbacks } from "../../services/firebase";
import { type Feedback } from "../../types";

const FeedbackSummary: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToFeedbacks(setFeedbacks);
    return () => unsubscribe();
  }, []);

  const totalFeedbacks = feedbacks.length;

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

  const thisWeekFeedbacks = feedbacks.filter(
    (feedback) => feedback.date.getTime() > sevenDaysAgo
  );
  const lastWeekFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.date.getTime() >= fourteenDaysAgo && feedback.date.getTime() < sevenDaysAgo
  );

  const recentFeedbacksCount = thisWeekFeedbacks.length;

  const totalScore = feedbacks.reduce(
    (acc, feedback) => acc + feedback.score,
    0
  );
  const averageScore = (totalScore / totalFeedbacks).toFixed(1);

  // Feedbacks change
  const feedbacksChange =
    lastWeekFeedbacks.length > 0
      ? Math.round(
          ((thisWeekFeedbacks.length - lastWeekFeedbacks.length) /
            lastWeekFeedbacks.length) *
            100
        )
      : thisWeekFeedbacks.length > 0
      ? 100
      : 0;

  // Popularity change (unique employees)
  const thisWeekEmployees = new Set(
    thisWeekFeedbacks.map((f) => f.employeeName)
  ).size;
  const lastWeekEmployees = new Set(
    lastWeekFeedbacks.map((f) => f.employeeName)
  ).size;

  const popularityChange =
    lastWeekEmployees > 0
      ? Math.round(
          ((thisWeekEmployees - lastWeekEmployees) / lastWeekEmployees) * 100
        )
      : thisWeekEmployees > 0
      ? 100
      : 0;

  return (
    <div className="h-full">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{totalFeedbacks}</p>
          <p className="text-sm text-gray-500">Total Feedbacks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{recentFeedbacksCount}</p>
          <p className="text-sm text-gray-500">Recent Feedbacks (7d)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{averageScore}</p>
          <p className="text-sm text-gray-500">Average Score</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4">
        <div className="text-center">
          <p
            className={`text-2xl font-bold ${
              feedbacksChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {feedbacksChange >= 0 ? `+${feedbacksChange}` : feedbacksChange}%
          </p>
          <p className="text-sm text-gray-500">Feedbacks Change (last 7d)</p>
        </div>
        <div className="text-center">
          <p
            className={`text-2xl font-bold ${
              popularityChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {popularityChange >= 0 ? `+${popularityChange}` : popularityChange}%
          </p>
          <p className="text-sm text-gray-500">Popularity Change (last 7d)</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
