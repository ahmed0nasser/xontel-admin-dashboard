import React from "react";
import { type Feedback } from "../types";
import { ACCENT_COLOR } from "../constants";

interface FeedbackTableProps {
  feedbacks: Feedback[];
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ feedbacks }) => {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-left border-collapse table-fixed">
        <thead style={{ backgroundColor: `${ACCENT_COLOR}22` }}>
          <tr>
            <th className="p-3 w-[20%]">Date</th>
            <th className="p-3 w-[25%]">Employee</th>
            <th className="p-3 w-[10%]">Score</th>
            <th className="p-3 w-[45%]">Notes</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f, index) => (
            <tr key={+f.id !== -1 ? f.id : `empty-${index}`} className="h-14">
              <td className="p-3 border-t truncate">
                {f.date ? new Date(f.date).toISOString().split("T")[0] : ""}
              </td>
              <td className="p-3 border-t truncate">{f.employeeName}</td>
              <td className="p-3 border-t truncate">{f.score || ""}</td>
              <td className="p-3 border-t truncate">{f.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
