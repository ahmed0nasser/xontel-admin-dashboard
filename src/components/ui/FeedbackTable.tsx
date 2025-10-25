import React from "react";
import { feedbackData, type Feedback } from "../../data/feedback";

const FeedbackTable: React.FC = () => {
  return (
    <div className="bg-soft-gray p-4 rounded-lg shadow text-charcoal">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Feedback Table</h2>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg p-2"
        />
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="pb-2">Date</th>
            <th className="pb-2">Employee Name</th>
            <th className="pb-2">Score</th>
            <th className="pb-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {feedbackData.map((feedback: Feedback) => (
            <tr key={feedback.id} className="border-t border-gray-300">
              <td className="py-2">{new Date(feedback.date).toLocaleDateString()}</td>
              <td className="py-2">{feedback.employeeName}</td>
              <td className="py-2">{feedback.score}</td>
              <td className="py-2">{feedback.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
