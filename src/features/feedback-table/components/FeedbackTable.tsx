import React from "react";
import { type Feedback } from "../types";

interface FeedbackTableProps {
  feedbacks: Feedback[];
  accentColor?: string;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({
  feedbacks,
  accentColor = "#007bff",
}) => {
  return (
    <div className="overflow-x-auto border rounded-lg transition-all duration-300 ease-in-out">
      <table className="min-w-full text-left border-collapse">
        <thead style={{ backgroundColor: `${accentColor}22` }}>
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Employee</th>
            <th className="p-2">Score</th>
            <th className="p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f) => (
            <tr key={+f.id !== -1 ? f.id : Math.random()}>
              <td className="p-2 border-t">
                {f.date ? new Date(f.date).toISOString().split("T")[0] : ""}
              </td>
              <td className="p-2 border-t">{f.employeeName}</td>
              <td className="p-2 border-t">{f.score || ""}</td>
              <td className="p-2 border-t">{f.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
