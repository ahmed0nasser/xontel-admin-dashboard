import React, { useState, useEffect } from "react";
import { subscribeToFeedback } from "../../services/firebase";
import { type Feedback } from "../../types";

const FeedbackSummary: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToFeedback(setFeedback);
    return () => unsubscribe();
  }, []);

  const totalFeedback = feedback.length;

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

  const thisWeekFeedback = feedback.filter(
    (feedback) => feedback.date.getTime() > sevenDaysAgo
  );
  const lastWeekFeedback = feedback.filter(
    (feedback) =>
      feedback.date.getTime() >= fourteenDaysAgo &&
      feedback.date.getTime() < sevenDaysAgo
  );

  const recentFeedbackCount = thisWeekFeedback.length;

  const totalScore = feedback.reduce(
    (acc, feedback) => acc + feedback.score,
    0
  );
  const averageScore = (totalScore / totalFeedback).toFixed(1);

  // Feedback change
  const feedbackChange =
    lastWeekFeedback.length > 0
      ? Math.round(
          ((thisWeekFeedback.length - lastWeekFeedback.length) /
            lastWeekFeedback.length) *
            100
        )
      : thisWeekFeedback.length > 0
      ? 100
      : 0;

  // Popularity change (unique employees)
  const thisWeekEmployees = new Set(thisWeekFeedback.map((f) => f.employeeName))
    .size;
  const lastWeekEmployees = new Set(lastWeekFeedback.map((f) => f.employeeName))
    .size;

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
          <p className="text-lg lg:text-2xl font-bold">{totalFeedback}</p>
          <p className="text-xs lg:text-sm text-gray-500">Total Feedback</p>
        </div>
        <div className="text-center">
          <p className="text-lg lg:text-2xl font-bold">{recentFeedbackCount}</p>
          <p className="text-xs lg:text-sm text-gray-500">
            Recent Feedback (7d)
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg lg:text-2xl font-bold">{averageScore}</p>
          <p className="text-xs lg:text-sm text-gray-500">Average Score</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4">
        <div className="text-center">
          <p
            className={`text-lg lg:text-2xl font-bold ${
              feedbackChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {feedbackChange >= 0 ? `+${feedbackChange}` : feedbackChange}%
          </p>
          <p className="text-xs lg:text-sm text-gray-500">
            Feedbacks Change (last 7d)
          </p>
        </div>
        <div className="text-center">
          <p
            className={`text-lg lg:text-2xl font-bold ${
              popularityChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {popularityChange >= 0 ? `+${popularityChange}` : popularityChange}%
          </p>
          <p className="text-xs lg:text-sm text-gray-500">
            Popularity Change (last 7d)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
