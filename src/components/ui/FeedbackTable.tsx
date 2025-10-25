import React, { useState } from "react";
import { feedbackData, type Feedback } from "../../data/feedback";

const FeedbackTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredFeedback = feedbackData.filter(
    (feedback) =>
      feedback.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedback.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-soft-gray p-4 rounded-lg shadow text-charcoal">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Feedback Table</h2>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          {currentItems.map((feedback: Feedback) => (
            <tr key={feedback.id} className="border-t border-gray-300">
              <td className="py-2">
                {new Date(feedback.date).toLocaleDateString()}
              </td>
              <td className="py-2">{feedback.employeeName}</td>
              <td className="py-2">{feedback.score}</td>
              <td className="py-2">{feedback.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-brand-blue text-white px-3 py-1 rounded-l-lg disabled:opacity-50 mr-2"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 border-t border-b ${
              currentPage === i + 1
                ? "bg-light-blue text-white"
                : "bg-soft-gray text-charcoal"
            } mx-1`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-brand-blue text-white px-3 py-1 rounded-r-lg disabled:opacity-50 ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedbackTable;
