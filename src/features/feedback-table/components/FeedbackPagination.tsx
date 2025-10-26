import React from "react";

interface FeedbackPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const FeedbackPagination: React.FC<FeedbackPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="flex justify-center mt-3 gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-2 py-1 rounded ${
            currentPage === i + 1 ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default FeedbackPagination;
