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
  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex items-center justify-center mt-6 gap-2 select-none">
      {/* Prev button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded-lg text-sm font-medium transition-all duration-200
          ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-white hover:bg-gray-400 active:scale-95"
          }`}
      >
        ‹
      </button>

      {/* Pages */}
      {getPages().map((page, i) => (
        <button
          key={i}
          onClick={() => typeof page === "number" && handlePageChange(page)}
          className={`px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transform transition-all duration-200
            ${
              page === currentPage
                ? "bg-brand-blue/90 text-white shadow-md scale-105"
                : typeof page === "number"
                ? "bg-gray-100 hover:bg-gray-200 hover:scale-105 active:scale-95"
                : "cursor-default text-gray-400"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded-lg text-sm font-medium transition-all duration-200
          ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-white hover:bg-gray-400 active:scale-95"
          }`}
      >
        ›
      </button>
    </div>
  );
};

export default FeedbackPagination;
