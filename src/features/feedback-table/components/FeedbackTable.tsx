import React from "react";
import { type Feedback } from "../../../types";
import { LuCalendarDays } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaRegNoteSticky } from "react-icons/fa6";

import { ACCENT_COLOR } from "../constants";

interface FeedbackTableProps {
  feedback: Feedback[];
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ feedback }) => {
  return (
    <div
      className="text-sm lg:text-base overflow-x-auto border rounded-md"
      style={{ minHeight: "336px" }}
    >
      <table className="min-w-full text-left border-collapse table-fixed">
        <thead style={{ backgroundColor: `${ACCENT_COLOR}22` }}>
          <tr>
            <th className="p-3 w-[20%]">
              <span className="flex items-center space-x-1">
                <LuCalendarDays />
                <span>Date</span>
              </span>
            </th>
            <th className="p-3 w-[25%]">
              <span className="flex items-center space-x-1">
                <FaRegUser />
                <span>Employee</span>
              </span>
            </th>
            <th className="p-3 w-[10%]">
              <span className="flex items-center space-x-1">
                <FaRegStar />
                <span>Score</span>
              </span>
            </th>
            <th className="p-3 w-[45%]">
              <span className="flex items-center space-x-1">
                <FaRegNoteSticky />
                <span>Notes</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((f, index) => (
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
